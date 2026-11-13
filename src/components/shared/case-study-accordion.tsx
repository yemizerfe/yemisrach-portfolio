import { ChevronRight } from "lucide-react";

import type { AccordionItem } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface CaseStudyAccordionProps {
  items: AccordionItem[];
  className?: string;
}

/**
 * Expandable technical detail.
 *
 * Built on `<details>`, so it opens with no JavaScript at all and the collapsed
 * state is real rather than visually hidden — which keeps a long case study
 * scannable without making the detail unreachable. The chevron rotates through
 * the `open` attribute, so motion is never the only signal.
 */
export function CaseStudyAccordion({ items, className }: CaseStudyAccordionProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-border",
        className,
      )}
    >
      {items.map((item) => (
        <details key={item.title} className="group bg-card">
          <summary className="flex cursor-pointer list-none items-start gap-3 p-5 transition-colors duration-200 hover:bg-secondary/25 [&::-webkit-details-marker]:hidden">
            <ChevronRight
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-foreground-subtle transition-transform duration-200 group-open:rotate-90"
            />
            <span className="flex flex-col gap-1">
              <span className="text-[13.5px] font-medium tracking-tight text-foreground">
                {item.title}
              </span>
              <span className="text-[12.5px] leading-relaxed text-muted-foreground">
                {item.body}
              </span>
            </span>
          </summary>

          {item.points && item.points.length > 0 ? (
            <ul className="flex flex-col gap-2.5 px-5 pb-5 pl-12">
              {item.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-2.5 text-[12.5px] leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-soft"
                  />
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </details>
      ))}
    </div>
  );
}
