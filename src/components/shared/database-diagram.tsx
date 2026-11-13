import type { DatabaseDiagram as DatabaseDiagramData } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface DatabaseDiagramProps {
  diagram: DatabaseDiagramData;
  className?: string;
  /** Accessible description of the diagram's purpose. */
  caption?: string;
}

/**
 * Simplified entity relationship view: one root entity and the entities that
 * relate to it.
 *
 * It is a nested list rather than an SVG, so the relationships stay legible
 * on a 375px screen and readable by assistive technology. Cardinality is
 * written as text, never implied by line style alone.
 */
export function DatabaseDiagram({
  diagram,
  className,
  caption,
}: DatabaseDiagramProps) {
  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-2 rounded-lg border border-accent/25 bg-accent/[0.06] p-4">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[12px] tracking-tight text-foreground">
              {diagram.root.name}
            </span>
            <span className="eyebrow">root entity</span>
          </div>
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">
            {diagram.root.detail}
          </p>
        </div>

        <ul className="mt-2 flex flex-col border-l border-border pl-5 sm:pl-6">
          {diagram.relations.map((relation) => (
            <li
              key={relation.name}
              className="relative flex flex-col gap-1.5 py-3.5 last:pb-0"
            >
              <span
                aria-hidden="true"
                className="absolute left-[-1.25rem] top-6 h-px w-4 bg-border-strong sm:left-[-1.5rem] sm:w-5"
              />
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] tracking-tight text-foreground">
                  {relation.name}
                </span>
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground-subtle">
                  {relation.cardinality}
                </span>
              </div>
              <p className="max-w-prose text-[12.5px] leading-relaxed text-muted-foreground">
                {relation.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {diagram.note ? (
        <figcaption className="text-[12.5px] leading-relaxed text-foreground-subtle">
          {caption ? <span className="text-muted-foreground">{caption} </span> : null}
          {diagram.note}
        </figcaption>
      ) : null}
    </figure>
  );
}
