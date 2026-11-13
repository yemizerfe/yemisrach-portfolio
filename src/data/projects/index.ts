import type { Project } from "@/types/portfolio";
import { ceooo } from "./ceooo";
import { estatePlus } from "./estateplus";
import { nexusGuard } from "./nexusguard";
import { weTalk } from "./wetalk";

/**
 * Ordered list of flagship projects.
 *
 * Order is deliberate: broader system-design projects first, product-concept
 * work last. Adding a project means adding a data file and one line here —
 * no component changes.
 */
export const projects: Project[] = [estatePlus, weTalk, nexusGuard, ceooo];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Neighbouring projects for previous / next navigation on a case study. */
export function getProjectNeighbours(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return { previous: undefined, next: undefined };
  }
  return {
    previous: index > 0 ? projects[index - 1] : undefined,
    next: index < projects.length - 1 ? projects[index + 1] : undefined,
  };
}
