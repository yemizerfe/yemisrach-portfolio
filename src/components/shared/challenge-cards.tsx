import { Reveal } from "@/components/shared/reveal";
import { StatusPill } from "@/components/shared/status-pill";
import type { ChallengeItem } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface ChallengeCardsProps {
  items: ChallengeItem[];
  className?: string;
}

/**
 * Challenge → approach → result.
 *
 * The three parts are labelled rather than implied by position, because the
 * difference between "what was hard" and "what was done about it" is the whole
 * point of the section. An approach that is designed but not built keeps its
 * pill, exactly as it would anywhere else in the site.
 */
export function ChallengeCards({ items, className }: ChallengeCardsProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      {items.map((item, index) => (
        <Reveal key={item.challenge} delay={(index % 2) * 0.04} className="h-full">
          <article className="card-glow flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="max-w-prose text-[14px] font-medium leading-snug tracking-tight text-foreground">
                {item.challenge}
              </h3>
              {item.status === "planned" ? <StatusPill status="designed" /> : null}
            </div>

            <dl className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <dt className="eyebrow">Approach</dt>
                <dd className="text-[12.5px] leading-relaxed text-muted-foreground">
                  {item.approach}
                </dd>
              </div>
              <div className="flex flex-col gap-1 border-t border-border pt-3.5">
                <dt className="eyebrow">
                  {item.status === "planned" ? "Expected outcome" : "Outcome"}
                </dt>
                <dd className="text-[12.5px] leading-relaxed text-muted-foreground">
                  {item.result}
                </dd>
              </div>
            </dl>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
