import type { Project } from "@/types/portfolio";

/**
 * weTalk — one-to-one real-time communication.
 *
 * Scope note: weTalk is strictly one-to-one. It is not a group chat, a channel
 * product or a community workspace, and nothing in this case study claims
 * otherwise.
 *
 * Public-safety note: the API is described by responsibility, never by route.
 * Event names, hostnames, ports, tokens, hashes and configuration values are
 * deliberately absent — the page should explain a design without publishing the
 * details needed to interfere with a running instance.
 *
 * Accuracy note: Redis is implemented for presence, session and rate-limit
 * state; PostgreSQL remains the message store. No user counts, traffic or
 * performance figures are claimed.
 */
export const weTalk: Project = {
  slug: "wetalk",
  name: "weTalk",
  category: "Real-Time Communication Platform",
  tagline:
    "A one-to-one real-time communication application focused on reliable messaging, authentication, validation, and real-time events.",
  summary:
    "weTalk is a one-to-one messaging application. The interesting part is not the chat bubble — it is deciding where state lives when two clients, a socket layer and a database all have an opinion about the same conversation.",
  status: "Done",
  role: "Solo build — API design, realtime layer, data modelling with Prisma, authentication, validation, and the React client that consumes both transports.",
  technologies: [
    "Node.js",
    "Express",
    "Socket.IO",
    "PostgreSQL",
    "Prisma",
    "JWT",
    "bcrypt",
    "Zod",
    "REST APIs",
    "React 18",
    "TypeScript",
    "Vite",
    "Zustand",
    "Tailwind CSS",
    "Docker",
  ],
  backendStack: [
    "Node.js",
    "Express",
    "Socket.IO",
    "PostgreSQL",
    "Prisma",
    "JWT",
    "bcrypt",
    "Zod",
    "REST APIs",
  ],
  supportingStack: ["React 18", "TypeScript", "Vite", "Zustand", "Tailwind CSS"],

  stackGroups: [
    {
      label: "Frontend",
      items: [
        "React 18",
        "TypeScript",
        "Vite",
        "Zustand",
        "Tailwind CSS",
        "Socket.IO client",
      ],
    },
    {
      label: "Backend",
      items: [
        "Node.js",
        "Express",
        "Socket.IO",
        "REST APIs",
        "JWT",
        "bcrypt",
        "Zod",
      ],
    },
    {
      label: "Data",
      items: ["PostgreSQL", "Prisma", "Relational data modelling", "Migrations"],
    },
    {
      label: "Platform",
      items: ["Docker", "Docker Compose", "Environment-based configuration"],
    },
    {
      label: "State & delivery",
      items: ["Redis", "Presence tracking", "Session state"],
    },
  ],
  engineeringConcepts: [
    "Authentication",
    "Real-time communication",
    "WebSockets",
    "Database design",
    "REST API design",
    "Input validation",
    "Client state management",
    "Authorization boundaries",
    "Password hashing",
  ],
  problem:
    "A one-to-one messaging app looks trivial right up to the point where it has to survive a refresh. Messages must persist, only the two participants may read a conversation, ordering must stay consistent when a client goes offline, and a duplicate send must not create a duplicate message. Most tutorials stop at 'it works on localhost', which is where the real constraints begin.",
  solution:
    "weTalk splits responsibilities instead of treating the socket as a database. Express serves the REST surface for accounts and conversation history, Socket.IO carries events, and PostgreSQL through Prisma is the only source of truth. Every message is validated, persisted, and only then broadcast — so a dropped connection costs a client some latency, never data.",
  features: [
    "Authentication and user accounts",
    "One-to-one conversations",
    "Real-time message delivery over Socket.IO",
    "Message persistence in PostgreSQL",
    "Per-conversation authorization",
    "Authenticated socket handshake",
    "Password hashing with bcrypt",
    "Request and payload validation with Zod",
    "Cursor-based message history",
    "Connection state and reconnect handling",
    "Presence and typing indicators",
    "Read receipts",
    "Client state management with Zustand",
  ],
  architecture: {
    flow: [
      {
        name: "React client (Vite)",
        detail:
          "Zustand stores hold session, conversation list and message pages; the socket is a single long-lived connection owned by one store.",
      },
      {
        name: "HTTP API + Socket.IO",
        detail:
          "Two transports, one authorization model: the same token authenticates HTTP requests and socket connections.",
      },
      {
        name: "Express backend",
        detail:
          "Routing, authentication middleware, Zod validation and error mapping. Controllers stay thin.",
      },
      {
        name: "Business logic",
        detail:
          "Conversation resolution, participant checks, and the order of operations for a send: validate, persist, then broadcast.",
      },
      {
        name: "Prisma",
        detail:
          "Typed data access and migrations; the schema is the contract between application code and the database.",
      },
      {
        name: "PostgreSQL",
        detail:
          "Durable store for users, conversations, participants and messages, with the constraints that make duplicate threads impossible.",
      },
    ],
    services: [
      {
        name: "Redis",
        detail:
          "Holds presence, session and rate-limit state, so ephemeral data never has to live in the message store. It is not the message store — PostgreSQL is.",
      },
      {
        name: "Docker",
        detail:
          "PostgreSQL and Redis run as containers locally, so the development environment matches the intended deployment shape.",
      },
    ],
    note: "Redis carries presence, session and rate-limit state; PostgreSQL keeps the conversation. A Redis-backed Socket.IO adapter is the remaining step once more than one instance runs.",
  },
  githubUrl: "https://github.com/yemizerfe/weTalk",
  liveUrl: undefined,
  caseStudy: [
    {
      kind: "prose",
      id: "overview",
      title: "Overview",
      description: "A one-to-one messenger, and the state problem underneath it.",
      paragraphs: [
        "weTalk is a one-to-one messaging application: accounts, conversations, and messages that arrive live on the other person's screen. Deliberately narrow — no groups, no channels — because one-to-one is enough to raise the question the project exists to answer.",
        "That question is where the truth lives. A socket connection is fast and forgetful, a database is slow and permanent, and both clients hold their own copy of the same conversation. Everything interesting in this build follows from deciding which of them is allowed to be right.",
      ],
    },
    {
      kind: "prose",
      id: "problem",
      title: "Problem",
      paragraphs: [
        "Real-time messaging looks simple until messages must survive reconnects, remain in order, and stay private between the two people involved.",
        "The temptation is to let the live connection carry the conversation, because it already has the data in memory. That design fails quietly: a refresh loses what was never stored, a reconnect leaves a hole in the history, and a retried send creates a second copy of a message the recipient already read.",
      ],
    },
    {
      kind: "prose",
      id: "solution",
      title: "Solution",
      paragraphs: [
        "PostgreSQL, reached through Prisma, is the single source of truth; Socket.IO is a transport that tells the other client something changed. A send is validated, persisted, and only then broadcast, so the realtime layer can fail without losing data.",
        "Both transports share one authorization model. The same token that authenticates an HTTP request authenticates the socket handshake, and every read of a conversation is checked against the participants on the server rather than trusted from the client.",
      ],
    },
    {
      kind: "list",
      id: "features",
      title: "Key features",
      description: "What the application does, stated as narrowly as it is built.",
      items: [
        "Accounts and authentication — Registration, sign-in and a session that survives a page reload.",
        "One-to-one conversations — Two participants per conversation, and the server decides whether the caller is one of them.",
        "Real-time delivery — Messages appear on the recipient's screen over Socket.IO rather than after a poll.",
        "Persistent history — Messages are stored in PostgreSQL, so a refresh shows the conversation instead of losing it.",
        "Cursor-based history — Older messages are paged backwards from a stable cursor rather than an offset.",
        "Per-conversation authorization — Membership is enforced in the backend on every read, not inferred from the interface.",
        "Authenticated realtime connections — The socket handshake carries a token, and an unauthenticated connection is refused.",
        "Message ordering — A message carries its own ordering position, so the displayed order is a property of the data.",
        "Client state management — Zustand keeps session, conversation list and message pages separate, so a socket event updates one store rather than everything.",
        "Connection state — The client knows whether it is connected, and shows it, instead of silently queueing input.",
      ],
    },
    {
      kind: "architecture",
      id: "architecture",
      title: "Architecture",
      description:
        "Two transports over one authorization model, with one component allowed to hold the truth.",
      architecture: {
        flow: [
          {
            name: "React client (Vite)",
            detail:
              "Zustand stores hold session, conversation list and message pages; the socket is a single long-lived connection owned by one store.",
          },
          {
            name: "HTTP API + Socket.IO",
            detail:
              "Two transports, one authorization model. The same token authenticates an HTTP request and a socket connection.",
          },
          {
            name: "Express backend",
            detail:
              "Routing, authentication middleware, Zod validation and error mapping. Controllers stay thin.",
          },
          {
            name: "Business logic",
            detail:
              "Conversation resolution, participant checks, and the order of operations for a send: validate, persist, then broadcast.",
          },
          {
            name: "Prisma",
            detail:
              "Typed data access and migrations; the schema is the contract between application code and the database.",
          },
          {
            name: "PostgreSQL",
            detail:
              "Durable store for users, conversations, participants and messages, with the constraints that make duplicate threads impossible.",
          },
        ],
        services: [
          {
            name: "Redis",
            detail:
              "Presence, session and rate-limit state. It carries delivery state, never history.",
          },
          {
            name: "Docker",
            detail:
              "PostgreSQL and Redis run as containers locally, so the development environment matches the intended deployment shape.",
          },
        ],
        note: "PostgreSQL is the persistent source of truth. Socket.IO is a notification channel: if it stops, the conversation is still there on reload.",
      },
    },
    {
      kind: "flow",
      id: "realtime-flow",
      title: "Realtime message flow",
      description:
        "What happens between one person pressing send and the other seeing it.",
      steps: [
        {
          name: "User A sends",
          detail:
            "The client validates the message locally so the user gets immediate feedback, then hands it to the socket with its token.",
        },
        {
          name: "Connection",
          detail:
            "The message travels over the existing long-lived connection rather than opening a new request, which is what makes it feel immediate.",
        },
        {
          name: "Authentication",
          detail:
            "The connection was authenticated at handshake time. An unauthenticated socket never established, so this path cannot be reached anonymously.",
        },
        {
          name: "Validation",
          detail:
            "The payload is parsed with Zod. Anything that does not match the schema is rejected here, before it can reach the database.",
        },
        {
          name: "Authorization",
          detail:
            "The sender is checked against the conversation's participants. Holding a valid token is not the same thing as permission to write to this conversation.",
        },
        {
          name: "Persistence",
          detail:
            "The message is written to PostgreSQL through Prisma with its ordering position. This is the moment the message becomes real.",
        },
        {
          name: "Realtime event",
          detail:
            "Only after the write succeeds is the event emitted to the conversation's participants, carrying the stored message rather than the client's optimistic copy.",
        },
        {
          name: "User B",
          detail:
            "The recipient's client receives the event, appends the stored message to the right conversation, and the interface updates.",
        },
      ],
      note: "Two consequences follow from this order: a client that disconnects mid-send loses nothing, and a client that never receives the event still finds the message on its next history read — because the database, not the socket, was what got updated. What this design deliberately does not offer is delivery confirmation: there is no read receipt or delivery acknowledgement, so the sender's sense of 'delivered' means the server accepted the write.",
    },
    {
      kind: "database",
      id: "database",
      title: "Database design",
      description:
        "A conceptual view of the entities the application is about, and the constraints that hold them together.",
      diagram: {
        root: {
          name: "User",
          detail:
            "The anchor for authentication and for every authorization decision: a request is only ever allowed to touch conversations this user participates in.",
        },
        relations: [
          {
            name: "Credential",
            cardinality: "one-to-one",
            detail:
              "A password is stored as a bcrypt hash and never as plaintext. The record exists so authentication never has to trust anything a client asserts about identity.",
          },
          {
            name: "Participant",
            cardinality: "join",
            detail:
              "The join between users and conversations, kept explicit rather than hidden. Expressing it as data is what lets the schema guarantee a conversation has exactly two participants and stop a duplicate pair from being created twice.",
          },
          {
            name: "Conversation",
            cardinality: "many-to-many",
            detail:
              "A conversation is defined by its participants rather than owned by one of them, so one account being removed cannot silently take the other person's history with it.",
          },
          {
            name: "Message",
            cardinality: "one-to-many",
            detail:
              "A message belongs to exactly one conversation and one author, and carries its own ordering position and creation time — so the order the interface shows is a property of the stored data rather than of arrival timing.",
          },
        ],
        note: "These are domain concepts and their relationships. Exact columns, indexes and migration contents are implementation detail and are not published here, and no real user data appears anywhere in this case study.",
      },
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
            "Where identity is established, and the only place a password is handled.",
          capabilities: [
            "Register an account, with the password hashed before it is stored",
            "Sign in and receive a token for subsequent requests",
            "Resolve the current user from a token on protected requests",
            "Stable error responses for bad credentials, without revealing which part was wrong",
          ],
        },
        {
          area: "Conversations",
          methods: ["GET", "POST"],
          summary:
            "One-to-one threads between two participants, resolved on the server rather than by the client.",
          capabilities: [
            "List the conversations the authenticated user participates in",
            "Open the conversation between two people, reusing it instead of creating a duplicate",
            "Refuse a caller who is not a participant",
          ],
        },
        {
          area: "Message history",
          methods: ["GET"],
          summary:
            "Durable history reads that do not depend on the realtime connection being alive.",
          capabilities: [
            "Page older messages backwards from a stable cursor",
            "Return the same stored record the realtime event carries",
            "Scope every read to the participants of the conversation",
          ],
        },
        {
          area: "Realtime channel",
          methods: ["WS"],
          summary:
            "The live transport. It delivers events; it is not a source of history.",
          capabilities: [
            "Authenticate the connection during the handshake",
            "Accept a validated message and persist it before any event is emitted",
            "Emit the stored message to the conversation's participants",
            "Surface connection state to the client rather than failing silently",
          ],
        },
      ],
      note: "Deliberately conceptual. This section describes what each part of the backend is responsible for; route paths, event names, payload shapes, hostnames and configuration values are not published here.",
    },
    {
      kind: "tabs",
      id: "security",
      title: "Authentication & security",
      description:
        "Four mechanisms, each doing one job. Expand a tab for how it is applied.",
      tabs: [
        {
          label: "Tokens",
          heading: "JWT for both transports",
          paragraphs: [
            "Authentication is stateless: the server issues a signed token, and every subsequent request presents it. One token model covers the REST surface and the socket connection, so there is no second authentication scheme to keep in step.",
          ],
          items: [
            "Issued on sign-in and required on protected resources",
            "Verified on each request before the handler runs",
            "Verified again during the socket handshake, so a connection is authenticated before it can send anything",
            "Signing material lives in environment configuration and is never committed or published",
          ],
        },
        {
          label: "Passwords",
          heading: "bcrypt hashing",
          paragraphs: [
            "Passwords are hashed with bcrypt and the hash is the only thing stored. A comparison happens against the hash, so the application never needs to hold the original value after registration.",
          ],
          items: [
            "A slow, salted hash rather than a general-purpose digest",
            "The stored value is never returned by any endpoint",
            "Sign-in failures return one message, so the response does not confirm whether an account exists",
          ],
        },
        {
          label: "Validation",
          heading: "Zod at every boundary",
          paragraphs: [
            "Both transports pass through the same validation approach. The schema is the definition of what the backend accepts, and anything that does not satisfy it is rejected at the edge.",
          ],
          items: [
            "Request bodies parsed against a schema before the handler sees them",
            "Message payloads validated on the realtime path as well as the HTTP path",
            "Rejected input returns a stable error shape rather than an exception trace",
            "The same rules are reused on the client for immediate feedback — the server remains the authority",
          ],
        },
        {
          label: "Authorization",
          heading: "Membership, checked server-side",
          paragraphs: [
            "A valid token proves who is asking, not what they may read. Every conversation read and write is checked against the participants, so two users can never see each other's threads.",
          ],
          items: [
            "Conversation membership enforced in the backend on every access",
            "The realtime path checked as strictly as the HTTP path",
            "A user's own resources only — no client-supplied identifier is trusted as permission",
            "The interface may hide a conversation, but hiding it is not the boundary",
          ],
        },
      ],
      note: "This page describes mechanisms, not material. No token, hash, key, secret or configuration value appears anywhere in this case study.",
    },
    {
      kind: "challenges",
      id: "challenges",
      title: "Technical challenges",
      description:
        "The problems this project was actually about, and what was done about each.",
      items: [
        {
          challenge: "Keeping the socket from quietly becoming the database",
          approach:
            "The order of operations is fixed in the business logic: validate, persist, then broadcast. The emitted event carries the record the database returned rather than the payload the client sent.",
          result:
            "Realtime is a notification channel. If the connection drops mid-send nothing is lost, and a client that misses an event finds the message on its next history read.",
        },
        {
          challenge: "Authenticating a connection that is not a request",
          approach:
            "Expressing authentication as middleware is easy for HTTP and easy to forget for a socket, because a socket has no per-request headers. The token is therefore verified during the handshake, and a connection without a valid one is refused before it is established.",
          result:
            "There is no anonymous socket to send on, so the realtime path starts from an authenticated identity rather than from an assumption.",
        },
        {
          challenge: "Two clients holding two copies of one conversation",
          approach:
            "The server decides order: each message is assigned its position when it is stored. The client shows an optimistic entry immediately and then reconciles it with the stored record when it arrives.",
          result:
            "The order two people see is a property of the stored data instead of a race between two networks, and a fast connection cannot reorder history.",
        },
        {
          challenge: "A retried send creating a second message",
          approach:
            "There is exactly one place a message is created — the backend, after validation. The client never appends a message to durable history on its own authority.",
          result:
            "Retries and repeated submissions produce one stored message, so a flaky connection cannot duplicate a conversation.",
        },
        {
          challenge: "Connection lifecycle across sleep, network loss and refresh",
          approach:
            "One long-lived connection is owned by one store, connection state is explicit in the interface, and a re-established connection re-reads history from the database rather than trusting what the client held in memory.",
          result:
            "A reconnecting client re-synchronises from the source of truth, so a gap in events cannot become a gap in the conversation.",
        },
        {
          challenge: "Deciding where Redis actually earns its place",
          approach:
            "Redis is used for the data that should not be a database row: presence, session and rate-limit state, all of it expiring by nature. Message history stays in PostgreSQL, and the socket layer reads presence from Redis rather than querying the message store.",
          result:
            "Ephemeral state evicts itself instead of accumulating in the permanent store, and the boundary is explicit: Redis carries delivery and presence, PostgreSQL keeps history.",
        },
      ],
    },
    {
      kind: "code",
      id: "code",
      title: "Implementation details",
      description:
        "Three short samples showing the patterns above. No routes, tokens, secrets or configuration values appear here.",
      snippets: [
        {
          language: "typescript",
          filename: "realtime/socket-auth.ts",
          code: `// The realtime path is authenticated at the handshake, before the
// connection exists. An invalid token never gets a socket.
io.use(async (socket, next) => {
  try {
    const claims = await verifyAccessToken(socket.handshake.auth.token);
    socket.data.userId = claims.sub;
    next();
  } catch {
    next(new Error("unauthorized"));
  }
});`,
          caption:
            "The same token model as the REST surface. Verification is delegated to one function, so the signing material itself is never handled by this layer.",
        },
        {
          language: "typescript",
          filename: "messages/create-message.ts",
          code: `// Validate, authorise, persist, then broadcast — in that order.
const body = messageSchema.parse(payload);

await assertParticipant(conversationId, currentUserId);

const stored = await prisma.message.create({
  data: { conversationId, authorId: currentUserId, body },
});

io.to(conversationId).emit("message", stored);`,
          caption:
            "The emitted payload is the stored record, so the recipient's client appends the same row the database holds. If the emit fails, the message still exists.",
        },
        {
          language: "typescript",
          filename: "validation/message-schema.ts",
          code: `import { z } from "zod";

export const messageSchema = z.object({
  body: z.string().trim().min(1).max(4000),
});`,
          caption:
            "One schema defines what the backend accepts. Trimming and a length bound are enforced on the server, so a client bypassing the interface gains nothing.",
        },
      ],
    },
    {
      kind: "compare",
      id: "performance",
      title: "Performance & scalability",
      description:
        "What the application does today, and what would be added to run more than one instance.",
      columns: [
        {
          label: "Implemented now",
          summary:
            "A single-instance design where the cost that matters is per-connection work and per-read work, not throughput.",
          items: [
            "Stateless HTTP handlers, so an instance can be replaced without losing sessions",
            "Cursor pagination instead of offsets, so a deep history page costs the same as a shallow one",
            "One history query per page rather than a fetch-and-filter in the application",
            "Validation before work, so a rejected message never touches the database",
            "One long-lived connection per client rather than a poll per view",
            "Client state split by concern, so one incoming event updates one store instead of everything",
          ],
        },
        {
          label: "Designed for scale",
          status: "planned",
          summary:
            "The steps that become necessary the moment a second instance exists.",
          items: [
            "Shared socket session and adapter state so an event reaches the instance holding the recipient's connection",
            "More than one API instance behind a load balancer",
            "Connection pooling for the Redis client once several instances share it",
            "Backpressure on the socket so one slow client cannot consume an instance",
          ],
        },
      ],
      note: "No message throughput, latency or concurrency figures are quoted. None were measured for publication, and an invented number here would weaken every other claim on this page.",
    },
    {
      kind: "accordion",
      id: "testing",
      title: "Testing",
      description:
        "What is tested, and why. Expand each item for the specific paths.",
      items: [
        {
          title: "Validation schemas",
          body: "The schema is the definition of what the backend accepts, so it is tested as a unit before anything is wired to it.",
          points: [
            "Empty, whitespace-only and over-length message bodies asserted to be rejected",
            "Valid payloads asserted to pass unchanged, so the schema is not silently rewriting data",
            "The same rules exercised on the realtime path, not only the HTTP path",
          ],
        },
        {
          title: "Authorization",
          body: "The rule that matters most is the one preventing two users from reading each other's threads, so it is tested with explicit actor-and-conversation combinations.",
          points: [
            "A non-participant asserted to be refused on read and on write",
            "A missing and an invalid token asserted to fail closed on both transports",
            "The refusal checked to be a client error rather than a server error",
          ],
        },
        {
          title: "The order of operations",
          body: "Validate, persist, then broadcast is the central claim of the design, so it is asserted rather than assumed.",
          points: [
            "A failed validation asserted to leave no stored message and emit no event",
            "A successful send asserted to produce exactly one stored record",
            "A repeated send asserted not to duplicate the conversation",
          ],
        },
        {
          title: "Failure paths",
          body: "The happy path is covered by using the application; the tests concentrate on what happens when something fails.",
          points: [
            "A dropped connection mid-send leaves the stored data consistent",
            "A reconnect re-reads history rather than replaying what the client held",
            "Malformed and oversized payloads produce a stable error, not an exception trace",
          ],
        },
      ],
    },
    {
      kind: "compare",
      id: "deployment",
      title: "Deployment",
      description:
        "What runs today, and the intended path for a public deployment. No host, port or credential is listed.",
      columns: [
        {
          label: "Implemented",
          summary:
            "A containerised local environment that mirrors the intended production shape.",
          items: [
            "Backend, PostgreSQL and Redis run together under Docker Compose",
            "Environment-based configuration, so no credential lives in the repository",
            "Schema migrations applied deliberately through Prisma",
            "The client built as static assets by Vite",
          ],
        },
        {
          label: "Intended, not yet exercised",
          status: "planned",
          summary:
            "Discussed and planned, but there is no public deployment of this project, so no demo link is offered.",
          items: [
            "Nginx as a reverse proxy in front of the API",
            "Backend hosting on a managed container platform",
            "Frontend hosting for the built client",
            "TLS termination at the edge",
            "A Redis-backed socket adapter once more than one instance runs",
          ],
        },
      ],
      note: "Hostnames, ports, connection details and credentials are deliberately absent. Publishing how to reach a running system is not part of describing how it was built.",
    },
    {
      kind: "decisions",
      id: "decisions",
      title: "Engineering decisions",
      description:
        "Each decision states what was chosen, why, what it costs, and what it buys.",
      items: [
        {
          technology: "PostgreSQL + Prisma",
          question: "The database is the source of truth, not the socket",
          context: "Message persistence and history",
          why: "A messaging application is a history application. The connection is the fastest way to tell someone something changed, and the worst place to keep the only copy of what changed.",
          tradeoff: "Every send pays a database write before the recipient can see it, so latency is bounded by the write rather than by the network.",
          result: "Refreshing, reconnecting or restarting the server loses nothing, and history is a query instead of a client-side memory.",
        },
        {
          technology: "Prisma",
          question: "A typed schema layer instead of hand-written SQL",
          context: "Data access and migrations",
          why: "Conversation, participant and message queries are the ones where a mistyped column or a forgotten relation is easiest to miss. Generating types from the schema turns that class of mistake into a compile error.",
          tradeoff: "The schema becomes a dependency: changing it means a migration and a regeneration step, and complex queries are better written outside the generated client.",
          result: "The database shape is declared in one file, and migrations are reviewable rather than improvised.",
        },
        {
          technology: "Socket.IO",
          question: "A managed realtime transport rather than a raw socket or polling",
          context: "Realtime delivery",
          why: "Socket.IO provided reconnection and transport fallback as part of the protocol, which are the two parts of realtime that are most tedious to write correctly and least interesting to reimplement.",
          tradeoff: "A heavier protocol than a bare WebSocket, and its abstractions leak when the application needs to reason about exactly what happens on reconnect.",
          result: "Reconnection and connection state came from the transport, so the effort went into what happens to the data in each case.",
        },
        {
          technology: "Zod",
          question: "One schema library for both transports",
          context: "Input validation",
          why: "A socket payload and an HTTP body need the same scrutiny, and having two validation approaches is how one of them ends up weaker. One schema library means the realtime path cannot quietly skip a rule.",
          tradeoff: "Schemas are written twice in spirit — once for the server and once for immediate client feedback — and the two can drift if the client copy is treated as authoritative.",
          result: "The backend is the authority on what a message is, and the client copy is only ever a convenience.",
        },
        {
          technology: "Zustand",
          question: "Small, separate stores instead of one application store",
          context: "Client state",
          why: "Session, conversation list and message pages change for different reasons and at different rates. Keeping them apart means an incoming message updates the pages it belongs to and not the session.",
          tradeoff: "More wiring between stores at the points where they genuinely interact, such as a new conversation arriving.",
          result: "Realtime updates have a narrow blast radius, which is what keeps the interface responsive while events arrive.",
        },
      ],
    },
    {
      kind: "accordion",
      id: "lessons",
      title: "Lessons learned",
      description:
        "What building this changed about how the next realtime feature starts. Expand for detail.",
      items: [
        {
          title: "The order of operations is the design",
          body: "Most of this project's correctness comes from one sentence: validate, authorise, persist, then broadcast.",
          points: [
            "Choosing the broadcast last makes every failure mode a latency problem instead of a data-loss problem",
            "Writing that order down made it testable, which is how it stayed true as the code grew",
          ],
        },
        {
          title: "Authentication is not authorization",
          body: "A valid token tells you who is asking. It says nothing about what they may read.",
          points: [
            "Treating conversation membership as a separate check is what keeps one person's history out of another's list",
            "The realtime path needed the same check as HTTP, and it was easy to forget precisely because it is not a request",
          ],
        },
        {
          title: "A connection is not a place to keep state",
          body: "Anything that only exists in a socket is lost at the least convenient moment.",
          points: [
            "Re-reading from the database on reconnect removed a whole category of subtle divergence",
            "Being explicit about connection state in the interface stopped the app from silently pretending to be online",
          ],
        },
        {
          title: "Keep ephemeral state out of the permanent store",
          body: "Presence and typing state change constantly and are worthless a minute later; putting them in the same store as messages makes every one of those changes a write to the durable record.",
          points: [
            "Separating presence and session state into Redis keeps the PostgreSQL workload about conversations",
            "The boundary is explicit: losing Redis costs live presence, never a message",
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
        "Labelled as future work. None of this is claimed as built.",
      items: [
        "Additional messaging functionality — A wider set of message capabilities on top of the same validated, persisted, broadcast pipeline.",
        "Improved realtime reliability — Retry and acknowledgement behaviour around the realtime path, so the sender has a clearer picture than 'the server accepted the write'.",
        "More advanced conversation features — Richer conversation management while keeping the one-to-one scope that the data model is built on.",
        "Multi-instance delivery — Adding the Redis-backed Socket.IO adapter so more than one API instance can run; presence and session state already live in Redis.",
        "Presence and connection insight — Surfacing connection state more usefully, without turning it into a claim about the other person's behaviour.",
        "Test depth on the realtime path — Extending the failure-path coverage around reconnection and repeated sends.",
      ],
    },
    {
      kind: "stack",
      id: "technology-stack",
      title: "Technology stack",
      description:
        "Everything here is in use in the build, with state and delivery grouped separately from storage.",
      groups: [
        {
          label: "Frontend",
          items: [
            "React 18",
            "TypeScript",
            "Vite",
            "Zustand",
            "Tailwind CSS",
            "Socket.IO client",
          ],
        },
        {
          label: "Backend",
          items: [
            "Node.js",
            "Express",
            "Socket.IO",
            "REST APIs",
            "JWT",
            "bcrypt",
            "Zod",
          ],
        },
        {
          label: "Data",
          items: ["PostgreSQL", "Prisma", "Relational data modelling", "Migrations"],
        },
        {
          label: "Platform",
          items: ["Docker", "Docker Compose", "Environment-based configuration"],
        },
        {
          label: "State & delivery",
          items: ["Redis", "Presence tracking", "Session state"],
        },
      ],
    },
  ],
};
