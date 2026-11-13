import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * Soft colour clouds for a hero-shaped band.
 *
 * Four blurred radial gradients, each drifting on its own long loop, so a band
 * is never flat and no two frames look identical. They are the palette's own
 * lights — violet, cyan, and champagne, with ice for depth — kept low in
 * strength, which is what makes the result read as deep navy with colour in it
 * rather than as a wash of unrelated hues.
 *
 * Where the site-wide `MeshBackdrop` is a fixed atmosphere, this is a local
 * one: bigger clouds, slower tempos, placed inside a section. The two are
 * composited independently, so a hero can carry both without either being
 * visible as a separate layer.
 *
 * The blobs are composited (transform-only animation over blurred paint), the
 * component is a server component, and the global prefers-reduced-motion rule
 * freezes them for anyone who asks for less motion.
 */

interface AuroraBlob {
  id: string;
  /** Position and size utilities; kept explicit so the layout is readable. */
  className: string;
  color: string;
  opacity: string;
}

const blobs: AuroraBlob[] = [
  {
    id: "violet",
    className: "left-[-16%] top-[-22%] size-[46rem] animate-aurora-1",
    color: "var(--color-accent-violet)",
    opacity: "0.38",
  },
  {
    id: "cyan",
    className: "right-[-18%] top-[2%] size-[34rem] animate-aurora-2",
    color: "var(--color-accent-cyan)",
    opacity: "0.26",
  },
  {
    id: "champagne",
    className: "left-[24%] top-[38%] size-[38rem] animate-aurora-3",
    color: "var(--color-accent)",
    opacity: "0.2",
  },
  {
    id: "ice",
    className: "right-[6%] bottom-[-22%] size-[32rem] animate-aurora-2",
    color: "var(--color-accent-ice)",
    opacity: "0.18",
  },
];

export function AuroraBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {blobs.map((blob) => (
        <span
          key={blob.id}
          className={cn("aurora-blob", blob.className)}
          style={
            {
              "--blob-color": blob.color,
              "--blob-opacity": blob.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

