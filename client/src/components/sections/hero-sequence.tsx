"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

/**
 * HeroSequence — the directed opening shot for `#top`.
 *
 * One GSAP timeline that plays the hero the way a title sequence is cut
 * rather than as a stack of unrelated fade-ins:
 *
 *   0.75s  the status row signals in
 *   0.95s  "Hi, I'm …" leans in
 *   1.10s  the headline is revealed through a clip mask
 *   1.65s  lead copy, supporting copy, focus areas and the tech rail follow
 *   2.10s  the call to action settles
 *   2.25s  the "current focus" block closes the column
 *   1.15s  the portrait arrives alongside the headline (parallel track)
 *   2.50s  the three stat plates pop in, staggered
 *\ * The headline reveal animates only `clip-path`, `opacity` and `transform`
 * — all compositor-friendly properties. An earlier version also animated
 * `filter: blur()`, which repaints the large gradient headline on every
 * frame and is the classic source of visible jank on mid-range laptops.
 *
 * The timings sit under the scene's 2.6s entrance so the room lights up
 * first, the subject turns, and only then does the type speak — the order
 * the spec asks for: atmosphere → subject → headline → support → CTA.
 *
 * Initial states are applied in a layout effect (before first paint), so
 * there is no flash of un-animated content; every target is guarded, so a
 * missing element simply does not animate. Reduced motion skips the
 * timeline entirely — the server HTML is already the final state. The
 * context is reverted on unmount, restoring inline styles cleanly.
 */
export function HeroSequence() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const scope = document.getElementById("top");
    if (!scope) return;

    const pick = (name: string) =>
      Array.from(scope.querySelectorAll<HTMLElement>(`[data-seq="${name}"]`));

    const groups: Record<string, HTMLElement[]> = {
      status: pick("status"),
      intro: pick("intro"),
      headline: pick("headline"),
      lead: pick("lead"),
      support: pick("support"),
      areas: pick("areas"),
      marquee: pick("marquee"),
      cta: pick("cta"),
      focus: pick("focus"),
      portrait: pick("portrait"),
      plate: pick("plate"),
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      const fadeUp = (
        key: keyof typeof groups,
        at: number,
        y = 16,
        duration = 0.9,
      ) => {
        const targets = groups[key];
        if (!targets.length) return;
        gsap.set(targets, { opacity: 0, y });
        tl.to(targets, { opacity: 1, y: 0, duration }, at);
      };

      fadeUp("status", 0.75, 10, 0.7);
      fadeUp("intro", 0.95, 14, 0.8);

      // The headline is the one element that gets a real mask reveal: it is
      // clipped from the bottom up as it settles, so the type emerges from
      // the light of the scene instead of merely fading. Only compositor-
      // friendly properties are animated — no per-frame repaints.
      if (groups.headline.length) {
        gsap.set(groups.headline, {
          opacity: 0,
          y: 30,
          clipPath: "inset(0% 0% 100% 0%)",
        });
        tl.to(
          groups.headline,
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.15,
            ease: "expo.out",
          },
          1.1,
        );
      }

      fadeUp("lead", 1.65, 14);
      fadeUp("support", 1.78, 12);
      fadeUp("areas", 1.9, 12, 0.8);
      fadeUp("marquee", 2.0, 12, 0.8);
      fadeUp("cta", 2.1, 14, 0.85);
      fadeUp("focus", 2.25, 12, 0.8);

      // Portrait: a slow 3D settle arriving in parallel with the headline,
      // as the right-hand half of the same shot.
      if (groups.portrait.length) {
        gsap.set(groups.portrait, {
          opacity: 0,
          y: 26,
          scale: 0.955,
          rotateY: -10,
          transformPerspective: 900,
        });
        tl.to(
          groups.portrait,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            duration: 1.5,
            ease: "power4.out",
          },
          1.15,
        );
      }

      // Stat plates: small punctuation marks at the very end.
      if (groups.plate.length) {
        gsap.set(groups.plate, { opacity: 0, y: 14, scale: 0.85 });
        tl.to(
          groups.plate,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "back.out(1.6)",
          },
          2.5,
        );
      }
    }, scope);

    return () => ctx.revert();
  }, []);

  return null;
}
