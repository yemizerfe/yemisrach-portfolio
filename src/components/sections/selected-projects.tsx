import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectGrid } from "@/components/shared/project-grid";
/**
 * Selected projects — four builds, each with its own engineering case study.
 *
 * Deliberately not a wall of every repository: four projects explained
 * properly, ordered by backend engineering value, beat twenty listed. Each
 * card leads with the backend stack, and the deeper reading lives on the case
 * study pages.
 */
export function SelectedProjects() {
  return (
    <Section id="projects" labelledBy="projects-heading">
      <div className="flex flex-col gap-12 lg:gap-14">
        <SectionHeading
          id="projects-heading"
          index="01"
          eyebrow="Selected projects"
          title="Backend-focused systems, documented properly."
          gradient="vivid"
          description="Backend-focused applications demonstrating API design, databases, authentication, realtime communication, data processing, and system architecture."
        />

        <ProjectGrid />
      </div>
    </Section>
  );
}
