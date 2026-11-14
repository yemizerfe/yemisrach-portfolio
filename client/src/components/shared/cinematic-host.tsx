"use client";

import dynamic from "next/dynamic";

/**
 * CinematicHost — lazy entry point for the WebGL scene.
 *
 * The three.js bundle is the largest chunk on the site, so it is split out
 * with `next/dynamic` and never server-rendered: the page paints its HTML,
 * CSS atmosphere and content first, and the scene joins when the chunk
 * arrives. If WebGL is unavailable the scene simply never mounts and the
 * painted layers carry the room on their own.
 */
const CinematicScene = dynamic(
  () =>
    import("@/components/shared/cinematic-scene").then(
      (module) => module.CinematicScene,
    ),
  { ssr: false, loading: () => null },
);

export function CinematicHost() {
  return <CinematicScene />;
}
