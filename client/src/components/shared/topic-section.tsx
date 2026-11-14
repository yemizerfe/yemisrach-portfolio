import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import type { EngineeringTopic } from "@/types/portfolio";

interface EngineeringTopicSectionProps {
  topic: EngineeringTopic;
  /** Monospaced section index, e.g. "03". */
  index: string;
  tone?: "default" | "raised";
}

/**
 * One deep engineering topic on /engineering.
 *
 * A topic can carry three things: prose, a bullet list of decisions, and an
 * ordered flow when the sequence is the point (caching, background work,
 * realtime). The flow is a real ordered list rather than a picture, so it
 * survives narrow screens and screen readers.
 */
export function EngineeringTopicSection({
  topic,
  index,
  tone = "default",
}: EngineeringTopicSectionProps) {
  return (
    <Section id={topic.id} labelledBy={`${topic.id}-heading`} tone={tone}>
      <div className="flex flex-col gap-10">
        <SectionHeading
          id={`${topic.id}-heading`}
          index={index}
          eyebrow="Engineering"
          title={topic.title}
          description={topic.description}
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          <div className="flex flex-col gap-5">
            {topic.paragraphs.map((paragraph, position) => (
              <p
                key={`${topic.id}-${position}`}
                className="max-w-3xl text-[14.5px] leading-[1.75] text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}

            {topic.appliedIn ? (
              <p className="max-w-3xl border-l-2 border-accent/40 pl-4 text-[12.5px] leading-relaxed text-foreground-subtle">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-soft">
                  Where implemented{" "}
                </span>
                {topic.appliedIn}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-8">
            {topic.flow && topic.flow.length > 0 ? (
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                <p className="eyebrow mb-5">Order of operations</p>

                <ol className="flex flex-col">
                  {topic.flow.map((step, position) => {
                    const isLast = position === topic.flow!.length - 1;

                    return (
                      <li key={step.name} className="relative flex gap-4 pb-5 last:pb-0">
                        <div className="flex flex-col items-center">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/60 font-mono text-[10px] text-muted-foreground">
                            {String(position + 1).padStart(2, "0")}
                          </span>
                          {!isLast ? (
                            <span
                              aria-hidden="true"
                              className="mt-1 w-px flex-1 bg-gradient-to-b from-border-strong to-transparent"
                            />
                          ) : null}
                        </div>

                        <div className="flex flex-col gap-1 pb-2">
                          <h3 className="font-mono text-[12px] tracking-tight text-foreground">
                            {step.name}
                          </h3>
                          <p className="max-w-prose text-[12.5px] leading-relaxed text-muted-foreground">
                            {step.detail}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ) : null}

            {topic.points && topic.points.length > 0 ? (
              <ul className="flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-border">
                {topic.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 bg-card p-4 text-[12.5px] leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}