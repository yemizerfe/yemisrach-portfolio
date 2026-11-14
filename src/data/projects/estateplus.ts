import type { Project } from "@/types/portfolio";

/**
 * EstatePlus — real-estate market intelligence platform.
 *
 * Public-safety note: every API area on this page is described conceptually.
 * Route paths, hostnames, ports, credentials, configuration values and
 * connection details are deliberately absent, so the page communicates an
 * architecture without giving anyone a way to probe a running system.
 *
 * Accuracy notes:
 *   - Redis, RabbitMQ, Kafka, worker processes and the Kubernetes manifests are
 *     all present in the repository. The Redis, RabbitMQ and Kafka connections
 *     are non-fatal at boot, so the API runs without them; the page says that
 *     rather than presenting the infrastructure as always-on.
 *   - No user counts, traffic, revenue or performance figures are claimed.
 *   - Every market value shown in the interface is application (sample) data,
 *     not a verified market measurement.
 */
export const estatePlus: Project = {
  slug: "estateplus",
  name: "EstatePlus",
  category: "Real Estate Market Intelligence Platform",
  tagline:
    "A data-driven platform for exploring real estate market conditions, neighborhood trends, economic indicators, and market reports.",
  summary:
    "EstatePlus is a market intelligence platform for real-estate data: a public explorer for market conditions, neighborhoods and economic indicators, and an analyst workspace for turning that data into published market reports.",
  status: "Done",
  role: "Solo build — backend architecture, REST API design, PostgreSQL data modelling, analytics queries, role-based access, and the analyst and admin surface areas.",
  /**
   * Backend-first, and only what the repository actually contains: an Express,
   * TypeScript and Prisma API over PostgreSQL, with Redis, RabbitMQ, Kafka and a
   * separate worker process alongside it. The React client is the supporting
   * layer; there is no Next.js in this build.
   */
  technologies: [
    "Node.js",
    "Express",
    "REST APIs",
    "PostgreSQL",
    "Prisma",
    "Redis",
    "TypeScript",
    "Google OAuth",
    "Docker",
  ],
  backendStack: [
    "Node.js",
    "Express",
    "PostgreSQL",
    "Prisma",
    "Redis",
    "REST APIs",
  ],
  supportingStack: ["React", "Vite", "TypeScript", "Recharts", "Leaflet"],
  qualifiedStack: [
    {
      label: "Implemented, optional at runtime",
      items: [
        "RabbitMQ task queue",
        "Kafka event producer",
        "Worker processes",
        "Kubernetes manifests",
      ],
    },
  ],
  stackGroups: [
    {
      label: "Backend",
      items: ["Node.js", "Express", "TypeScript", "REST APIs", "Prisma"],
    },
    {
      label: "Data",
      items: ["PostgreSQL", "Relational schema design", "Indexing", "Query design"],
    },
    {
      label: "Authentication",
      items: ["Google OAuth", "JWT sessions", "Role-based access control"],
    },
    {
      label: "Platform",
      items: [
        "Docker",
        "Docker Compose",
        "Kubernetes manifests",
        "Prometheus metrics",
      ],
    },
    {
      label: "Supporting infrastructure",
      items: ["Redis", "RabbitMQ", "Kafka", "Worker processes"],
    },
    {
      label: "Frontend",
      items: ["React", "Vite", "Tailwind CSS", "Recharts", "Leaflet"],
    },
  ],
  engineeringConcepts: [
    "REST API architecture",
    "Layered architecture",
    "Relational data modelling",
    "Authentication",
    "Role-based authorization",
    "Caching design",
    "Background processing design",
    "Pagination",
    "Analytical queries",
    "Data validation",
    "Data visualization",
  ],
  problem:
    "Exploring a property market usually means stitching together listings, spreadsheets and informal notes. Comparing neighborhoods, tracking how market conditions move over time, and turning raw data into a report is slow, manual and difficult to reproduce. The same numbers get recomputed differently by different people, and the reasoning behind a published figure is rarely traceable.",
  solution:
    "EstatePlus separates the product into two surfaces over one API. A public explorer serves aggregated market data — market overview, neighborhood metrics and economic indicators — while an analyst workspace owns data imports, data quality and the report lifecycle. The API is the only path to the data, so a published figure has one definition rather than one per screen. Expensive work is designed to move off the request path, and repeated aggregate reads are designed to be cached.",
  features: [
    "Public market exploration",
    "Addis Ababa market snapshot",
    "Neighborhood analysis",
    "Property market metrics",
    "Economic indicators",
    "API-based data imports",
    "Data sources and data quality",
    "Analyst dashboard",
    "Report lifecycle (create, preview, publish, archive)",
    "Admin area: users, roles, organizations",
    "Integrations and audit information",
    "System health and settings",
  ],
  architecture: {
    flow: [
      {
        name: "Client (browser)",
        detail:
          "Public explorer and analyst workspace, both consuming the same HTTP API.",
      },
      {
        name: "React client (Vite)",
        detail:
          "A single-page React client that consumes the REST API; charts, maps and filters render from the API's response shapes."
      },
      {
        name: "Node.js / Express API (REST)",
        detail:
          "The only data boundary. Routing, validation, pagination and consistent response envelopes.",
      },
      {
        name: "Authentication & authorization",
        detail:
          "Identity verification plus role checks (public, analyst, admin) applied before any domain work begins.",
      },
      {
        name: "Business logic / services",
        detail:
          "Metric definitions, aggregation rules and the report lifecycle live here — never in controllers or the interface.",
      },
      {
        name: "PostgreSQL",
        detail:
          "Transactional store for properties, locations, market data, indicators, integrations and reports.",
      },
    ],
    services: [
      {
        name: "External data sources",
        detail:
          "Ingestion adapters that normalise third-party or public datasets before they enter the internal schema.",
      },
      {
        name: "Caching layer",
        detail:
          "A Redis client used for short-lived read state; it connects at boot but is non-fatal, so the API serves without it.",
      },
      {
        name: "Background processing",
        detail:
          "A separate worker process consuming queued import and market-statistics jobs, so slow aggregation cannot exhaust API connections.",
      },
      {
        name: "Event / message processing",
        detail:
          "RabbitMQ queues for task routing with retries, and a Kafka producer for publishing market events to independent consumers.",
      },
    ],
    note: "The API, schema, authentication and client are the load-bearing layers. Redis, RabbitMQ, Kafka and the worker fleet are implemented alongside them and connect non-fatally, so the platform still runs when they are unavailable.",
  },
  githubUrl: "https://github.com/yemizerfe/EstatePlus",
  liveUrl: undefined,
  caseStudy: [
    {
      kind: "prose",
      id: "overview",
      title: "Overview",
      description:
        "What the platform does, who uses it, and how the work is split.",
      paragraphs: [
        "EstatePlus turns real-estate and economic data into market intelligence. A public explorer answers questions about market conditions before anyone signs in, and a signed-in analyst workspace is where imported data is checked, analysed and turned into published reports.",
        "The interesting part is not the charts. It is keeping one definition of every published figure while several surfaces — public market views, neighborhood analysis, analyst tooling and administration — read the same data through one API.",
      ],
    },
    {
      kind: "prose",
      id: "problem",
      title: "Problem",
      paragraphs: [
        "Property research is usually spread across listings, spreadsheets, notes and separate reports. That makes comparisons hard to reproduce and leaves little context behind the numbers people publish.",
        "Two people asking the same market question would rarely arrive at the same answer, because the calculation lived in whichever spreadsheet happened to be open.",
      ],
    },
    {
      kind: "prose",
      id: "solution",
      title: "Solution",
      paragraphs: [
        "Market data enters through API-based source adapters, is validated and normalised into one internal schema, and is then served as aggregated analytics through a single REST API. Public discovery and analyst work are separated by authorization rather than by duplicated code paths.",
        "Market calculations live in the backend, so a figure shown on a public market page and the same figure quoted in a report come from one definition. Expensive work is designed to leave the request path entirely.",
      ],
    },
    {
      kind: "list",
      id: "features",
      title: "Key features",
      description:
        "The product areas represented in the build, grouped by the surface that owns them.",
      items: [
        "Public market exploration — Market overview with a summary of current conditions, including median price, growth, rent and listing counts as application data.",
        "Addis Ababa market snapshot — A city-level view that gives the rest of the analysis a common frame of reference.",
        "Neighborhood analysis — The same market questions answered per neighborhood, filtered by property type and time period.",
        "Market metrics and trends — Period-based analysis so movement over time is visible rather than implied.",
        "Economic indicators — Inflation, interest rate, exchange rate and construction cost tracked alongside property data.",
        "API-based data imports — Market data pulled from external sources through adapters rather than manual file handling.",
        "Data sources and data quality — Imported data is inspected so a figure can be traced to where it came from.",
        "Analyst dashboard — A single view of available market data and analysis activity.",
        "Report lifecycle — Reports move through create, preview, publish and archive as explicit states.",
        "Admin area — User, role and organization management, integrations, audit information, system health and settings.",
      ],
    },
    {
      kind: "architecture",
      id: "architecture",
      title: "Architecture",
      description:
        "One API boundary between every surface and the data, with the supporting layers around it.",
      architecture: {
        flow: [
          {
            name: "Client (browser)",
            detail:
              "Public explorer and analyst workspace, both consuming the same HTTP API.",
          },
          {
            name: "React client (Vite)",
            detail:
              "A single-page React client that consumes the REST API; charts, maps and filters render from the API's response shapes.",
          },
          {
            name: "Node.js / Express API (REST)",
            detail:
              "The only data boundary. Routing, validation, pagination and consistent response envelopes.",
          },
          {
            name: "Authentication & authorization",
            detail:
              "Identity verification plus role checks applied before any domain work begins.",
          },
          {
            name: "Business logic / services",
            detail:
              "Metric definitions, aggregation rules and the report lifecycle live here — never in controllers or the interface.",
          },
          {
            name: "PostgreSQL",
            detail:
              "Transactional store for properties, locations, market data, indicators, integrations and reports.",
          },
        ],
        services: [
          {
            name: "External data sources",
            detail:
              "Ingestion adapters that normalise third-party or public datasets before they enter the internal schema.",
          },
          {
            name: "Caching layer",
            detail:
              "A Redis client for short-lived read state, connected at boot but non-fatal when unavailable.",
          },
          {
            name: "Background processing",
            detail:
              "A worker process consuming queued import and market-statistics jobs, separate from the API.",
          },
          {
            name: "Event / message processing",
            detail:
              "RabbitMQ task queues with retries, and a Kafka producer for publishing market events to independent consumers.",
          },
        ],
        note: "Everything in this diagram exists in the repository. The cache, queue, event stream and workers are optional at runtime: each connection is non-fatal, so the API keeps serving aggregates when they are not running.",
      },
    },
    {
      kind: "compare",
      id: "architecture-status",
      title: "Implemented vs not yet exercised",
      description:
        "The site labels unexercised work as such. This is that line, stated plainly for this project.",
      columns: [
        {
          label: "Implemented",
          summary:
            "The layers that carry the product: the API, the schema, the authorization model and the supporting infrastructure.",
          items: [
            "React (Vite) client and Express REST API",
            "Google OAuth sign-in with JWT sessions and role checks",
            "Business-logic layer holding metric definitions",
            "PostgreSQL schema through Prisma, with versioned migrations",
            "API-based ingestion adapters for external market sources",
            "Redis client, RabbitMQ queues, Kafka producer and worker processes",
            "Containerised local environment and Kubernetes manifests",
          ],
        },
        {
          label: "Not yet exercised",
          status: "planned",
          summary:
            "Written down and wired up, but not run as a public deployment.",
          items: [
            "A managed PostgreSQL, Redis, RabbitMQ and Kafka environment",
            "Images published to a registry",
            "More than one API instance behind a load balancer",
            "Workers monitored in a running cluster",
            "Cache hit rates measured on real traffic",
          ],
        },
      ],
      note: "Presenting these as one list would be easier and would overstate the project. The split is the honest version, and it is also the more useful one: it shows which decisions were made and which are still designs.",
    },
    {
      kind: "flow",
      id: "data-flow",
      title: "Data flow",
      description:
        "How an external market figure becomes something a reader can trust enough to quote.",
      steps: [
        {
          name: "External market source",
          detail:
            "Data arrives from a third-party or public API through a source adapter, which is the only place that knows the provider's shape.",
        },
        {
          name: "Validation & normalisation",
          detail:
            "Each record is validated before it is stored. Anything that fails is rejected and recorded rather than written and discovered later.",
        },
        {
          name: "PostgreSQL",
          detail:
            "Accepted records land in the relational store. The API is the only component that reads them.",
        },
        {
          name: "Aggregation",
          detail:
            "Metric definitions turn rows into the figures the market views show — one definition per metric, applied in the backend.",
        },
        {
          name: "API response",
          detail:
            "Aggregates are returned in a consistent envelope with pagination metadata, shaped for the view that asked for it.",
        },
        {
          name: "Interface",
          detail:
            "Charts and tables render the supplied structure. No market calculation runs in the client, so two views cannot disagree.",
        },
      ],
      note: "All market values shown in this build are application (sample) data. They demonstrate the data flow and the interface; they are not verified market measurements, and this case study does not present them as such.",
    },
    {
      kind: "database",
      id: "database",
      title: "Database design",
      description:
        "A conceptual view of the relational model: the domain concepts and how they relate.",
      diagram: {
        root: {
          name: "User",
          detail:
            "The centre of the model. Identity, role and organization membership decide which surface areas the API will serve at all.",
        },
        relations: [
          {
            name: "Role",
            cardinality: "many-to-one",
            detail:
              "A user holds a role (public, analyst, admin), and the role — not the interface — decides what the API allows.",
          },
          {
            name: "Organization",
            cardinality: "many-to-one",
            detail:
              "A user belongs to an organization, which is how an account's data is scoped and administered.",
          },
          {
            name: "Location / Neighborhood",
            cardinality: "one-to-many",
            detail:
              "Locations group properties and are the main analysis dimension; neighborhood analysis is a filtered read over this relation.",
          },
          {
            name: "Property",
            cardinality: "one-to-many",
            detail:
              "Properties are the subject of the market data, and each one sits in a location and carries a property type.",
          },
          {
            name: "Market data",
            cardinality: "one-to-many",
            detail:
              "Period-based observations attached to a property or a location — the input to every metric the platform publishes.",
          },
          {
            name: "Economic indicator",
            cardinality: "many-to-many",
            detail:
              "Inflation, interest rate, exchange rate and construction cost are held as their own series and read alongside market data rather than copied into it.",
          },
          {
            name: "Integration",
            cardinality: "one-to-many",
            detail:
              "Records where imported data came from, so a published figure can be traced back to the source that produced it.",
          },
          {
            name: "Report",
            cardinality: "one-to-many",
            detail:
              "A report references the period, locations and indicators it covers, and carries its own lifecycle state.",
          },
        ],
        note: "These are domain concepts and their relationships, not a table listing. Exact columns, keys and migration contents are implementation detail, so they stay off a public page.",
      },
    },
    {
      kind: "list",
      id: "schema-notes",
      title: "Schema decisions",
      description: "The parts of the model that were designed rather than discovered.",
      items: [
        "Relationships — Foreign keys express the model instead of application code re-checking it, so an orphaned row becomes impossible rather than merely unlikely.",
        "Constraints — NOT NULL, uniqueness and referential constraints reject bad data at the point of writing, which is the cheapest place to catch it.",
        "Indexes — Chosen to match the filters and sort order the analytics actually use (location, property type, period) rather than one index per column.",
        "Migrations — Versioned and applied deliberately, so a schema change is reviewable and reversible instead of an improvised script run against a live database.",
        "Analytical queries — Aggregation happens in SQL, so rows nobody displays are never transferred just to compute an average.",
        "Query design — Each endpoint reads the shape it returns, which is what keeps the market overview and the neighborhood view consistent.",
      ],
    },
    {
      kind: "api",
      id: "api",
      title: "API & backend engineering",
      description:
        "The API surface by responsibility. Route paths are deliberately not published.",
      capabilities: [
        {
          area: "Market data",
          methods: ["GET"],
          summary:
            "Aggregated market reads: overview metrics, period-based trends and property-level observations.",
          capabilities: [
            "Market overview for a city and a period",
            "Market trends across a chosen time range",
            "Property market metrics filtered by type",
            "Consistent response envelope with pagination metadata",
          ],
        },
        {
          area: "Neighborhood analysis",
          methods: ["GET"],
          summary:
            "The same market questions answered per neighborhood, so comparisons rest on one definition of each metric.",
          capabilities: [
            "Metrics filtered by neighborhood, property type and period",
            "Distribution data for the charts the interface renders",
            "Comparative reads across more than one location",
          ],
        },
        {
          area: "Economic indicators",
          methods: ["GET"],
          summary:
            "Indicator series that can be read alongside property data for market analysis.",
          capabilities: [
            "Inflation, interest rate, exchange rate and construction cost series",
            "Period filtering shared with the market endpoints",
          ],
        },
        {
          area: "Analyst workspace",
          methods: ["GET", "POST"],
          summary:
            "Where imported market data is brought in, inspected and assessed for quality.",
          capabilities: [
            "Trigger an import from a configured external source",
            "Inspect imported records alongside the source they came from",
            "Review the data-quality outcome of an import",
          ],
        },
        {
          area: "Reports",
          methods: ["GET", "POST", "PATCH"],
          summary:
            "The report lifecycle as explicit states rather than a document edited in place.",
          capabilities: [
            "Create and preview a report",
            "Publish a report that is ready for readers",
            "Archive a report that is no longer current",
            "Move between states, with the transition recorded",
          ],
        },
        {
          area: "Administration",
          methods: ["GET", "POST", "PATCH"],
          summary: "Management of the things an analyst must not be able to change.",
          capabilities: [
            "Users, roles and organization membership",
            "Integrations and their configuration status",
            "Audit information for privileged actions",
            "System health and settings",
          ],
        },
      ],
      note: "Deliberately conceptual. This section names what each area of the API is responsible for and which verbs it accepts; route paths, payload shapes, hostnames and configuration are not published, because a public case study should not double as a map of a running system.",
    },
    {
      kind: "tabs",
      id: "security",
      title: "Authentication & security",
      description:
        "One authorization model, three audiences. The role decides what the API serves, not which page is open.",
      tabs: [
        {
          label: "Public",
          heading: "Open market exploration, read-only",
          paragraphs: [
            "Market exploration works before sign-in, and that is a deliberate product decision rather than a missing guard: these reads are scoped to published, aggregated market data.",
          ],
          items: [
            "Market overview, trends and indicator series are readable without an account",
            "Only aggregated market data is exposed on this path",
            "No private resources, drafts or unpublished reports are reachable here",
            "Values shown are application data, not verified market measurements",
          ],
        },
        {
          label: "Analyst",
          heading: "Imports, data quality and report authoring",
          paragraphs: [
            "Sign-in uses Google OAuth, so the platform never handles a password for a normal account. The authenticated identity is resolved into a user, a role and an organization before any request reaches domain logic.",
          ],
          items: [
            "Google OAuth sign-in for authenticated access",
            "Role checked before the request reaches business logic",
            "Imported data and data-quality views are restricted to this role",
            "Reports can be authored, previewed and published, but not administered",
            "Every privileged action is recorded for audit",
          ],
        },
        {
          label: "Admin",
          heading: "Users, roles, integrations and settings",
          paragraphs: [
            "Administration is a separate area with its own authorization requirement. It exists so that the analyst role never needs the ability to change who can access the platform.",
          ],
          items: [
            "User, role and organization management",
            "Integrations and their configuration status",
            "Audit information and system health",
            "Settings, kept out of the analyst workflow on purpose",
            "Configuration is environment-based, so no credential is stored in the interface",
          ],
        },
      ],
      note: "Authorization is enforced in the API. A surface can hide a control, but hiding a control is a user-experience decision, never the security boundary.",
    },
    {
      kind: "challenges",
      id: "challenges",
      title: "Technical challenges",
      description:
        "The problems that shaped the design, and what was actually done about them.",
      items: [
        {
          challenge: "Market data arrives in someone else's shape",
          approach:
            "Ingestion is treated as a boundary: a source adapter owns everything provider-specific, validates each record, and maps it onto the internal schema before anything is stored.",
          result:
            "The third-party structure never becomes the domain model, so adding a source means adding an adapter rather than reshaping the schema that the rest of the platform depends on.",
        },
        {
          challenge: "Analytics that filter by location, property type and period at once",
          approach:
            "Aggregation is pushed into SQL, with indexes chosen to match the filter-and-sort combination the views actually use and pagination applied at the database level rather than over a fetched result set.",
          result:
            "The interface receives aggregates instead of raw rows, and the market overview and neighborhood views share one query shape — which is what stops them drifting apart.",
        },
        {
          challenge: "Imported data cannot be trusted by default",
          approach:
            "Records are validated before they are written, rejected rows are recorded rather than silently dropped, and an accepted record keeps a reference to the source that produced it.",
          result:
            "A published figure can be traced to its origin, and a bad import shows up as a data-quality outcome instead of a wrong number in a report.",
        },
        {
          challenge: "Two audiences with different privileges in one system",
          approach:
            "Analyst and administrator responsibilities were modelled as roles and checked in a single authorization layer before any domain work runs.",
          result:
            "Privilege became an explicit property of the API rather than something inferred from which screen a user happened to open.",
        },
        {
          challenge: "Expensive work competing with request handling",
          approach:
            "Import and statistics work runs in a separate worker process: the API enqueues a job on RabbitMQ and answers with a reference, while workers consume the queue away from request handling.",
          result:
            "Slow ingestion no longer holds an API connection open, and job progress stays visible as data rather than disappearing into a queue.",
        },
        {
          challenge: "Repeated expensive reads on the same aggregates",
          approach:
            "A cache-aside layer sits in front of read-heavy aggregate endpoints, with cache keys derived from normalised query parameters and TTLs chosen per data volatility. The Redis connection is non-fatal, so a cache outage degrades to database reads instead of failing the request.",
          result:
            "Repeat reads of the same aggregate are served without recomputing them, and the API contract stays identical whether the cache is warm, cold or unavailable.",
        },
      ],
    },
    {
      kind: "compare",
      id: "performance",
      title: "Performance & scalability",
      description:
        "What the read path does today, and — separately labelled — what is designed for later.",
      columns: [
        {
          label: "Implemented now",
          summary:
            "Cost is managed in the query and the response shape rather than in a cache that does not exist yet.",
          items: [
            "Indexes chosen for the filter-and-sort combinations the analytics actually use",
            "Aggregation pushed into SQL, so rows nobody displays are never transferred",
            "Pagination at the database level on stable keys rather than deep offsets",
            "Validation before work: a rejected request never reaches the database",
            "One response envelope per resource area, so clients do not over-fetch to be safe",
          ],
        },
        {
          label: "Next scaling steps",
          status: "planned",
          summary:
            "The first places growth would be absorbed, beyond what already runs.",
          items: [
            "Cache hit rates measured and TTLs tuned per endpoint",
            "Workers autoscaled on queue depth rather than a fixed replica count",
            "Task queue with retries, backoff and a dead-letter destination",
            "Event stream so several consumers can read the same market events",
            "Container orchestration once more than one instance runs",
          ],
        },
      ],
      note: "No benchmark figures appear here. None were measured, and a number that cannot be reproduced is worth less than the design decision behind it.",
    },
    {
      kind: "code",
      id: "code",
      title: "Implementation details",
      description:
        "Three short samples showing the patterns described above. Nothing here is a credential, a route or a configuration value.",
      snippets: [
        {
          language: "typescript",
          filename: "ingestion/normalise-record.ts",
          code: `// The provider's shape stops here: it is validated and mapped onto the
// internal schema before anything is written.
const imported = marketRecordSchema.parse(rawRecord);

const accepted = await marketData.create({
  data: {
    propertyId: imported.propertyId,
    period: imported.period,
    price: imported.price,
    sourceId: importRun.sourceId,
  },
});`,
          caption:
            "Validation happens before persistence, and the accepted row keeps a reference to the import run that produced it — which is what makes a figure traceable.",
        },
        {
          language: "sql",
          filename: "queries/neighborhood-trend.sql",
          code: `SELECT md.period,
       percentile_cont(0.5) WITHIN GROUP (ORDER BY md.price) AS median_price,
       count(*) AS observation_count
FROM market_data md
JOIN property p ON p.id = md.property_id
WHERE p.location_id = $1
  AND p.property_type = $2
  AND md.period BETWEEN $3 AND $4
GROUP BY md.period
ORDER BY md.period;`,
          caption:
            "The analytical query filters on the same three dimensions the interface exposes — location, property type and period — and aggregates in the database so the API returns figures rather than rows. Placeholders are bound parameters, never interpolated values.",
        },
        {
          language: "typescript",
          filename: "middleware/authorize.ts",
          code: `// Authorization is applied to the API, before domain work runs.
const permitted = permittedRoles(request.resource);
if (!permitted.includes(request.user.role)) {
  throw new ForbiddenError();
}`,
          caption:
            "One authorization check for every route that needs one. The interface may hide a control, but it is never the boundary.",
        },
      ],
    },
    {
      kind: "accordion",
      id: "testing",
      title: "Testing",
      description:
        "What is tested, and why those paths were chosen. Expand for detail.",
      items: [
        {
          title: "Validation and normalisation",
          body: "The ingestion boundary is the first place a bad figure can enter the system, so it is tested hardest.",
          points: [
            "Provider payloads mapped onto the internal schema by an adapter under test",
            "Malformed and incomplete records asserted to be rejected rather than stored",
            "Boundary values checked, including an empty result and a single observation",
          ],
        },
        {
          title: "Authorization rules",
          body: "Privilege is tested with explicit actor-and-resource combinations, because a permission rule that is only checked by eye is not a rule.",
          points: [
            "Each role exercised against each protected area",
            "Wrong, missing and insufficient credentials asserted to fail closed",
            "The public path checked to expose aggregate market data and nothing else",
          ],
        },
        {
          title: "Analytics calculations",
          body: "Metric definitions are the product, so they are tested against hand-checked expected values rather than against themselves.",
          points: [
            "Aggregates verified for a known input set",
            "Filtering by location, property type and period tested at the boundaries",
            "Pagination tested at the first page and the last",
          ],
        },
        {
          title: "Failure paths",
          body: "The happy path is exercised every time the application is used, so tests spend most of their effort on the paths nobody visits by accident.",
          points: [
            "Rejected input returns a stable error rather than an exception trace",
            "A missing resource is a clear not-found, not a server error",
            "An import that fails part-way leaves the stored data consistent",
          ],
        },
      ],
    },
    {
      kind: "compare",
      id: "deployment",
      title: "Deployment",
      description:
        "How the service runs locally, and what has not been deployed. Configuration values are not listed.",
      columns: [
        {
          label: "Implemented",
          summary:
            "A containerised environment that matches the intended deployment shape, with configuration kept outside the code.",
          items: [
            "API and PostgreSQL run together in a containerised local environment",
            "Environment-based configuration, so no credential is committed to the repository",
            "Migrations applied deliberately as part of bringing the environment up",
            "Application and data tiers separated, so either can move independently",
          ],
        },
        {
          label: "Not yet exercised",
          status: "planned",
          summary:
            "There is no public deployment for this project, so no demo link is offered.",
          items: [
            "A managed database instance",
            "Image builds published to a registry",
            "Multi-instance orchestration",
            "Monitored background workers",
          ],
        },
      ],
      note: "Hostnames, ports, connection details and credentials are deliberately absent from this page — a case study should describe how a system is shaped, not how to reach it.",
    },
    {
      kind: "decisions",
      id: "decisions",
      title: "Engineering decisions",
      description:
        "Each decision states what was chosen, why, what it costs, and what it buys.",
      items: [
        {
          technology: "PostgreSQL",
          question: "One relational store for market data, indicators and reports",
          context: "Schema, constraints and analytical queries",
          why: "The domain is genuinely relational — properties sit in locations, observations attach to properties, reports reference periods and indicators — and the questions asked of it are aggregate queries with filters, which is what a relational engine with real indexes does well.",
          tradeoff: "A relational model demands deliberate schema design and versioned migrations. Changing shape later is a project, not a line of code.",
          result: "Every published figure is derived from one store with explicit relationships, so a figure cannot exist in two places with two values.",
        },
        {
          technology: "Express",
          question: "A layered Express API rather than logic in route handlers",
          context: "Controllers, services and domain rules",
          why: "Keeping controllers thin and putting metric definitions in a service layer means a calculation exists once, so a public market view and an analyst report cannot drift apart.",
          tradeoff: "More files and more indirection than a single-file API. A small change touches more than one layer.",
          result: "Business rules are testable without an HTTP request, and the layers that change for different reasons are separated.",
        },
        {
          technology: "Google OAuth",
          question: "Delegated sign-in instead of storing passwords",
          context: "Analyst and admin authentication",
          why: "Handing identity verification to a provider that already does it removes an entire class of risk — there is no password store to protect, and no reset flow to get wrong.",
          tradeoff: "The platform depends on an external identity provider, and account access depends on the provider account.",
          result: "Authentication is verified once and resolved into a user, a role and an organization before any domain logic runs.",
        },
        {
          technology: "Roles",
          question: "Role separation instead of feature flags on shared screens",
          context: "Analyst versus administrator responsibilities",
          why: "Analysis and administration are different jobs with different privileges. Modelling them as roles keeps the authorization rule in one place instead of scattered across per-screen conditions.",
          tradeoff: "Every endpoint has to declare which roles it serves, which is friction at the moment a route is written.",
          result: "Privilege is explicit in the API and enforceable independently of what the interface chooses to render.",
        },
        {
          technology: "Queues",
          question: "An asynchronous path designed before it was needed",
          context: "Aggregation and report generation",
          why: "Aggregation over a full market history and report generation are both slow, and both were going to hold a request open while a user waited. Designing the boundary early keeps the request path thin.",
          tradeoff: "Asynchronous work is harder to reason about: it needs job status as data, idempotent handlers and a dead-letter destination, all before it does anything useful.",
          result: "Designed, not built. The API is already shaped for it — a request would be accepted, queued and answered with a reference rather than blocking.",
        },
      ],
    },
    {
      kind: "accordion",
      id: "lessons",
      title: "Lessons learned",
      description:
        "What this build changed about how the next one starts. Expand for detail.",
      items: [
        {
          title: "Model the data before writing the endpoints",
          body: "The endpoints were easy once the relationships were right, and expensive to change while they were wrong.",
          points: [
            "Relationships expressed as foreign keys removed a category of validation that would otherwise have lived in application code",
            "Deciding what a period means once — rather than per endpoint — stopped two views disagreeing about the same month",
          ],
        },
        {
          title: "Analytics belongs in the database",
          body: "Computing a metric while assembling a response is convenient until the dataset is real.",
          points: [
            "Aggregating in SQL means the interface receives figures instead of rows it must summarise",
            "Pushing filters into the query is what made location, property type and period behave as one filter rather than three optional extras",
          ],
        },
        {
          title: "A boundary is a place, not a habit",
          body: "Third-party data will always arrive in someone else's shape, and that shape should stop at one layer.",
          points: [
            "An adapter that owns provider-specific structure kept the provider's vocabulary out of the domain model",
            "Validating before persistence turned a class of quiet data bugs into visible rejected records",
          ],
        },
        {
          title: "Label designed work as designed",
          body: "The queueing and caching layers are the most interesting part of the architecture, and the easiest to describe dishonestly.",
          points: [
            "Marking them planned makes the case study credible rather than impressive, and it shows judgement instead of overstating scope",
            "The same labelling applies to sample market values: demonstrated behaviour, not measured market statistics",
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
        "Labelled as future work on purpose. None of this exists in the build today.",
      items: [
        "More market-data sources — Additional API-based adapters behind the same ingestion boundary, so coverage grows without touching the domain schema.",
        "Advanced analytics — Higher-level market models built on the same aggregate queries the neighborhood views already use.",
        "Expanded reporting — Richer report composition and comparison across periods and locations.",
        "Automated report generation — Moving report assembly onto the designed worker path so it stops being an interactive operation.",
        "Data automation — Scheduled synchronisation of external sources rather than analyst-triggered imports.",
        "Event-driven processing — Publishing market events to several independent consumers once there is more than one consumer to justify it.",
        "Cache tuning — Measuring hit rates and tuning TTLs per endpoint now that the cache-aside layer is in place.",
        "Finer-grained permissions — Moving from three roles to scoped permissions within an organization.",
      ],
    },
    {
      kind: "stack",
      id: "technology-stack",
      title: "Technology stack",
      description:
        "What the project is built with, backend first, with the supporting infrastructure in its own group.",
      groups: [
        {
          label: "Backend",
          items: ["Node.js", "Express", "TypeScript", "REST APIs", "Prisma"],
        },
        {
          label: "Data",
          items: [
            "PostgreSQL",
            "Relational schema design",
            "Indexing",
            "Query design",
          ],
        },
        {
          label: "Authentication",
          items: ["Google OAuth", "JWT sessions", "Role-based access control"],
        },
        {
          label: "Platform",
          items: [
            "Docker",
            "Docker Compose",
            "Kubernetes manifests",
            "Prometheus metrics",
          ],
        },
        {
          label: "Supporting infrastructure",
          items: ["Redis", "RabbitMQ", "Kafka", "Worker processes"],
        },
        {
          label: "Frontend",
          items: ["React", "Vite", "Tailwind CSS", "Recharts", "Leaflet"],
        },
      ],
    },
  ],
};

