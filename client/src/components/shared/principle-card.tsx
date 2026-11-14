import type { LucideIcon } from "lucide-react";

import { accentFor } from "@/lib/accents";
import { cn } from "@/lib/utils";

export interface EngineeringPrinciple {
  id: string;
  title: string;
  description: string;
}

interface PrincipleCardProps {
  principle: EngineeringPrinciple;
  icon: LucideIcon;
}

/**
 * One engineering principle.
 *
 * The lightest card on the site: a small icon, a title and a single sentence.
 * Principles are meant to be read in a few seconds, so anything longer than one
 * line would defeat the point of having them. The hue follows the principle's
 * own id through the shared accent palette, the same way every other card does.
 */
export function PrincipleCard({ principle, icon: Icon }: PrincipleCardProps) {
  const accent = accentFor(principle.id);

  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-2.5 rounded-xl border border-border bg-card/60 p-4 transition-colors duration-300 hover:border-accent-violet/30",
        accent.glow,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-8 items-center justify-center rounded-lg border",
          accent.chip,
        )}
      >
        <Icon className="size-4" />
      </span>

      <h3 className="text-[14px] font-medium tracking-tight text-foreground">
        {principle.title}
      </h3>

      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {principle.description}
      </p>
    </article>
  );
}