import type { ApiCapability, ApiMethod } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface ApiCapabilityCardProps {
  capability: ApiCapability;
  className?: string;
}

/**
 * One area of the API surface, described conceptually.
 *
 * The verb chips are generic HTTP verbs on purpose: a reader can see that the
 * area accepts reads and writes without being handed a route to try. Paths,
 * payload shapes and configuration stay out of the published page.
 */
export function ApiCapabilityCard({ capability, className }: ApiCapabilityCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-mono text-[12px] tracking-tight text-foreground">
            {capability.area}
          </h3>
          {capability.methods && capability.methods.length > 0 ? (
            <span className="flex flex-wrap items-center gap-1">
              {capability.methods.map((method) => (
                <MethodChip key={method} method={method} />
              ))}
            </span>
          ) : null}
        </div>
        <p className="text-[12.5px] leading-relaxed text-muted-foreground">
          {capability.summary}
        </p>
      </div>

      <ul className="flex flex-col gap-2.5 border-t border-border pt-4">
        {capability.capabilities.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-[12.5px] leading-relaxed text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground-subtle"
            />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

/** The verb is text inside a bordered chip, so it never depends on colour. */
function MethodChip({ method }: { method: ApiMethod }) {
  const isRealtime = method === "WS";

  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded border px-1.5 font-mono text-[10px] uppercase tracking-[0.1em]",
        isRealtime
          ? "border-accent/30 bg-accent/10 text-accent-soft"
          : "border-border bg-secondary/50 text-muted-foreground",
      )}
    >
      {method}
    </span>
  );
}

interface ApiCapabilityListProps {
  capabilities: ApiCapability[];
  className?: string;
  label?: string;
}

export function ApiCapabilityList({
  capabilities,
  className,
  label = "API areas",
}: ApiCapabilityListProps) {
  return (
    <ul aria-label={label} className={cn("grid gap-4 md:grid-cols-2", className)}>
      {capabilities.map((capability) => (
        <li key={capability.area} className="h-full">
          <ApiCapabilityCard capability={capability} />
        </li>
      ))}
    </ul>
  );
}
