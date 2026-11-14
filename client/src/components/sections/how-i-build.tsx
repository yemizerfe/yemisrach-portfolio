import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProcessTimeline } from "@/components/shared/process-timeline";
import { processSteps } from "@/data/process";

/**
 * How I build — the order of work, backend-first.
 *
 * The order matters more than the steps: each one exists because skipping it
 * costs more later than doing it now. Data model and API come before the
 * business logic, and the interface comes last because it consumes a contract
 * rather than defining one.
 */
export function HowIBuild() {
  return (
    <Section id="process" labelledBy="process-heading">
      <div className="flex flex-col gap-12 lg:gap-14">
        <SectionHeading
          id="process-heading"
          index="03"
          eyebrow="How I build"
          title="A process that assumes the first answer is wrong."
          description="Design decisions are cheap before code and expensive afterwards, so the sequence is deliberate: understand the requirement, model the data, define the API, then implement — with authentication, validation and failure paths handled as part of the feature rather than after it."
        />

        <ProcessTimeline steps={processSteps} />
      </div>
    </Section>
  );
}
