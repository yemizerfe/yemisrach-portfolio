import type { ArchitectureLayer } from "@/types/portfolio";

export interface SystemNode extends ArchitectureLayer {
  id: string;
  /** Short label describing the node's responsibility. */
  label: string;
}

/**
 * The reference architecture shown in "How I Think About Systems".
 *
 * This is a mental model for how I reason about systems, not a claim that
 * every project uses every component. The section copy says exactly that.
 */
export const systemFlow: SystemNode[] = [
  {
    id: "user",
    label: "Client",
    name: "User",
    detail:
      "Where a request starts. What the user waits for defines the latency budget everything behind it has to fit inside.",
  },
  {
    id: "frontend",
    label: "Presentation",
    name: "Frontend",
    detail:
      "Server-rendered pages for content that should be crawlable and fast, client-rendered components where interaction density is high. No business rules live here.",
  },
  {
    id: "api",
    label: "Boundary",
    name: "API",
    detail:
      "The only way in. Routing, validation, pagination, consistent responses and error mapping. A thin layer on purpose: it translates HTTP into a call, and nothing more.",
  },
  {
    id: "auth",
    label: "Trust",
    name: "Authentication",
    detail:
      "Identity and permission are resolved before any domain logic runs. Authentication answers who is calling; authorization answers whether they may do this to this resource.",
  },
  {
    id: "logic",
    label: "Domain",
    name: "Business Logic",
    detail:
      "Where the rules live: what a valid state transition is, how a metric is defined, who may change what. Testable in isolation, because none of it depends on HTTP.",
  },
  {
    id: "data",
    label: "Access",
    name: "Data Layer",
    detail:
      "Repositories and queries. Parameterised, explicit about what is loaded, and transactional where an operation spans more than one table.",
  },
  {
    id: "database",
    label: "Storage",
    name: "PostgreSQL",
    detail:
      "Primary relational data store for transactional application data. Constraints enforce the invariants the application depends on, so invalid states are rejected rather than trusted.",
  },
];

export const systemServices: SystemNode[] = [
  {
    id: "redis",
    label: "Cache",
    name: "Redis",
    detail:
      "Used for caching and fast-access temporary data where appropriate: expensive repeated reads, rate-limit counters and shared socket state once more than one instance exists.",
  },
  {
    id: "rabbitmq",
    label: "Queue",
    name: "RabbitMQ",
    detail:
      "Supports asynchronous background processing. A task has one owner, ordering is per queue, and retries with dead-lettering are the point rather than an afterthought.",
  },
  {
    id: "kafka",
    label: "Stream",
    name: "Kafka",
    detail:
      "Supports event streaming and decoupled event-driven workflows where appropriate — several independent consumers reading one log, with replay available when one needs rebuilding.",
  },
  {
    id: "workers",
    label: "Compute",
    name: "Workers",
    detail:
      "Long-running processes that consume queued work. Separated from the API so a slow job degrades throughput instead of availability.",
  },
  {
    id: "external",
    label: "Integration",
    name: "External APIs",
    detail:
      "Third-party systems, isolated behind adapters. Their formats, failures and timeouts are handled at the edge so they never leak into the domain model.",
  },
];
