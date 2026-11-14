import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { PracticeCard } from "@/components/shared/practice-card";
import { performanceTopics } from "@/data/performance";

/**
 * Performance and scalability.
 *
 * Concepts rather than measurements: no benchmark, throughput or latency
 * figure is claimed anywhere, because none has been measured on real traffic.
 */
export function Performance() {
  return (
    <Section id="performance" labelledBy="performance-heading">
      <div className="flex flex-col gap-12 lg:gap-14">
        <SectionHeading
          id="performance-heading"
          index="07"
          eyebrow="Performance & scalability"
          title="Where performance work actually happens."
          description="Most of it is decided before a profiler is opened: the schema, the query shape, what runs inside a request, and what the cache is allowed to hold. The figures are absent on purpose — I do not publish numbers I have not measured."
        />
        {/* Plated cards in a 6-col bento: a wide 4-col lead card beside a
            2-col one, then three equal cards — a different rhythm from the
            open-entry sections around it. */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {performanceTopics.map((topic, index) => (
            <Reveal
              key={topic.id}
              delay={(index % 3) * 0.04}
              className={`h-full ${
                ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"][index] ?? "lg:col-span-2"
              }`}
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
