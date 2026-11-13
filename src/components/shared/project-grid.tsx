import { ProjectCard } from "@/components/shared/project-card";
import { Reveal } from "@/components/shared/reveal";
import { projects } from "@/data/projects";

interface ProjectGridProps {
  className?: string;
}

/** Per-position spans: a 7/5 then 5/7 zigzag, so the four cards never form
 *  two identical rows. Unknown positions fall back to a balanced half. */
const positionSpans = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
];

/** Zigzag 12-col grid of flagship projects on desktop, single column on mobile. */
export function ProjectGrid({ className }: ProjectGridProps) {
  return (
    <ul className={className ? `grid gap-5 lg:grid-cols-12 ${className}` : "grid gap-5 lg:grid-cols-12"}>
      {projects.map((project, index) => (
        <Reveal
          as="li"
          key={project.slug}
          delay={index * 0.05}
          className={positionSpans[index] ?? "lg:col-span-6"}
        >
          <ProjectCard project={project} position={index + 1} />
        </Reveal>
      ))}
    </ul>
  );
}
