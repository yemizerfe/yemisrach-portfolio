import { BookOpen, GraduationCap } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { education } from "@/data/about";

/**
 * Education — kept deliberately short.
 *
 * Degree, institution and enrolment status only. No graduation date, no GPA
 * and no awards: none of those have been supplied, and none may be invented.
 * The coursework is listed because it is the formal version of what the
 * projects practise.
 */
export function Education() {
  return (
    <Section id="education" labelledBy="education-heading" tone="raised">
      <div className="flex flex-col gap-12 lg:gap-14">
        <SectionHeading
          id="education-heading"
          index="05"
          eyebrow="Education"
          title="Software engineering, studied formally and applied in projects."
          description="The fundamentals — data modelling, algorithms, operating systems and networks — taught alongside the projects where they are actually used."
        />

        {/* One composition split by a hairline — degree on the left, coursework
            on the right — rather than two equal boxes: the asymmetry of an
            editorial spread, with the vertical rule carrying the divide. */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-0">
          <Reveal className="flex flex-col gap-5 md:pr-10">
            <div className="flex items-center gap-3">
              <GraduationCap aria-hidden="true" className="size-4 text-accent-soft" />
              <p className="eyebrow">Degree</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="max-w-md text-lg font-medium leading-snug tracking-tight text-foreground">
                {education.degree}
              </h3>
              <p className="text-[13px] text-muted-foreground">
                {education.institution}
              </p>
            </div>
            <p className="max-w-md text-[13px] leading-relaxed text-muted-foreground">
              {education.status}
            </p>
            <p className="max-w-md text-[12px] leading-relaxed text-foreground-subtle">
              {education.note}
            </p>
          </Reveal>

          <Reveal
            delay={0.05}
            className="flex flex-col gap-5 border-t border-border pt-10 md:border-t-0 md:border-l md:border-border md:pt-0 md:pl-10"
          >
            <div className="flex items-center gap-3">
              <BookOpen aria-hidden="true" className="size-4 text-accent-soft" />
              <p className="eyebrow">Coursework focus</p>
            </div>
            <ul className="flex flex-col gap-2.5">
              {education.focus.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-[13px] leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-border-strong"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-auto max-w-md text-[12px] leading-relaxed text-foreground-subtle">
              The coursework shows up in the projects: schemas designed before
              queries in weTalk and EstatePlus, request validation in both, and a
              workflow that had to be enforceable in NexusGuard.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}