import Link from "next/link";
import { ArrowUpRight, FileText, Printer } from "lucide-react";

import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";

/**
 * Resume.
 *
 * The download button only appears when a real PDF exists at
 * `siteConfig.resumePdf`. Until then the resume lives on /resume, which
 * prints cleanly to PDF from the browser — no placeholder file, no broken
 * link.
 */
export function Resume() {
  const hasPdf = Boolean(siteConfig.resumePdf);

  return (
    <Section id="resume" labelledBy="resume-heading" tone="raised">
      <div className="flex flex-col gap-10">
        <SectionHeading
          id="resume-heading"
          index="10"
          eyebrow="Resume"
          title="Resume"
          description="A concise overview of my education, technical skills and projects — the same information that is on this page, in a form that is easier to skim or hand to someone else."
        />

        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={siteConfig.resumePath}>
                <FileText />
                View resume
              </Link>
            </Button>

            {hasPdf ? (
              <Button asChild size="lg" variant="secondary">
                <a
                  href={siteConfig.resumePdf as string}
                  download
                  aria-label="Download the resume as a PDF"
                >
                  <ArrowUpRight />
                  Download PDF
                </a>
              </Button>
            ) : null}
          </div>

          <p className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-foreground-subtle">
            <Printer aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span>
              {hasPdf
                ? "The PDF is the same content as the on-site resume."
                : "The on-site resume is print-ready: use your browser's print dialog (Ctrl/Cmd + P) and choose “Save as PDF” if you need a file."}
            </span>
          </p>
        </div>
      </div>
    </Section>
  );
}
