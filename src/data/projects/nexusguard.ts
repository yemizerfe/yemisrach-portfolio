import type { Project } from "@/types/portfolio";

/**
 * NexusGuard — security-focused application and analysis workflow.
 *
 * Honesty note, and the most important one on this page: NexusGuard is not a
 * scanner and does not claim to be. It does not detect vulnerabilities, it does
 * not cover OWASP, and it holds no certification or audit. What it is: an async
 * API that models security work as a structured, auditable workflow, plus the
 * security engineering that comes with building that properly —
 * authentication, authorization, validation and migrations.
 *
 * Public-safety note: the API is described by responsibility, never by route.
 * No endpoint paths, hostnames, ports, connection strings, credentials or
 * configuration values appear anywhere in this case study.
 */
export const nexusGuard: Project = {
  slug: "nexusguard",
  name: "NexusGuard",
  category: "Security Testing Platform",
  tagline:
    "A security-focused web application designed around structured security testing workflows, API services, authentication, and security-oriented analysis.",
  summary:
    "NexusGuard is a security-oriented web application: a FastAPI backend that models security work as a structured, auditable workflow, and a React interface that turns the resulting data into something a person can actually reason about.",
  status: "Done",
  role: "Solo build — async FastAPI backend, relational schema and migrations, authentication and authorization, validation, realtime channel, and the React dashboard that consumes it.",
  technologies: [
    "Python",
    "FastAPI",
    "SQLAlchemy (async)",
    "Alembic",
    "PostgreSQL",
    "asyncpg",
    "Pydantic",
    "JWT",
    "WebSockets",
    "React 19",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "shadcn/ui",
    "Zustand",
    "Recharts",
  ],
  backendStack: [
    "Python",
    "FastAPI",
    "PostgreSQL",
    "SQLAlchemy (async)",
    "asyncpg",
    "Alembic",
    "Pydantic",
    "JWT",
    "REST APIs",
  ],
  supportingStack: [
    "React 19",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "shadcn/ui",
    "Zustand",
    "Recharts",
  ],
  qualifiedStack: [
    {
      label: "Used where implemented",
      items: ["WebSockets", "Redis", "Background tasks", "Gemini (external AI service)"],
    },
  ],
  stackGroups: [
    {
      label: "Backend",
      items: [
        "Python",
        "FastAPI",
        "Pydantic",
        "SQLAlchemy (async)",
        "Alembic",
        "asyncpg",
        "JWT",
        "REST APIs",
      ],
    },
    {
      label: "Data",
      items: [
        "PostgreSQL",
        "Async SQLAlchemy sessions",
        "Versioned migrations",
        "Indexed query paths",
      ],
    },
    {
      label: "Frontend",
      items: [
        "React 19",
        "TypeScript",
        "Vite",
        "Tailwind CSS",
        "shadcn/ui",
        "Zustand",
        "Recharts",
      ],
    },
    {
      label: "Where implemented",
      status: "planned",
      items: ["WebSockets", "Redis", "Background tasks", "Gemini (external AI service)"],
    },
  ],
  engineeringConcepts: [
    "Async APIs",
    "Authentication",
    "Authorization",
    "Database migrations",
    "Secure API design",
    "Structured workflows",
    "Request validation",
    "WebSocket communication",
    "Async database access",
    "Data visualization",
  ],
  problem:
    "Security work tends to be ad-hoc. Findings live in scattered notes, the same check gets repeated inconsistently, and there is no reliable answer to the question that matters after an assessment: what was checked, against what, when, and what came out of it. The underlying cause is that the work has structure but the tooling does not — a test run is a sequence of steps over a list of targets with observations attached, yet that structure is usually flattened into free text the moment it is written down.",
  solution:
    "NexusGuard models a test run as an explicit workflow: a run targets a set of targets, progresses through defined states, and accumulates observations that stay attached to the run that produced them. Every state change is recorded, so a run can be reconstructed instead of remembered. The platform is deliberately the record of the work rather than an automated assessor of it: the tooling makes security work reviewable, it does not pretend to perform it.",
  features: [
    "Structured test run lifecycle with explicit states",
    "Target registration with typed scope metadata",
    "Observation logging attached to a specific run and target",
    "Per-run authorization so a user only reaches their own assessments",
    "JWT authentication with role-based checks",
    "Local password reset without an external mail dependency",
    "Async FastAPI endpoints backed by async SQLAlchemy",
    "Schema migrations managed with Alembic",
    "Request and response validation through Pydantic models",
    "WebSocket channel for live run status where implemented",
    "Recharts visualizations built from aggregation endpoints",
    "Composable dashboard views over run and observation data",
    "Consistent API error format across the whole surface",
  ],
  architecture: {
    flow: [
      {
        name: "React 19 client",
        detail:
          "Typed API client, Zustand stores for run state, and Recharts views driven by aggregation endpoints rather than raw rows.",
      },
      {
        name: "FastAPI application",
        detail:
          "Async route handlers, dependency-injected authentication and database sessions, Pydantic-validated input and output.",
      },
      {
        name: "Authentication & authorization",
        detail:
          "Custom dependencies resolve the current user and check ownership before the service layer runs.",
      },
      {
        name: "Application services",
        detail:
          "Workflow transitions, authorization decisions and aggregation queries — kept out of route handlers on purpose.",
      },
      {
        name: "Async database access",
        detail:
          "Request-scoped async SQLAlchemy sessions over asyncpg, so database I/O never blocks the event loop and a session cannot leak between requests.",
      },
      {
        name: "PostgreSQL",
        detail:
          "Runs, targets, observations and users, with constraints and indexes that encode the workflow rules.",
      },
    ],
    services: [
      {
        name: "Alembic",
        detail:
          "Versioned schema migrations applied deliberately, so a schema change is reviewable and reversible instead of manual.",
      },
      {
        name: "WebSockets",
        detail:
          "Where implemented, a channel that pushes run status changes so the interface does not have to poll.",
      },
      {
        name: "Redis",
        detail:
          "Where implemented, short-lived state such as rate-limit counters and run-status fan-out across instances.",
      },
      {
        name: "External AI service",
        detail:
          "Where implemented, an external provider used to assist with information already recorded in a run. It is not a detection engine, and no model was trained for this project.",
      },
    ],
    note: "The workflow, API, schema and dashboard layers are the focus of the build. WebSockets, Redis and the external AI service are marked as implemented only where they are, and nothing in this project claims scanning or detection capability.",
  },
  githubUrl: "https://github.com/yemizerfe/NexusGuard",
  liveUrl: undefined,
  caseStudy: [
    {
      kind: "prose",
      id: "overview",
      title: "Overview",
      description:
        "What this application is, and — stated first — what it deliberately is not.",
      paragraphs: [
        "NexusGuard is a security-focused web application. Earlier versions of it were called SecurityTesterApp, so an unfamiliar name on an older link explains itself.",
        "The important framing is what it does not do. It does not scan anything, it does not detect vulnerabilities, and it makes no claim to OWASP coverage or certification. Detecting vulnerabilities is a research problem; keeping a record of security work reviewable is an engineering problem, and this project is the second one.",
        "What it is: an async FastAPI backend that models a test run as an explicit workflow — targets, states, observations and state changes — and a React interface that turns that structured record into something a person can reason about after the fact.",
      ],
    },
    {
      kind: "prose",
      id: "problem",
      title: "Problem",
      paragraphs: [
        "Security work is often recorded as scattered notes and unstructured results, which makes it hard to answer what was reviewed, what changed, and how a conclusion was reached.",
        "The information needed to reconstruct an assessment usually exists — it just lives in three places and none of them is authoritative. A run has a natural structure of steps over targets with observations attached, and that structure is destroyed the moment it is written down as prose.",
      ],
    },
    {
      kind: "prose",
      id: "solution",
      title: "Solution",
      paragraphs: [
        "The platform treats a test run as a first-class record. It targets a set of targets, moves through defined states, and accumulates observations attached to the run and target that produced them. Because every transition is recorded, a run can be reconstructed rather than remembered.",
        "The backend is asynchronous throughout: async route handlers, async SQLAlchemy over asyncpg, and request-scoped sessions resolved through dependencies. Authorization is checked per run, so the workflow record is also the access boundary.",
      ],
    },
    {
      kind: "list",
      id: "features",
      title: "Key features",
      description:
        "What the application actually does, described without inflating it.",
      items: [
        "Test run lifecycle — A run moves through explicit states, and each transition is recorded rather than inferred.",
        "Targets — Each run covers a registered set of targets, so scope is data rather than a paragraph of context.",
        "Observations — Findings attach to the specific run and target that produced them, which is what keeps them traceable.",
        "Run history — Past runs stay reconstructable, including what changed and when.",
        "Per-run authorization — A user reaches their own assessments and no one else's.",
        "Authentication — JWT-based sign-in with role checks on protected resources.",
        "Local password reset — Recovery handled inside the application rather than depending on an external mail provider.",
        "Dashboard views — Aggregation endpoints feed Recharts views, so the summary numbers come from the backend.",
        "Live run status — Where implemented, a WebSocket channel pushes status changes so the interface does not poll.",
        "Consistent error format — One error shape across the whole API, so clients handle failure once.",
      ],
    },
    {
      kind: "architecture",
      id: "architecture",
      title: "Architecture",
      description:
        "Asynchronous from the request to the driver, with authorization sitting in front of the service layer.",
      architecture: {
        flow: [
          {
            name: "React 19 client",
            detail:
              "Typed API client, Zustand stores for run state, and Recharts views driven by aggregation endpoints rather than raw rows.",
          },
          {
            name: "FastAPI application",
            detail:
              "Async route handlers, dependency-injected authentication and database sessions, Pydantic-validated input and output.",
          },
          {
            name: "Authentication & authorization",
            detail:
              "Custom dependencies resolve the current user and check ownership before the service layer runs.",
          },
          {
            name: "Application services",
            detail:
              "Workflow transitions, authorization decisions and aggregation queries — kept out of route handlers on purpose.",
          },
          {
            name: "Async database access",
            detail:
              "Request-scoped async SQLAlchemy sessions over asyncpg, so database I/O never blocks the event loop and a session cannot leak between requests.",
          },
          {
            name: "PostgreSQL",
            detail:
              "Runs, targets, observations and users, with constraints and indexes that encode the workflow rules.",
          },
        ],
        services: [
          {
            name: "Alembic",
            detail:
              "Versioned schema migrations applied deliberately, so a schema change is reviewable and reversible instead of manual.",
          },
          {
            name: "WebSockets",
            detail:
              "Where implemented, a channel that pushes run status changes so the interface does not have to poll.",
          },
          {
            name: "Redis",
            detail:
              "Where implemented, short-lived state such as rate-limit counters and run-status fan-out across instances.",
          },
          {
            name: "External AI service",
            detail:
              "Where implemented, an external provider used to assist with information already recorded in a run. It is not a detection engine, and no model was trained for this project.",
          },
        ],
        note: "Nothing in this diagram is a scanner. Every component exists to record, structure or display security work — not to perform it.",
      },
    },
    {
      kind: "flow",
      id: "data-flow",
      title: "Data flow",
      description:
        "The path one API request takes, from token to stored transition.",
      steps: [
        {
          name: "Request arrives",
          detail:
            "A typed client sends a request carrying a bearer token. Nothing about the caller's identity is taken from the payload.",
        },
        {
          name: "Token verification",
          detail:
            "A dependency verifies the token's signature and expiry before the handler runs. An invalid token never reaches application code.",
        },
        {
          name: "Current user & payload validation",
          detail:
            "The identity is resolved into a user record, and the request body is parsed into a Pydantic model. Failure here is a clear client error rather than an exception deeper in the stack.",
        },
        {
          name: "Authorization",
          detail:
            "Ownership is checked against the resource being touched. Being authenticated is not the same as being allowed, and this is where the difference is enforced.",
        },
        {
          name: "Service layer",
          detail:
            "The service applies the domain rule: is this transition legal from the run's current state, and what does it change? Transport concerns stay out of it entirely.",
        },
        {
          name: "Async persistence",
          detail:
            "A request-scoped async session commits the change through SQLAlchemy over asyncpg. The session is disposed with the request, so nothing is shared between requests.",
        },
        {
          name: "Response & live update",
          detail:
            "The result is serialized through a response model, and — where implemented — a status change is pushed over the WebSocket channel so open views update without polling.",
        },
      ],
      note: "Validation and authorization happen before any query is issued for a write. A request that fails either check costs a database connection but never a row.",
    },
    {
      kind: "database",
      id: "database",
      title: "Database design",
      description:
        "The workflow, expressed as data. Concepts and relationships rather than a schema listing.",
      diagram: {
        root: {
          name: "Test run",
          detail:
            "The record everything else hangs from. A run owns its state, its scope and its observations, so an observation can never be orphaned from the work that produced it.",
        },
        relations: [
          {
            name: "User",
            cardinality: "many-to-one",
            detail:
              "A run belongs to the user who created it, and that ownership is the authorization boundary for every read and write on the run.",
          },
          {
            name: "Target",
            cardinality: "many-to-many",
            detail:
              "Targets are registered once and associated with runs, so the same system can be assessed repeatedly without re-describing it — and scope becomes queryable rather than a paragraph of context.",
          },
          {
            name: "Observation",
            cardinality: "one-to-many",
            detail:
              "An observation is attached to the run and the target it came from. That pairing is what makes a finding traceable back to the exact piece of work that produced it.",
          },
          {
            name: "State transition",
            cardinality: "one-to-many",
            detail:
              "Each change of state is recorded with the state it moved to and when. The run's history is therefore reconstructable rather than remembered, which is the point of the whole model.",
          },
        ],
        note: "These are domain concepts and their relationships. Exact columns, indexes and constraint expressions are implementation detail and are not published here. The application holds no real assessment data belonging to anyone else.",
      },
    },
    {
      kind: "list",
      id: "migrations",
      title: "Schema & migrations",
      description:
        "The workflow rules that live in the database rather than in application code, and how the schema is changed.",
      items: [
        "Migrations — Alembic versions every change, so the schema has a reviewable history and a change can be rolled back instead of repaired by hand.",
        "Relationships — Foreign keys express run ownership, target association and observation attachment, so an observation cannot exist without the run that produced it.",
        "Constraints — State values and required relations are constrained at the database level, so an illegal state is rejected even if a code path forgets to check.",
        "Indexes — Chosen for the reads the dashboard actually makes: runs by owner and status, and observations by run, rather than one index per column.",
        "Async access — The driver is async (asyncpg), and sessions are request-scoped, so schema work and query work are both non-blocking.",
        "Aggregation in SQL — Dashboard summaries are aggregated in the query, so the API returns figures rather than transferring rows for the client to count.",
      ],
    },
    {
      kind: "api",
      id: "api",
      title: "Backend engineering",
      description:
        "The API surface by responsibility. Route paths are deliberately not published.",
      capabilities: [
        {
          area: "Accounts & sessions",
          methods: ["GET", "POST"],
          summary:
            "Where identity is established and where a token is issued for everything else.",
          capabilities: [
            "Register an account, with the password stored only as a hash",
            "Sign in and receive a token for subsequent requests",
            "Resolve the authenticated user for the current session",
            "One error shape for bad credentials, without confirming whether an account exists",
          ],
        },
        {
          area: "Password recovery",
          methods: ["POST"],
          summary:
            "Handled locally, without an external mail provider or a second delivery system to keep secure.",
          capabilities: [
            "Request a reset for an account",
            "Complete a reset using a short-lived, single-use token",
            "Refuse an expired or already-used reset attempt",
          ],
        },
        {
          area: "Test runs",
          methods: ["GET", "POST", "PATCH"],
          summary:
            "The workflow itself: a run created, scoped, and moved through its states.",
          capabilities: [
            "Create a run and attach the targets it covers",
            "List runs belonging to the authenticated user",
            "Apply a state transition, recorded with the state it moved to",
            "Read a run's full history of transitions",
          ],
        },
        {
          area: "Targets",
          methods: ["GET", "POST"],
          summary:
            "Registered scope, so a run's coverage is data rather than prose.",
          capabilities: [
            "Register a target with typed scope metadata",
            "Associate targets with a run",
            "List the targets a run covers",
          ],
        },
        {
          area: "Observations",
          methods: ["GET", "POST"],
          summary:
            "What was recorded against a run and a target, kept attached to both.",
          capabilities: [
            "Record an observation against a run and a specific target",
            "List observations for a run, grouped as the dashboard needs them",
            "Reject an observation that references a run the caller does not own",
          ],
        },
        {
          area: "Dashboard aggregation",
          methods: ["GET"],
          summary:
            "Summary reads the charts are built from, computed in the database rather than the client.",
          capabilities: [
            "Run counts and status distribution",
            "Observation counts grouped for visualization",
            "Trend data across recent runs",
          ],
        },
        {
          area: "Realtime channel",
          methods: ["WS"],
          summary:
            "Where implemented, an authenticated channel that carries run status changes.",
          capabilities: [
            "Authenticate the connection before it carries anything",
            "Push a status change to the views watching that run",
            "Fall back to ordinary reads when the channel is unavailable",
          ],
        },
      ],
      note: "Deliberately conceptual. This section describes what each part of the API is responsible for and which verbs it accepts; route paths, payload schemas, hostnames, ports and configuration values are not published here.",
    },
    {
      kind: "milestones",
      id: "security",
      title: "Authentication & security",
      description:
        "The security engineering actually in the build. This section describes what NexusGuard does — not a claim of certification, audit or complete coverage of anything.",
      items: [
        {
          title: "JWT authentication",
          body: "Sign-in issues a signed token; a dependency verifies signature and expiry before any handler runs. An invalid or expired token never reaches application code, so authentication failure is a boundary rather than a conditional.",
        },
        {
          title: "Password handling",
          body: "Passwords are stored as hashes, never as values, and are never returned by any endpoint. Verification compares against the hash, so the application does not need to hold the original after registration.",
        },
        {
          title: "Local password reset",
          body: "Recovery is implemented inside the application with a short-lived, single-use token, and no external mail provider. Fewer moving parts means fewer places a credential or a link can leak.",
        },
        {
          title: "Authorization",
          body: "A valid token proves who is asking, not what they may touch. Ownership is checked per run, so a caller can reach only their own assessments — the check happens before the service layer, not inside the interface.",
        },
        {
          title: "API validation",
          body: "Pydantic models define what every endpoint accepts and returns. A malformed request is rejected at the boundary with a clear client error, and the response model prevents accidental over-exposure of internal fields.",
        },
        {
          title: "Environment-based configuration",
          body: "Signing material, database connection information and service credentials live in environment configuration, never in the repository. Nothing of that kind appears on this page either.",
        },
      ],
    },
    {
      kind: "challenges",
      id: "challenges",
      title: "Technical challenges",
      description:
        "The engineering problems this project was actually about, and what was done about each.",
      items: [
        {
          challenge: "Structuring a backend that is asynchronous all the way down",
          approach:
            "FastAPI's dependency system was used as the composition point: one dependency resolves the current user, another hands out a request-scoped async session, and the service layer is async end to end. Nothing in the request path calls a synchronous driver.",
          result:
            "Database I/O never blocks the event loop, and because the session comes from a dependency it is disposed with the request — resources cannot leak between requests.",
        },
        {
          challenge: "Session lifetime in an async ORM",
          approach:
            "Relationships needed by a response are loaded deliberately in the query rather than lazily on attribute access, because a lazy load outside an open session is an error that only appears at runtime.",
          result:
            "Serialization happens against loaded data, so a response cannot fail because a session closed early — a class of bug that is otherwise intermittent and hard to reproduce.",
        },
        {
          challenge: "Authorization where the role is not the whole answer",
          approach:
            "Authentication was separated from authorization: a token answers who is asking, and a separate check answers whether the run being touched belongs to them. Ownership is verified before the service layer, not inside the query.",
          result:
            "One user's assessments cannot be reached by another even with a valid token, and the rule exists in one place rather than being re-implemented per endpoint.",
        },
        {
          challenge: "Keeping workflow states from becoming a free-text field",
          approach:
            "A run's state is a constrained value and every transition is recorded as data. The service layer decides whether a transition is legal from the current state, and the database refuses a value outside the allowed set.",
          result:
            "A run's history can be reconstructed rather than remembered, which is the problem the project set out to solve — and an illegal state cannot be written even by a code path that forgets to check.",
        },
        {
          challenge: "Changing the schema without breaking a running application",
          approach:
            "Migrations are managed with Alembic and reviewed rather than applied blind. Generated migrations are read through before they are applied, because a generated file can drop a column it does not understand.",
          result:
            "Schema history is versioned and reversible, and a change to a model is a deliberate, reviewable step instead of something that happens because a development database drifted.",
        },
        {
          challenge: "Serving realtime updates next to a normal HTTP API",
          approach:
            "Where implemented, the WebSocket channel is authenticated on connect and is treated as an additional way to hear about a change — never as the place a change is stored. Views still read from the API.",
          result:
            "A client that cannot hold a channel open loses immediacy, not information, which is what keeps the realtime layer from becoming a second source of truth.",
        },
      ],
    },
    {
      kind: "compare",
      id: "performance",
      title: "Performance & scalability",
      description:
        "What the build does today, and what is used only where implemented.",
      columns: [
        {
          label: "Implemented now",
          summary:
            "Cost is managed in the query, the session and the response shape.",
          items: [
            "Indexes matching the dashboard reads: runs by owner and status, observations by run",
            "Dashboard summaries aggregated in SQL rather than counted in Python",
            "Asynchronous database access, so concurrent requests are not serialized on I/O",
            "Request-scoped sessions disposed with the request, so connections are not held longer than needed",
            "Response models that define exactly what leaves the API, so payloads stay bounded",
            "Validation before work: a rejected request never issues a write",
          ],
        },
        {
          label: "Where implemented",
          status: "planned",
          summary:
            "Present in the design and used only where the implementation actually includes them.",
          items: [
            "Redis for short-lived state such as rate-limit counters",
            "Status fan-out across more than one instance",
            "Background tasks for work that should not block a response",
            "Paged reads on long run histories",
          ],
        },
      ],
      note: "No latency, throughput or concurrency figures are quoted. None were measured for publication, and an unsupported number would undermine the rest of this page — which is exactly the failure mode a security-focused project should avoid.",
    },
    {
      kind: "code",
      id: "code",
      title: "Implementation details",
      description:
        "Three short samples showing the patterns above. No connection strings, secrets or configuration values appear here.",
      snippets: [
        {
          language: "python",
          filename: "db/session.py",
          code: `from collections.abc import AsyncIterator

async def get_session() -> AsyncIterator[AsyncSession]:
    """One session per request, disposed when the request ends."""
    async with session_factory() as session:
        yield session`,
          caption:
            "Expressed as a dependency rather than created in handlers, which is what makes the session's lifetime the request's lifetime. The connection details are read from configuration by the factory and never appear in application code.",
        },
        {
          language: "python",
          filename: "api/dependencies/auth.py",
          code: `async def get_current_user(
    token: str = Depends(bearer_scheme),
    session: AsyncSession = Depends(get_session),
) -> User:
    claims = decode_access_token(token)  # signature and expiry checked here
    user = await session.get(User, claims.subject)
    if user is None:
        raise credentials_exception
    return user`,
          caption:
            "Authentication is a dependency, so it runs before the handler and cannot be forgotten on a new endpoint. Decoding handles the signing material internally — it never reaches this layer.",
        },
        {
          language: "python",
          filename: "services/runs.py",
          code: `async def get_owned_run(
    run_id: UUID,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> TestRun:
    run = await session.get(TestRun, run_id)
    if run is None or run.owner_id != user.id:
        # A run that belongs to someone else is reported exactly like
        # a run that does not exist.
        raise HTTPException(status_code=404, detail="Run not found")
    return run`,
          caption:
            "Authorization is checked before the service uses the resource, and a permission failure is deliberately indistinguishable from a missing record — so the API does not confirm what exists to someone who may not see it.",
        },
      ],
    },
    {
      kind: "accordion",
      id: "testing",
      title: "Testing",
      description:
        "What is tested, and why. Expand each item for the specific paths.",
      items: [
        {
          title: "Authentication",
          body: "Token handling is tested as a boundary, because everything else assumes it held.",
          points: [
            "A missing token, an expired token and a malformed token each asserted to be refused",
            "A valid token asserted to resolve to the right user record",
            "Protected endpoints asserted to fail closed rather than fall through to anonymous access",
          ],
        },
        {
          title: "Authorization",
          body: "Ownership is the rule that matters most here, so it is tested with explicit actor-and-resource combinations.",
          points: [
            "One user's run asserted to be unreachable by another user, on read and on write",
            "A permission failure asserted to return the same response as a missing record",
            "An observation referencing another user's run asserted to be rejected",
          ],
        },
        {
          title: "Validation and error shape",
          body: "The API promises one error format, so the format itself is asserted rather than assumed.",
          points: [
            "Malformed and incomplete payloads asserted to produce a client error rather than a server error",
            "Missing required fields asserted to name the field rather than returning a trace",
            "Oversized and unexpected fields asserted to be rejected rather than ignored",
          ],
        },
        {
          title: "Workflow transitions",
          body: "The state machine is the product, so its illegal moves are tested as carefully as its legal ones.",
          points: [
            "Each legal transition asserted to record a transition row",
            "An illegal transition asserted to be refused without changing the run's state",
            "A run's history asserted to reconstruct the states it passed through",
          ],
        },
        {
          title: "Migrations",
          body: "A migration that works on an empty database is not evidence it works on a populated one.",
          points: [
            "Migrations applied against a disposable database to confirm the schema matches the models",
            "A rollback exercised, so a change is reversible rather than merely forward-only",
          ],
        },
      ],
    },
    {
      kind: "compare",
      id: "deployment",
      title: "Deployment",
      description:
        "How the application is run today, and what a public deployment would require. No host, port or credential is listed.",
      columns: [
        {
          label: "Implemented",
          summary:
            "The application runs against PostgreSQL with configuration kept outside the code.",
          items: [
            "Backend served by an ASGI server, with the async driver reaching PostgreSQL",
            "Configuration supplied through environment variables rather than committed files",
            "Migrations applied through Alembic as a deliberate step, not on import",
            "The interface built to static assets by Vite",
          ],
        },
        {
          label: "Not yet exercised",
          status: "planned",
          summary:
            "There is no public deployment of this project, so no demo link is offered.",
          items: [
            "Container image built and published to a registry",
            "A managed PostgreSQL instance",
            "A reverse proxy with TLS termination in front of the API",
            "Redis provisioned for the short-lived state it is designed to hold",
            "Running more than one instance, with status fan-out across them",
          ],
        },
      ],
      note: "Hostnames, ports, connection details and credentials are deliberately absent. For a security-focused project, publishing the shape of the deployed environment would be the wrong trade: the architecture is worth describing, the way in is not.",
    },
    {
      kind: "decisions",
      id: "decisions",
      title: "Engineering decisions",
      description:
        "Each decision states what was chosen, why, what it costs, and what it buys.",
      items: [
        {
          technology: "FastAPI",
          question: "An async Python framework with dependency injection at its centre",
          context: "Request handling, authentication, sessions",
          why: "Two things had to be true at once: the API had to be non-blocking, and cross-cutting concerns like authentication and session lifetime had to be applied consistently rather than remembered per endpoint. Dependencies solve the second problem structurally.",
          tradeoff: "Dependency injection is a layer of indirection, and a dependency that does real work is easy to make too clever — especially when it starts deciding authorization as well as resolving a session.",
          result: "Authentication, authorization and session lifetime are applied before the handler runs, so a new endpoint inherits them instead of having to re-implement them.",
        },
        {
          technology: "SQLAlchemy (async) + asyncpg",
          question: "An async ORM over an async driver, rather than a synchronous stack",
          context: "Database access",
          why: "A synchronous driver inside an async framework blocks the event loop, which turns concurrency into a queue. Matching the whole path from handler to driver keeps the concurrency the framework promises.",
          tradeoff: "Async ORM code has to be written with session lifetime in mind: a lazy relationship load outside an open session is an error that only shows up at runtime, so relationships have to be loaded deliberately.",
          result: "Database I/O yields instead of blocking, and the resulting code is explicit about exactly what each request loads.",
        },
        {
          technology: "Alembic",
          question: "Versioned migrations instead of letting models define the schema at runtime",
          context: "Schema changes",
          why: "A workflow application accumulates constraints over time. Creating tables from models is convenient on day one and leaves no record of how a production schema got to its current shape.",
          tradeoff: "Every model change becomes a two-step operation — generate, review, apply — and a generated migration still has to be read by a person before it is trusted.",
          result: "The schema has a reviewable history, changes are reversible, and the schema in any environment can be explained rather than inferred.",
        },
        {
          technology: "Pydantic",
          question: "One model layer for input and output validation",
          context: "API contracts",
          why: "The boundary between an API and its clients should be described once. Using the same model system for what comes in and what goes out makes the contract explicit and prevents internal fields from leaking into responses by accident.",
          tradeoff: "Request, response and database shapes are related but not identical, so some mapping between them is unavoidable and tempting to skip.",
          result: "Invalid input is rejected before any work is done, and what leaves the API is a deliberate choice rather than whatever the ORM object happened to contain.",
        },
        {
          technology: "JWT + ownership checks",
          question: "Authentication and authorization as two separate steps",
          context: "Access control",
          why: "These answer different questions. A token answers who is asking; only an ownership check answers whether they may touch this particular run. Conflating them is how an application ends up with valid tokens that can read everything.",
          tradeoff: "Every endpoint that touches a resource needs the ownership check, which is exactly the kind of repetition that gets forgotten on the endpoint added six months later.",
          result: "Separating the steps makes the authorization rule visible and testable, and lets a permission failure be reported the same way as a missing record.",
        },
      ],
    },
    {
      kind: "accordion",
      id: "lessons",
      title: "Lessons learned",
      description:
        "What this build changed about how the next async service starts. Expand for detail.",
      items: [
        {
          title: "Asynchronous is a property of the whole path",
          body: "An async framework in front of a blocking driver is not an async application; it is a queue with better branding.",
          points: [
            "The driver, the session and the ORM all had to be async for the concurrency to mean anything",
            "Session lifetime became an explicit design decision rather than an afterthought, because in an async ORM the session's scope is a correctness concern",
          ],
        },
        {
          title: "Authentication and authorization are different questions",
          body: "One asks who is calling. The other asks whether this caller may touch this record.",
          points: [
            "Separating them made the ownership rule visible enough to test it with explicit actors",
            "Reporting a permission failure the same way as a missing record was a deliberate choice, not an oversight — the API should not confirm what exists to someone who may not see it",
          ],
        },
        {
          title: "Let the database hold the rules that must not break",
          body: "Application checks are a convenience. Constraints are the guarantee.",
          points: [
            "Constraining workflow states in the schema means a code path that forgets to check cannot write an illegal state",
            "Foreign keys made an orphaned observation impossible rather than merely unlikely",
          ],
        },
        {
          title: "A generated migration is a draft, not a change",
          body: "Autogeneration compares models to a database, and it can decide that a column it does not recognise should be dropped.",
          points: [
            "Reading every migration before applying it became a rule rather than a good intention",
            "Exercising a rollback turns a migration from forward-only into something reversible",
          ],
        },
        {
          title: "Say what the tool is not",
          body: "The clearest thing this project does is refuse to overclaim. It records security work; it does not perform assessment.",
          points: [
            "Stating that limit first makes the rest of the page credible instead of defensive",
            "It also set the scope: every feature had to make the work reviewable, or it did not belong",
          ],
        },
      ],
    },
    {
      kind: "list",
      id: "future",
      title: "Future improvements",
      status: "planned",
      description:
        "Labelled as future work. None of this is claimed as built, and none of it would turn this into a scanner.",
      items: [
        "Expanded security-analysis workflows — More structured work types beyond a single run shape, still recorded rather than performed automatically.",
        "More advanced visualization — Deeper dashboard views over the same aggregation endpoints, including comparison across runs.",
        "Additional integrations — Bringing recorded work in from other tools rather than asking for it to be re-entered.",
        "Improved analysis capabilities — Better summaries of what a run actually covers, derived from the structured record that already exists.",
        "Role-based review — A reviewer role alongside an owner, so a run can be signed off rather than only created.",
        "Exportable reports — Turning a reconstructed run into a document that can leave the application.",
      ],
    },
    {
      kind: "stack",
      id: "technology-stack",
      title: "Technology stack",
      description:
        "What the build uses, with the technologies that are present only where implemented kept in their own group.",
      groups: [
        {
          label: "Backend",
          items: [
            "Python",
            "FastAPI",
            "Pydantic",
            "SQLAlchemy (async)",
            "Alembic",
            "asyncpg",
            "JWT",
            "REST APIs",
          ],
        },
        {
          label: "Data",
          items: [
            "PostgreSQL",
            "Async SQLAlchemy sessions",
            "Versioned migrations",
            "Indexed query paths",
          ],
        },
        {
          label: "Frontend",
          items: [
            "React 19",
            "TypeScript",
            "Vite",
            "Tailwind CSS",
            "shadcn/ui",
            "Zustand",
            "Recharts",
          ],
        },
        {
          label: "Where implemented",
          status: "planned",
          items: ["WebSockets", "Redis", "Background tasks", "Gemini (external AI service)"],
        },
      ],
    },
  ],
};
