import type { ProcessStep } from "@/types/portfolio";

/**
 * The order I work in, and why the order matters.
 *
 * Backend-first by construction: the data model and the API are designed
 * before the business logic is implemented, and the interface comes last
 * because it consumes a contract rather than defining one.
 */
export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Understand the requirements",
    description:
      "Work out what the system has to do before choosing how to build it. Most costly mistakes are made here, because they look like progress everywhere else.",
  },
  {
    number: "02",
    title: "Design the data model",
    description:
      "Decide the entities, their relationships and the constraints that make invalid states impossible. Schema decisions outlive interface decisions, so they are made deliberately.",
  },
  {
    number: "03",
    title: "Design the API",
    description:
      "Define resources, request and response shapes, status codes and pagination before writing handlers, so the contract exists before the implementation.",
  },
  {
    number: "04",
    title: "Structure backend services",
    description:
      "Draw the boundaries: a thin HTTP layer, rules in services, data access behind one layer, and nothing that reaches across those lines.",
  },
  {
    number: "05",
    title: "Implement authentication & authorization",
    description:
      "Identity first, then permission: object-level checks on reads as well as writes, centralised so no route can silently skip one.",
  },
  {
    number: "06",
    title: "Validate inputs and handle errors",
    description:
      "Reject bad data at the boundary where it is still cheap, and return stable codes and messages instead of stack traces.",
  },
  {
    number: "07",
    title: "Implement the business logic",
    description:
      "Transitions, calculations and policy live in the service layer, where they can be tested without HTTP and cannot be bypassed by a new route.",
  },
  {
    number: "08",
    title: "Add caching and background work where they earn it",
    description:
      "A cache must never become a source of truth, and a queue must have a workload. Both are added against a measured problem, not in advance.",
  },
  {
    number: "09",
    title: "Test",
    description:
      "Validation, permissions and failure paths first, because those are the behaviours where a bug is a security or data-integrity problem rather than a visual defect.",
  },
  {
    number: "10",
    title: "Containerise and deploy",
    description:
      "A reproducible environment with configuration supplied from outside, so a deploy is repeatable and a missing secret fails at startup rather than at the first request.",
  },
  {
    number: "11",
    title: "Monitor and improve",
    description:
      "Measure before optimising, keep the reasoning for a change, and treat observability as part of the feature rather than something added after an incident.",
  },
];
