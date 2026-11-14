"use client";

import { useEffect, useRef } from "react";

/**
 * CanvasBackdrop — the painted light layer, drawn on a real `<canvas>`.
 *
 * The rest of the background is SVG plates and CSS paint; this one is the
 * artistic stroke: seven slow ribbons of light sweeping the viewport on
 * shallow diagonals, the long-exposure light-streak look. Each ribbon is
 * three stacked strokes — a wide wash, a body, and a bright core — composited
 * with `globalCompositeOperation = "lighter"`, so crossings bloom the way two
 * beams of light add rather than overwrite. Sixteen seeded motes drift over
 * the ribbons for depth.
 *
 * Two rules keep it on-theme:
 *
 * 1. Every colour is resolved from the navy theme's own tokens at mount
 *    (`--color-accent-violet`, `--color-accent-cyan`, `--color-accent`,
 *    `--color-accent-ice`), with the current hex as fallback — so the canvas
 *    can only ever show the four lights the rest of the site uses, and a
 *    theme change flows into it without touching this file.
 * 2. Reduced motion gets one still frame instead of a loop, and a change to
 *    the media query starts or stops the loop to match. The loop also pauses
 *    while the tab is hidden, and the backing store is capped at 1.75× DPR
 *    so a 4K display does not pay four times for a decorative layer.
 *
 * Decorative only: aria-hidden, pointer-events-none, no input, and all state
 * lives inside the effect — the server markup is an empty canvas element.
 */

const TAU = Math.PI * 2;

interface Ribbon {
  token: string;
  /** Current hex for the token; used if the custom property is missing. */
  fallback: string;
  /** Vertical anchor across the viewport, 0–1. */
  y: number;
  /** Wave amplitude as a fraction of viewport height. */
  amp: number;
  /** Wave cycles across the full width. */
  freq: number;
  /** Cycles per second the phase advances — deliberately slow. */
  speed: number;
  /** Diagonal drift: fraction of height gained across one full width. */
  tilt: number;
  /** Core stroke width in CSS pixels. */
  width: number;
  /** Multiplier applied to every pass's alpha. */
  alpha: number;
  /** Radians of phase offset so no two ribbons crest together. */
  phase: number;
}

const ribbons: Ribbon[] = [
  { token: "--color-accent-violet", fallback: "#8b5cf6", y: 0.14, amp: 0.05, freq: 1.5, speed: 0.035, tilt: -0.1, width: 2.6, alpha: 1, phase: 0 },
  { token: "--color-accent-cyan", fallback: "#22d3ee", y: 0.27, amp: 0.07, freq: 1.1, speed: 0.026, tilt: -0.16, width: 2.2, alpha: 0.9, phase: 1.7 },
  { token: "--color-accent", fallback: "#e0b978", y: 0.39, amp: 0.05, freq: 1.8, speed: 0.04, tilt: -0.08, width: 1.8, alpha: 0.75, phase: 3.1 },
  { token: "--color-accent-violet", fallback: "#8b5cf6", y: 0.52, amp: 0.09, freq: 0.9, speed: 0.022, tilt: -0.2, width: 3.2, alpha: 0.8, phase: 4.4 },
  { token: "--color-accent-ice", fallback: "#8fa6d4", y: 0.64, amp: 0.06, freq: 1.3, speed: 0.032, tilt: -0.12, width: 2, alpha: 0.7, phase: 0.9 },
  { token: "--color-accent-cyan", fallback: "#22d3ee", y: 0.77, amp: 0.08, freq: 1, speed: 0.028, tilt: -0.18, width: 2.4, alpha: 0.7, phase: 2.4 },
  { token: "--color-accent-violet", fallback: "#8b5cf6", y: 0.89, amp: 0.05, freq: 1.6, speed: 0.038, tilt: -0.1, width: 2, alpha: 0.65, phase: 5.2 },
];

/** Stroke passes per ribbon: [width multiplier, base alpha]. Additive, so the
 *  wide passes paint the wash and the core pass draws the filament. */
const passes: [number, number][] = [
  [8, 0.03],
  [3.2, 0.065],
  [1.25, 0.3],
];

