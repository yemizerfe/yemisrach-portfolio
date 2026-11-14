import type { SkillCategory } from "@/types/portfolio";

/**
 * Technical skills, grouped by discipline and ordered backend-first.
 *
 * No proficiency percentages and no ranking claims: the categories say what
 * has been worked with, and the projects are the evidence. Items that are
 * studied or designed rather than implemented live in `exploring`, so the
 * two are never blended into one impressive-looking list.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: "backend",
    title: "Backend",
    description:
      "Services and APIs: the layer where correctness, authorization and validation are decided.",
    items: [
      "Node.js",
      "Express.js",
      "Python",
      "FastAPI",
      "REST APIs",
      "Socket.IO",
      "Input validation",
      "Business logic",
    ],
  },
  {
    id: "databases",
    title: "Databases",
    description:
      "Schemas designed before queries, with constraints that make invalid states unrepresentable.",
    items: [
      "PostgreSQL",
      "Prisma",
      "SQLAlchemy",
      "asyncpg",
      "Alembic migrations",
      "Data modelling",
      "Indexing",
      "Query design",
      "Transactions",
    ],
    exploring: ["MongoDB", "MySQL / MariaDB"],
  },
  {
    id: "infrastructure",
    title: "Backend infrastructure",
    description:
      "The supporting layer around the request path: caching, messaging and reproducible environments.",
    items: ["Docker", "Docker Compose", "Environment configuration", "Git", "GitHub"],
    exploring: ["Redis", "RabbitMQ", "Kafka", "Nginx", "Kubernetes", "CI/CD"],
  },
  {
    id: "security",
    title: "Authentication & security",
    description:
      "Identity, permission and the unglamorous defaults that prevent common API vulnerabilities.",
    items: [
      "JWT",
      "bcrypt",
      "RBAC",
      "Object-level authorization",
      "Rate limiting",
      "Payload validation",
      "CORS and secure headers",
    ],
    exploring: ["OAuth providers"],
  },
  {
    id: "frontend",
    title: "Frontend (supporting)",
    description:
      "Interfaces as the visible edge of a system — built on top of the APIs above, and deliberately not the specialisation.",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Responsive UI", "Accessibility"],
  },
];

/**
 * Shown under the skill grid so the distinction is explicit rather than
 * implied by a dashed border alone.
 */
export const skillsHonestyNote =
  "Dashed items are being learned or were designed but not yet implemented in a project. The rest appear in the case studies on this site.";
