/**
 * The contact contract for the standalone API.
 *
 * This mirrors `src/lib/contact.ts`, which the browser uses: the same rules have
 * to run on both sides, or a form passes validation locally and is rejected by
 * the server. The two files are kept in step by hand because this folder is a
 * plain Node package with no build step — change both together.
 */

export const contactFieldNames = ["name", "email", "subject", "message"];

export const contactLimits = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { min: 4, max: 120 },
  message: { min: 20, max: 2000 },
  /** Ceiling for the whole request body, checked before it is parsed. */
  payload: 20_000,
};

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
};

/** Sentences a visitor could read. Nothing here describes the server's internals. */
export const contactApiMessages = {
  sent: "Your message has been sent successfully.",
  invalid: "Please check the highlighted fields and try again.",
  malformed: "That request could not be read. Please try again.",
  rateLimited:
    "Too many messages have been sent from this connection. Please try again shortly.",
  unavailable: "The contact form is not available right now.",
  failed: "Something went wrong while sending your message. Please try again.",
};

/** The honeypot's field name, shared with the form. */
export const contactHoneypotField = "contactReference";

const emailPattern =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

/** Drop control characters and normalise line endings; markup is escaped later, at the boundary. */
export function sanitizeContactText(input) {
  return String(input ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function asText(value) {
  return typeof value === "string" ? value : "";
}

/** One field's rule: used on blur in the browser and again here. */
export function validateContactField(field, rawValue) {
  const value = sanitizeContactText(rawValue);

  switch (field) {
    case "name":
      if (!value) return contactValidationMessages.name.required;
      if (value.length < contactLimits.name.min) return contactValidationMessages.name.tooShort;
      if (value.length > contactLimits.name.max) return contactValidationMessages.name.tooLong;
      return undefined;
    case "email":
      if (!value) return contactValidationMessages.email.required;
      if (value.length > contactLimits.email.max) return contactValidationMessages.email.tooLong;
      if (!emailPattern.test(value)) return contactValidationMessages.email.invalid;
      return undefined;
    case "subject":
      if (!value) return contactValidationMessages.subject.required;
      if (value.length < contactLimits.subject.min) return contactValidationMessages.subject.tooShort;
      if (value.length > contactLimits.subject.max) return contactValidationMessages.subject.tooLong;
      return undefined;
    case "message":
      if (!value) return contactValidationMessages.message.required;
      if (value.length < contactLimits.message.min) return contactValidationMessages.message.tooShort;
      if (value.length > contactLimits.message.max) return contactValidationMessages.message.tooLong;
      return undefined;
    default:
      return undefined;
  }
}

export function hasContactErrors(errors) {
  return Object.keys(errors).length > 0;
}

export function firstInvalidField(errors) {
  return contactFieldNames.find((field) => Boolean(errors[field]));
}

/** The whole submission: normalise every field, then run every rule. */
export function parseContactSubmission(raw) {
  const record = typeof raw === "object" && raw !== null ? raw : {};

  const value = {
    name: sanitizeContactText(asText(record.name)),
    email: sanitizeContactText(asText(record.email)),
    subject: sanitizeContactText(asText(record.subject)),
    message: sanitizeContactText(asText(record.message)),
  };

  const errors = {};

  for (const field of contactFieldNames) {
    const message = validateContactField(field, value[field]);
    if (message) errors[field] = message;
  }

  return { value, errors };
}
