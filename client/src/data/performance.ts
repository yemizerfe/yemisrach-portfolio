import type { PracticeTopic } from "@/types/portfolio";

export const performanceTopics: PracticeTopic[] = [
  {
    id: "caching",
    title: "Caching",
    description:
      "Caching removes repeated work. It also creates a second copy of the truth, so it is a correctness decision before it is a performance one.",
    points: [
      "Redis used where appropriate for frequently requested, expensive reads",
      "Cache keys derived from normalised query parameters so equivalent requests share an entry",
      "TTLs chosen per data volatility rather than one global default",
      "Invalidation tied to the event that changed the data, not to guesswork",
      "Private responses never cached in shared storage",
    ],
  },
  {
    id: "async",
    title: "Asynchronous processing",
    description:
      "Expensive work belongs outside the request path, where it cannot hold a connection while someone waits for a page.",
    points: [
      "Background jobs queued and acknowledged with a job reference and a 202 response",
      "Workers running as separate processes from the API so they scale independently",
      "Idempotent handlers keyed by job id, so a redelivered message cannot double-apply",
      "Retries with backoff and a dead-letter destination instead of silent loss",
      "Job status stored as data, because async work is invisible without it",
    ],
  },
  {
    id: "database",
    title: "Database optimisation",
    description:
      "Query cost is mostly decided by the schema, so indexes are part of the design rather than a later fix.",
    points: [
      "Indexes that match the filters and sort order of real queries",
      "Relationships expressed in the schema so joins are explicit",
      "Pagination at the database level, on stable keys rather than offsets deep into a result set",
      "Aggregation pushed into SQL when it avoids transferring rows nobody displays",
      "Connection pooling configured deliberately rather than left at defaults",
    ],
  },
  {
    id: "api-performance",
    title: "API design for load",
    description:
      "A predictable API is cheaper to run, because clients stop re-fetching what they already have.",
    points: [
      "Consistent response envelopes with pagination metadata",
      "Validation before work: a rejected request never touches the database",
      "Error handling that returns a stable code instead of forcing a retry loop",
      "Filtering and field selection so a client is not forced to over-fetch",
    ],
  },
  {
    id: "scalability",
    title: "Scalability",
    description:
      "Scaling is a set of properties designed in early, not capacity purchased later.",
    points: [
      "Stateless APIs, so instances can be added or replaced without session loss",
      "Horizontal scaling behind a load balancer, with shared state moved to Redis",
      "Caching and queues as the first places to absorb growth",
      "Event-driven decoupling so a slow consumer cannot slow down the producer",
      "Read paths separated from write paths where the access pattern justifies it",
    ],
  },
];
