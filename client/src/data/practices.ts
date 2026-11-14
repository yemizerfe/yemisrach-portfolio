import type { PracticeTopic } from "@/types/portfolio";

/**
 * Security, performance and testing content.
 *
 * Everything here is tied to something actually used in a listed project.
 * Where a technique is a general practice rather than an implemented feature,
 * the copy says so — no claimed audits, coverage numbers or benchmarks.
 */

export const securityPractices: PracticeTopic[] = [
  {
    id: "authentication",
    title: "Authentication",
    description:
      "Identity is proved once and then carried in a signed token with a short lifetime.",
    points: [
      "JWT access tokens verified on every request and at socket handshake",
      "Passwords stored only as hashes, never reversibly encoded",
      "Uniform failure responses, so an error cannot confirm whether an account exists",
      "Failed authentication returns 401, while a failed permission check returns 403",
    ],
  },
  {
    id: "authorization",
    title: "Authorization",
    description:
      "Being authenticated is not the same as being allowed, so permission is checked per resource.",
    points: [
      "Object-level checks: a conversation, run or report is verified against the caller",
      "Role and ownership treated as separate gates rather than one combined flag",
      "Checks centralised in policy functions so no route can silently skip one",
      "Client-side gating treated as convenience only — the server decides",
    ],
  },
  {
    id: "validation",
    title: "Validation",
    description:
      "Input is validated at the boundary, where rejecting bad data is still cheap.",
    points: [
      "Zod schemas in the Node services and Pydantic models in the FastAPI service",
      "Unknown fields rejected instead of silently dropped",
      "Payload size and field length limits applied before persistence",
      "Database constraints as a second line of defence against application gaps",
    ],
  },
  {
    id: "api-security",
    title: "Secure API defaults",
    description:
      "The unglamorous defaults that prevent the common classes of API vulnerability.",
    points: [
      "Parameterised queries only, through Prisma or SQLAlchemy",
      "Rate limiting on authentication and other sensitive endpoints",
      "CORS restricted to known origins rather than a wildcard",
      "Error responses sanitised: stable codes and messages, no stack traces or SQL",
    ],
  },
  {
    id: "secrets",
    title: "Secrets and configuration",
    description:
      "A secret that reaches a repository has to be treated as compromised.",
    points: [
      "Credentials and signing keys supplied through environment variables",
      "No production defaults, so a missing value fails at startup rather than at runtime",
      "Secrets never returned in responses and never written to logs",
      "Environment-specific configuration kept out of code",
    ],
  },
  {
    id: "data-security",
    title: "Data boundaries",
    description:
      "Sensitive records are treated as sensitive everywhere they travel, not only in transit.",
    points: [
      "Authorization enforced on reads, not only on writes",
      "Private and per-user responses excluded from shared caches",
      "Least privilege in database roles and connection configuration",
      "Audit records for changes to security-relevant data",
    ],
  },
];
