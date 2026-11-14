/**
 * Portfolio content types.
 *
 * All portfolio content lives in `src/data/*` as typed objects so that
 * components never hard-code content and adding a project is a data-only change.
 */

export type ApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "WS";

/**
 * A conceptual view of one area of a backend's API surface.
 *
 * Deliberately not a route list. These pages are public, so a case study
 * describes what an area of the API is responsible for and which verbs it
 * accepts, never the paths it exposes — that way the published pages cannot be
 * used to probe or map a running system.
 */
export interface ApiCapability {
  /** Resource area, e.g. "Market data" or "Report lifecycle". */
  area: string;
  /** What this part of the surface is responsible for. */
  summary: string;
  /** Generic verbs this area accepts. Never a path. */
  methods?: ApiMethod[];
  /** What this area exposes, described in plain language. */
  capabilities: string[];
}

/** One node in a layered architecture flow. */
export interface ArchitectureLayer {
  name: string;
  detail: string;
}

/** Layered request flow plus the supporting services around it. */
export interface Architecture {
  flow: ArchitectureLayer[];
  services?: ArchitectureLayer[];
  note?: string;
}

/** Simplified entity relationship view. */
export interface DatabaseDiagram {
  root: {
    name: string;
    detail: string;
  };
  relations: {
    name: string;
    cardinality: string;
    detail: string;
  }[];
  note?: string;
}

/**
 * One engineering decision, recorded the way the case studies state them:
 * what was chosen, why, what it costs, and what it buys.
 *
 * `answer` is the single-paragraph form. `why`, `tradeoff` and `result` are the
 * structured form the case studies prefer, because a decision without its
 * trade-off is marketing rather than engineering.
 */
export interface DecisionItem {
  /** The decision, stated as a heading, e.g. "PostgreSQL as the single store". */
  question: string;
  /** Where the decision applies. Never a private path or configuration key. */
  context?: string;
  /** Technology label rendered in the card's own accent register. */
  technology?: string;
  /** Single-paragraph explanation, used when the structured fields are absent. */
  answer?: string;
  /** The engineering reason this option was chosen. */
  why?: string;
  /** The complexity or limitation the choice introduces. */
  tradeoff?: string;
  /** How the decision supports the project. */
  result?: string;
}

export interface TextItem {
  title: string;
  body: string;
}

/**
 * Whether a section describes shipped code or work that is designed but not
 * built yet.
 *
 * This is the mechanism behind the site's "nothing invented" rule: a planned
 * capability carries `status: "planned"`, which renders a visible pill beside
 * the heading, so designed work can never be read as delivered work.
 */
export type ImplementationStatus = "implemented" | "planned";

/** A technology group in the stack section, with its own honesty label. */
export interface StackGroup {
  label: string;
  items: string[];
  /** Overrides the label-based inference for groups whose name is neutral. */
  status?: ImplementationStatus;
}

/** One step in an ordered sequence, where the order is the meaning. */
export interface FlowStep {
  name: string;
  detail: string;
}

/** A short, representative code sample. */
export interface CodeSnippet {
  language: string;
  /** Shown in the sample's header, e.g. "messages/router.ts". */
  filename: string;
  code: string;
  caption?: string;
}

/** One tab in a case-study tab group. A tab carries prose, a list, or both. */
export interface TabItem {
  label: string;
  heading?: string;
  paragraphs?: string[];
  items?: string[];
}

/**
 * One expandable technical detail.
 *
 * Used for material that is worth recording but not worth reading unrequested —
 * the reasoning under a decision, or the notes behind a challenge. Collapsed by
 * default, so a long case study stays scannable without losing the detail.
 */
export interface AccordionItem {
  title: string;
  body: string;
  points?: string[];
}

/**
 * An interface screenshot slot.
 *
 * `src` stays null until a real screenshot is dropped into /public, so an
 * absent screenshot renders an honestly labelled empty slot — the same rule
 * the home-page portrait follows — rather than a broken image or an invented
 * mock.
 */
export interface ProjectImage {
  src: string | null;
  alt: string;
  caption: string;
  /** Where the file belongs, shown inside the empty slot. */
  expectedPath: string;
}

/** Challenge → approach → result, the shape a real engineering story takes. */
export interface ChallengeItem {
  challenge: string;
  approach: string;
  result: string;
  /** Set when the approach is designed but not yet built. */
  status?: ImplementationStatus;
}

