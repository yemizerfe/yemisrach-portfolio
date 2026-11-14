import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { GitHubIcon } from "@/components/shared/github-icon";
import { TechBadgeList } from "@/components/shared/tech-badge";
import { PrintResumeButton } from "@/components/sections/print-resume-button";
import { ResumeSection } from "@/components/sections/resume-section";
import { Button } from "@/components/ui/button";
import { aboutParagraphs, education } from "@/data/about";
import { skillCategories } from "@/data/engineering";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Yemisrach Zerfe: education, technical skills and selected software engineering projects.",
  alternates: { canonical: siteConfig.resumePath },
};

/**
 * On-site resume.
 *
 * This is the real resume document: education, skills and projects, drawn from
 * the same typed data as the rest of the site. It prints cleanly to PDF from
 * the browser, so no placeholder PDF file has to exist.
 */
export default function ResumePage() {
  return (
    <div className="shell py-14 md:py-20">
      <div className="print-hidden mb-10 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/#resume"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to portfolio
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <PrintResumeButton />
          <Button asChild variant="secondary" size="sm">
            <a href={siteConfig.github} target="_blank" rel="noreferrer noopener">
              <GitHubIcon className="size-4" />
              GitHub
            </a>
          </Button>
        </div>
      </div>

      <article className="mx-auto max-w-3xl">
        <header className="flex flex-col gap-4 border-b border-border pb-8">
          <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {siteConfig.name}
          </h1>
          <p className="text-[15px] text-muted-foreground">{siteConfig.role}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] text-foreground-subtle">
            <span>{siteConfig.location}</span>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent-soft underline-offset-4 hover:underline"
            >
              github.com/{siteConfig.githubHandle}
            </a>
          </div>
        </header>

        <ResumeSection title="Summary">
          <div className="flex flex-col gap-4">
            {aboutParagraphs.map((paragraph, index) => (
              <p
                key={`summary-${index}`}
                className="text-[14px] leading-[1.75] text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title="Education">
          <div className="flex flex-col gap-2">
            <h3 className="text-[15px] font-medium tracking-tight text-foreground">
              {education.degree}
            </h3>
            <p className="text-[13.5px] text-muted-foreground">
              {education.institution}
            </p>
            <p className="text-[13px] text-muted-foreground">{education.status}</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {education.focus.map((item) => (
                <li key={item} className="flex gap-2.5 text-[13px] text-muted-foreground">
                  <span aria-hidden="true" className="text-accent-soft">
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[12px] text-foreground-subtle">{education.note}</p>
          </div>
        </ResumeSection>

        <ResumeSection title="Technical skills">
          <div className="flex flex-col gap-6">
            {skillCategories.map((category) => (
              <div key={category.id} className="flex flex-col gap-2.5">
                <h3 className="text-[13px] font-medium tracking-tight text-foreground">
                  {category.title}
                </h3>
                <TechBadgeList
                  items={category.items}
                  label={`${category.title} skills`}
                />
              </div>
            ))}
          </div>
        </ResumeSection>
      </article>
    </div>
  );
}
