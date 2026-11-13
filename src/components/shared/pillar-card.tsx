import type { LucideIcon } from "lucide-react";

import { TechBadgeList } from "@/components/shared/tech-badge";
import type { EngineeringPillar } from "@/types/portfolio";
import { accentFor } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface PillarCardProps {
  pillar: EngineeringPillar;
  icon: LucideIcon;
}

/**
 * One engineering area.
 *
 * Compact by design: icon, title, one sentence, then the technologies as small
 * badges. The previous version of this section carried six bullets of prose per
 * discipline, which made it read like documentation — the reasoning behind these
 * choices belongs in the project case studies, not here.
 *
 * Applied and exploratory items are separated by treatment — solid badge versus
 * dashed — so a reader can tell what runs in a project from what is merely
 * familiar, without a label row repeating it on every card. Each area's hue
 * comes from its own id through the shared accent palette, so the grid is
 * colourful without anyone choosing colours per card.
 */
export function PillarCard({ pillar, icon: Icon }: PillarCardProps) {
  const accent = accentFor(pillar.id);
  const hasExploring = Boolean(pillar.exploring?.length);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-3 rounded-xl border border-border bg-card/60 p-4 transition-colors duration-300 hover:border-accent-cyan/30",
        accent.glow,
      )}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg border",
            accent.chip,
          )}
        >
          <Icon className="size-4" />
        </span>
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          {pillar.title}
        </h3>
      </div>

      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {pillar.description}
      </p>

      <div className="mt-auto flex flex-col gap-2">
        <TechBadgeList
          items={pillar.applied}
          label={`${pillar.title} technologies used in projects`}
        />

        {hasExploring ? (
          <TechBadgeList
            items={pillar.exploring as string[]}
            label={`${pillar.title} technologies practised outside the listed projects`}
            tone="muted"
          />
        ) : null}
      </div>
    </article>
  );
}