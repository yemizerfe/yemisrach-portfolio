import type { DecisionItem } from "@/types/portfolio";
import { accentFor } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface DecisionCardProps {
  decision: DecisionItem;
}

/**
 * One engineering decision — what was chosen, where it applies, and why.
 *
 * Not a card: a margin-rail entry. The left rule is drawn in the technology's
 * register, so the same technology keeps the same colour wherever it appears,
 * and the block stays open — a decision reads as annotation, not as a surface.
 *
 * A decision recorded in the structured form (why / trade-off / result) is
 * rendered as three labelled rows, since naming the trade-off is the part that
 * makes the decision credible.
 */
export function DecisionCard({ decision }: DecisionCardProps) {
  const accent = accentFor(decision.technology ?? decision.question);
  const structured: { label: string; body: string }[] = [];

  if (decision.why) {
    structured.push({ label: "Why", body: decision.why });
  }
  if (decision.tradeoff) {
    structured.push({ label: "Trade-off", body: decision.tradeoff });
  }
  if (decision.result) {
    structured.push({ label: "Result", body: decision.result });
  }

  return (
    <article
      className={cn(
        "flex h-full flex-col gap-3 border-l-2 border-border pl-5 transition-[border-color] duration-300 hover:border-[color:color-mix(in_oklab,var(--glow-color,var(--color-border-strong))_70%,transparent)] sm:pl-6",
        accent.glow,
      )}
    >
      {decision.technology ? (
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="font-mono text-[11px] text-foreground-subtle">
            [
          </span>
          <h3 className={cn("font-mono text-[12px] tracking-tight", accent.soft)}>
            {decision.technology}
          </h3>
          <span aria-hidden="true" className="font-mono text-[11px] text-foreground-subtle">
            ]
          </span>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium tracking-tight text-foreground">
          {decision.question}
        </p>
        {decision.context ? (
          <p className="font-mono text-[11px] leading-relaxed text-foreground-subtle">
            {decision.context}
          </p>
        ) : null}
      </div>

      {structured.length > 0 ? (
        <dl className="flex flex-col gap-3">
          {structured.map((row) => (
            <div key={row.label} className="flex flex-col gap-1">
              <dt className="eyebrow">{row.label}</dt>
              <dd className="text-[13px] leading-relaxed text-muted-foreground">
                {row.body}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {decision.answer}
        </p>
      )}
    </article>
  );
}
