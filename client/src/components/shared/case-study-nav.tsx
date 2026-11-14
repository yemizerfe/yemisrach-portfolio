"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

interface CaseStudyNavProps {
  /** Anchor ids of the case-study blocks, in document order. */
  sections: { id: string; title: string }[];
  projectName: string;
}

/**
 * Sticky case-study navigation.
 *
 * Desktop: a rail with an active indicator driven by a scroll spy.
 * Mobile: a horizontally scrollable chip row under the header — horizontal
 * scrolling is used here because the alternative is a menu the reader has to
 * open before they can navigate a long document.
 */
export function CaseStudyNav({ sections, projectName }: CaseStudyNavProps) {
  const ids = sections.map((section) => section.id);
  const activeId = useActiveSection(ids);

  return (
    <nav aria-label={`${projectName} case study sections`}>
      <Link
        href="/#projects"
        className="mb-5 inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        All projects
      </Link>

      <p className="eyebrow mb-4 hidden lg:block">On this page</p>

      {/*
        A case study now runs to eighteen sections, so the desktop rail scrolls
        inside the viewport instead of running off the bottom of the screen. The
        scrollbar is hidden because the rail is a list, not a document.
      */}
      <ul className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:mx-0 lg:max-h-[calc(100vh-12rem)] lg:flex-col lg:gap-0.5 lg:overflow-y-auto lg:px-0">
        {sections.map((section) => {
          const isActive = activeId === section.id;

          return (
            <li key={section.id} className="shrink-0 lg:shrink">
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-[12.5px] transition-colors lg:whitespace-normal",
                  isActive
                    ? "bg-secondary/60 text-foreground"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden h-px w-3 transition-colors lg:block",
                    isActive ? "bg-accent" : "bg-border-strong",
                  )}
                />
                {section.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
