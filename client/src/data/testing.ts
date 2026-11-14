import type { PracticeTopic } from "@/types/portfolio";

export const testingPractices: PracticeTopic[] = [
  {
    id: "unit",
    title: "Unit testing",
    description:
      "Pure logic is the cheapest thing to test and the most likely to change.",
    points: [
      "Validation rules and schema parsing tested as isolated functions",
      "Permission policies tested with explicit actor and resource combinations",
      "Derived calculations tested against hand-checked expected values",
      "Jest and Mocha used to run these suites",
    ],
  },
  {
    id: "integration",
    title: "Integration testing",
    description:
      "Rules that live in databases and middleware only prove themselves when the real pieces are connected.",
    points: [
      "API tests exercising the full request path, including middleware",
      "Database behaviour checked against a disposable instance with migrations applied",
      "Failure paths asserted deliberately — rejected input, expired tokens, missing records",
      "Test data created per run so results do not depend on leftover state",
    ],
  },
  {
    id: "api-testing",
    title: "API testing",
    description:
      "Endpoints are tested as contracts, because that is how clients consume them.",
    points: [
      "Status codes and response shapes asserted, not only the happy-path payload",
      "Authentication and authorization exercised with wrong, expired and missing credentials",
      "Pagination and filtering tested at their boundaries",
      "Direct API testing with HTTP clients alongside the automated suites",
    ],
  },
  {
    id: "edge-cases",
    title: "Edge cases",
    description:
      "Edge cases are the reason tests exist: the happy path is verified every time the feature is used.",
    points: [
      "Empty collections, missing relations and boundary values",
      "Simultaneous operations that must not produce duplicates",
      "Reconnections, retries and repeated submissions",
      "Malformed and oversized payloads rejected without a 500",
    ],
  },
];

/**
 * Rendered with the testing section. Deliberately contains no coverage
 * percentage: there is no measured number to claim.
 */
export const testingHonestyNote =
  "I test the behaviour that is expensive to get wrong — validation, permissions and failure paths — and I do not publish coverage numbers, because a percentage says nothing about whether the important paths are covered.";
