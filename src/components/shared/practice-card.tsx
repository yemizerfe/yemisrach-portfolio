import { CircleCheck } from "lucide-react";

import type { PracticeTopic } from "@/types/portfolio";
import { accentFor } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface PracticeCardProps {
  topic: PracticeTopic;
  className?: string;
}

/**
 * Used by the security, performance and testing sections.
 *
 * Not a card: an open ruled entry. The section is a list of related points,
 * so the items share the column instead of each one hiding in its own box —
 * a hairline across the top caps the entry, and that hairline warms towards
 * the topic's register on hover. Bullets are check marks with a text label,
 * never colour alone — the hue is decoration that follows the topic, not the
 * thing carrying the meaning.
 */
export function PracticeCard({ topic, className }: PracticeCardProps) {
  const accent = accentFor(topic.id);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-4 border-t border-border pt-5 transition-colors duration-300",
        accent.glow,
        className,
      )}
    >
      {/* A short lit segment pinned to the rule: the entry's register made
          visible without ever enclosing the content in a surface. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -top-px left-0 h-0.5 w-14 transition-[width] duration-500 ease-[var(--ease-out-expo)] group-hover:w-28",
          accent.mark,
        )}
      />

      <div className="flex flex-col gap-2">
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          {topic.title}
        </h3>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {topic.description}
        </p>
      </div>

      <ul className="mt-auto flex flex-col gap-2 pt-1">
        {topic.points.map((point) => (
          <li key={point} className="flex gap-2.5 text-[12.5px] leading-relaxed">
            <CircleCheck
              aria-hidden="true"
              className={cn("mt-0.5 size-3.5 shrink-0", accent.soft)}
            />
            <span className="text-muted-foreground">{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
