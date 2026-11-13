/**
 * Atmospheric overlays: a corner vignette and a film-grain layer.
 *
 * This is the difference between a flat navy rectangle and a surface with
 * depth. The vignette pulls the far corners back towards the page colour so the
 * content column reads as lit from the middle, and the grain — a static noise
 * tile blended as soft-light — removes the banding a large flat field always
 * shows and gives the page the tooth of printed paper.
 *
 * Both are pure decoration: aria-hidden, pointer-events-none, no state and no
 * client bundle. Nothing here animates, so the whole layer costs one composited
 * paint and no main-thread work.
 *
 * Kept beneath the content layer on purpose: grain over the cards would soften
 * small monospaced type, and the large flat areas are exactly where it shows.
 */
export function Atmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="vignette absolute inset-0" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