const moteTokens: [string, string][] = [
  ["--color-accent-violet", "#8b5cf6"],
  ["--color-accent-cyan", "#22d3ee"],
  ["--color-accent", "#e0b978"],
  ["--color-accent-ice", "#8fa6d4"],
];

interface Mote {
  x: number;
  y: number;
  size: number;
  /** Viewport fractions per second. */
  speed: number;
  phase: number;
  color: number;
}

/** Seeded scatter, same LCG as the other decorative layers: the drift is part
 *  of the design, not a per-visit random effect. */
const motes: Mote[] = (() => {
  let state = 20240611;
  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  return Array.from({ length: 16 }, (_, index) => ({
    x: next(),
    y: next() * 0.94 + 0.03,
    size: 1.2 + next() * 1.8,
    speed: 0.005 + next() * 0.01,
    phase: next() * TAU,
    color: index % moteTokens.length,
  }));
})();

interface CanvasBackdropProps {
  className?: string;
}

export function CanvasBackdrop({ className }: CanvasBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Resolve the tokens once at mount: the canvas paints with the theme's
    // own four lights, never with literals of its own choosing.
    const styles = getComputedStyle(document.documentElement);
    const ribbonColors = ribbons.map(
      (ribbon) => styles.getPropertyValue(ribbon.token).trim() || ribbon.fallback,
    );
    const moteColors = moteTokens.map(
      ([token, fallback]) => styles.getPropertyValue(token).trim() || fallback,
    );

    let width = 0;
    let height = 0;
    let raf = 0;
    let start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** One frame at time `t` (seconds). Also used for the reduced-motion
     *  still, so that frame is composed, not blank. */
    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalCompositeOperation = "lighter";

      // Ribbons: sample the wave across the width (plus bleed), stroke the
      // three passes wash → body → core so crossings bloom.
      for (let r = 0; r < ribbons.length; r++) {
        const ribbon = ribbons[r];
        const color = ribbonColors[r];
        const step = Math.max(24, width / 40);

        const points: [number, number][] = [];
        for (let x = -60; x <= width + 60; x += step) {
          const u = (x + 60) / (width + 120);
          const y =
            ribbon.y * height +
            ribbon.tilt * height * u +
            Math.sin(u * ribbon.freq * TAU + t * ribbon.speed * TAU + ribbon.phase) *
              ribbon.amp *
              height +
            Math.sin(u * ribbon.freq * 0.5 * TAU - t * ribbon.speed * TAU * 0.6 + ribbon.phase) *
              ribbon.amp *
              height *
              0.4;
          points.push([x, y]);
        }

        for (const [widthMul, baseAlpha] of passes) {
          ctx.beginPath();
          ctx.moveTo(points[0][0], points[0][1]);
          for (let i = 1; i < points.length - 1; i++) {
            const [x1, y1] = points[i];
            const [x2, y2] = points[i + 1];
            ctx.quadraticCurveTo(x1, y1, (x1 + x2) / 2, (y1 + y2) / 2);
          }
          ctx.strokeStyle = color;
          ctx.globalAlpha = Math.min(1, baseAlpha * ribbon.alpha);
          ctx.lineWidth = ribbon.width * widthMul;
          ctx.stroke();
        }
      }

      // Motes: small additive dots drifting along the same diagonals.
      for (const mote of motes) {
        const x = ((mote.x + t * mote.speed) % 1) * width;
        const y =
          (((mote.y + t * mote.speed * 0.4) % 1) + 1) % 1 * height +
          Math.sin(t * 0.6 + mote.phase) * 8;
        const flicker = 0.35 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.4 + mote.phase));
        ctx.beginPath();
        ctx.fillStyle = moteColors[mote.color];
        ctx.globalAlpha = flicker;
        ctx.arc(x, y, mote.size, 0, TAU);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      cancelAnimationFrame(raf);
      if (reduceMotion.matches) {
        draw(1.75); // composed still frame, not an empty canvas
        return;
      }
      start = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const stopLoop = () => cancelAnimationFrame(raf);

    const onVisibility = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    const onResize = () => {
      resize();
      if (reduceMotion.matches) draw(1.75);
    };

    resize();
    startLoop();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener("change", startLoop);

    return () => {
      stopLoop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", startLoop);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      <canvas ref={canvasRef} className="block size-full opacity-80 mix-blend-screen" />
    </div>
  );
}
