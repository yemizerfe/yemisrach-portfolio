import type { ReactNode } from "react";

interface ResumeSectionProps {
  title: string;
  children: ReactNode;
}

/** Print-friendly titled block used on the /resume page. */
export function ResumeSection({ title, children }: ResumeSectionProps) {
  return (
    <section className="border-b border-border py-8 first:pt-10">
      <h2 className="eyebrow mb-5">{title}</h2>
      {children}
    </section>
  );
}
