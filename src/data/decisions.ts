import type { DecisionCard } from "@/types/portfolio";

/**
 * "Why These Technologies?" — short, opinionated answers about tool choice.
 *
 * Each card states where the technology is actually used, because the
 * reasoning is only useful if it is attached to a project. Where a component
 * is designed rather than implemented, the context line says so.
 */
export const engineeringDecisions: DecisionCard[] = [
  {
    technology: "PostgreSQL",
    question: "Why PostgreSQL?",
    context: "WeTalk, NexusGuard and EstatePlus.",
    answer:
      "For applications with structured relational data, transactions, relationships and strong consistency requirements. Constraints live in the schema, so invalid states are rejected by the database rather than trusted to application code.",
  },
  {
    technology: "FastAPI",
    question: "Why FastAPI?",
    context: "NexusGuard.",
    answer:
      "For building modern Python APIs with strong typing, async support and automatic API documentation. Validation and the contract come from the same declaration, so they cannot drift apart.",
  },
  {
    technology: "Prisma",
    question: "Why an ORM like Prisma?",
    context: "WeTalk.",
    answer:
      "For typed data access and versioned migrations without hand-writing SQL for every relationship. The trade-off is explicit: complex aggregate queries are still written as SQL where the ORM would obscure them.",
  },
  {
    technology: "SQLAlchemy",
    question: "Why async SQLAlchemy?",
    context: "NexusGuard, with Alembic migrations.",
    answer:
      "Because a request-scoped async session keeps database I/O off the event loop and stops connections leaking between requests. Loading is explicit, so a relationship access can never quietly trigger a query mid-response.",
  },
  {
    technology: "WebSockets",
    question: "Why WebSockets?",
    context: "Implemented in weTalk; a status channel where implemented in NexusGuard.",
    answer:
      "For communication the client needs as it happens, instead of polling the server on a timer. The trade-off is that a long-lived connection needs its own authentication and authorization checks, and that the database must stay the source of truth.",
  },
  {
    technology: "Redis",
    question: "Why Redis?",
    context: "Designed as the cache layer in EstatePlus; the scaling path in weTalk; short-lived state where implemented in NexusGuard.",
    answer:
      "For caching and low-latency access to frequently requested data. It removes repeated work from the database without becoming a source of truth — if it is empty, the request still succeeds.",
  },
  {
    technology: "RabbitMQ",
    question: "Why RabbitMQ?",
    context: "EstatePlus — part of the target architecture, not yet implemented.",
    answer:
      "For reliable asynchronous job processing and decoupling background workloads from API requests. One message, one owner, with acknowledgements, retries and dead-letter handling.",
  },
  {
    technology: "Kafka",
    question: "Why Kafka?",
    context: "EstatePlus — part of the target architecture, not yet implemented.",
    answer:
      "For event streaming where multiple consumers need to process the same events independently, at their own pace, with replay available when a consumer has to be rebuilt.",
  },
  {
    technology: "Docker",
    question: "Why Docker?",
    context: "WeTalk, and the EstatePlus development environment.",
    answer:
      "To make development and deployment the same environment. When the stack has several processes, a reproducible environment removes an entire category of bug before it can be debugged.",
  },
];
