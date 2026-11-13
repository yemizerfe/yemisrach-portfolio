import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Backend-system backdrop: a connected-dot graph carrying the symbols that show
 * up in a server-side design — database, cache, queue, workers, event stream,
 * metrics, auth, API, CDN — so the background reads as a system diagram rather
 * than as decoration.
 *
 * Decorative only: the wrapper is aria-hidden and pointer-events-none, and this
 * is a server component, so it adds nothing to the client bundle. The only
 * motion is a CSS dash animation over the connector lines, which the global
 * prefers-reduced-motion rule already disables.
 *
 * Every coordinate is fixed, and the scattered "dust" dots come from a seeded
 * generator, so the markup is identical on each render: no hydration mismatch
 * and no layout shift. Colours come from the navy design tokens, so the
 * backdrop can never drift away from the theme.
 */

export type GraphVariant = "page" | "hero";

type GraphSymbol =
  | "database"
  | "server"
  | "cloud"
  | "shield"
  | "lock"
  | "code"
  | "cpu"
  | "queue"
  | "cache"
  | "stream"
  | "chart"
  | "globe";

interface GraphNode {
  id: string;
  x: number;
  y: number;
  /** Draws a 24×24 line glyph at this point instead of a plain dot. */
  symbol?: GraphSymbol;
  /** Brighter dot: a node an actual signal passes through. */
  accent?: boolean;
  pulse?: boolean;
}

const nodes: GraphNode[] = [
  { id: "client", x: 80, y: 300, accent: true, pulse: true },
  { id: "cdn", x: 140, y: 100, symbol: "globe" },
  { id: "gateway", x: 210, y: 280, accent: true },
  { id: "server", x: 190, y: 480, symbol: "server" },
  { id: "api", x: 390, y: 330, symbol: "code", pulse: true },
  { id: "auth", x: 400, y: 130, symbol: "lock" },
  { id: "shield", x: 540, y: 120, symbol: "shield" },
  { id: "bus", x: 360, y: 470, accent: true, pulse: true },
  { id: "logs", x: 430, y: 650 },
  { id: "spare", x: 545, y: 650 },
  { id: "cache", x: 600, y: 270, symbol: "cache" },
  { id: "queue", x: 620, y: 470, symbol: "queue" },
  { id: "db", x: 720, y: 105, symbol: "database", accent: true },
  { id: "metrics", x: 700, y: 660, symbol: "chart" },
  { id: "replicas", x: 830, y: 245, symbol: "database" },
  { id: "workers", x: 840, y: 480, symbol: "cpu" },
  { id: "stream", x: 1010, y: 300, symbol: "stream" },
  { id: "cloud", x: 1020, y: 140, symbol: "cloud" },
  { id: "sink", x: 1120, y: 470 },
];

/** [from, to, animated?] — the animated ones carry the request/signal flow. */
const edges: [string, string, boolean?][] = [
  ["client", "gateway"],
  ["cdn", "gateway"],
  ["gateway", "api"],
  ["gateway", "bus", true],
  ["api", "server"],
  ["api", "auth"],
  ["api", "shield"],
  ["api", "cache", true],
  ["api", "queue", true],
  ["api", "logs"],
  ["cache", "db"],
  ["cache", "replicas"],
  ["db", "replicas"],
  ["shield", "db"],
  ["bus", "queue", true],
  ["queue", "workers", true],
  ["queue", "metrics"],
  ["workers", "replicas"],
  ["workers", "stream", true],
  ["replicas", "cloud"],
  ["stream", "metrics"],
  ["stream", "sink"],
  ["logs", "spare"],
  ["logs", "metrics"],
  ["server", "bus"],
  ["client", "server"],
];

const nodeById = new Map(nodes.map((node) => [node.id, node]));


/**
 * Seeded scatter for the background "constellation" dots.
 *
 * A plain LCG keeps the positions stable between renders and between server and
 * client, which a Math.random() call would not.
 */
function scatter(count: number, seed: number) {
  let state = seed;
  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  return Array.from({ length: count }, (_, index) => ({
    id: index,
    x: Math.round(next() * 1200),
    y: Math.round(next() * 800),
    r: Number((1.1 + next() * 1.5).toFixed(1)),
    delay: Number((next() * 4).toFixed(2)),
  }));
}

/** Fixed seed: the pattern is part of the design, not a random effect. */
const dust = scatter(44, 20240517);

/**
 * Mesh links between the scattered dots: each dot joins the dot five along, so
 * the result is a loose web rather than a random scribble. The filter keeps the
 * last few dots from pointing past the end of the list.
 */
const dustLinks = dust
  .map((from, index) => ({ key: from.id, from, to: dust[index + 5] }))
  .filter((link) => Boolean(link.to));


/**
 * Line glyphs in a 24×24 box, Lucide-compatible geometry so they sit beside the
 * icons used in the rest of the site without looking like a different set.
 */
