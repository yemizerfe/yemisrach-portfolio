import { contactLimits } from "@/lib/contact";
import type { ContactFieldConfig, ContactOpportunity } from "@/types/portfolio";

/**
 * Contact copy.
 *
 * The section has one job — let someone reach me inside a few seconds — so the
 * heading is the invitation rather than a slogan, the supporting line says what
 * I am open to instead of reaching for a phrase, and the form asks for the four
 * things an email actually needs. The addresses themselves are not repeated
 * here: they come from `siteConfig`, so there is one place where a real value
 * can exist.
 */

/** The hero: the invitation, and the only paragraph a visitor has to read. */
export const contactIntro = {
  index: "04",
  eyebrow: "Contact",
  title: "Let's Connect",
  description:
    "I'm open to backend engineering opportunities, technical collaborations, and conversations about software engineering. If you'd like to get in touch, feel free to send me a message.",
};

/** Heading and note for the channel ledger. The rows are built from `siteConfig`. */
export const contactInfoCopy = {
  title: "Contact information",
};

/**
 * The form's fields, in the order they are asked.
 *
 * Each one carries its own `maxLength`, taken from the shared limits, so the
 * control, the character counter and the server all stop at the same place.
 */
export const contactFormFields: ContactFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    placeholder: "Your name",
    control: "input",
    type: "text",
    autoComplete: "name",
    maxLength: contactLimits.name.max,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "you@example.com",
    control: "input",
    type: "email",
    autoComplete: "email",
    maxLength: contactLimits.email.max,
  },
  {
    name: "subject",
    label: "Subject",
    placeholder: "What would you like to discuss?",
    control: "input",
    type: "text",
    autoComplete: "off",
    maxLength: contactLimits.subject.max,
  },
  {
    name: "message",
    label: "Message",
    placeholder: "Write your message...",
    control: "textarea",
    autoComplete: "off",
    maxLength: contactLimits.message.max,
    hint: `A few sentences is plenty — up to ${contactLimits.message.max} characters.`,
  },
];

/** Everything the form says around its fields. */
export const contactFormCopy = {
  title: "Send a message",
  description: "Four fields, nothing more. What you write comes straight to my inbox.",
  requiredNote: "All four fields are required.",
  submitLabel: "Send Message",
  pendingLabel: "Sending...",
  successMessage:
    "Thanks for reaching out. Your message has been sent successfully.",
  /**
   * Failure copy comes in two versions.
   *
   * A site with no configured address and one with an address fail the same
   * way, but only one of them can offer a second route — so the form picks the
   * version it can honour rather than telling everyone to send an email that
   * may not exist.
   */
  failure:
    "Something went wrong while sending your message. Please try again in a moment.",
  failureWithEmail:
    "Something went wrong while sending your message. Please try again, or contact me directly by email.",
  unavailable: "The contact form is not open yet. Please try again later.",
  unavailableWithEmail:
    "The contact form is not available right now. Please email me directly instead.",
  privacyNote: "Only these four fields are sent. Nothing is stored on this site.",
  emailFallbackTitle: "Prefer email?",
  emailFallbackNote: "If the form gives you any trouble, this address always works.",
};

/**
 * The kinds of work I am open to.
 *
 * The list is the claim, and it is deliberately kept to the work itself: what
 * I want to build, not a level to be placed at. No seniority, no graduation
 * year and no internship framing, because those are the employer's side of the
 * conversation to decide and stating them here would only narrow it.
 */
export const contactOpportunityItems: ContactOpportunity[] = [
  { id: "backend-roles", label: "Backend Engineering" },
  { id: "collaborations", label: "Technical Collaboration" },
  { id: "projects", label: "Software Projects" },
];

export const contactOpportunitiesCopy = {
  title: "Open to Opportunities",
  note: "I’m open to backend engineering opportunities, technical collaborations, and software projects where I can contribute to reliable systems, thoughtful engineering, and meaningful products.",
};

