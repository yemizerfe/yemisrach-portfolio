import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ResumeDownloadButton } from "@/components/sections/resume-download-button";
import { resume } from "@/data/resume";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Yemisrach Zerfe, Backend Software Engineer: professional summary, technical skills, experience, projects and education.",
  alternates: { canonical: siteConfig.resumePath },
};

/**
 * The résumé, as the document itself.
 *
 * The content is the CV word for word (`data/resume.ts`); this file is only the
 * typesetting. Everything is sized so that Print → A4 lands on a single page:
 * the sheet is capped at 210mm, the type is small and tight, and the print
 * stylesheet strips the card so the page margins are the paper's own.
 */
export default function ResumePage() {
  return (
    <div className="shell resume-shell pt-24 pb-10 md:pt-28 md:pb-14">
      <div className="print-hidden mx-auto mb-8 flex max-w-[210mm] flex-wrap items-center justify-between gap-4">
        <Link
          href="/#resume"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to portfolio
        </Link>

        <ResumeDownloadButton />
      </div>

      <article className="resume-sheet mx-auto w-full max-w-[210mm] rounded-xl border border-border bg-card px-7 py-8 text-[10.5px] leading-[1.45] text-muted-foreground sm:px-10">
        <header className="border-b border-border pb-3">
          <h1 className="text-[21px] font-semibold uppercase tracking-[0.08em] text-foreground">
            {resume.name}
          </h1>

          <p className="mt-1 text-[11px] text-foreground">
            <span className="font-medium">{resume.headline}</span>
            <span className="text-foreground-subtle"> | </span>
            {resume.location}
            <span className="text-foreground-subtle"> | </span>
            <a href={resume.phoneHref} className="hover:text-foreground">
              {resume.phone}
            </a>
            <span className="text-foreground-subtle"> | </span>
            <a href={`mailto:${resume.email}`} className="hover:text-foreground">
              {resume.email}
            </a>
          </p>

          <p className="mt-1 text-[11px]">
            {resume.links.map((link, index) => (
              <span key={link.label}>
                {index > 0 ? <span className="text-foreground-subtle"> | </span> : null}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </p>
        </header>

        <Section title="Professional Summary">
          <p className="text-[10.5px] leading-[1.45]">{resume.summary}</p>
        </Section>

        <Section title="Technical Skills">
          <dl className="flex flex-col gap-1">
            {resume.skills.map((skill) => (
              <div key={skill.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-1">
                <dt className="font-semibold text-foreground">{skill.label}:</dt>
                <dd>{skill.items}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Professional Experience">
          <div className="flex flex-col gap-2.5">
            {resume.experience.map((role) => (
              <div key={`${role.title}-${role.organisation}`}>
                <div className="flex flex-wrap items-baseline gap-x-1.5">
                  <h3 className="text-[11.5px] font-semibold text-foreground">
                    {role.title} — {role.organisation}
                  </h3>
                  <span className="text-foreground-subtle">| {role.location}</span>
                  {role.meta ? (
                    <span className="italic text-foreground-subtle">| {role.meta}</span>
                  ) : null}
                </div>
                <ul className="mt-1 flex flex-col gap-0.5">
                  {role.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-1.5">
                      <span aria-hidden="true" className="text-foreground-subtle">
                        •
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Key Project Experience">
          <div className="flex flex-col gap-2.5">
            {resume.projects.map((project) => (
              <div key={project.name}>
                <div className="flex flex-wrap items-baseline gap-x-1.5">
                  <h3 className="text-[11.5px] font-semibold text-foreground">
                    {project.name} — {project.summary}
                  </h3>
                  <span className="text-foreground-subtle">|</span>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    GitHub
                  </a>
                  <span className="italic text-foreground-subtle">| {project.stack}</span>
                </div>
                <ul className="mt-1 flex flex-col gap-0.5">
                  {project.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-1.5">
                      <span aria-hidden="true" className="text-foreground-subtle">
                        •
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Education">
          <p className="text-foreground">
            <span className="font-semibold">{resume.education.degree}</span>
            <span className="text-foreground-subtle"> | </span>
            {resume.education.institution}
            <span className="text-foreground-subtle"> | </span>
            {resume.education.detail}
          </p>
        </Section>
      </article>
    </div>
  );
}

/** A titled block with a rule under it, spaced for the printed page. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-2.5 first:mt-2.5">
      <h2 className="mb-1.5 border-b border-border pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
