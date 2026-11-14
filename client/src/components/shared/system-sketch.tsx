import { Database, Server, Workflow } from "lucide-react";

/**
 * System sketch: a minimal, deliberately abstract diagram of one request path.
 *
 * A request path down the spine with the supporting services beside it. It is
 * decorative rather than informative, so the whole figure is marked aria-hidden
 * and the same information is available as text in the "How I Think About
 * Systems" section.
 *
 * Kept as a server component: the only motion is CSS keyframes on the connector
 * lines, which respects prefers-reduced-motion through the global stylesheet
 * without shipping any JavaScript.
 */

const spine = [
  { name: "client", label: "browser" },
  { name: "api", label: "rest · sockets" },
  { name: "logic", label: "domain rules" },
  { name: "postgres", label: "source of truth" },
];

const branches = [
  { name: "redis", label: "cache-aside", row: 2 },
  { name: "rabbitmq", label: "queued jobs", row: 3 },
  { name: "workers", label: "background", row: 4 },
];

export function SystemSketch() {
  return (
    <figure
      aria-hidden="true"
      className="plate-marks relative overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-foreground-subtle">
          system / request path
        </span>
        <span className="flex items-center gap-1.5">
          <Server className="size-3.5 text-foreground-subtle" />
          <span className="font-mono text-[10.5px] text-foreground-subtle">
            abstract
          </span>
        </span>
      </div>

      <div className="relative aspect-[4/3.4] w-full p-4 sm:p-5">
        {/* Connector lines. Percent coordinates keep them aligned at any width. */}
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {[0, 1, 2].map((row) => {
            const y = 12 + row * 25;
            return (
              <line
                key={`spine-${row}`}
                x1="34"
                y1={y}
                x2="34"
                y2={y + 25}
                stroke="var(--color-border-strong)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          {[1, 2, 3].map((row) => {
            const y = 12 + (row - 1) * 25;
            return (
              <line
                key={`branch-${row}`}
                x1="60"
                y1={y}
                x2="70"
                y2={y}
                stroke="var(--color-accent-cyan)"
                strokeOpacity="0.6"
                strokeWidth="1"
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
                className="animate-signal-flow"
              />
            );
          })}
        </svg>

        {spine.map((node, index) => (
          <div
            key={node.name}
            className="absolute left-[8%] flex w-[52%] items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-2"
            style={{ top: `${4 + index * 25}%` }}
          >
            <span className="font-mono text-[12px] tracking-tight text-foreground">
              {node.name}
            </span>
            <span className="font-mono text-[10px] text-foreground-subtle">
              {node.label}
            </span>
          </div>
        ))}

        {branches.map((branch) => (
          <div
            key={branch.name}
            className="absolute left-[70%] flex w-[26%] flex-col gap-0.5 rounded-lg border border-dashed border-border bg-card px-3 py-2"
            style={{ top: `${4 + (branch.row - 1) * 25}%` }}
          >
            <span className="font-mono text-[11px] tracking-tight text-accent-soft">
              {branch.name}
            </span>
            <span className="font-mono text-[10px] text-foreground-subtle">
              {branch.label}
            </span>
          </div>
        ))}
      </div>

      <figcaption className="flex items-center justify-between border-t border-border px-4 py-3">
        <span className="flex items-center gap-2 font-mono text-[10.5px] text-foreground-subtle">
          <Database className="size-3.5" />
          one definition per metric
        </span>
        <span className="flex items-center gap-2 font-mono text-[10.5px] text-foreground-subtle">
          <Workflow className="size-3.5" />
          slow work off the request path
        </span>
      </figcaption>
    </figure>
  );
}