/** A side-by-side comparison, e.g. two role-separated areas of one system. */
export interface CompareColumn {
  label: string;
  summary: string;
  items: string[];
  /**
   * Set when a column describes designed work rather than shipped work, so a
   * "target architecture" column can never be read as a delivered one.
   */
  status?: ImplementationStatus;
}

/** A project destination. Only real URLs are ever listed. */
export interface ProjectLink {
  label: string;
  href: string;
  kind: "github" | "demo" | "docs";
  detail: string;
}

/** Fields every case-study section shares, whatever its body kind is. */
interface CaseStudyBlockBase {
  /** Anchor id — also what the sticky navigation links to. */
  id: string;
  title: string;
  description?: string;
  /** Renders a "Planned" pill when the section describes unbuilt work. */
  status?: ImplementationStatus;
}

/**
 * Case studies are an ordered list of typed blocks, so the project page
 * renders any project without project-specific page code.
 *
 * The kinds are ordered to match how a backend engineer is asked about a
 * system: what it is, how it is shaped, how data is modelled, how it is
 * secured, what was hard, and what the code looks like.
 */
export type CaseStudyBlock =
  | (CaseStudyBlockBase & { kind: "prose"; paragraphs: string[] })
  | (CaseStudyBlockBase & { kind: "list"; items: string[] })
  | (CaseStudyBlockBase & { kind: "stack"; groups: StackGroup[] })
  | (CaseStudyBlockBase & { kind: "architecture"; architecture: Architecture })
  | (CaseStudyBlockBase & { kind: "database"; diagram: DatabaseDiagram })
  | (CaseStudyBlockBase & { kind: "api"; capabilities: ApiCapability[]; note?: string })
  | (CaseStudyBlockBase & { kind: "decisions"; items: DecisionItem[] })
  | (CaseStudyBlockBase & { kind: "flow"; steps: FlowStep[]; note?: string })
  | (CaseStudyBlockBase & { kind: "compare"; columns: CompareColumn[]; note?: string })
  | (CaseStudyBlockBase & { kind: "challenges"; items: ChallengeItem[] })
  | (CaseStudyBlockBase & { kind: "code"; snippets: CodeSnippet[] })
  | (CaseStudyBlockBase & { kind: "gallery"; images: ProjectImage[]; note?: string })
  | (CaseStudyBlockBase & { kind: "tabs"; tabs: TabItem[]; note?: string })
  | (CaseStudyBlockBase & { kind: "accordion"; items: AccordionItem[] })
  | (CaseStudyBlockBase & { kind: "milestones"; items: TextItem[] })
  | (CaseStudyBlockBase & { kind: "links"; items: ProjectLink[] });

export interface Project {
  /** URL segment: /projects/<slug> */
  slug: string;
  name: string;
  category: string;
  /** One-line description used on the project card. */
  tagline: string;
  /** Lead paragraph on the case study hero. */
  summary: string;
  /** Honest, current status. Never implies production usage. */
  status: string;
  /** Flat technology list used for badges. */
  technologies: string[];
  /**
   * Backend-first technologies shown on the project card, in display order.
   *
   * This is the list a recruiter reads first, so it contains only what the
   * project actually uses on the server side. Empty for interface-only work —
   * an empty list renders an honest note instead of a padded one.
   */
  backendStack: string[];
  /** Supporting technologies (usually the interface), shown after the backend stack. */
  supportingStack?: string[];
  /**
   * Technologies that are designed, partial or exploratory. Rendered as
   * qualified badges with their own label, never as if they were shipped.
   */
  qualifiedStack?: { label: string; items: string[] }[];
  /** Grouped stack used in the case study stack section. */
  stackGroups: StackGroup[];
  /** Engineering concepts demonstrated, not proficiency claims. */
  engineeringConcepts: string[];
  problem: string;
  solution: string;
  features: string[];
  architecture: Architecture;
  /** Omitted when no public repository exists — never invented. */
  githubUrl?: string;
  /** Omitted when no deployed demo exists — never invented. */
  liveUrl?: string;
  /** Omitted when no documentation site exists — never invented. */
  docsUrl?: string;
  /**
   * The author's part in the build, stated on the case-study hero.
   *
   * These are solo builds, so this reads as scope rather than as a claim of
   * working inside someone else's team.
   */
  role: string;
  caseStudy: CaseStudyBlock[];
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  items: string[];
  /**
   * Technologies in this category that are studied or designed rather than
   * implemented in a listed project. Rendered differently, with a caption.
   */
  exploring?: string[];
}

