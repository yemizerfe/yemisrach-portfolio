import type { Architecture } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface ArchitectureFlowProps {
  architecture: Architecture;
  className?: string;
  /** Case studies use compact nodes; the home section uses the interactive view. */
  size?: "default" | "compact";
}

/**
 * Layered request flow with the supporting services alongside it.
 *
 * Rendered as a semantic ordered list: the vertical order is the meaning, so
 * it must survive without styling — which also means it stays readable on a
 * narrow screen instead of being scaled down into an image.
 */
export function ArchitectureFlow({
  architecture,
  className,
  size = "default",
}: ArchitectureFlowProps) {
  const compact = size === "compact";

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]", className)}>
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <p className="eyebrow mb-5">Request path</p>

        <ol className="relative flex flex-col">
          {architecture.flow.map((layer, index) => {
            const isLast = index === architecture.flow.length - 1;

            return (
              <li key={layer.name} className="relative flex gap-4 pb-5 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/60 font-mono text-[10px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {!isLast ? (
                    <span
                      aria-hidden="true"
                      className="mt-1 w-px flex-1 bg-gradient-to-b from-border-strong to-transparent"
                    />
                  ) : null}
                </div>

                <div className={cn("flex flex-col gap-1", compact ? "pb-1" : "pb-2")}>
                  <h4 className="text-sm font-medium tracking-tight text-foreground">
                    {layer.name}
                  </h4>
                  <p className="max-w-prose text-[13px] leading-relaxed text-muted-foreground">
                    {layer.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {architecture.services && architecture.services.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Supporting services</p>
          <ul className="flex flex-col gap-3">
            {architecture.services.map((service) => (
              <li
                key={service.name}
                className="rounded-lg border border-border bg-secondary/20 p-4 transition-colors duration-200 hover:border-border-strong"
              >
                <h4 className="font-mono text-[12px] tracking-tight text-accent-cyan-soft">
                  {service.name}
                </h4>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                  {service.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {architecture.note ? (
        <p className="text-[12.5px] leading-relaxed text-foreground-subtle lg:col-span-2">
          {architecture.note}
        </p>
      ) : null}
    </div>
  );
}
