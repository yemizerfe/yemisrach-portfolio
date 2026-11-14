import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { PracticeCard } from "@/components/shared/practice-card";
import { testingHonestyNote, testingPractices } from "@/data/testing";

/**
 * Testing.
 *
 * The note at the end is deliberate: it says what is tested and explicitly
 * declines to publish a coverage percentage, because there is no measured
 * number to publish.
 */
export function Testing() {
  return (
    <Section id="testing" labelledBy="testing-heading" tone="raised">
      <div className="flex flex-col gap-12 lg:gap-14">
        <SectionHeading
          id="testing-heading"
          index="12"
          eyebrow="Testing"
          title="Testing the parts that are expensive to get wrong."
          description="Validation, permissions and failure paths first: those are the behaviours where a bug is not a visual defect but a security or data-integrity problem."
        />

        {/* Diagonal cascade: each column in the 4-col row sits deeper than the
            one before it, so the four entries step down instead of lining up
            on one baseline. Offsets only apply at lg; below that it's a plain
            stack. */}
        <div className="grid gap-x-8 gap-y-9 md:grid-cols-2 lg:grid-cols-4">
          {testingPractices.map((topic, index) => (
            <Reveal
              key={topic.id}
              delay={(index % 4) * 0.04}
              className={`h-full ${["", "lg:mt-8", "lg:mt-16", "lg:mt-24"][index] ?? ""}`}
            >
              <PracticeCard topic={topic} />
            </Reveal>
          ))}
        </div>

        <p className="max-w-3xl border-l-2 border-accent/40 pl-4 text-[13px] leading-relaxed text-muted-foreground">
          {testingHonestyNote}
        </p>
      </div>
    </Section>
  );
}