/**
 * A backend discipline on the home-page Engineering section.
 *
 * `applied` and `exploring` are kept separate on purpose: the portfolio
 * distinguishes what runs in a project from what is being learned, rather
 * than presenting one undifferentiated technology list.
 */
export interface EngineeringPillar {
  id: string;
  title: string;
  description: string;
  /** Used in the listed projects. */
  applied: string[];
  /** Familiar with, or practised outside a listed project. Labelled as such. */
  exploring?: string[];
}

/**
 * A deep engineering topic on `/engineering`.
 *
 * Each topic explains the concept with examples from the projects that use
 * it, so the page demonstrates understanding instead of listing tools.
 */
export interface EngineeringTopic {
  id: string;
  title: string;
  description: string;
  paragraphs: string[];
  points?: string[];
  /** Stepped flow rendered as an ordered diagram, when the order is the point. */
  flow?: { name: string; detail: string }[];
  /** Where this is implemented, stated honestly. */
  appliedIn?: string;
}

export interface DecisionCard {
  /** Optional header label, e.g. a technology name. */
  technology?: string;
  question: string;
  /** Where the technology is actually used — never a generic claim. */
  context?: string;
  answer: string;
}


export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface PracticeTopic {
  id: string;
  title: string;
  description: string;
  points: string[];
}

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string;
  description: string;
  external: boolean;
}

/**
 * The four things the contact form asks for. Named in the order they are
 * asked, because that order is also the order the form walks when it moves
 * focus to the first field that needs attention.
 */
export type ContactFieldName = "name" | "email" | "subject" | "message";

/** A submission that has been normalised — every field present, every field a string. */
export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Field-level messages, keyed by field. Absent key means the field passed. */
export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

/** One field's presentation: how it is labelled, hinted at, and capped. */
export interface ContactFieldConfig {
  name: ContactFieldName;
  label: string;
  placeholder: string;
  /** Single-line input or multiline textarea — the only structural difference. */
  control: "input" | "textarea";
  /** Only meaningful for `control: "input"`. */
  type?: "text" | "email";
  /** A real browser autofill hint; `off` for the subject, which has no autofill concept. */
  autoComplete?: string;
  /** Matches the shared validation limit, so the control cannot exceed the rule. */
  maxLength: number;
  /** Visible helper text under the control. */
  hint?: string;
}

/**
 * One kind of work I am open to.
 *
 * `id` exists only so the item derives a stable colour from `accentFor()` —
 * the same mechanism every other data-driven item on the site uses.
 */
export interface ContactOpportunity {
  id: string;
  label: string;
}

/**
 * The home-page portrait slot.
 *
 * `src` stays null until a real photo is dropped into /public, so the frame
 * renders a labelled placeholder instead of a broken image — the same
 * "nothing invented" rule the rest of the content follows.
 */
export interface PortraitPhoto {
  /** Public path to the image, e.g. "/images/yemisrach-zerfe.jpg". */
  src: string | null;
  /** Where the file belongs, shown inside the empty frame. */
  expectedPath: string;
  /** Small monospace label in the frame header. */
  label: string;
  /** Alternative text used once a real photo is rendered. */
  alt: string;
  /** Caption under the frame. */
  caption: string;
  /** Frame aspect ratio, e.g. "4 / 5". Portrait crops work best. */
  ratio: string;
}

/** One quick fact shown beside the portrait. */
export interface PortraitFact {
  label: string;
  value: string;
  /** Only present when the value is a real, clickable destination. */
  href?: string;
}

/**
 * The About section's prose and its one content list.
 *
 * The section is mostly reading, so the paragraphs carry the content and the
 * only structured list is "Beyond Code". Each interest carries an `id` so its
 * hue can be derived from the entry itself through `accentFor()` rather than
 * chosen by hand.
 */

/**
 * A paragraph that carries one emphasised phrase.
 *
 * The split is modelled as data rather than as markup inside the string: the
 * sentence stays whole and readable, the component decides how the emphasis
 * looks, and nothing has to be parsed at render time.
 */
export interface AboutEmphasis {
  /** The text before the emphasised phrase. */
  before: string;
  /** The phrase set in bold. */
  emphasis: string;
  /** The text after the emphasised phrase. */
  after: string;
}

/** A paragraph of prose: plain text, or text with one emphasised phrase. */
export type AboutParagraph = string | AboutEmphasis;

/** One interest in "Beyond Code". */
export interface AboutInterest {
  id: string;
  label: string;
  description: string;
}

