import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";

import { AuroraBackdrop } from "@/components/shared/aurora-backdrop";
import { BackendGraphBackdrop } from "@/components/shared/backend-graph-backdrop";
import { PortraitFrame } from "@/components/shared/portrait-frame";
import { HeroSequence } from "@/components/sections/hero-sequence";
import { TechMarquee } from "@/components/shared/tech-marquee";
import { Button } from "@/components/ui/button";
import { skillCategories } from "@/data/engineering";
import { projects } from "@/data/projects";
import { focusAreas, siteConfig } from "@/data/site";
import { accents, accentFor } from "@/lib/accents";
import { cn } from "@/lib/utils";

/**
 * Hero: identity and positioning, lit.
 *
 * The heading states the specialisation — Backend Software Engineer — and the
 * lead paragraph says what that means in practice. Frontend capability
 * follows as a supporting sentence rather than as a second headline, because
 * this is a backend portfolio that happens to be full-stack capable, not the
 * other way round.
 *
 * The artistic weight comes from three things, and all three are data-driven:
 * the drifting colour clouds behind the copy, the poster gradient that walks
 * the palette through the headline, and the rail of real technologies. The
 * floating plates are derived from the site's own data — case studies,
 * disciplines, focus areas — so the composition gains the shape of a portfolio
 * without a single invented figure.
 *
 * Colour: the headline carries the vivid gradient and a matching halo, each
 * focus area takes its hue from the shared accent palette (via its own label),
 * and each plate takes a named register. Nothing here picks a colour by hand.
 *
 * The copy itself comes from site data so it exists in exactly one place.
 */
