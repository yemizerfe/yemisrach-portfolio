import type { LucideIcon } from "lucide-react";

import { TechBadgeList } from "@/components/shared/tech-badge";
import type { SkillCategory } from "@/types/portfolio";
import { accentFor } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface EngineeringCardProps {
  category: SkillCategory;
  icon: LucideIcon;
}

/**
 * One discipline: what it covers and the tools actually used in it.
 *
 * Not a card — an open column under a hairline, so the discipline grid reads
 * as one continuous field rather than a tray of tiles. The rule picks up the
 * category's register on hover.
 */
export function EngineeringCard({ category, icon: Icon }: EngineeringCardProps) {
  const accent = accentFor(category.id);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-5 border-t border-border pt-5",
        accent.glow,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute -top-px left-0 h-0.5 w-14 transition-[width] duration-500 ease-[var(--ease-out-expo)] group-hover:w-28",
          accent.mark,
        )}
      />

      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-9 items-center justify-center rounded-lg border",
            accent.chip,
          )}
        >
          <Icon className="size-4" />
        </span>
        <h3 className="text-base font-medium tracking-tight text-foreground">
          {category.title}
        </h3>
      </div>

      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {category.description}
      </p>

      <div className="mt-auto flex flex-col gap-4">
        <TechBadgeList
          items={category.items}
          label={`${category.title} skills`}
        />

        {category.exploring && category.exploring.length > 0 ? (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <p className="eyebrow">Studying / designed</p>
            <TechBadgeList
              items={category.exploring}
              label={`${category.title} skills being learned`}
              tone="muted"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}
