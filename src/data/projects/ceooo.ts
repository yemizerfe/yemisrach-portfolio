import type { Project } from "@/types/portfolio";

/**
 * CEOOO — executive decision-support workspace.
 *
 * Accuracy note: this is a full-stack build. The repository contains a Next.js
 * client and an Express API with Prisma over PostgreSQL, JWT sessions and Google
 * OAuth, password reset by email, and Kubernetes manifests. Integrations run
 * through Paragon where a connection is configured; deeper ERP and CRM data sync
 * is still labelled as future work, never as present capability.
 *
 * AI note: decision support consumes an external AI provider through an
 * integration layer. No model was trained for this project and no autonomous
 * analysis of external data is claimed.
 *
 * Public-safety note: no provider credential, key, endpoint, prompt or
 * environment value appears anywhere on this page.
 */
export const ceooo: Project = {
  slug: "ceooo",
  name: "CEOOO",
  category: "Executive Decision Support Platform",
  tagline:
    "An executive-focused platform for organizing business information, decisions, projects, budgets, goals, stakeholders, and performance.",
  summary:
    "CEOOO is an executive workspace: a Next.js client over an Express and PostgreSQL API, built so strategy, execution, money and people can be read together because the decisions that matter always span more than one of them.",
  status: "Done",
  role: "Solo build — product concept, information architecture, domain modelling, Express API and Prisma schema, JWT and Google OAuth sessions, integrations, and the component system and interface.",
  technologies: [
    "Node.js",
    "Express",
    "PostgreSQL",
    "Prisma",
    "Next.js",
    "TypeScript",
    "JWT",
    "Google OAuth",
    "Tailwind CSS",
    "External AI provider",
  ],
  /**
   * Backend-first: the repository has an Express API with Prisma over
   * PostgreSQL, JWT sessions and Google OAuth, so the card leads with that
   * rather than with the interface.
   */
  backendStack: [
    "Node.js",
    "Express",
    "PostgreSQL",
    "Prisma",
    "JWT",
    "Google OAuth",
  ],
  supportingStack: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "Zustand",
    "Recharts",
  ],
  qualifiedStack: [
    {
      label: "Planned",
      items: [
        "Deeper ERP data sync",
        "Deeper CRM data sync",
        "Granular role permissions",
      ],
    },
  ],
  stackGroups: [
    {
      label: "Application",
      items: [
        "Next.js App Router",
        "React",
        "TypeScript",
        "Server components where appropriate",
      ],
    },
    {
      label: "Interface",
      items: [
        "Tailwind CSS",
        "shadcn/ui",
        "Zustand",
        "Framer Motion",
        "GSAP",
        "Lucide React",
      ],
    },
    {
      label: "Data",
      items: [
        "PostgreSQL",
        "Prisma schema and migrations",
        "Typed domain models",
        "Derived selectors",
      ],
    },
    {
      label: "AI",
      items: ["External AI provider (server-side integration layer)"],
    },
    {
      label: "Planned",
      status: "planned",
      items: [
        "Deeper ERP data sync",
        "Deeper CRM data sync",
        "Granular role permissions",
      ],
    },
  ],
  engineeringConcepts: [
    "Information architecture",
    "Domain modelling",
    "Derived state",
    "Dashboard design",
    "Type-safe data flow",
    "Component composition",
    "Motion restraint",
    "External API integration",
  ],
  problem:
    "An executive's information is spread across the tools that produced it. Strategy lives in a document, progress lives in a tracker, spend lives in a spreadsheet, commitments live in a calendar, and relationships live in memory. Each tool is reasonable on its own, and together they make the most important questions — are we on track, what is at risk, and what needs a decision — hard to answer quickly.",
  solution:
    "CEOOO is built around a single question: what does an executive need to see in order to make a decision now? One workspace is composed from a shared domain model — decisions, projects, budgets, goals, stakeholders and notes — so the same entity appears consistently wherever it is relevant instead of being re-entered per tool. The engineering approach is deliberate about where truth lives: typed domain models define each entity once, and derived selectors compute the figures the dashboard shows rather than storing duplicates that can disagree.",
  features: [
    "Executive dashboard bringing goals, projects, budget and decisions together",
    "Decision register with context and outcome tracking",
    "Project and initiative tracking with status and owner",
    "Budget views organized by category and period",
    "Objectives and key results, with progress derived from linked work",
    "KPI tracking for the measures an executive actually reviews",
    "Calendar view for commitments and review cadence",
    "Stakeholder directory with relationship context",
    "Notes attached to the entity they are about",
    "AI-assisted decision support where it is implemented",
    "Company-performance views over the shared model",
    "Keyboard-accessible interface with restrained motion",
  ],
  architecture: {
    flow: [
      {
        name: "User (executive)",
        detail:
          "The workspace is a single surface — strategy, execution, money and people reached from one place instead of six tools.",
      },
      {
        name: "Next.js App Router",
        detail:
          "Server components for the dashboard shell and metadata; client components only where interaction requires them.",
      },
      {
        name: "Express API (server)",
        detail:
          "REST endpoints for the workspace modules, with JWT sessions, Google OAuth sign-in, validation and Prisma as the data boundary.",
      },
      {
        name: "PostgreSQL (Prisma)",
        detail:
          "Persistent records for decisions, projects, budgets, goals, stakeholders, notes and support requests, with versioned migrations.",
      },
      {
        name: "Domain model",
        detail:
          "TypeScript types defining decisions, projects, budgets, goals, KPIs, stakeholders and notes as referenceable entities.",
      },
      {
        name: "Selectors & derived state",
        detail:
          "Functions that compute dashboard figures from the model, so a displayed number has one calculation rather than several.",
      },
      {
        name: "Reusable components (shadcn/ui)",
        detail:
          "Accessible primitives — dialogs, tables, tabs, tooltips — themed once so every module inherits the same language.",
      },
      {
        name: "Module views",
        detail:
          "Dashboard, budget, projects, OKRs, KPIs, calendar, stakeholders and notes, each a composition over the shared model rather than a separate world.",
      },
      {
        name: "Workspace data",
        detail:
          "Records read through the API. The seeded dataset is sample data for the demo, not a company's production records.",
      },
    ],
    services: [
      {
        name: "Zustand",
        detail:
          "Client state for interface concerns: filters, selection, panel state and edits to the local model.",
      },
      {
        name: "AI integration layer",
        detail:
          "A server-side layer that calls an external AI provider on behalf of the interface, so the provider credential never reaches the browser. Assistance is limited to information the user has already entered.",
      },
      {
        name: "Framer Motion / GSAP",
        detail:
          "Motion used to explain change: panel transitions, list reordering and progress indication. Both respect reduced-motion preferences, and GSAP is reserved for the few sequences it genuinely improves.",
      },
    ],
    note: "The client, the API, the schema and the session model are all in the repository. Integrations are connected through Paragon where configured; deeper ERP and CRM data sync is the part still labelled as planned.",
  },
  githubUrl: "https://github.com/yemizerfe/ceooo",
  liveUrl: undefined,
  caseStudy: [
    {
      kind: "prose",
      id: "overview",
      title: "Overview",
      description:
        "A workspace for executive decisions, and the stack underneath it.",
      paragraphs: [
        "CEOOO is an executive workspace: decisions, projects, budgets, objectives, KPIs, calendar, stakeholders and notes held in one place rather than eight. It began as a product concept and was carried through to a working full-stack application.",
        "It is a full-stack application: a Next.js client over an Express API with Prisma and PostgreSQL, JWT sessions with Google OAuth sign-in, and password reset by email. The dataset it ships with is seeded sample data, so nothing on this page claims real company records or live ERP data sync — that deeper integration is the part still labelled as planned.",
      ],
    },
    {
      kind: "prose",
      id: "problem",
      title: "Problem",
      paragraphs: [
        "Executive information is spread across separate tools for goals, projects, budgets, people and decisions, so more time goes into reconciling the information than acting on it.",
        "The tools are not the problem on their own — each one is reasonable. The problem is that the questions an executive actually asks cross all of them: is this project on track, can we afford it, who is accountable, and what is still waiting on me.",
      ],
    },
    {
      kind: "prose",
      id: "solution",
      title: "Solution",
      paragraphs: [
        "One workspace composed from a shared domain model. Each entity is defined once as a type, and each view is a composition over that model rather than a separate store of its own — so a project shown in the dashboard and the same project shown in a review are the same record.",
        "Figures are derived, not stored. Selectors compute the numbers the dashboard displays from the underlying records, which removes the possibility of two views showing two totals for the same thing.",
      ],
    },
    {
      kind: "list",
      id: "features",
      title: "Key features",
      description:
        "The modules the workspace is composed from, and what each one is for.",
      items: [
        "Decision support — Assistance that works from information the executive has already entered, offered as a draft rather than a conclusion.",
        "Dashboard — Movement in goals, projects and measures in one view, because a total without context is not a decision aid.",
        "Projects — Initiatives with status, owner and the decisions attached to them.",
        "Budget — Planning and financial information organized by category and period.",
        "OKRs — Objectives and key results, with progress derived from the work linked to them.",
        "KPIs — The small set of measures an executive actually reviews, defined once.",
        "Calendar — Commitments and review cadence, so planning is part of the same surface.",
        "Stakeholders — Directory with the relationship context that makes a name useful.",
        "Notes — Notes attach to the entity they are about, instead of living in a separate notebook.",
        "Company performance — Performance views over the shared model. ERP and CRM powered views are future work.",
      ],
    },
    {
      kind: "architecture",
      id: "architecture",
      title: "Architecture",
      description:
        "One model, many compositions — served by a real API and a relational schema rather than held in the browser.",
      architecture: {
        flow: [
          {
            name: "User (executive)",
            detail:
              "The workspace is a single surface: strategy, execution, money and people reached from one place instead of six tools.",
          },
          {
            name: "Next.js App Router",
            detail:
              "Server components for the dashboard shell and metadata; client components only where interaction requires them.",
          },
          {
            name: "Domain model",
            detail:
              "TypeScript types defining decisions, projects, budgets, goals, KPIs, stakeholders and notes as referenceable entities.",
          },
          {
            name: "Selectors & derived state",
            detail:
              "Functions that compute dashboard figures from the model, so a displayed number has one calculation rather than several.",
          },
          {
            name: "Reusable components (shadcn/ui)",
            detail:
              "Accessible primitives — dialogs, tables, tabs, tooltips — themed once so every module inherits the same language.",
          },
          {
            name: "Module views",
            detail:
              "Dashboard, budget, projects, OKRs, KPIs, calendar, stakeholders and notes, each a composition over the shared model rather than a separate world.",
          },
          {
            name: "Workspace data",
            detail:
              "Records read through the API from PostgreSQL. The seeded rows are sample data; deeper ERP and CRM data sync is the part still planned.",
          },
        ],
        services: [
          {
            name: "Zustand",
            detail:
              "Client state for interface concerns: filters, selection, panel state and edits to the local model.",
          },
          {
            name: "AI integration layer",
            detail:
              "A server-side layer that calls an external AI provider on behalf of the interface, so the provider credential never reaches the browser.",
          },
          {
            name: "Framer Motion / GSAP",
            detail:
              "Motion used to explain change: panel transitions, list reordering and progress indication, both respecting reduced-motion preferences.",
          },
        ],
        note: "No backend is drawn because there is none. The AI integration is a server-side call to an external provider, not a service this project operates.",
      },
    },
    {
      kind: "compare",
      id: "integrations",
      title: "What exists, and what is planned",
      description:
        "The same honesty rule the other case studies follow: designed work is labelled as designed.",
      columns: [
        {
          label: "Implemented",
          summary:
            "The client, the API, the schema, the session model and the AI assistance path.",
          items: [
            "Next.js workspace with all modules as compositions over one model",
            "Express REST API with validation and Prisma as the data boundary",
            "PostgreSQL schema with versioned migrations",
            "JWT sessions and Google OAuth sign-in",
            "Password reset by email",
            "AI-assisted decision support through a server-side call to an external provider",
            "Kubernetes manifests for the client, API, PostgreSQL and Redis",
          ],
        },
        {
          label: "Planned / future improvements",
          status: "planned",
          summary:
            "Deeper business-system data and finer-grained access than the current build covers.",
          items: [
            "Deeper ERP data sync for real financial and operational figures",
            "Deeper CRM data sync for customer and pipeline information",
            "Granular role permissions for scoped access",
            "Multi-user collaboration on shared records",
            "Scheduled instead of on-demand integration runs",
          ],
        },
      ],
      note: "The company-performance module is real as a view over the shared model. It is not connected to an ERP or a CRM, and no such connection is claimed.",
    },
    {
      kind: "milestones",
      id: "business-entities",
      title: "Business entities",
      description:
        "How each business concept is represented, and what it links to. This is the model the whole interface is composed from.",
      items: [
        {
          title: "Decision",
          body: "The record the workspace is organized around: what was decided, the context it was made in, who owns it and how it turned out. Decisions link to the projects and goals they affect, so a decision is never an isolated note.",
        },
        {
          title: "Project",
          body: "An initiative with a status, an owner and the decisions attached to it. Health is derived from the project's own fields rather than stored separately, so one project cannot report two different states.",
        },
        {
          title: "Budget",
          body: "Planned and actual amounts organized by category and period. It is a planning view over typed records, deliberately not a general ledger — there is no accounting engine here and none is claimed.",
        },
        {
          title: "Objective & key result",
          body: "An objective carries key results, and progress is computed from the work linked to them rather than typed in. That is what keeps an OKR view from drifting away from the projects underneath it.",
        },
        {
          title: "KPI",
          body: "A named measure with a definition and a target. Holding the definition next to the value is what stops two people reporting the same KPI two different ways.",
        },
        {
          title: "Stakeholder",
          body: "A person plus the relationship context that makes them useful: their role, the commitments attached to them, and the notes about them.",
        },
        {
          title: "Note",
          body: "Notes attach to the entity they are about rather than living in a separate notebook, which is what makes them findable at the moment they are needed.",
        },
        {
          title: "Calendar commitment",
          body: "Time commitments and review cadence, so planning shares a surface with the strategy and the money constraining it.",
        },
      ],
    },
    {
      kind: "flow",
      id: "data-flow",
      title: "Data flow",
      description:
        "How one edit propagates. The point of this path is that no figure is stored twice.",
      steps: [
        {
          name: "A record changes",
          detail:
            "An executive edits a project status, a budget line or a key result. The edit is applied to the typed model rather than to a rendered copy of it.",
        },
        {
          name: "The model updates once",
          detail:
            "There is a single source record for each entity, so the change lands in one place and cannot partially apply across views.",
        },
        {
          name: "Selectors recompute",
          detail:
            "Derived figures — OKR progress, budget position, project health, dashboard totals — are recalculated from the updated records rather than patched by hand.",
        },
        {
          name: "Views re-render from the result",
          detail:
            "Each module reads the recomputed values. A number shown in two places is the same value computed once, so the two cannot disagree.",
        },
        {
          name: "State records interface concerns",
          detail:
            "Filters, selection and open panels live in client state. They are deliberately kept out of the model, so a view preference never becomes business data.",
        },
      ],
      note: "The same path runs from a fresh page load: records are read, selectors recompute, and the interface renders the result. Nothing is cached as a stored total, which is a rendering cost accepted in exchange for never showing two totals for one thing.",
    },
    {
      kind: "flow",
      id: "ai-architecture",
      title: "AI decision support",
      description:
        "How the AI assistance path works. The application consumes an external model; no model was trained for this project.",
      steps: [
        {
          name: "User asks within the workspace",
          detail:
            "Assistance is requested in context — summarising a set of notes, or drafting the surrounding context for a decision that is already open.",
        },
        {
          name: "Application logic assembles the request",
          detail:
            "The relevant records the user has already entered are gathered. Nothing is sent that the user cannot see in the workspace.",
        },
        {
          name: "AI integration layer",
          detail:
            "A server-side layer calls the provider. It exists so the provider credential stays on the server and never reaches the browser.",
        },
        {
          name: "External AI provider",
          detail:
            "A third-party model produces a response. This project does not train, fine-tune or host a model, and does not claim to.",
        },
        {
          name: "Response returns to the application",
          detail:
            "The output is presented as a draft attached to the decision or note it concerns — never written into the model without the user accepting it.",
        },
        {
          name: "User decides",
          detail:
            "The executive accepts, edits or discards the suggestion. The judgement stays with the person, which is the only defensible place for it in a decision-support tool.",
        },
      ],
      note: "The provider credential, the request payload and any prompt configuration are environment-level details and are not published here. The architecture is what is worth describing: the application consumes an external model through an integration layer, and the human remains the decision-maker.",
    },
    {
      kind: "accordion",
      id: "state-components",
      title: "State & component design",
      description:
        "Where state lives, and how a new module is added without inventing a new system. Expand for detail.",
      items: [
        {
          title: "One model, no shadow copies",
          body: "Every business entity is defined once as a type. A view may project it, sort it or filter it, but it may not keep its own copy of it.",
          points: [
            "Derived figures are computed by selectors instead of being stored as fields",
            "Two views of the same entity cannot disagree, because they are the same record",
            "Adding a module means composing existing entities, not introducing a parallel model",
          ],
        },
        {
          title: "Business data and interface state are kept apart",
          body: "Not everything in an application is data. Filters and open panels are interface concerns, and treating them as records would pollute the model.",
          points: [
            "Zustand holds selection, filters, panel state and pending edits",
            "The domain model holds decisions, projects, budgets, goals, KPIs, stakeholders and notes",
            "The boundary is deliberate, so a view preference never becomes something that needs persisting, migrating or reporting on",
          ],
        },
        {
          title: "Composition over configuration",
          body: "Modules share primitives rather than an options object. A budget table and a stakeholder list are the same table with different columns.",
          points: [
            "shadcn/ui primitives are themed once, so every module inherits one visual language",
            "Each module is a composition over the shared model, which is why nine of them did not become nine codebases",
            "New behaviour is added by composing an existing primitive rather than extending a configurable mega-component",
          ],
        },
        {
          title: "Numbers are displayed where they are explained",
          body: "A figure without its definition is a number an executive has to trust on faith.",
          points: [
            "A KPI carries its definition beside its value",
            "OKR progress shows the work it was derived from, not just a percentage",
            "Budget views state the period they cover, so a total is never ambiguous",
          ],
        },
      ],
    },
    {
      kind: "list",
      id: "security",
      title: "Authentication & security",
      description:
        "How sessions and credentials are handled in the build, and what is not claimed.",
      items: [
        "JWT sessions — Sign-in issues a token that the API verifies on every request; the client never treats a hidden control as an authorization boundary.",
        "Google OAuth — Delegated sign-in is available alongside password accounts, so there is no password to store for those users.",
        "Hashed passwords — Password accounts store a bcrypt hash, never the password itself.",
        "Password reset by email — Reset tokens are sent by the API through a mail provider and expire.",
        "Provider credentials stay server-side — The AI integration calls the provider from the server, so the key is never exposed to the browser or bundled into the client.",
        "Configuration through the environment — Secrets come from environment configuration, never from the repository, and never appear in this case study.",
        "Planned: granular permissions — Moving from a shared workspace to scoped access: who can see which budget, project or decision.",
      ],
    },
    {
      kind: "challenges",
      id: "challenges",
      title: "Technical challenges",
      description:
        "The problems this build was actually about, and what was done about each.",
      items: [
        {
          challenge: "Nine executive workflows that all want their own data",
          approach:
            "The module was made the composition point, not the data. Every workflow reads and writes the same typed entities, and each view is a projection of that model rather than a store of its own.",
          result:
            "Adding a module means writing a view over existing entities. The alternative — each module with its own version of a project — is how a workspace becomes the thing it was built to replace.",
        },
        {
          challenge: "Keeping a derived figure honest",
          approach:
            "Anything computed is computed by a selector from the source records: OKR progress from linked work, budget position from line items, project health from its own fields. No derived value is stored as a field that can go stale.",
          result:
            "A number shown in two places is one calculation, so two views cannot report different totals for the same state of the business.",
        },
        {
          challenge: "Designing a dashboard that does not become a wall of tiles",
          approach:
            "The dashboard was organised around questions rather than metrics: what moved, what is at risk, and what is waiting on a decision. A figure earns space by supporting one of those questions, not by being available.",
          result:
            "The first screen answers questions an executive actually arrives with, and the modules underneath hold the detail rather than the summary competing with it.",
        },
        {
          challenge: "Deciding what is data and what is a view",
          approach:
            "Filters, selection and panel state were deliberately kept out of the domain model. They change for different reasons and at a much higher rate than business records do.",
          result:
            "Business records stay small and meaningful, and interface state never becomes something that would need persisting, migrating or reporting on.",
        },
        {
          challenge: "Adding AI without handing it authority",
          approach:
            "Assistance is scoped to information the user has already entered, the call is made through a server-side integration layer so the credential stays off the client, and the output arrives as a draft the user accepts or discards.",
          result:
            "The model proposes and the executive decides. Nothing an AI returns is written into the workspace without a person accepting it.",
        },
        {
          challenge: "Motion that explains change instead of decorating it",
          approach:
            "Animation is limited to transitions that carry meaning — a panel opening, a list reordering, progress moving — and every animated surface respects a reduced-motion preference.",
          result:
            "The interface communicates state change without becoming tiring to use daily, and the two animation libraries are used where each is genuinely better rather than everywhere they could be.",
        },
      ],
    },
    {
      kind: "compare",
      id: "performance",
      title: "Performance & scalability",
      description:
        "Rendering decisions that are implemented, and the honest costs of running this without a server.",
      columns: [
        {
          label: "Implemented",
          summary:
            "The decisions that keep a large surface responsive without a backend.",
          items: [
            "Server components for the dashboard shell and metadata; client components only where interaction requires them",
            "Derived values computed once per render rather than stored and synced",
            "Reusable primitives, so a module is a composition rather than another component tree to maintain",
            "Motion limited to meaningful transitions and disabled under a reduced-motion preference",
            "No charting or state library beyond the two chosen, so the bundle is not carrying duplicate abstractions",
          ],
        },
        {
          label: "Honest limits",
          status: "planned",
          summary:
            "What a real dataset would force, and what this build therefore does not do.",
          items: [
            "No benchmark is quoted for the API: none was measured against a dataset larger than the seeded demo",
            "No memoisation strategy is claimed for datasets larger than a demo workspace",
            "Real data would require persistence, authentication and permissions before performance work mattered",
            "The seeded dataset is demonstration data, not a company's scaled production data",
          ],
        },
      ],
      note: "No rendering timings, query timings or bundle figures are quoted, because none were measured for publication. Where a figure comes from matters more than how fast the demo paints.",
    },
    {
      kind: "accordion",
      id: "testing",
      title: "Testing",
      description:
        "What this build verifies, given that the logic worth testing lives in selectors and the model rather than in a database. Expand for detail.",
      items: [
        {
          title: "Derived selectors",
          body: "The selectors are where the business meaning lives, so they are tested against hand-checked expected values rather than against their own output.",
          points: [
            "OKR progress verified for a known set of linked work",
            "Budget position verified for a period with partial entries",
            "Project health verified at the boundaries where a status changes meaning",
          ],
        },
        {
          title: "Model integrity",
          body: "An entity that links to another entity is a promise, and a broken promise should render a clear state rather than a broken view.",
          points: [
            "A reference to a missing record exercised rather than assumed away",
            "A goal with no key results, and a project with no decisions, each rendered deliberately",
            "An empty workspace treated as a real state to design for, not an error",
          ],
        },
        {
          title: "Edge cases",
          body: "The demo dataset is tidy; the interface should not depend on it being tidy.",
          points: [
            "Empty collections, zero values and single-item lists",
            "A budget period with no entries",
            "A performance figure with no prior period to compare against",
          ],
        },
        {
          title: "Interface behaviour",
          body: "Two properties were treated as requirements rather than polish, because this is a tool someone would use every day.",
          points: [
            "Keyboard access to the interactive surfaces, not only pointer access",
            "Reduced-motion preference respected, so no animation is required to understand a change",
            "Interactive targets labelled for assistive technology rather than relying on an icon alone",
          ],
        },
      ],
    },
    {
      kind: "compare",
      id: "deployment",
      title: "Deployment",
      description:
        "What can be built and run today, and the honest note that there is no public demo.",
      columns: [
        {
          label: "Implemented",
          summary:
            "A production build that runs, with the one credential it needs kept on the server side.",
          items: [
            "Next.js production build and the Express API run locally",
            "PostgreSQL through Prisma, with migrations applied as a deliberate step",
            "Docker and Kubernetes manifests for the client, API, PostgreSQL and Redis",
            "Provider credentials supplied through environment configuration, never committed",
            "The AI call made server-side, so nothing credential-shaped reaches the client bundle",
          ],
        },
        {
          label: "Not yet exercised",
          status: "planned",
          summary:
            "There is no public deployment for this project, so no live demo link is offered.",
          items: [
            "Hosting for the Next.js client and the Express API",
            "A managed PostgreSQL instance",
            "Secrets provisioned in the host rather than on a local machine",
            "A running worker and mail provider for password reset in production",
          ],
        },
      ],
      note: "No hostname, provider, key or environment value is listed on this page. The deployment picture that matters here is the boundary: the credential stays on the server, and the demo data stays local.",
    },
    {
      kind: "decisions",
      id: "decisions",
      title: "Engineering decisions",
      description:
        "Each decision states what was chosen, why, what it costs, and what it buys.",
      items: [
        {
          technology: "Next.js",
          question: "One framework for the workspace shell and its routes",
          context: "Application structure",
          why: "An executive workspace is mostly a set of destinations around a static shell. Next.js gave routing, server rendering for the parts that do not change per interaction, and a server boundary for the AI call.",
          tradeoff: "Two rendering models in one codebase. Every component needs a decision about whether it runs on the server or the client, and getting that wrong produces bugs that appear in only one of them.",
          result: "The shell and metadata render on the server, interactive modules run on the client, and the AI credential has a server boundary to live behind.",
        },
        {
          technology: "Zustand",
          question: "Small client stores instead of one global application store",
          context: "Interface state",
          why: "The state this application genuinely needs on the client is narrow: filters, selection, open panels and pending edits. A minimal store matches that, and deliberately has no opinion about where business data comes from.",
          tradeoff: "A small store means state is composed at the component level, which is more wiring than reaching into one global object from anywhere.",
          result: "Interface state stays separate from the domain model, so a view preference can never quietly become a business record.",
        },
        {
          technology: "Tailwind CSS + shadcn/ui",
          question: "Utility styling over a themed primitive set, rather than a component library",
          context: "The interface system",
          why: "Nine modules needed to look like one product. Theming primitives once and styling with tokens is what makes a budget table and a stakeholder list read as the same interface instead of two.",
          tradeoff: "Utilities in markup are verbose, and copying primitives into the project means owning them: an update is a deliberate merge rather than a package upgrade.",
          result: "A new module inherits the visual language by using the same primitives, and accessibility behaviour lives in the primitives instead of being re-implemented per view.",
        },
        {
          technology: "Framer Motion / GSAP",
          question: "Two animation tools, each scoped to what it is good at",
          context: "Motion",
          why: "Component-level transitions and layout changes are Framer Motion's strength; orchestrated timeline sequences are GSAP's. Using one tool for both jobs would mean fighting it for half the cases.",
          tradeoff: "Two dependencies to keep in step, and a real risk of motion creeping in as decoration once two libraries are available.",
          result: "Motion is used to explain change — a panel opening, a list reordering, progress moving — and both libraries respect a reduced-motion preference.",
        },
        {
          technology: "External AI provider",
          question: "An API integration instead of a custom model",
          context: "AI decision support",
          why: "Training a model is a research programme, not a feature of an executive workspace. The value here is in the integration and in the safety of it, not in producing a model.",
          tradeoff: "The capability depends on a third party — its availability, its cost model and its terms — and the workspace cannot improve the model itself.",
          result: "Assistance is available where it helps, the credential stays server-side, and the project claims an integration rather than a model it did not build.",
        },
      ],
    },
    {
      kind: "accordion",
      id: "lessons",
      title: "Lessons learned",
      description:
        "What this build changed about how the next product surface starts. Expand for detail.",
      items: [
        {
          title: "The model is the product",
          body: "Deciding what a decision, a project and a key result are was slower than drawing the screens, and it decided the screens.",
          points: [
            "Defining entities once is what let nine modules share one workspace instead of becoming nine tools",
            "Deriving figures rather than storing them removed a class of inconsistency before it could appear",
          ],
        },
        {
          title: "Not everything in an application is data",
          body: "Treating interface state as records is how a model grows fields nobody needs and a migration nobody wants.",
          points: [
            "Keeping filters and selection in client state kept the business model small and meaningful",
            "The boundary made it obvious which changes were worth persisting and which were only a preference",
          ],
        },
        {
          title: "A dashboard is an argument, not a summary",
          body: "A wall of tiles is neutral. Space allocated to a question is a design decision, and decisions are what the product is for.",
          points: [
            "Organising the first screen around what moved, what is at risk and what needs a decision gave every figure a reason to be there",
            "Leaving something off the dashboard was harder than adding it, and more valuable",
          ],
        },
        {
          title: "AI should propose, never conclude",
          body: "In a tool that supports decisions, the most important thing to get right about AI is where its output stops.",
          points: [
            "Scoping assistance to information the user has already entered keeps the output checkable",
            "Making the result a draft the user accepts or discards keeps the judgement with the person",
            "The server-side integration boundary is what stops a provider credential from becoming a client-side secret",
          ],
        },
        {
          title: "Seed data is not a product dataset",
          body: "The workspace ships with seeded records so every module can be used immediately; saying that plainly is what keeps the interface from implying live company data.",
          points: [
            "A demo dataset described honestly is a clearer signal than one padded with integrations it does not run",
            "Naming the deeper ERP and CRM sync as planned is what makes the integration story credible rather than vague",
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
        "Labelled as future work. None of this exists in the build today.",
      items: [
        "ERP integration — Reading real financial and operational data so the budget and performance views reflect the actual business rather than a typed dataset.",
        "CRM integration — Customer and pipeline information, so stakeholder and performance views include the revenue side of the picture.",
        "Advanced company analytics — Deeper performance analysis over persisted data instead of a demonstration dataset.",
        "Automated reporting — Assembling a periodic summary from the records the workspace already holds, rather than an executive compiling it by hand.",
        "Expanded AI decision support — Broader assistance across the modules, still scoped to information the user has entered and still presented as a draft.",
        "Granular permissions — Moving beyond a shared workspace to scoped access: who can see which budget, project or decision.",
        "Multi-user collaboration — Decisions and notes that more than one person can see and act on, which is what turns the workspace into a shared record.",
      ],
    },
    {
      kind: "stack",
      id: "technology-stack",
      title: "Technology stack",
      description:
        "What the project is built with, backend first, with integration work that is still planned kept in its own group.",
      groups: [
        {
          label: "Application",
          items: [
            "Next.js App Router",
            "React",
            "TypeScript",
            "Server components where appropriate",
          ],
        },
        {
          label: "Interface",
          items: [
            "Tailwind CSS",
            "shadcn/ui",
            "Zustand",
            "Framer Motion",
            "GSAP",
            "Lucide React",
          ],
        },
        {
          label: "Data",
          items: [
            "Typed domain models",
            "Derived selectors",
            "Client-side state",
            "Local dataset for the demo",
          ],
        },
        {
          label: "AI",
          items: ["External AI provider (server-side integration layer)"],
        },
        {
          label: "Planned / not built yet",
          status: "planned",
          items: [
            "Server-side persistence",
            "Authentication",
            "Role-based permissions",
            "ERP integrations",
            "CRM integrations",
          ],
        },
      ],
    },
  ],
};
