import { accentFor } from "@/lib/accents";
import { cn } from "@/lib/utils";
import { skillCategories } from "@/data/engineering";
import { projects } from "@/data/projects";

/**
 * Infinite technology rail.
 *
 * Every name on the rail comes from the site's own data — the backend stacks of
 * the four projects first, then the disciplines that are actually implemented —
 * so the rail is a faster way to read the same list, not a decorative wall of
 * logos nobody can be held to. Nothing here is invented and nothing is added
 * that is not already claimed (and evidenced) elsewhere on the page.
 *
 * Each chip takes its hue from its own name through the shared accent palette,
 * which is why the row is colourful while still reading as one palette.
 *
 * How the loop works: the list is rendered twice, each copy carries the same
 * trailing margin, and the track translates by exactly half its own width. The
 * seam therefore lands on a copy boundary and is never visible. The animation
 * is CSS-only, pauses on hover or keyboard focus so the rail can be read, and
 * is frozen entirely for `prefers-reduced-motion`.
 */

/** Project backend stacks first: the things that are actually running. */
const railItems = Array.from(
  new Set([
    ...projects.flatMap((project) => project.backendStack),
    ...skillCategories.flatMap((category) => category.items),
  ]),
);

interface TechMarqueeProps {
  /** Seconds for one full pass. Longer reads calmer. */
  duration?: number;
  label?: string;
  className?: string;
}

export function TechMarquee({
  duration = 75,
  label = "Built with",
  className,
}: TechMarqueeProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-3">
        <span className="eyebrow whitespace-nowrap">{label}</span>
        <span aria-hidden="true" className="gradient-line h-px flex-1" />
      </div>

      <div
        className="marquee"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? "true" : undefined}
              className="flex items-center"
            >
              {railItems.map((item) => {
                const accent = accentFor(item);

                return (
                  <li
                    key={item}
                    className="mr-3 flex shrink-0 items-center gap-2 rounded-full border border-border bg-secondary/30 px-3 py-1.5 font-mono text-[11px] tracking-tight text-muted-foreground transition-colors duration-200 hover:border-border-strong hover:text-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className={cn("size-1.5 rounded-full", accent.mark)}
                    />
                    {item}
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
