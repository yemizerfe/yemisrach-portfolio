import { accentFor } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface SectionGlowProps {
  /**
   * The seed the hue is derived from — normally the section id, so a section
   * keeps the same light on every render and on every route.
   */
  seed: string;
  className?: string;
}

/**
 * Per-section light.
 *
 * Two soft pools of the section's own register, one in the top corner and one
 * in the bottom corner, so the twelve sections read as twelve rooms instead of
 * one long corridor. The hue is *derived*, never chosen: `accentFor(seed)`
 * means a new section automatically gets a light that differs from its
 * neighbours, and no list has to be maintained.
 *
 * The hue arrives as an inline custom property rather than a class, because
 * `--glow-color` is what `.section-glow > span` reads; the class-based version
 * of the same token lives in `accents.ts` for the hover treatments.
 *
 * Decorative by construction: aria-hidden, pointer-events-none, absolutely
 * positioned, and stopped by the global reduced-motion rule in `globals.css`.
 */
export function SectionGlow({ seed, className }: SectionGlowProps) {
  const accent = accentFor(seed);

  return (
    <div aria-hidden="true" className={cn("section-glow", className)}>
      <span
        className="left-[-14%] top-[-34%] size-[38rem]"
        style={
          {
            "--glow-color": accent.token,
            "--glow-duration": "48s",
          } as React.CSSProperties
        }
      />
      <span
        className="right-[-12%] bottom-[-38%] size-[32rem]"
        style={
          {
            "--glow-color": accent.token,
            "--glow-duration": "66s",
          } as React.CSSProperties
        }
      />
    </div>
  );
}

