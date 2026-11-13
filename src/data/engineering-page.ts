import type { EngineeringTopic } from "@/types/portfolio";
import { siteConfig } from "@/data/site";

/**
 * The engineering deep-dive page.
 *
 * Each topic explains a concept using the projects that actually apply it, so
 * the page demonstrates reasoning rather than listing tools. Where something
 * is designed rather than implemented — the queue and stream layers in
 * EstatePlus, for example — the copy says so in the topic itself.
 */
export const engineeringPageIntro = {
  eyebrow: "Engineering",
  title: "How I build backend systems.",
  description:
    "The home page states what I focus on. This page is the detail: how a request is structured, how the data is modelled, how identity and permission are enforced, and what I would and would not put in front of a database.",
  paragraphs: [
    siteConfig.engineeringFocus,
    "Everything below is written against the four projects on this site rather than in the abstract. Where a layer is designed but not yet running, it is labelled that way — an architecture you can reason about is not the same as one that is deployed, and the difference is worth stating.",
  ],
  note: "“Where implemented” refers to a listed project. “Designed” means part of a target architecture that is not running end to end yet.",
};

export const engineeringTopics: EngineeringTopic[] = [
  {
    id: "backend-architecture",
    title: "Backend architecture",
    description:
      "A backend is a set of boundaries: what the HTTP layer is allowed to know, where the rules live, and which code may touch the data.",
    paragraphs: [
      "Every project here is layered the same way, because the alternative — route handlers that talk to the database directly — makes correctness something a developer has to remember rather than something the structure enforces. The HTTP layer parses and responds, services own the rules, and a single data layer is the only code that speaks SQL or an ORM.",
      "In NexusGuard that means FastAPI dependencies resolving the caller and a request-scoped async session, with workflow transitions in a service layer so they cannot be triggered from an arbitrary route. In weTalk it means authentication middleware, Zod validation and thin controllers over a domain module. The runtime differs; the boundary does not.",
    ],
    points: [
      "Thin HTTP layer: routing, parsing, status codes — no business rules",
      "Service layer owns the rules, so they are testable without HTTP",
      "Data access behind one layer, parameterised and transactional where an operation spans tables",
      "Dependencies resolved at the boundary — caller identity, session, configuration",
      "Boundaries drawn early: a module you can reason about is easier to split later than one you cannot",
    ],
    appliedIn:
      "NexusGuard (FastAPI services and a dependency layer) and weTalk (Express middleware over a domain module).",
  },
  {
    id: "api-design",
    title: "API design",
    description:
      "An API is a contract. If the documentation can drift from the validation, it will — so both come from the same declaration.",
    paragraphs: [
      "Routes are grouped under a versioned namespace, request bodies are validated before any work happens, and responses keep a consistent envelope so a client handles success and failure the same way everywhere. Validation models are the source of truth for the shape of a request, which is also why Pydantic in NexusGuard and Zod in weTalk remove a class of documentation drift.",
      "Errors are part of the contract rather than an afterthought. A rejected payload returns a stable code and message, an unauthenticated request returns 401, and an authenticated request that is not permitted returns 403 — a client that needs to know whether to re-authenticate or stop depends on that distinction being real.",
    ],
    points: [
      "Validation at the boundary, before the database or the domain is touched",
      "Status codes used precisely enough for a client to branch on them",
      "Cursor pagination for growing collections, so a page does not shift under concurrent writes",
      "Filtering and field selection, so a client is never forced to over-fetch",
      "Unknown fields rejected rather than silently dropped",
    ],
    appliedIn:
      "weTalk and NexusGuard; EstatePlus is being built API-first with the same boundary rules.",
  },
  {
    id: "database-engineering",
    title: "Database engineering",
    description:
      "Schema decisions outlive interface decisions, so the model is designed before the endpoints that depend on it.",
    paragraphs: [
      "Constraints carry the invariants. In weTalk a composite unique index on participants makes a duplicate membership row impossible, and a monotonic sequence column per conversation keeps message ordering stable under concurrent writes. In NexusGuard, runs, targets and observations are related so an observation cannot exist without the run that produced it, and every state change records the identity that caused it.",
      "Indexes are designed against the queries the application actually runs rather than every conceivable one. A dashboard that groups observations by severity and filters by time gets an index matching the filter and grouping columns plus a bounded default window — the difference between a query whose cost follows the data and one whose cost follows the request.",
    ],
    points: [
      "Constraints in the schema: uniqueness, foreign keys, non-null where the domain requires it",
      "Indexes that match real filters and sort order",
      "Migrations as reviewable artefacts, correct against an empty database and an existing one",
      "Parameterised access only — Prisma in weTalk, SQLAlchemy with asyncpg in NexusGuard",
      "Aggregation pushed into SQL when it avoids transferring rows nobody displays",
    ],
    appliedIn:
      "PostgreSQL across EstatePlus, weTalk and NexusGuard, with Prisma, SQLAlchemy and Alembic as the access and migration layers.",
  },
  {
    id: "authentication-authorization",
    title: "Authentication & authorization",
    description:
      "Proving identity and being allowed to do something are two different questions, answered at two different points.",
    paragraphs: [
      "Identity is proved once and then carried in a signed token with a short lifetime. In weTalk the same JWT authenticates HTTP requests and the socket handshake, so there is one identity model rather than two, and a token carries an identifier rather than a permission list — role changes take effect without waiting for old tokens to expire.",
      "Permission is then checked per resource. A conversation, run or report is verified against the caller: in weTalk membership is a row in a participants table, and in NexusGuard ownership is checked in a service function that every path calls, so the question is always “does this function check, and is it on the path?” Long-lived connections need their own answer — a socket that outlives a permission should not keep receiving messages, so rooms are joined on subscribe, re-checked on emit and left on disconnect.",
    ],
    points: [
      "Object-level authorization on reads as well as writes",
      "Role and ownership treated as separate gates rather than one combined flag",
      "Checks centralised so no route can silently skip one",
      "Passwords stored only as hashes, with uniform failure responses",
      "Client-side gating treated as convenience — the server decides",
    ],
    appliedIn:
      "weTalk (JWT, bcrypt, per-conversation authorization) and NexusGuard (JWT with role checks and per-run ownership).",
  },
  {
    id: "caching",
    title: "Caching",
    description:
      "A cache removes repeated work. It also creates a second copy of the truth, so it is a correctness decision before it is a performance one.",
    flow: [
      {
        name: "Request",
        detail: "A read arrives for an expensive aggregate or a frequently requested collection.",
      },
      {
        name: "API",
        detail: "The route validates and normalises the parameters. Nothing is fetched yet.",
      },
      {
        name: "Check Redis",
        detail: "The key is derived from the normalised query, so equivalent requests share one entry.",
      },
      {
        name: "Cache hit → return",
        detail: "The stored value is returned without touching PostgreSQL.",
      },
      {
        name: "Cache miss → PostgreSQL",
        detail: "The aggregate is computed once from the source of truth.",
      },
      {
        name: "Store the result in Redis",
        detail: "With a TTL chosen from how volatile that data is, not from one global default.",
      },
      {
        name: "Return the data",
        detail: "The response is identical to the hit path, so a cold cache is slower — never different.",
      },
    ],
    paragraphs: [
      "Cache-aside is the only pattern used here, and for a specific reason: the cache is never the source of truth. If it is empty or unavailable the request still succeeds against PostgreSQL, which means losing the cache is a performance event rather than an outage.",
      "Keys are derived from normalised parameters, TTLs are chosen per data volatility, and invalidation is tied to the event that changed the data instead of to a guess. Private and per-user responses are never written to a shared cache.",
      "Honest scope: EstatePlus uses this design as its cache layer and NexusGuard uses Redis where implemented for short-lived state such as rate-limit counters and status fan-out. Neither cache is load-bearing for correctness, and no hit-rate figure is quoted because none has been measured.",
    ],
    appliedIn:
      "Designed in EstatePlus; used where implemented in NexusGuard; documented as the scaling step in weTalk.",
  },
  {
    id: "background-processing",
    title: "Background processing",
    description:
      "Expensive work belongs outside the request path, where it cannot hold a connection while somebody waits for a page.",
    flow: [
      {
        name: "API accepts the request",
        detail: "Validation still runs first — a rejected request is rejected before any work is queued.",
      },
      {
        name: "Write a job record",
        detail: "Job status is stored as data, because asynchronous work is invisible without it.",
      },
      {
        name: "Return 202 with a job reference",
        detail: "The client polls a status endpoint or waits for a push instead of holding a connection open.",
      },
      {
        name: "Worker consumes the message",
        detail: "A separate process from the API, so a slow job degrades throughput rather than availability.",
      },
      {
        name: "Handler is idempotent",
        detail: "Keyed by job id, so a redelivered message cannot apply twice.",
      },
      {
        name: "Retry with backoff, then dead-letter",
        detail: "Failure is bounded and visible rather than silently lost.",
      },
    ],
    paragraphs: [
      "EstatePlus is where this matters: ingesting data from external sources and generating reports are long-running operations that fail in ways which need retrying, so they are modelled as queued jobs with a worker fleet separate from the API.",
      "The distinction that shapes the design is between a work queue and an event log. RabbitMQ carries tasks — one message, one owner, per-message acknowledgement, retries and dead-lettering. Kafka carries events — published once and read independently by aggregation, notification and audit consumers at their own pace, with replay available when a consumer has to be rebuilt. Using one for the other's job is what makes these systems brittle.",
      "Honest scope: in EstatePlus the queue, stream and worker layers are part of the target architecture and are labelled that way. The API, the schema and the report lifecycle come first, so each supporting layer is added against a real workload instead of a guessed one.",
    ],
    appliedIn:
      "Designed for EstatePlus (RabbitMQ task queue, Kafka event stream, worker processes) — not yet implemented.",
  },
  {
    id: "realtime-systems",
    title: "Realtime systems",
    description:
      "Realtime is a persistence problem before it is a transport problem. The socket is the easy half.",
    flow: [
      {
        name: "Client emits an event",
        detail: "Over an authenticated socket connection, not a trusted one.",
      },
      {
        name: "Server authorises the caller",
        detail: "Identity comes from the handshake token; permission is re-checked on emit, per resource.",
      },
      {
        name: "Validate the payload",
        detail: "The same rules as the HTTP path — an event is not exempt from validation.",
      },
      {
        name: "Persist to PostgreSQL",
        detail: "Only the database decides ordering, identity and durability.",
      },
      {
        name: "Broadcast to the conversation room",
        detail: "Only to participants the server has verified, and only after the write succeeded.",
      },
      {
        name: "Client reconciles",
        detail: "The optimistic copy is replaced by the confirmed record, not merged with it.",
      },
    ],
    paragraphs: [
      "The order is deliberately validate → persist → broadcast. Broadcasting first would make a dropped connection lose history and leave two clients disagreeing about what happened; this way a disconnect costs latency and never data.",
      "Long-lived connections also need their own authorization lifecycle, because HTTP middleware stops being relevant the moment the request ends. Rooms are joined at subscribe time, permission is re-checked on emit, and rooms are left explicitly on disconnect.",
      "NexusGuard applies the same principle to run status: the socket only announces that something changed and the client refetches the affected run, so the database stays the single answer instead of competing with a second copy in the browser.",
    ],
    appliedIn:
      "weTalk (one-to-one messaging over Socket.IO) and NexusGuard (a run-status channel where implemented).",
  },
];