const glyphs: Record<GraphSymbol, ReactNode> = {
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </>
  ),
  server: (
    <>
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <path d="M6 6h.01" />
      <path d="M6 18h.01" />
    </>
  ),
  cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
  shield: (
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  code: (
    <>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </>
  ),
  cpu: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
    </>
  ),
  queue: (
    <>
      <path d="M3 6h12M3 12h12M3 18h12" />
      <path d="M19 6h2M19 12h2M19 18h2" />
    </>
  ),
  cache: (
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14Z" />
  ),
  stream: (
    <path d="M22 12h-2.5a2 2 0 0 0-1.9 1.4l-2.4 8.4a.25.25 0 0 1-.5 0L9.3 2.2a.25.25 0 0 0-.5 0L6.4 10.6A2 2 0 0 1 4.5 12H2" />
  ),
  chart: (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="m19 9-5 5-4-4-3 3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15 15 0 0 0 0 20 15 15 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>
  ),
};

const variantStyles: Record<GraphVariant, string> = {
  /** Site-wide wash: present everywhere, never loud enough to fight the copy. */
  page: "opacity-[0.7] [mask-image:radial-gradient(125%_95%_at_50%_0%,black,transparent_88%)]",
  /** Hero wash: brighter, with the mask spread so the graph spans the hero. */
  hero: "opacity-[0.85] [mask-image:radial-gradient(90%_80%_at_50%_30%,black,transparent)]",
};

interface BackendGraphBackdropProps {
  /** `page` for the fixed site backdrop, `hero` for the home-section wash. */
  variant?: GraphVariant;
  className?: string;
}

export function BackendGraphBackdrop({
  variant = "page",
  className,
}: BackendGraphBackdropProps) {
  const washId = `graph-wash-${variant}`;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        variantStyles[variant],
        className,
      )}
    >
      <svg
        className="size-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={washId} cx="52%" cy="16%" r="78%">
            <stop
              offset="0%"
              stopColor="var(--color-accent-violet)"
              stopOpacity="0.16"
            />
            <stop
              offset="55%"
              stopColor="var(--color-accent-cyan)"
              stopOpacity="0.05"
            />
            <stop
              offset="100%"
              stopColor="var(--color-accent-cyan)"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        {/* Navy base wash: keeps the pattern sitting inside the palette. */}
        <rect
          width="1200"
          height="800"
          fill="var(--color-surface-raised)"
          opacity="0.55"
        />
        <rect width="1200" height="800" fill={`url(#${washId})`} />

        {/* Boundary rings — the "trust zone" idea, drawn but not labelled. */}
        <g stroke="var(--color-accent-cyan)" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="2 12">
          <circle cx="620" cy="380" r="370" />
          <circle cx="400" cy="360" r="195" />
          <circle cx="850" cy="300" r="230" />
        </g>

        {/* Background constellation: loose dots joined into a wide mesh. */}
        <g stroke="var(--color-border-strong)" strokeOpacity="0.35">
          {dustLinks.map((link) => (
            <line
              key={`dust-link-${link.key}`}
              x1={link.from.x}
              y1={link.from.y}
              x2={link.to.x}
              y2={link.to.y}
            />
          ))}
        </g>

        {/* Background dots. Only every third one breathes: enough life to read as
            a live system, few enough elements re-painting each frame. */}
        <g fill="var(--color-accent-violet)">
          {dust.map((dot, index) => {
            const animated = index % 3 === 0;
            return (
              <circle
                key={`dust-${dot.id}`}
                cx={dot.x}
                cy={dot.y}
                r={dot.r}
                fillOpacity="0.22"
                className={animated ? "animate-node-pulse" : undefined}
                style={animated ? { animationDelay: `${dot.delay}s` } : undefined}
              />
            );
          })}
        </g>

        {/* Connectors. Percent-free coordinates: the graph scales as a whole. */}
        <g strokeWidth="1">
          {edges.map(([fromId, toId, animated]) => {
            const from = nodeById.get(fromId);
            const to = nodeById.get(toId);
            if (!from || !to) return null;

            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={animated ? "var(--color-accent-cyan)" : "var(--color-border-strong)"}
                strokeOpacity={animated ? 0.55 : 0.55}
                strokeDasharray={animated ? "4 10" : undefined}
                className={animated ? "animate-signal-flow" : undefined}
              />
            );
          })}
        </g>

        {/* Nodes. */}
        <g>
          {nodes.map((node) => (
            <g key={node.id}>
              {node.accent ? (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="10"
                  fill="var(--color-accent-violet)"
                  fillOpacity="0.14"
                  className="animate-node-pulse"
                />
              ) : null}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.accent ? 2.6 : 2}
                fill={
                  node.accent
                    ? "var(--color-accent-cyan-soft)"
                    : "var(--color-accent-violet)"
                }
                fillOpacity={node.accent ? 0.75 : 0.45}
              />
            </g>
          ))}
        </g>

        {/* Backend glyphs. */}
        <g
          stroke="var(--color-accent-cyan-soft)"
          strokeWidth="1.15"
          strokeOpacity="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {nodes
            .filter((node) => node.symbol)
            .map((node) => (
              <g
                key={`glyph-${node.id}`}
                transform={`translate(${node.x} ${node.y}) scale(1.05) translate(-12 -12)`}
              >
                {glyphs[node.symbol as GraphSymbol]}
              </g>
            ))}
        </g>
      </svg>
    </div>
  );
}
