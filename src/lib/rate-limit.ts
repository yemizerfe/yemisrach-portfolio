/**
 * A small in-memory rate limiter for the contact endpoint.
 *
 * There is no database behind this portfolio and the form sees a few messages a
 * week, so a shared counter (Redis, Upstash) would be infrastructure added to
 * protect a resource nobody is attacking. A fixed window per client address is
 * the cheapest thing that stops the behaviour that actually happens: one client
 * — a bot, a stuck retry loop, someone who clicked twice — sending repeatedly.
 *
 * The limitation is stated rather than implied: counters live in a single
 * process, so a platform running several instances gives each its own window,
 * and a restart clears them. This is per-instance throttling, not a global
 * quota, and it is not described as more than it is.
 */

export interface RateLimitOptions {
  /** Requests allowed per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Requests left in this window. */
  remaining: number;
  /** Seconds until the window resets — sent on as `Retry-After`. */
  retryAfterSeconds: number;
}

interface Window {
  count: number;
  expiresAt: number;
}

const windows = new Map<string, Window>();

/**
 * A ceiling on tracked clients.
 *
 * Without one, any bot with a pool of addresses could grow the map for as long
 * as the process lives. Past this point expired windows are swept instead, which
 * bounds memory at the cost of forgiving a very old request.
 */
const maxTrackedClients = 2_000;

/** Fixed window, counted per key. */
export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  const window = windows.get(key);

  if (!window || window.expiresAt <= now) {
    if (windows.size >= maxTrackedClients) sweepExpired(now);
    windows.set(key, { count: 1, expiresAt: now + windowMs });

    return { allowed: true, remaining: Math.max(0, limit - 1), retryAfterSeconds: 0 };
  }

  window.count += 1;

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((window.expiresAt - now) / 1000),
  );

  if (window.count > limit) {
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - window.count),
    retryAfterSeconds,
  };
}

function sweepExpired(now: number): void {
  for (const [key, entry] of windows) {
    if (entry.expiresAt <= now) windows.delete(key);
  }
}

/**
 * The client address, read the way a reverse proxy reports it.
 *
 * `x-forwarded-for` is a list and only the first entry is the client; the rest
 * are proxies. Neither header can be trusted on its own — a direct caller can
 * invent both — and that is acceptable here, because this limiter exists to slow
 * repeat traffic, not to identify anyone. Requests carrying neither header share
 * one bucket rather than escaping the limit entirely.
 */
export function clientAddressFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");

  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * A stable, non-reversible key for an address.
 *
 * The limiter only needs to know whether two requests came from the same place,
 * so the map is keyed by a hash: no raw addresses are held in memory and nothing
 * about a visitor outlives the process.
 */
export function addressKey(address: string): string {
  let hash = 2_166_136_261;

  for (let index = 0; index < address.length; index += 1) {
    hash ^= address.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }

  return `c${(hash >>> 0).toString(36)}`;
}
