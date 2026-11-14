import type { EngineeringPillar } from "@/types/portfolio";

/**
 * The six areas shown in the Engineering section.
 *
 * Deliberately short: this section answers "how do you build backend systems?"
 * for someone skimming, so each area is one sentence plus a compact list. The
 * reasoning behind these choices lives in the project case studies instead —
 * duplicating it here is what made the section unreadable.
 *
 * `applied` is what runs in a listed project; `exploring` is what is familiar
 * or practised elsewhere. The two are labelled separately so a reader can tell
 * shipping from studying without taking anyone's word for it.
 */
export const engineeringAreas: EngineeringPillar[] = [
  {
    id: "backend",
    title: "Backend Engineering",
    description:
      "Backend services covering business logic, authentication, integrations and data processing.",
    applied: [
      "Node.js",
      "Express.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "REST APIs",
      "WebSockets",
    ],
  },
  {
    id: "architecture",
    title: "Architecture & System Design",
    description:
      "Designing backend systems with clear boundaries between business logic, data access and infrastructure.",
    applied: [
      "Layered architecture",
      "Modular design",
      "RESTful API design",
      "Event-driven architecture",
      "Caching",
      "Background processing",
    ],
  },
  {
    id: "data",
    title: "Databases & Data",
    description:
      "Designing data models for integrity, performance and maintainability.",
    applied: ["PostgreSQL", "Data modelling", "Indexing", "Transactions", "Migrations"],
    exploring: ["MySQL / MariaDB", "MongoDB", "Redis"],
  },
  {
    id: "security",
    title: "Security & Authentication",
    description:
      "Security is considered throughout backend development, from authentication and authorization to validation and API protection.",
    applied: [
      "JWT authentication",
      "Password hashing",
      "Role-based access control",
      "Input validation",
      "Rate limiting",
    ],
    exploring: ["OAuth 2.0 / Google OAuth"],
  },
  {
    id: "infrastructure",
    title: "Infrastructure & Deployment",
    description:
      "Experience with containerized applications and deployment-oriented technologies.",
    applied: ["Docker", "Docker Compose", "Nginx"],
    exploring: ["Kubernetes", "CI/CD", "Cloud deployment"],
  },
];

/**
 * The principles behind those areas, in six lines.
 *
 * Kept as one sentence each so the section closes on intent rather than on
 * another list of tools.
 */
export const engineeringPrinciples = [
  {
    id: "clean-architecture",
    title: "Clean Architecture",
    description:
      "Separate responsibilities so code stays easy to understand and change.",
  },
  {
    id: "security-first",
    title: "Security First",
    description:
      "Authentication, authorization and validation are treated as core parts of the system.",
  },
  {
    id: "maintainability",
    title: "Maintainability",
    description:
      "Build modular systems that can evolve without unnecessary complexity.",
  },
  {
    id: "data-integrity",
    title: "Data Integrity",
    description:
      "Design around consistency, constraints and correct data handling.",
  },
  {
    id: "performance",
    title: "Performance",
    description:
      "Optimize queries, caching and asynchronous work where they provide measurable value.",
  },
  {
    id: "continuous-learning",
    title: "Continuous Learning",
    description:
      "Improve through projects, experimentation and continued study.",
  },
] as const;

/**
 * The two proficiency states, rendered as a legend under the area grid.
 *
 * Deliberately not a percentage: this states where a technology comes from
 * rather than claiming a score for it. Each entry pairs a real badge in its own
 * tone with the sentence explaining that tone, so the distinction is shown
 * before it is described.
 */
export const proficiencyLegend = [
  {
    id: "applied",
    label: "Used in projects",
    tone: "default",
    description: "Solid items are used in the projects on this site.",
  },
  {
    id: "familiar",
    label: "Familiar with",
    tone: "muted",
    description:
      "Familiar items are technologies I have studied or worked with but may not be represented in every project.",
  },
] as const;