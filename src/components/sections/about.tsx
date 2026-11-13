import Link from "next/link";
import { FileText } from "lucide-react";
import type { ReactNode } from "react";

import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { SystemSketch } from "@/components/shared/system-sketch";
import { Button } from "@/components/ui/button";
import {
  aboutBeyondCode,
  aboutInterests,
  aboutIntro,
  aboutJourney,
  aboutWorkingToward,
} from "@/data/about";
import { siteConfig } from "@/data/site";
import { accentFor } from "@/lib/accents";
import { cn } from "@/lib/utils";
import type { AboutParagraph } from "@/types/portfolio";

/** The sub-heading every block after the introduction shares, so the section reads as one account. */
function BlockHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[15px] font-medium tracking-tight text-foreground">
      {children}
    </h3>
  );
}

/**
 * One paragraph of supplied copy.
 *
 * The introduction's third paragraph emphasises a phrase, which the data models
 * in three parts rather than as markup inside a string: the sentence stays
 * whole, and how the emphasis looks is decided here.
 */
function Paragraph({ text, lead }: { text: AboutParagraph; lead?: boolean }) {
  const className = cn(
    "max-w-2xl",
    lead
      ? "text-[15.5px] leading-relaxed text-foreground"
      : "text-[14px] leading-[1.75] text-muted-foreground",
  );

  if (typeof text === "string") {
    return <p className={className}>{text}</p>;
  }

  return (
    <p className={className}>
      {text.before}
      <strong className="font-medium text-foreground">{text.emphasis}</strong>
      {text.after}
    </p>
  );
}

/** A sub-heading followed by its prose — the shape every middle block shares. */
function ProseBlock({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: readonly AboutParagraph[];
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-10">
      <BlockHeading>{title}</BlockHeading>

      <div className="flex flex-col gap-3">
        {paragraphs.map((paragraph, index) => (
          <Paragraph key={`${title}-${index}`} text={paragraph} />
        ))}
      </div>
    </div>
  );
}

/**
 * About — who I am, told in the order the copy was written.
 *
 * The flow is the introduction, the journey so far, what I am working toward,
 * the interests that sit beyond code, and a link to the resume. It is prose
 * rather than a grid of cards on purpose: the reasoning behind the work lives
 * in the Engineering section and the case studies, so nothing here restates it.
 *
 * Backend engineering is stated as the primary interest, and no seniority or
 * date is claimed. The left column keeps the abstract request-path sketch,
 * which belongs beside prose about how systems are reasoned about; the portrait
 * lives in the hero instead, beside the identity copy it illustrates.
 */
export function About() {
  return (
    <Section id="about" labelledBy="about-heading">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:gap-14">
        {/* Decorative request-path sketch, aligned with the prose. */}
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <SystemSketch />
        </Reveal>

        <div className="flex flex-col gap-10">
          {/* 1 — About Me. Three paragraphs, read as one continuous account. */}
          <div className="flex flex-col gap-6">
            <SectionHeading
              id="about-heading"
              index="03"
              eyebrow={aboutIntro.eyebrow}
              title={aboutIntro.title}
              gradient="warm"
            />

            <div className="flex flex-col gap-3">
              {aboutIntro.paragraphs.map((paragraph, index) => (
                <Paragraph
                  key={`intro-${index}`}
                  text={paragraph}
                  lead={index === 0}
                />
              ))}
            </div>
          </div>

          {/* 2 — My Journey. */}
          <ProseBlock
            title={aboutJourney.title}
            paragraphs={aboutJourney.paragraphs}
          />

          {/* 3 — What I'm Working Toward. The near goal, then the long one. */}
          <ProseBlock
            title={aboutWorkingToward.title}
            paragraphs={aboutWorkingToward.paragraphs}
          />

          {/* 4 — Beyond Code. Five interests, one line each: enough to say
              something about the person without turning into a hobby list. */}
          <div className="flex flex-col gap-6 border-t border-border pt-10">
            <BlockHeading>{aboutBeyondCode.title}</BlockHeading>

            <p className="max-w-2xl text-[14px] leading-[1.75] text-muted-foreground">
              {aboutBeyondCode.intro}
            </p>

            <ul className="flex flex-col gap-3">
              {aboutInterests.map((interest) => {
                const accent = accentFor(interest.id);

                return (
                  <Reveal
                    as="li"
                    key={interest.id}
                    className="flex items-start gap-3"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-[7px] size-1.5 shrink-0 rounded-full",
                        accent.mark,
                      )}
                    />
                    <span className="max-w-2xl text-[14px] leading-[1.75] text-muted-foreground">
                      <strong className="font-medium text-foreground">
                        {interest.label}
                      </strong>
                      {" — "}
                      {interest.description}
                    </span>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          {/* 5 — Resume link at the end of About. */}
          <div className="border-t border-border pt-10">
            <Button asChild>
              <Link href={siteConfig.resumePath}>
                <FileText />
                View Resume
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

