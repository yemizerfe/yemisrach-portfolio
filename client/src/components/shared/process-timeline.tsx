import { Reveal } from "@/components/shared/reveal";
import type { ProcessStep } from "@/types/portfolio";
import { accentFor } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

/**
 * The eight-step workflow.
 *
 * Steps are numbered because the order carries meaning; the connector lines
 * are decorative and hidden from assistive technology. Each step number takes
 * the next hue in the accent palette, so the timeline reads as a sequence
 * rather than as eight identical cells.
 */
export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => {
        const accent = accentFor(step.number);

        return (
          <Reveal
            as="li"
            key={step.number}
            delay={(index % 4) * 0.04}
            className="relative flex flex-col gap-3 bg-card p-6 transition-colors duration-300 hover:bg-secondary/30"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn("size-1.5 rounded-full", accent.mark)}
              />
              <span
                className={cn(
                  "font-mono text-[11px] tracking-[0.14em]",
                  accent.soft,
                )}
              >
                {step.number}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-border" />
            </div>

            <h3 className="text-[15px] font-medium tracking-tight text-foreground">
              {step.title}
            </h3>

            <p className="text-[12.5px] leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </Reveal>
        );
      })}
    </ol>
  );
}
