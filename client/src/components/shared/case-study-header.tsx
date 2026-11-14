import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { ProjectActions } from "@/components/shared/project-actions";
import { StatusPill } from "@/components/shared/status-pill";
import { TechBadgeList } from "@/components/shared/tech-badge";
import type { Project } from "@/types/portfolio";

interface CaseStudyHeaderProps {
  project: Project;
  position: number;
  total: number;
}

/** Case-study hero: identity, honesty about status, stack and actions. */
export function CaseStudyHeader({ project, position, total }: CaseStudyHeaderProps) {
  const index = String(position).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  return (
    <header className="light-field relative border-b border-border bg-surface-raised">
      <div className="shell py-12 md:py-16 lg:py-20">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </li>
            <ChevronRight aria-hidden="true" className="size-3.5 text-foreground-subtle" />
            <li>
              <Link
                href="/#projects"
                className="transition-colors hover:text-foreground"
              >
                Projects
              </Link>
            </li>
            <ChevronRight aria-hidden="true" className="size-3.5 text-foreground-subtle" />
            <li aria-current="page" className="text-foreground">
              {project.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">
                {index} / {totalLabel}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-border-strong" />
              <span className="eyebrow">{project.category}</span>
            </div>

            <h1 className="text-gradient animate-text-sheen text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              {project.name}
            </h1>

            <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {project.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <StatusPill status={project.status} tone="active" />
            </div>

            <ProjectActions
              slug={project.slug}
              name={project.name}
              githubUrl={project.githubUrl}
              liveUrl={project.liveUrl}
              showCaseStudy={false}
              className="flex flex-wrap items-center gap-3"
            />
          </div>

          <div className="flex flex-col gap-6 lg:border-l lg:border-border lg:pl-10">
            <div className="flex flex-col gap-3">
              <p className="eyebrow">Stack</p>
              <TechBadgeList
                items={project.technologies}
                label={`${project.name} technology stack`}
              />
            </div>

            <div className="flex flex-col gap-3">
              <p className="eyebrow">Engineering concepts</p>
              <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                {project.engineeringConcepts.map((concept) => (
                  <li
                    key={concept}
                    className="flex items-center gap-1.5 text-[12px] text-foreground-subtle"
                  >
                    <span aria-hidden="true" className="text-accent-soft">
                      •
                    </span>
                    {concept}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
