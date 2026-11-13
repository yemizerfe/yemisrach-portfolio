import type {
  ContactFieldErrors,
  ContactFieldName,
  ContactSubmission,
} from "@/types/portfolio";

/**
 * The contact contract.
 *
 * One set of rules, used by both sides of the form. The browser validates with
 * these functions so a visitor hears about a problem before a round trip; the
 * route handler validates with the same ones, because the browser's answer is a
 * courtesy and never a guarantee — nothing stops a request being written by
 * hand. Sharing the rules is what keeps the two from drifting, which is how a
 * form ends up accepting something the API then rejects.
 *
 * Isomorphic on purpose: no Node APIs, no React, no provider SDKs, so the same
 * import works in a client component and in a route handler.
 */

/** The fields in the order they are asked for. That order is also how the form finds the first one needing attention. */
export const contactFieldNames: readonly ContactFieldName[] = [
  "name",
  "email",
  "subject",
  "message",
];

/**
 * Hard limits.
 *
 * The inputs carry the same numbers as `maxLength`, so the character counter,
 * the control and the server all agree on where "too long" begins.
 */
export const contactLimits = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { min: 4, max: 120 },
  message: { min: 20, max: 2000 },
  /** Ceiling for the whole request body, checked before it is parsed. */
  payload: 20_000,
} as const;

/**
 * What a visitor reads when a field does not pass.
 *
 * Written as instructions rather than diagnoses, because a field error is the
 * one moment the form has someone's full attention. The numbers come from
 * `contactLimits`, so the copy cannot disagree with the rule it describes.
 */
export const contactValidationMessages = {
  name: {
    required: "Please enter your name.",
    tooShort: `Please enter at least ${contactLimits.name.min} characters for your name.`,
    tooLong: `Please keep your name under ${contactLimits.name.max} characters.`,
  },
  email: {
    required: "Please enter your email address.",
    invalid: "Please enter a valid email address.",
    tooLong: "That email address is too long.",
  },
  subject: {
    required: "Please enter a subject.",
    tooShort: `Please give the subject at least ${contactLimits.subject.min} characters.`,
    tooLong: `Please keep the subject under ${contactLimits.subject.max} characters.`,
  },
  message: {
    required: "Please enter a message.",
    tooShort: `Please write at least ${contactLimits.message.min} characters.`,
    tooLong: `Please keep your message under ${contactLimits.message.max} characters.`,
  },
} as const;

/**
 * The route handler's own copy.
 *
 * Hand-written sentences rather than anything the email provider said: a
 * provider error can name an account, a domain or a key, and none of that
 * belongs in a browser. Deliberately free of "email me instead" — this site
 * publishes no address yet, and pointing a visitor at an inbox that does not
 * exist is worse than saying less. The form adds that offer itself, and only
 * when there is a real address to offer.
 */
export const contactApiMessages = {
  sent: "Your message has been sent successfully.",
  invalid: "Please check the highlighted fields and try again.",
  malformed: "That request could not be read. Please try again.",
  rateLimited:
    "Too many messages have been sent from this connection. Please try again shortly.",
  unavailable: "The contact form is not available right now.",
  failed: "Something went wrong while sending your message. Please try again.",
} as const;

/**
 * The honeypot's field name, shared so the form and the handler cannot disagree
 * about which input is the trap.
 *
 * It has to look worth filling to a script that fills everything, and be
 * unreachable to anyone using the form: the control is off-screen, out of the
 * tab order, and named for something browser autofill has no opinion about.
 */
export const contactHoneypotField = "contactReference";

/**
 * A cheap, linear shape check for an address — deliberately not an RFC 5322
 * parser. It has to be readable, reject the obvious nonsense, and run in
 * bounded time on whatever arrives. An address is verified by replying to it,
 * which is the only verification that means anything.
 */
const emailPattern =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

/**
 * Turn whatever arrived into a string we are willing to work with.
 *
 * Control characters go — they exist to break logs and mail headers. CRLF
 * becomes LF, so "how many lines is this" has one answer. Runs of blank lines
 * collapse, so a pasted message does not arrive as a wall of empty space.
 *
 * Markup is *not* stripped here. Nothing is ever inserted into a document as
 * HTML, and the email body escapes its values as it composes them, which is the
 * point where escaping actually belongs — one place, at the boundary.
 */
export function sanitizeContactText(input: string): string {
  return input
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Non-strings are treated as empty, and empty therefore fails as "required". */
function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * One field's rule.
 *
 * Used on blur in the browser and again in the route handler, so a field cannot
 * be valid in one place and invalid in the other.
 */
export function validateContactField(
  field: ContactFieldName,
  rawValue: string,
): string | undefined {
  const value = sanitizeContactText(rawValue);

  switch (field) {
    case "name": {
      if (!value) return contactValidationMessages.name.required;
      if (value.length < contactLimits.name.min) {
        return contactValidationMessages.name.tooShort;
      }
      if (value.length > contactLimits.name.max) {
        return contactValidationMessages.name.tooLong;
      }
      return undefined;
    }
    case "email": {
      if (!value) return contactValidationMessages.email.required;
      if (value.length > contactLimits.email.max) {
        return contactValidationMessages.email.tooLong;
      }
      if (!emailPattern.test(value)) {
        return contactValidationMessages.email.invalid;
      }
      return undefined;
    }
    case "subject": {
      if (!value) return contactValidationMessages.subject.required;
      if (value.length < contactLimits.subject.min) {
        return contactValidationMessages.subject.tooShort;
      }
      if (value.length > contactLimits.subject.max) {
        return contactValidationMessages.subject.tooLong;
      }
      return undefined;
    }
    case "message": {
      if (!value) return contactValidationMessages.message.required;
      if (value.length < contactLimits.message.min) {
        return contactValidationMessages.message.tooShort;
      }
      if (value.length > contactLimits.message.max) {
        return contactValidationMessages.message.tooLong;
      }
      return undefined;
    }
    default:
      return undefined;
  }
}

export interface ContactParseResult {
  /** Normalised values — present even when invalid, so the form can keep what was typed. */
  value: ContactSubmission;
  errors: ContactFieldErrors;
}

/** Whether a parse produced anything to complain about. */
export function hasContactErrors(errors: ContactFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** The first field, in ask-order, that needs attention — where a form should put the cursor. */
export function firstInvalidField(
  errors: ContactFieldErrors,
): ContactFieldName | undefined {
  return contactFieldNames.find((field) => Boolean(errors[field]));
}

/**
 * The whole submission: normalise every field, then run every rule.
 *
 * Takes `unknown` because that is genuinely what a request body is — the route
 * handler must not assume the shape it hoped for.
 */
export function parseContactSubmission(raw: unknown): ContactParseResult {
  const record =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>)
      : {};

  const value: ContactSubmission = {
    name: sanitizeContactText(asText(record.name)),
    email: sanitizeContactText(asText(record.email)),
    subject: sanitizeContactText(asText(record.subject)),
    message: sanitizeContactText(asText(record.message)),
  };

  const errors: ContactFieldErrors = {};

  for (const field of contactFieldNames) {
    const message = validateContactField(field, value[field]);
    if (message) errors[field] = message;
  }

  return { value, errors };
}
