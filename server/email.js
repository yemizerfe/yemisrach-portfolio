/**
 * Delivery for the standalone API.
 *
 * Mirrors `src/lib/email.ts`: one transactional provider, a plain `fetch`, and
 * credentials read from the environment at call time so nothing is bundled or
 * logged. The message is composed twice — HTML and text — because a port of the
 * message is a courtesy to clients that will not render markup.
 */

const endpoint = "https://api.resend.com/emails";

/** Nothing waits forever: a provider that hangs must not hold the request open. */
const timeoutMs = 10_000;

/** Default destination, used when CONTACT_TO_EMAIL is not set. */
const defaultInbox = "yemisrachzerfe021@gmail.com";

function readConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() || defaultInbox;

  if (!apiKey || !to) return null;

  return {
    apiKey,
    to,
    from:
      process.env.CONTACT_FROM_EMAIL?.trim() ||
      "Portfolio contact form <onboarding@resend.dev>",
  };
}

/** Whether the server can actually deliver right now. */
export function isDeliveryConfigured() {
  return readConfig() !== null;
}

/** Escape for an HTML text node: the visitor's words arrive as text, never markup. */
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Collapse to one line: a subject ends up in a mail header. */
function singleLine(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function buildHtml(payload) {
  const field = (label, value) =>
    `<p style="margin:0 0 14px"><strong style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280">${label}</strong><br />${value}</p>`;

  return [
    '<div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#111827;max-width:640px">',
    '<p style="margin:0 0 20px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280">New message from the portfolio contact form</p>',
    field("Name", escapeHtml(payload.name)),
    field("Email", escapeHtml(payload.email)),
    field("Subject", escapeHtml(singleLine(payload.subject))),
    '<p style="margin:0 0 6px"><strong style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280">Message</strong></p>',
    `<blockquote style="margin:0 0 20px;padding:12px 16px;border-left:3px solid #d1d5db;background:#f9fafb;white-space:pre-wrap">${escapeHtml(payload.message)}</blockquote>`,
    `<p style="margin:0;font-size:13px;color:#6b7280">Reply to this email to answer ${escapeHtml(singleLine(payload.name))} directly.</p>`,
    "</div>",
  ].join("");
}

function buildText(payload) {
  return [
    "New message from the portfolio contact form",
    "",
    `Name: ${singleLine(payload.name)}`,
    `Email: ${singleLine(payload.email)}`,
    `Subject: ${singleLine(payload.subject)}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}

/** Hands the message to the provider. Reports what happened; never assumes success. */
export async function sendContactMessage(payload) {
  const config = readConfig();
  if (!config) return { ok: false, reason: "not-configured" };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        subject: `[Portfolio] ${singleLine(payload.subject)}`,
        reply_to: payload.email,
        html: buildHtml(payload),
        text: buildText(payload),
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      console.error(`[contact] delivery failed with status ${response.status}`);
      return { ok: false, reason: "provider-error" };
    }

    const body = await response.json().catch(() => null);
    return { ok: true, id: body?.id ?? null };
  } catch (error) {
    console.error("[contact] delivery threw", error instanceof Error ? error.message : "unknown");
    return { ok: false, reason: "provider-error" };
  }
}
