import { NextResponse } from "next/server";

import {
  contactApiMessages,
  contactHoneypotField,
  contactLimits,
  hasContactErrors,
  parseContactSubmission,
} from "@/lib/contact";
import { isContactDeliveryConfigured, sendContactMessage } from "@/lib/email";
import { addressKey, checkRateLimit, clientAddressFrom } from "@/lib/rate-limit";

/**
 * POST /api/contact — the form's only backend.
 *
 * The order of the checks is the design: refuse anything oversized before
 * parsing it, drop bots before doing any work, throttle before spending CPU on
 * validation, validate before touching the provider, and only then send. Every
 * refusal is a sentence a visitor could read, and none of them describes what
 * the server was doing — no provider payloads, no status codes from anyone
 * else, no stack traces, no configuration.
 *
 * The route never reports success it did not have: if delivery is not
 * configured, or the provider refuses, the answer says so. A visitor who is
 * told their message arrived will not write again, so a false success is the
 * one failure this endpoint must not have.
 */

/** Five messages per ten minutes per client. Ample for a person, thin for a script. */
const rateLimit = { limit: 5, windowMs: 10 * 60 * 1000 } as const;

function json(
  body: Record<string, unknown>,
  status: number,
  headers?: HeadersInit,
): NextResponse {
  return NextResponse.json(body, { status, headers });
}

export async function POST(request: Request): Promise<NextResponse> {
  // 1. Size, from the header when the caller sent one …
  const declaredLength = Number(request.headers.get("content-length") ?? "");

  if (Number.isFinite(declaredLength) && declaredLength > contactLimits.payload) {
    return json({ success: false, message: contactApiMessages.malformed }, 413);
  }

  const raw = await request.text();

  // … and from the body itself when it did not, so a chunked request cannot
  // sidestep the ceiling.
  if (raw.length > contactLimits.payload) {
    return json({ success: false, message: contactApiMessages.malformed }, 413);
  }

  let body: unknown;

  try {
    body = JSON.parse(raw);
  } catch {
    return json({ success: false, message: contactApiMessages.malformed }, 400);
  }

  const record =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};

  // 2. The honeypot. Answered, not rejected: a script that learns which check
  //    caught it comes back without it. Nothing was sent, and nothing is said.
  const honeypot = record[contactHoneypotField];

  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return json({ success: true, message: contactApiMessages.sent }, 200);
  }

  // 3. Throttling, before any validation work is done for the same client.
  const limit = checkRateLimit(addressKey(clientAddressFrom(request.headers)), rateLimit);

  if (!limit.allowed) {
    return json({ success: false, message: contactApiMessages.rateLimited }, 429, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  // 4. The same rules the browser ran. The browser's answer was a courtesy.
  const { value, errors } = parseContactSubmission(record);

  if (hasContactErrors(errors)) {
    return json(
      { success: false, message: contactApiMessages.invalid, errors },
      400,
    );
  }

  // 5. Refuse honestly when there is nowhere to send it.
  if (!isContactDeliveryConfigured()) {
    return json({ success: false, message: contactApiMessages.unavailable }, 503);
  }

  const result = await sendContactMessage(value);

  if (!result.ok) {
    return json({ success: false, message: contactApiMessages.failed }, 502);
  }

  return json({ success: true, message: contactApiMessages.sent }, 200);
}
