import type { ContactChannel } from "@/types/portfolio";

/**
 * Single source of truth for identity, links and contact.
 *
 * Positioning: the primary professional identity is **Backend Software
 * Engineer**. Full-stack delivery is a supporting capability, described as
 * supporting rather than as a second specialisation, and no seniority is
 * claimed that has not been established.
 *
 * Accuracy rules: only verified links are listed here. `email` stays null
 * until a real address exists, and components render channels conditionally
 * so nothing points at a placeholder.
 */
/**
 * The deliberately-null slots.
 *
 * Declared above the config so a use cannot outrun its declaration, and written
 * as `null as string | null` rather than `null` with a type annotation on
 * purpose: TypeScript narrows a `const` whose initialiser is the literal `null`
 * all the way down to the type `null`, and a value typed `null` cannot be
 * tested for, which is exactly what the components do with these. Asserting the
 * union keeps the type honest until a real value replaces it.
 *
 * Filling one of these in publishes the matching channel everywhere it is read
 * — `contactChannels` spreads in only what exists, so nothing ever points at an
 * invented address or a placeholder profile.
 */

/** Set this to a real address to publish an Email channel across the site. */
const email = "yemisrachzerfe021@gmail.com" as string | null;

/** Professional profile. Published as a Contact channel. */
const linkedin = "https://www.linkedin.com/in/yemisrach-zerfe-14884a360" as string | null;

/**
 * Set this to a PDF path inside /public (for example
 * "/resume/yemisrach-zerfe-resume.pdf") to enable the download button.
 * Until then the resume lives on /resume and can be printed to PDF.
 */
const resumePdf = null as string | null;

export const siteConfig = {
  name: "Yemisrach Zerfe",
  shortName: "Yemisrach",
  /** Primary positioning. Used as the hero heading and the page title. */
  role: "Backend Software Engineer",
  status: "Backend Software Engineer",
  /** Primary description: what is actually designed and built. */
  intro:
    "I design and build backend systems that are reliable, secure, and built to scale.",
  supporting:
    "My work spans APIs, data models, authentication, and the infrastructure that keeps products dependable.",
  /** Where the engineering attention goes, in priority order. */
  engineeringFocus:
    "Focused on backend architecture, API design, databases, authentication, security, realtime systems, and scalable application design.",
  availability: "Currently building and learning through real-world projects.",
  location: "Ethiopia",
  github: "https://github.com/yemizerfe",
  githubHandle: "yemizerfe",
  email,
  linkedin,
  resumePdf,
  resumePath: "/resume",
} as const;

/**
 * Discipline order: backend first, systems and data next, frontend support
 * last. The order is the message.
 */
export const focusAreas = [
  "Backend Engineering",
  "API Design",
  "Databases",
  "Security",
  "Distributed Systems",
  "Realtime Systems",
  "System Design",
] as const;

/**
 * Primary navigation. Resume and GitHub sit beside these links in the
 * navbar and in the footer, so they are not repeated here.
 */
export const navLinks = [
  { label: "Home", href: "/#top" },
  { label: "Projects", href: "/#projects" },
  { label: "Engineering", href: "/#engineering" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

/**
 * Where I can actually be reached, in the order of how direct each one is.
 *
 * Email and LinkedIn are spread in only when a real value exists in the config
 * above, so the list is always a list of working destinations: no greyed-out
 * row and nothing pointing at an invented address. GitHub is unconditional
 * because the profile is verifiably real. The resume is not repeated here —
 * it is a link in the navbar, in the footer, and in this section's closing
 * call to action.
 */
export const contactChannels: ContactChannel[] = [
  ...(email
    ? [
        {
          id: "email",
          label: "Email",
          value: email,
          href: `mailto:${email}`,
          description: "The most direct route to me for a role, a project or a question.",
          external: false,
        },
      ]
    : []),
  {
    id: "github",
    label: "GitHub",
    value: `github.com/${siteConfig.githubHandle}`,
    href: siteConfig.github,
    description:
      "Source code, commit history and work in progress across my projects.",
    external: true,
  },
  ...(linkedin
    ? [
        {
          id: "linkedin",
          label: "LinkedIn",
          value: linkedin.replace(/^https?:\/\/(www\.)?/, ""),
          href: linkedin,
          description: "Professional profile, if you would rather connect there.",
          external: true,
        },
      ]
    : []),
];
