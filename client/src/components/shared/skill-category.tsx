import {
  Boxes,
  Cloud,
  Database,
  Layers,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { EngineeringCard } from "@/components/shared/engineering-card";
import { Reveal } from "@/components/shared/reveal";
import { skillCategories } from "@/data/engineering";

/** Icon per discipline. Kept beside the data mapping so it stays in one place. */
const categoryIcons: Record<string, LucideIcon> = {
  backend: Server,
  databases: Database,
  infrastructure: Cloud,
  security: ShieldCheck,
  frontend: Layers,
};

interface SkillCategoryGridProps {
  className?: string;
}

/**
 * Discipline grid: what each area covers and the tools used in it.
 *
 * Categories arrive backend-first and the frontend category last, so the grid
 * reads in the order the positioning does.
 */
export function SkillCategoryGrid({ className }: SkillCategoryGridProps) {
  return (
    // Bento default: two wide categories over three narrower ones (6/6 then
    // 4/4/4 of a 12-col grid), so this grid never mirrors the pillar grid.
    <div className={className ?? "grid gap-x-8 gap-y-9 md:grid-cols-2 lg:grid-cols-12"}>
      {skillCategories.map((category, index) => (
        <Reveal
          key={category.id}
          delay={(index % 3) * 0.05}
          className={`h-full ${
            ["lg:col-span-6", "lg:col-span-6", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"][index] ?? "lg:col-span-4"
          }`}
        >
          <EngineeringCard
            category={category}
            icon={categoryIcons[category.id] ?? Boxes}
          />
        </Reveal>
      ))}
    </div>
  );
}
