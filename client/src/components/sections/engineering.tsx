import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  BrainCircuit,
  Database,
  Gauge,
  Layers,
  Network,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { PillarCard } from "@/components/shared/pillar-card";
import { PrincipleCard } from "@/components/shared/principle-card";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { TechBadge } from "@/components/shared/tech-badge";
import { Button } from "@/components/ui/button";
import {
  engineeringAreas,
  engineeringPrinciples,
  proficiencyLegend,
} from "@/data/engineering-areas";

/** Icon per area, kept beside the grid so the mapping stays in one place. */
const areaIcons: Record<string, LucideIcon> = {
  backend: Server,
  architecture: Network,
  data: Database,
  security: ShieldCheck,
  infrastructure: Blocks,
};

/** Icon per principle. */
const principleIcons: Record<string, LucideIcon> = {
  "clean-architecture": Layers,
  "security-first": ShieldCheck,
  maintainability: Blocks,
  "data-integrity": Database,
  performance: Gauge,
  "continuous-learning": BrainCircuit,
};

/**
 * Engineering — how backend systems are approached.
 *
 * A recruiter-skimmable overview, not a tutorial: one sentence per area, the
 * technologies as badges, and six principles underneath. The detailed reasoning
 * lives in the project case studies, which is what keeps this section to a
 * minute or two of reading and keeps it from repeating itself.
 */
export function Engineering() {
  return (
    <Section id="engineering" labelledBy="engineering-heading" tone="raised">
      <div className="flex flex-col gap-10 lg:gap-12">
        <SectionHeading
          id="engineering-heading"
          index="02"
          eyebrow="Engineering"
          title="Engineering"
          gradient="cool"
          description="Building reliable backend systems. Clean architecture, secure APIs and well-structured data — code that is understandable, maintainable and designed to evolve with the product."
        />

        {/* Five areas in an even grid. The old layout used a 12-col bento with
            uneven spans; with fewer, broader cards the even rhythm is calmer
            and scans faster. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {engineeringAreas.map((area, index) => (
            <Reveal
              key={area.id}
              delay={(index % 3) * 0.04}
              className="h-full"
            >
              <PillarCard pillar={area} icon={areaIcons[area.id] ?? Server} />
            </Reveal>
          ))}
        </div>

        {/* Provenance, not proficiency. Each row shows a real badge in the tone
            it describes, so the solid/dashed split is legible before it is
            explained — and no percentage is claimed anywhere. */}
        <dl className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:gap-8">
          {proficiencyLegend.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-1.5">
              <dt className="flex items-center gap-2">
                <TechBadge label={entry.label} tone={entry.tone} />
              </dt>
              <dd className="text-[12.5px] leading-relaxed text-foreground-subtle">
                {entry.description}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-6 border-t border-border pt-8">
          <h3 className="text-[15px] font-medium tracking-tight text-foreground">
            Engineering Principles
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {engineeringPrinciples.map((principle, index) => (
              <Reveal
                key={principle.id}
                delay={(index % 3) * 0.04}
                className="h-full"
              >
                <PrincipleCard
                  principle={principle}
                  icon={principleIcons[principle.id] ?? Layers}
                />
              </Reveal>
            ))}
          </div>
        </div>

        {/* One step out of the section, and the only button in it: the
            reasoning is what this section is for, and the projects are where it
            is applied. */}
        <div className="flex flex-col gap-4 border-t border-border pt-8">
          <Button asChild>
            <Link href="/#projects">
              See the Engineering in Practice
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
