"use client";

import { useEffect, useState } from "react";

/**
 * Scroll spy for section anchors.
 *
 * The active section is the last one whose top has crossed the reading line,
 * 30% down the viewport. That is measured from geometry on a passive,
 * frame-throttled scroll listener rather than from IntersectionObserver
 * ratios: every section here is taller than the viewport, so its intersection
 * ratio with the spy's band never crosses the observer thresholds — which
 * makes an observer miss whole sections and skip the one you just jumped to.
 * Geometry answers the same question at any scroll position, at any speed.
 *
 * The listener only sets React state; it does not touch the 3D backdrop or
 * any other part of the page. State is set on the animation frame, not on
 * every scroll event, and React bails out when the id has not changed.
 */
export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (sectionIds.length === 0) {
      return;
    }

    let frame = 0;
    let timer = 0;

    const measure = () => {
      frame = 0;
      if (timer !== 0) {
        window.clearTimeout(timer);
        timer = 0;
      }
      const line = window.innerHeight * 0.3;
      let current = sectionIds[0] ?? null;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element === null) {
          continue;
        }
        if (element.getBoundingClientRect().top <= line) {
          current = id;
        }
      }

      // At the end of the page the final section is what you are reading,
      // even when its top has not reached the line yet.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        current = sectionIds[sectionIds.length - 1] ?? current;
      }

      setActiveId(current);
    };

    // Measure on the next frame, with a timer as a backstop: a tab that is
    // not painting (background, or a hidden preview pane) never runs the
    // animation frame, and the address bar must still keep up.
    const schedule = () => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(measure);
      timer = window.setTimeout(measure, 150);
    };

    measure();
    // A scroll that happens while the page is still hydrating fires before
    // this listener exists, so take one more reading once the page settles.
    const settle = window.setTimeout(measure, 350);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    // Fonts and images settle after first paint and move the sections.
    window.addEventListener("load", schedule);
    // A tab that was not painting (background, or a hidden preview pane)
    // dispatches no scroll events, so catch up the moment it is shown.
    document.addEventListener("visibilitychange", schedule);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      document.removeEventListener("visibilitychange", schedule);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      if (timer !== 0) {
        window.clearTimeout(timer);
      }
    };
  }, [sectionIds]);

  return activeId;
}