export function Hero() {
  /** Counts derived from the data files, never typed in by hand. */
  const caseStudies = projects.length;
  const disciplines = skillCategories.length;
  const areaCount = focusAreas.length;

  const plates = [
    {
      id: "cases",
      value: String(caseStudies).padStart(2, "0"),
      label: caseStudies === 1 ? "case study" : "case studies",
      accent: accents.violet,
      className: "-left-3 top-20 animate-float sm:-left-6",
    },
    {
      id: "disciplines",
      value: String(disciplines).padStart(2, "0"),
      label: "disciplines",
      accent: accents.cyan,
      className: "-right-3 top-[58%] animate-float-slow sm:-right-6",
    },
    {
      id: "areas",
      value: String(areaCount).padStart(2, "0"),
      label: "focus areas",
      accent: accents.champagne,
      className: "left-2 bottom-6 animate-float",
    },
  ];

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-28 md:pt-40 lg:pt-48"
    >
      {/* Backend background: connected nodes, storage, queue, workers, metrics. */}
      <BackendGraphBackdrop
        variant="hero"
        className="h-[900px] sm:h-[920px] md:h-[960px] lg:h-[1000px]"
      />
      {/* Drifting colour clouds in the palette's own lights, under the scrim so
          they light the copy without ever competing with it. */}
      <AuroraBackdrop className="h-[900px] sm:h-[920px] md:h-[960px] lg:h-[1000px]" />
      {/* Navy scrim on the copy side only, so the graph never costs legibility. */}
      <div
        aria-hidden="true"
        className="hero-scrim pointer-events-none absolute inset-x-0 top-0 h-[900px] sm:h-[920px] md:h-[960px] lg:h-[1000px]"
      />
      {/* One asymmetric pool of light laid over the graph: champagne from the
          top left where the copy sits, cooler on the portrait side. The
          composition is modelled with light now — the drawn blueprint grid
          that used to sit here is gone. */}
      <div
        aria-hidden="true"
        className="hero-wash pointer-events-none absolute inset-x-0 top-0 h-[900px] sm:h-[920px] md:h-[960px] lg:h-[1000px]"
      />

      {/* The directed opening shot: one timeline paces this section's
          entrance against the 3D scene lighting up. Targets are the
          data-seq markers below; reduced motion skips it entirely. */}
      <HeroSequence />

      <div className="shell relative">
        <div className="grid items-start gap-12 pb-20 sm:gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:gap-12 lg:pb-28 xl:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-9">
              <div data-seq="status" className="flex flex-wrap items-center gap-3">
                {/* Availability reads as a signal light: emerald is the
                    palette's healthy hue, and the pulse is the only motion in
                    the row. The halo is the same hue, blurred. */}
                <span className="inline-flex items-center gap-2 rounded-full border border-accent-emerald/30 bg-accent-emerald/[0.09] px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent-emerald-soft shadow-[0_0_22px_-6px] shadow-accent-emerald/80">
                  <span
                    aria-hidden="true"
                    className="size-1.5 animate-node-pulse rounded-full bg-accent-emerald"
                  />
                  {siteConfig.status}
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground-subtle">
                  {siteConfig.location}
                </span>
              </div>

              <div className="flex flex-col gap-5">
                <p
                  data-seq="intro"
                  className="text-base font-medium tracking-tight text-accent-violet-soft sm:text-lg"
                >
                  Hi, I’m {siteConfig.name}.
                </p>

                <h1
                  id="hero-heading"
                  data-seq="headline"
                  className="text-gradient-vivid animate-text-sheen text-glow max-w-2xl text-3xl font-medium leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.75rem]"
                >
                  {siteConfig.role}
                </h1>

                <p
                  data-seq="lead"
                  className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base"
                >
                  {siteConfig.intro}
                </p>

                <p
                  data-seq="support"
                  className="max-w-xl text-[13.5px] leading-relaxed text-foreground-subtle"
                >
                  {siteConfig.supporting}
                </p>

                {/* Disciplines, each in its own hue from the shared palette. */}
                <ul
                  aria-label="Focus areas"
                  data-seq="areas"
                  className="flex flex-wrap gap-1.5"
                >
                  {focusAreas.map((area) => {
                    const accent = accentFor(area);

                    return (
                      <li
                        key={area}
                        className={cn(
                          "rounded-full border px-2.5 py-1 font-mono text-[10.5px] tracking-tight",
                          accent.chip,
                        )}
                      >
                        {area}
                      </li>
                    );
                  })}
                </ul>

                {/* The rail below the chips is the same list of technologies the
                    rest of the site is built from — a faster way to read it,
                    not a second, decorative claim. */}
                <div data-seq="marquee">
                  <TechMarquee label="Built with" className="max-w-xl" />
                </div>
              </div>

              <div data-seq="cta" className="flex flex-wrap items-center gap-3">
                {/** On narrow screens the large page buttons overflow the line;
                    wrap them so nothing gets clipped without resizing the page. */}
                <Button asChild size="lg">
                  <Link href="/#projects">
                    View Projects
                    <ArrowUpRight />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="secondary">
                  <Link href={siteConfig.resumePath}>
                    <FileText />
                    View Resume
                  </Link>
                </Button>
              </div>

              <div
                data-seq="focus"
                className="flex flex-col gap-3 border-t border-border pt-6"
              >
                <p className="eyebrow text-accent-soft">Current focus</p>
                <p className="max-w-xl text-[13px] leading-relaxed text-muted-foreground">
                  {siteConfig.engineeringFocus}
                </p>
                <p className="max-w-xl text-[12.5px] leading-relaxed text-foreground-subtle">
                  {siteConfig.availability}
                </p>
              </div>
            </div>
          </div>

          <div data-seq="portrait">
            <div className="relative mx-auto w-full max-w-[23rem] sm:max-w-[24rem] lg:ml-4 lg:mr-auto lg:max-w-[25rem]">
              {/* Two rings of light around the frame: a conic sweep that
                  travels the whole palette, and the halo ring underneath it.
                  The portrait is the one element on the page that gets both. */}
              <div className="glow-ring aurora-border relative rounded-xl">
                <PortraitFrame />
              </div>

              {/* Floating plates. Every figure is a count of something that
                  exists in `src/data` — case studies, disciplines, focus areas
                  — so the hero gains the composition of a portfolio without a
                  single number anyone would have to be able to defend. */}
              {plates.map((plate) => (
                <div
                  key={plate.id}
                  aria-hidden="true"
                  data-seq="plate"
                  className={cn(
                    "absolute hidden items-center gap-2.5 rounded-xl border border-border/80 bg-card/80 px-3 py-2 backdrop-blur-md sm:flex",
                    plate.className,
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      plate.accent.mark,
                    )}
                  />
                  <span className="font-mono text-[15px] leading-none tracking-tight text-foreground">
                    {plate.value}
                  </span>
                  <span className="eyebrow">{plate.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
