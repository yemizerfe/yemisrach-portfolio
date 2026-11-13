import type { AboutInterest, AboutParagraph } from "@/types/portfolio";
import { siteConfig } from "@/data/site";

/**
 * About, education and learning content.
 *
 * Positioning: backend engineering is the primary interest; frontend work is
 * described as a supporting capability, never as a second specialisation.
 *
 * The section is supplied copy, kept in the order and the wording it was given:
 * the introduction, the journey so far, what I am working toward, the interests
 * beyond code, and a resume link. It reads as one continuous account
 * rather than a set of marketing blocks, and it complements the Engineering
 * section instead of restating it.
 *
 * Accuracy: no CGPA and no graduation date are published anywhere. The name is
 * taken from `siteConfig` so this copy can never drift from the rest of the
 * site.
 */

/** 1. About Me — the introduction. Three paragraphs, read as one account. */
export const aboutIntro = {
  eyebrow: "About me",
  title: "About Me",
  paragraphs: [
    `I'm ${siteConfig.name}, a final-year Software Engineering student with a strong interest in backend development and building software that solves practical problems.`,
    "I enjoy taking an idea, understanding the problem behind it, and turning it into a structured, working application. Through my projects, I've been developing my skills in backend engineering, databases, APIs, system design, and software architecture.",
    {
      before: "I'm especially interested in understanding ",
      emphasis: "how systems work behind the interface",
      after: " — how data is structured, how services communicate, how business logic is designed, and how software can remain maintainable as it grows.",
    },
  ] as AboutParagraph[],
} as const;

/**
 * The introduction as plain text.
 *
 * The resume summary renders these paragraphs directly, so the short version of
 * who I am cannot drift from this section: the copy is written once, above.
 */
export const aboutParagraphs: string[] = aboutIntro.paragraphs.map((paragraph) =>
  typeof paragraph === "string"
    ? paragraph
    : `${paragraph.before}${paragraph.emphasis}${paragraph.after}`,
);

/** 2. My Journey — how the interest in backend work began. */
export const aboutJourney = {
  title: "My Journey",
  paragraphs: [
    "I started my programming journey with web development and gradually became more interested in what happens behind the interface. That interest led me toward backend development, where I've been focusing on APIs, databases, authentication, architecture, and building complete backend systems.",
    "Today, I learn primarily by building. Each project gives me an opportunity to work through real engineering problems, make architectural decisions, and understand the technologies I use rather than simply relying on them.",
  ],
} as const;

/** 3. What I'm Working Toward — the near goal first, then the long one. */
export const aboutWorkingToward = {
  title: "What I'm Working Toward",
  paragraphs: [
    "My immediate goal is to begin my career as a backend engineer, contribute to real-world systems, and continue learning from experienced engineers.",
    "Long term, I want to combine technical expertise with product thinking, business understanding, and leadership to build technology products that create meaningful value.",
  ],
} as const;

export const education = {
  degree: "Bachelor of Software Engineering",
  institution: "Debre Markos University",
  status: "Currently enrolled",
  focus: [
    "Software engineering fundamentals and design",
    "Databases and data modelling",
    "Algorithms and data structures",
    "Operating systems and networks",
    "Software project practice",
  ],
  /** No dates or CGPA are displayed: neither has been verified. */
  note: "Dates, expected graduation and GPA are left off deliberately — I only publish figures I can verify.",
} as const;

/** 4. Beyond Code — its heading, plus the line that introduces the list. */
export const aboutBeyondCode = {
  title: "Beyond Code",
  intro: "I'm interested in more than writing software. I enjoy learning about:",
} as const;

/** The five interests themselves: a label, then one line of explanation. */
export const aboutInterests: AboutInterest[] = [
  {
    id: "system-design",
    label: "System design",
    description: "understanding how complex software is structured.",
  },
  {
    id: "product-thinking",
    label: "Product thinking",
    description:
      "understanding the problem and value behind what is being built.",
  },
  {
    id: "technology-and-business",
    label: "Technology & business",
    description: "exploring how technology can solve business problems.",
  },
  {
    id: "leadership",
    label: "Leadership",
    description:
      "developing the skills needed to eventually build and lead technology products.",
  },
  {
    id: "continuous-learning",
    label: "Continuous learning",
    description:
      "constantly improving through projects, experimentation, and study.",
  },
];


