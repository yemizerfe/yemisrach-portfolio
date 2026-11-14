import { siteConfig } from "@/data/site";
import type { ContactSubmission } from "@/types/portfolio";

/**
 * Contact-form delivery.
 *
 * The form sends a real message. A green tick that delivers nothing is worse
 * than no form at all, because the sender believes they have reached me and
 * their message is gone.
 *
 * Delivery therefore goes through one transactional email provider — Resend,
 * whose free tier (3,000 messages a month, 100 a day) is far beyond what a
 * portfolio needs — and every credential stays in the environment. The API key
 * is read from `process.env` inside the handler: never bundled, never returned
 * in a response, never written to a log. This module is imported by the route
 * handler alone.
 *
 * A provider API was chosen over raw SMTP deliberately: SMTP would mean a
 * long-lived password in the deploy settings plus a transport dependency and
 * its own failure modes, whereas a scoped key is revocable on its own and the
 * call below is a plain `fetch`.
 */

const endpoint = "https://api.resend.com/emails";

/** Nothing waits forever: a provider that hangs must not hold the request open. */
const timeoutMs = 10_000;

export type ContactDeliveryResult =
  | { ok: true; id: string | null }
  | { ok: false; reason: "not-configured" | "provider-error" };

interface ContactDeliveryConfig {
  apiKey: string;
  to: string;
  from: string;
}

/**
 * Credentials, read at call time rather than at import time.
 *
 * `CONTACT_TO_EMAIL` is the destination and stays server-side, so the form can
 * deliver to an inbox that is not published in the page's HTML. When it is
 * absent, the address configured in `siteConfig` is used instead — which means
 * setting one line anywhere is enough to switch delivery on.
 */
function readContactDeliveryConfig(): ContactDeliveryConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() || siteConfig.email || "";

  if (!apiKey || !to) return null;

  return {
    apiKey,
    to,
    /*
     * `onboarding@resend.dev` is Resend's shared test sender: it delivers
     * without a verified domain, which is what makes this runnable before the
     * portfolio owns one. A verified address overrides it, and should — the
     * shared sender is for getting the flow working, not for production.
     */
    from:
      process.env.CONTACT_FROM_EMAIL?.trim() ||
      "Portfolio contact form <onboarding@resend.dev>",
  };
}

/**
 * Asked by the route handler before it tries.
 *
 * Knowing the answer means a visitor gets "this is not available right now"
 * instead of a provider error dressed up as a failure they caused.
 */
export function isContactDeliveryConfigured(): boolean {
  return readContactDeliveryConfig() !== null;
}

/**
 * Escape for an HTML text node.
 *
 * A visitor's own words are the one input that reaches somewhere markup is
 * rendered, so this is where escaping belongs: the inbox sees exactly what was
 * typed, including anything that looks like a tag — as text, never as markup.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Collapse to one line: the subject ends up in a mail header, where a newline means something else. */
function singleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * The message as HTML.
 *
 * Plain and quiet on purpose: it has to arrive intact in a mail client nobody
 * has tested against, so it is one column, inline styles and no template. The
 * message keeps its own line breaks.
 */
function buildHtml(payload: ContactSubmission): string {
  const field = (label: string, value: string) =>
    `<p style="margin:0 0 14px"><strong style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280">${label}</strong><br />${value}</p>`;

  return [
    '<div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#111827;max-width:640px">',
    '<p style="margin:0 0 20px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280">New message from the portfolio contact form</p>',
    field("Name", escapeHtml(payload.name)),
    field("Email", escapeHtml(payload.email)),
    field("Subject", escapeHtml(singleLine(payload.subject))),
    '<p style="margin:0 0 6px"><strong style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280">Message</strong></p>',
    `<blockquote style="margin:0 0 20px;padding:12px 16px;border-left:3px solid #d1d5db;background:#f9fafb;white-space:pre-wrap">${escapeHtml(payload.message)}</blockquote>`,
    `<p style="margin:0;font-size:13px;color:#6b7280">Reply to this email to answer ${escapeHtml(singleLine(payload.name))} directly — the reply-to address is theirs, not the sender this was sent from.</p>`,
    "</div>",
  ].join("");
}

/** The same message for clients that prefer not to render HTML. */
function buildText(payload: ContactSubmission): string {
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

/**
 * Hand the message to the provider.
 *
 * Anything the provider says about a failure stops here and becomes one of two
 * outcomes the route handler already knows how to answer: configured and sent,
 * or not sent. The response body is never passed on and the status is the only
 * thing written to the server log — enough to debug with, nothing a reader of
 * the logs should not see.
 */
export async function sendContactMessage(
  payload: ContactSubmission,
): Promise<ContactDeliveryResult> {
  const config = readContactDeliveryConfig();
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
        // Prefixed so the inbox can tell a form message from anything else.
        subject: `[Portfolio] ${singleLine(payload.subject)}`,
        // Replying to the notification answers the visitor, not the sender.
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

    const body = (await response.json().catch(() => null)) as {
      id?: string;
    } | null;

    return { ok: true, id: body?.id ?? null };
  } catch (error) {
    console.error(
      "[contact] delivery threw",
      error instanceof Error ? error.message : "unknown error",
    );
    return { ok: false, reason: "provider-error" };
  }
}
