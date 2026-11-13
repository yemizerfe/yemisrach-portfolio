import { cn } from "@/lib/utils";

/**
 * EngravingBackdrop — the illustrated layer of the background.
 *
 * Three hand-drawn plates in `public/images` carry the artistic weight that
 * flat colour cannot: a blueprint elevation of a server rack with its
 * datastore, cache, queue and workers (`blueprint-system.svg`); a circuit
 * layout with routed traces, vias and pads (`circuit-traces.svg`); and a
 * distributed system drawn as an orbital mandala (`topology-ring.svg`).
 * Every stroke in the plates is already a navy-palette value, so the images
 * belong to the page rather than sitting on top of it.
 *
 * Treatment: each plate is composited with `mix-blend-mode: screen` (dark
 * navy pixels become transparent, the lit strokes survive) at low opacity,
 * masked with a soft radial falloff so the plate dissolves instead of ending
 * on a rectangle edge, rotated a few degrees so the composition reads as
 * drawings pinned to a board rather than tiles in a grid, and floated on the
 * shared `float-soft` keyframe at its own tempo so the three never bob in
 * step. The global `prefers-reduced-motion` rule freezes them like every
 * other decorative layer.
 *
 * The component is a server component and the images are static SVGs, so
 * this layer adds no client JavaScript. Placement is decorative: the wrapper
 * is `aria-hidden` and `pointer-events-none`.
 */

interface Plate {
  id: string;
  src: string;
  /** Placement, size and rotation, kept explicit so the composition reads. */
  className: string;
  /** Seconds on the `float-soft` keyframe; each plate on its own tempo. */
  duration: string;
}

const plates: Plate[] = [
  {
    id: "blueprint",
    src: "/images/blueprint-system.svg",
    className:
      "left-[-6%] top-[6%] w-[min(54rem,68vw)] -rotate-2 opacity-[0.16] sm:opacity-[0.22]",
    duration: "46s",
  },
  {
    id: "circuit",
    src: "/images/circuit-traces.svg",
    className:
      "right-[-10%] top-[34%] w-[min(34rem,52vw)] rotate-3 opacity-[0.12] sm:opacity-[0.17]",
    duration: "54s",
  },
  {
    id: "topology",
    src: "/images/topology-ring.svg",
    className:
      "left-[4%] bottom-[-8%] w-[min(26rem,44vw)] opacity-[0.14] sm:opacity-[0.19]",
    duration: "62s",
  },
];

interface EngravingBackdropProps {
  className?: string;
}

export function EngravingBackdrop({ className }: EngravingBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {plates.map((plate) => (
        <img
          key={plate.id}
          src={plate.src}
          alt=""
          decoding="async"
          className={cn("plate-engraving absolute", plate.className)}
          style={{ animation: `float-soft ${plate.duration} ease-in-out infinite` }}
        />
      ))}
    </div>
  );
}
