/**
 * A small in-memory rate limiter.
 *
 * Mirrors `src/lib/rate-limit.ts`. Counters live in one process: a deployment
 * with several instances gives each its own window, and a restart clears them.
 * That is per-instance throttling, not a global quota.
 */

const windows = new Map();

/** A ceiling on tracked clients, so a bot with many addresses cannot grow the map forever. */
const maxTrackedClients = 2_000;

export function checkRateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const window = windows.get(key);

  if (!window || window.expiresAt <= now) {
    if (windows.size >= maxTrackedClients) sweepExpired(now);
    windows.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: Math.max(0, limit - 1), retryAfterSeconds: 0 };
  }

  window.count += 1;

  const retryAfterSeconds = Math.max(1, Math.ceil((window.expiresAt - now) / 1000));

  if (window.count > limit) {
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - window.count),
    retryAfterSeconds,
  };
}

function sweepExpired(now) {
  for (const [key, entry] of windows) {
    if (entry.expiresAt <= now) windows.delete(key);
  }
}

/**
 * The client address as a reverse proxy reports it.
 *
 * Only the first `x-forwarded-for` entry is the client. Neither header can be
 * trusted from a direct caller, which is fine: this slows repeat traffic, it does
 * not identify anyone.
 */
export function clientAddressFrom(headers) {
  const forwarded = headers["x-forwarded-for"];

  if (forwarded) {
    const first = String(forwarded).split(",")[0]?.trim();
    if (first) return first;
  }

  return String(headers["x-real-ip"] ?? "").trim() || "unknown";
}

/** Key the map by a hash: no raw addresses are held in memory. */
export function addressKey(address) {
  let hash = 2_166_136_261;

  for (let index = 0; index < address.length; index += 1) {
    hash ^= address.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }

  return `c${(hash >>> 0).toString(36)}`;
}
