import type { FlowStep } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface FlowStepsProps {
  steps: FlowStep[];
  note?: string;
  className?: string;
  /** Header label above the sequence. */
  label?: string;
}

/**
 * An ordered sequence where the order is the meaning.
 *
 * A real ordered list rather than a picture: the numbering survives without
 * styling, the connectors are decorative, and the whole flow stays readable at
 * 375px instead of being scaled down into an image.
 */
export function FlowSteps({
  steps,
  note,
  className,
  label = "Order of operations",
}: FlowStepsProps) {
  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <p className="eyebrow mb-5">{label}</p>

        <ol className="relative flex flex-col">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;

            return (
              <li key={step.name} className="relative flex gap-4 pb-5 last:pb-0">
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

                <div className="flex flex-col gap-1 pb-2">
                  <h3 className="text-sm font-medium tracking-tight text-foreground">
                    {step.name}
                  </h3>
                  <p className="max-w-prose text-[13px] leading-relaxed text-muted-foreground">
                    {step.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {note ? (
        <figcaption className="text-[12.5px] leading-relaxed text-foreground-subtle">
          {note}
        </figcaption>
      ) : null}
    </figure>
  );
}
