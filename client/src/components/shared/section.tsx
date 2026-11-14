import type { ComponentProps, ReactNode } from "react";

import { SectionGlow } from "@/components/shared/section-glow";
import { cn } from "@/lib/utils";

interface SectionProps extends ComponentProps<"section"> {
  id: string;
  /** id of the heading element that labels this section. */
  labelledBy?: string;
  children: ReactNode;
  /** Sections are divided by a hairline rule by default. */
  bordered?: boolean;
  /** Background treatment. */
  tone?: "default" | "raised";
  /**
   * The section's own pool of light. Its hue is derived from the section `id`,
   * so twelve sections read as twelve rooms. Turn it off for sections that
   * already carry their own treatment.
   */
  glow?: boolean;
}

/**
 * Shared section shell.
 *
 * Centralising padding, max width, the divider and the section's light is what
 * keeps the vertical rhythm identical across twelve sections instead of
 * approximately identical. The light sits behind the content (`z-0` against the
 * shell's `z-10`) so it can never wash over type.
 */
export function Section({
  id,
  labelledBy,
  children,
  className,
  bordered = true,
  tone = "default",
  glow = true,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative scroll-mt-20 py-20 md:py-24 lg:py-28",
        bordered && "section-seam",
        tone === "raised" && "bg-surface-raised",
        className,
      )}
      {...props}
    >
      {glow ? <SectionGlow seed={id} /> : null}
      <div className="shell relative z-10">{children}</div>
    </section>
  );
}
