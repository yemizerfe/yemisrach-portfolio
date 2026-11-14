import type { ElementType, ReactNode } from "react";

import { ClipReveal } from "@/components/shared/clip-reveal";
import { accentForIndex, accents, type AccentName } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Anchor id for the section's `aria-labelledby`. */
  id: string;
  /** Monospaced section index, e.g. "01". */
  index?: string;
  /** Short eyebrow label, e.g. "Selected work". */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Rendered alongside the heading — usually a link to more detail. */
  action?: ReactNode;
  /**
   * Hue for the index mark. Defaults to the accent that matches the section
   * index, so the page walks the palette in order and each section keeps its
   * own colour without anyone having to maintain a list.
   */
  tone?: AccentName;
  /**
   * Gradient title. `cool` is the aurora default, `vivid` is the poster
   * version (violet → cyan → champagne) and `warm` is the gold used by the
   * personal sections. Used sparingly: a gradient everywhere would stop
   * meaning anything.
   */
  gradient?: "cool" | "warm" | "vivid";
  as?: ElementType;
  className?: string;
  titleClassName?: string;
}

/**
 * Consistent section intro: index, eyebrow, heading, lead paragraph.
 * Every major section uses it, which is what keeps vertical rhythm even.
 */
export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  description,
  action,
  tone,
  gradient,
  as: Heading = "h2",
  className,
  titleClassName,
}: SectionHeadingProps) {
  const accent = tone ? accents[tone] : accentForIndex(index);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {(index || eyebrow) && (
        <div className="flex items-center gap-3">
          {index ? (
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn("size-1.5 rounded-full", accent.mark)}
              />
              <span
                className={cn(
                  "font-mono text-[11px] tracking-[0.16em]",
                  accent.soft,
                )}
              >
                {index}
              </span>
            </span>
          ) : null}
          {index && eyebrow ? (
            <span aria-hidden="true" className="gradient-line h-px w-10" />
          ) : null}
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        </div>
      )}

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <ClipReveal className="min-w-0">
          <Heading
            id={id}
            className={cn(
              "max-w-2xl text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]",
              gradient === "warm"
                ? "text-gradient-warm animate-text-sheen"
                : gradient === "vivid"
                  ? "text-gradient-vivid animate-text-sheen"
                  : gradient
                    ? "text-gradient animate-text-sheen"
                    : "text-foreground",
              titleClassName,
            )}
          >
            {title}
          </Heading>
        </ClipReveal>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {description ? (
        <ClipReveal delay={0.08}>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </ClipReveal>
      ) : null}
    </div>
  );
}
