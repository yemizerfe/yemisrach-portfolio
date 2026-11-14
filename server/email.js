/**
 * Delivery for the standalone API — EmailJS, the same provider the site uses.
 *
 * EmailJS accepts a server-side send from its REST endpoint when the request
 * carries the account's **private key** (`accessToken`). That key is a real
 * secret: it stays in the host's environment, is read per call, and never
 * reaches the browser. The service id, template id and public key are the same
 * values the site already ships — public by design.
 *
 * Without a private key the API answers "not available" instead of pretending a
 * message was sent.
 */

const endpoint = "https://api.emailjs.com/api/v1.0/email/send";

/** Nothing waits forever: a provider that hangs must not hold the request open. */
const timeoutMs = 10_000;

/** Fallback destination when CONTACT_TO_EMAIL is unset. */
const defaultInbox = "yemisrachzerfe021@gmail.com";

function readConfig() {
  const serviceId = (process.env.EMAILJS_SERVICE_ID ?? process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "").trim();
  const templateId = (process.env.EMAILJS_TEMPLATE_ID ?? process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "").trim();
  const publicKey = (process.env.EMAILJS_PUBLIC_KEY ?? process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "").trim();
  const privateKey = (process.env.EMAILJS_PRIVATE_KEY ?? "").trim();
  const to = (process.env.CONTACT_TO_EMAIL ?? "").trim() || defaultInbox;

  if (!serviceId || !templateId || !publicKey || !privateKey) return null;

  return { serviceId, templateId, publicKey, privateKey, to };
}

/** Whether the server can actually deliver right now. */
export function isDeliveryConfigured() {
  return readConfig() !== null;
}

/**
 * The template's variables.
 *
 * An EmailJS template names its own variables in their dashboard. The common
 * spellings are sent together — the template ignores keys it does not use — so
 * the message lands whichever name it asks for. Every value is the visitor's own
 * words and nothing else.
 */
function templateParams(payload, to) {
  const single = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

  return {
    name: payload.name,
    from_name: payload.name,
    user_name: payload.name,
    email: payload.email,
    from_email: payload.email,
    reply_to: payload.email,
    user_email: payload.email,
    subject: single(payload.subject),
    title: single(payload.subject),
    message: payload.message,
    user_message: payload.message,
    to_email: to,
    to_name: "Yemisrach Zerfe",
  };
}

/** Hands the message to EmailJS. Reports what happened; never assumes success. */
export async function sendContactMessage(payload) {
  const config = readConfig();
  if (!config) return { ok: false, reason: "not-configured" };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateId,
        user_id: config.publicKey,
        accessToken: config.privateKey,
        template_params: templateParams(payload, config.to),
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      // The provider's own words can name an account or a key, so only the
      // status is kept.
      console.error(`[contact] delivery failed with status ${response.status}`);
      return { ok: false, reason: "provider-error" };
    }

    return { ok: true, id: null };
  } catch (error) {
    console.error("[contact] delivery threw", error instanceof Error ? error.message : "unknown");
    return { ok: false, reason: "provider-error" };
  }
}
