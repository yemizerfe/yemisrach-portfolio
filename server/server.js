/**
 * The portfolio's backend, as its own service.
 *
 * It exposes exactly what the site needs and nothing else:
 *
 *   POST /api/contact  — the contact form's fallback when EmailJS is not configured
 *   GET  /healthz      — liveness plus whether delivery has credentials
 *
 * The order of checks in the handler is the design: refuse oversized bodies
 * before parsing, drop bots before doing work, throttle before spending CPU on
 * validation, validate before touching the provider, and only then send. Every
 * refusal is a sentence a visitor could read. Nothing here reports a success it
 * did not have.
 *
 * Run it with `npm start` in this folder, or as part of the root Docker image.
 */

import cors from "cors";
import express from "express";

import {
  contactApiMessages,
  contactHoneypotField,
  contactLimits,
  hasContactErrors,
  parseContactSubmission,
} from "./contact.js";
import { isDeliveryConfigured, sendContactMessage } from "./email.js";
import { addressKey, checkRateLimit, clientAddressFrom } from "./rate-limit.js";

/**
 * Hosts like Render, Railway and Fly inject `PORT` and route to that one; Docker
 * in this repo sets `API_PORT`. PORT wins so a copied .env cannot bind a port
 * nobody is routing to.
 *
 * An empty or non-numeric value counts as absent: `Number("")` is 0, which would
 * otherwise bind a random port nobody forwards to.
 */
const requestedPort = (process.env.PORT || process.env.API_PORT || "4000").trim();
const parsedPort = Number(requestedPort);
const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 4000;

/** Five messages per ten minutes per client: ample for a person, thin for a script. */
const rateLimit = { limit: 5, windowMs: 10 * 60 * 1000 };

/**
 * Who may call this from a browser.
 *
 * Unset means any origin, which is fine for an endpoint with no cookies and no
 * session: the request carries nothing a stranger could borrow. Set
 * `ALLOWED_ORIGINS=https://yourdomain.com` to narrow it.
 */
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

// Behind a proxy (Docker, Render, Fly) the client address arrives in a header.
app.set("trust proxy", true);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: ["POST", "GET", "OPTIONS"],
  }),
);

// 1. Size, from the header before anything is read…
app.use((request, response, next) => {
  const declared = Number(request.headers["content-length"] ?? "");

  if (Number.isFinite(declared) && declared > contactLimits.payload) {
    response.status(413).json({ success: false, message: contactApiMessages.malformed });
    return;
  }

  next();
});

// … and from the body itself, so a chunked request cannot sidestep the ceiling.
app.use(express.json({ limit: contactLimits.payload }));

app.use((error, request, response, next) => {
  if (error?.type === "entity.too.large" || error?.status === 413) {
    response.status(413).json({ success: false, message: contactApiMessages.malformed });
    return;
  }

  if (error instanceof SyntaxError) {
    response.status(400).json({ success: false, message: contactApiMessages.malformed });
    return;
  }

  next(error);
});

app.get("/healthz", (request, response) => {
  response.json({ ok: true, delivery: isDeliveryConfigured() });
});

app.post("/api/contact", async (request, response) => {
  const body = typeof request.body === "object" && request.body !== null ? request.body : {};

  // 2. The honeypot. Answered, not rejected: a script that learns which check
  //    caught it comes back without it.
  const honeypot = body[contactHoneypotField];

  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    response.json({ success: true, message: contactApiMessages.sent });
    return;
  }

  // 3. Throttling, before any validation work is done for the same client.
  const limit = checkRateLimit(
    addressKey(clientAddressFrom(request.headers)),
    rateLimit,
  );

  if (!limit.allowed) {
    response
      .status(429)
      .set("Retry-After", String(limit.retryAfterSeconds))
      .json({ success: false, message: contactApiMessages.rateLimited });
    return;
  }

  // 4. The same rules the browser ran. The browser's answer was a courtesy.
  const { value, errors } = parseContactSubmission(body);

  if (hasContactErrors(errors)) {
    response.status(400).json({ success: false, message: contactApiMessages.invalid, errors });
    return;
  }

  // 5. Refuse honestly when there is nowhere to send it.
  if (!isDeliveryConfigured()) {
    response.status(503).json({ success: false, message: contactApiMessages.unavailable });
    return;
  }

  const result = await sendContactMessage(value);

  if (!result.ok) {
    response.status(502).json({ success: false, message: contactApiMessages.failed });
    return;
  }

  response.json({ success: true, message: contactApiMessages.sent });
});

// Anything else is a 404 in the same shape, so a client never has to parse HTML.
app.use((request, response) => {
  response.status(404).json({ success: false, message: "Not found." });
});

const server = app.listen(port, () => {
  console.log(
    `[api] listening on :${port} — delivery ${isDeliveryConfigured() ? "configured" : "NOT configured"}`,
  );
});

/** Stop accepting requests, then exit; containers send SIGTERM, not Ctrl+C. */
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    console.log(`[api] ${signal} received, shutting down`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5_000).unref();
  });
}
