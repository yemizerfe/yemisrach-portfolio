import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CaseStudyBlocks } from "@/components/shared/case-study-blocks";
import { CaseStudyHeader } from "@/components/shared/case-study-header";
import { CaseStudyNav } from "@/components/shared/case-study-nav";
import {
  getProjectBySlug,
  getProjectNeighbours,
  projects,
} from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

/** Every case study is statically generated at build time. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  const title = `${project.name} — ${project.category}`;
  const path = `/projects/${project.slug}`;

  return {
    title,
    description: project.tagline,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title,
      description: project.tagline,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.tagline,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const position = projects.findIndex((item) => item.slug === project.slug) + 1;
  const { previous, next } = getProjectNeighbours(project.slug);
  const sections = project.caseStudy.map((block) => ({
    id: block.id,
    title: block.title,
  }));

  return (
    <>
      <CaseStudyHeader project={project} position={position} total={projects.length} />

      <div className="shell py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <CaseStudyNav sections={sections} projectName={project.name} />
          </div>

          <div className="min-w-0">
            <CaseStudyBlocks blocks={project.caseStudy} />

            <nav
              aria-label="Other case studies"
              className="mt-20 grid gap-3 border-t border-border pt-8 sm:grid-cols-2"
            >
              {previous ? (
                <Link
                  href={`/projects/${previous.slug}`}
                  className="group flex flex-col gap-1.5 rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-border-strong"
                >
                  <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-foreground-subtle">
                    <ArrowLeft aria-hidden="true" className="size-3.5" />
                    Previous
                  </span>
                  <span className="text-[15px] font-medium tracking-tight text-foreground">
                    {previous.name}
                  </span>
                  <span className="text-[12.5px] text-muted-foreground">
                    {previous.category}
                  </span>
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}

              {next ? (
                <Link
                  href={`/projects/${next.slug}`}
                  className="group flex flex-col items-start gap-1.5 rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-border-strong sm:items-end sm:text-right"
                >
                  <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-foreground-subtle">
                    Next
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </span>
                  <span className="text-[15px] font-medium tracking-tight text-foreground">
                    {next.name}
                  </span>
                  <span className="text-[12.5px] text-muted-foreground">
                    {next.category}
                  </span>
                </Link>
              ) : null}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
