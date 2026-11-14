import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { PracticeCard } from "@/components/shared/practice-card";
import { securityPractices } from "@/data/practices";

/**
 * Security mindset.
 *
 * Every bullet maps to something used in a listed project — the mapping is
 * the point: a technique is not listed just because it appears in a skills
 * list somewhere else on the site.
 */
export function Security() {
  return (
    <Section id="security" labelledBy="security-heading">
      <div className="flex flex-col gap-12 lg:gap-14">
        <SectionHeading
          id="security-heading"
          index="05"
          eyebrow="Security"
          title="Security is a property of the design, not a final pass."
          description="Authentication, authorization and validation are decided while the data model is being shaped, because that is when they are still cheap. Each item below is tied to something implemented in weTalk or NexusGuard."
        />

        {/* Plated cards instead of open entries, in a tight 3-col wall with
            20px gutters — the card treatment makes this section read as a
            distinct room compared with the open entries around it. */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {securityPractices.map((topic, index) => (
            <Reveal
              key={topic.id}
              delay={(index % 3) * 0.04}
              className="h-full"
            >
              <PracticeCard
                topic={topic}
                className="surface card-glow rounded-xl p-5"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
