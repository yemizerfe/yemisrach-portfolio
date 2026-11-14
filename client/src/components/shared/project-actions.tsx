import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { GitHubIcon } from "@/components/shared/github-icon";
import { Button } from "@/components/ui/button";

interface ProjectActionsProps {
  slug: string;
  name: string;
  githubUrl?: string;
  liveUrl?: string;
  /** Hides the case-study button when already on the case study page. */
  showCaseStudy?: boolean;
  className?: string;
}

/**
 * Project action buttons.
 *
 * Shared by the project card and the case-study hero so the rules are in one
 * place: no demo button without a deployment, no GitHub button without a
 * public repository.
 */
export function ProjectActions({
  slug,
  name,
  githubUrl,
  liveUrl,
  showCaseStudy = true,
  className,
}: ProjectActionsProps) {
  return (
    <div className={className}>
      {showCaseStudy ? (
        <Button asChild>
          <Link href={`/projects/${slug}`}>
            Read case study
            <ArrowUpRight />
          </Link>
        </Button>
      ) : null}

      {githubUrl ? (
        <Button asChild variant="secondary">
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${name} source code on GitHub`}
          >
            <GitHubIcon className="size-4" />
            GitHub
          </a>
        </Button>
      ) : null}

      {liveUrl ? (
        <Button asChild variant="secondary">
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${name} live demo`}
          >
            <ArrowUpRight />
            Live demo
          </a>
        </Button>
      ) : null}
    </div>
  );
}
