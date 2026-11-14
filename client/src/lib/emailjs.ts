"use client";

import emailjs from "@emailjs/browser";

import { siteConfig } from "@/data/site";
import type { ContactSubmission } from "@/types/portfolio";

/**
 * Browser-side delivery through EmailJS.
 *
 * EmailJS sends from the browser with a public key, which is exactly what this
 * deployment needs: there is no server secret to provision, and the provider
 * refuses server-side calls for this account ("API access from non-browser
 * environments is currently disabled"). The key is public by design — it can
 * only send through this one service and template — so the `NEXT_PUBLIC_`
 * prefix is correct here rather than careless.
 *
 * The route handler is still the fallback: when these variables are absent the
 * form posts to /api/contact exactly as before. Delivery is attempted, never
 * assumed: `sendViaEmailJs` reports what happened, and the form only clears
 * itself and says "sent" when the provider accepted the message.
 */

const config = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim() ?? "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim() ?? "",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() ?? "",
  /** Optional override; the published address is the sane default. */
  toEmail:
    process.env.NEXT_PUBLIC_EMAILJS_TO_EMAIL?.trim() || siteConfig.email || "",
} as const;

/** True when every value a send needs is present. */
export const isEmailJsConfigured = Boolean(
  config.serviceId && config.templateId && config.publicKey,
);

/**
 * The template's variables.
 *
 * An EmailJS template names its own variables, and that name is configured in
 * their dashboard rather than in this repository. The common spellings are sent
 * together — unknown keys are ignored by the template — so the message lands
 * whether the template asks for `name`, `from_name` or `user_name`. Every value
 * is the visitor's own words and nothing else.
 */
function templateParams(payload: ContactSubmission): Record<string, string> {
  return {
    name: payload.name,
    from_name: payload.name,
    user_name: payload.name,
    email: payload.email,
    from_email: payload.email,
    reply_to: payload.email,
    user_email: payload.email,
    subject: payload.subject,
    title: payload.subject,
    message: payload.message,
    user_message: payload.message,
    to_email: config.toEmail,
    to_name: "Yemisrach Zerfe",
  };
}

/** Hands the message to EmailJS. Resolves true only if the provider accepted it. */
export async function sendViaEmailJs(
  payload: ContactSubmission,
): Promise<boolean> {
  if (!isEmailJsConfigured) return false;

  try {
    await emailjs.send(
      config.serviceId,
      config.templateId,
      templateParams(payload),
      { publicKey: config.publicKey },
    );
    return true;
  } catch (error) {
    // The provider's own words can name an account or a key, so they stop here.
    console.error(
      "[contact] email delivery failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return false;
  }
}
