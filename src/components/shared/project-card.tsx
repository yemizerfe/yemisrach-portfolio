import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { GitHubIcon } from "@/components/shared/github-icon";
import { TechBadgeList } from "@/components/shared/tech-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/portfolio";
import { accentFor } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  /** 1-based position, rendered as the card's index. */
  position: number;
}

/**
 * Flagship project card.
 *
 * The stack is read backend-first: what the server side uses, then the
 * supporting interface layer, then anything designed but not yet implemented.
 * A project with no backend layer says so instead of borrowing credibility
 * from the technologies around it.
 *
 * Buttons are conditional: a GitHub link only appears when a public
 * repository exists, and a live demo only when something is actually
 * deployed. Nothing is rendered as a placeholder.
 *
 * The card's hue is derived from the project slug, so a project keeps its
 * colour across the grid, the case-study page and the hover glow.
 */
export function ProjectCard({ project, position }: ProjectCardProps) {
  const index = String(position).padStart(2, "0");
  const accent = accentFor(project.slug);

  return (
    <article
      className={cn(
        "card-glow plate-marks aurora-border group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card bg-linear-to-br",
        accent.plate,
        accent.glow,
      )}
    >
      {/* Whole-card link target, sitting beneath the action buttons. */}
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-0"
        aria-label={`${project.name} — read the case study`}
      />

      <div className="relative z-10 flex flex-1 flex-col gap-6 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className={cn("eyebrow", accent.soft)}>
              {project.category}
            </span>
            <h3 className="text-2xl font-medium tracking-tight text-foreground">
              {project.name}
            </h3>
          </div>
          {/* The index takes the project's own register as a tinted chip, so
              the card's colour reads from the number down. */}
          <span
            className={cn(
              "rounded-md border px-2 py-0.5 font-mono text-[11px] tracking-tight",
              accent.chip,
            )}
          >
            {index}
          </span>
        </div>

        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>

        <div className="flex flex-col gap-3 border-y border-border py-5">
          <p className="eyebrow">Key technologies</p>
          <TechBadgeList
            items={project.technologies.slice(0, 6)}
            label={`${project.name} key technologies`}
            tone="subtle"
          />
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
          <Badge variant="status">{project.status}</Badge>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-2 border-t border-border bg-linear-to-r from-secondary/40 to-transparent px-6 py-4 sm:px-7">
        <Button asChild size="sm" variant="secondary" className="z-10">
          <Link href={`/projects/${project.slug}`}>
            View Case Study
            <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Button>

        {project.githubUrl ? (
          <Button asChild size="sm" variant="ghost" className="z-10">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${project.name} source code on GitHub`}
            >
              <GitHubIcon className="size-4" />
              GitHub
            </a>
          </Button>
        ) : null}

        {project.liveUrl ? (
          <Button asChild size="sm" variant="ghost" className="z-10">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${project.name} live demo`}
            >
              <ArrowUpRight className="size-4" />
              Live demo
            </a>
          </Button>
        ) : null}
      </div>
    </article>
  );
}
