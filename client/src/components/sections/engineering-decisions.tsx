import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { DecisionCard } from "@/components/shared/decision-card";
import { Reveal } from "@/components/shared/reveal";
import { engineeringDecisions } from "@/data/decisions";

/**
 * Engineering decisions — "Why these technologies?"
 *
 * Each card answers a question and states where the technology is actually
 * used, so the reasoning is attached to a project instead of floating as a
 * general preference. Where a layer is designed rather than implemented, the
 * context line says that outright.
 */
export function EngineeringDecisions() {
  return (
    <Section id="decisions" labelledBy="decisions-heading">
      <div className="flex flex-col gap-12 lg:gap-14">
        <SectionHeading
          id="decisions-heading"
          index="11"
          eyebrow="Engineering decisions"
          title="Why these technologies?"
          description="Technology choice is a set of trade-offs, not a shopping list. These are the answers I would give if you asked me in a review, each with the project it applies to."
        />

        {/* Three answers are double-width, staggered so every row of the 3-col
            grid fills exactly: (2+1), (1+2), (1+1+1), (2+1). */}
        <div className="grid gap-x-8 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
          {engineeringDecisions.map((decision, index) => (
            <Reveal
              key={decision.technology}
              delay={(index % 3) * 0.04}
              className={index === 0 || index === 3 || index === 7 ? "h-full lg:col-span-2" : "h-full"}
            >
              <DecisionCard decision={decision} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
