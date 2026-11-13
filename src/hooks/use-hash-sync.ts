"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Keeps the address bar in step with the page, the way documentation and
 * marketing sites do it:
 *
 * 1. The hash names the section currently being read, so `/#projects` is
 *    always a link to what you are looking at. The hero is the base URL, so
 *    the top of the page stays a clean `/`.
 * 2. The entry is *replaced*, never pushed: Back returns to the previous page
 *    instead of walking back through every section you scrolled past.
 * 3. A deep link (`/#contact` opened from a search result or a shared URL) is
 *    jumped to once the page is interactive, because Next's scroll restoration
 *    can otherwise pull the restored jump back to the top. The spy stays out
 *    of the way until that jump has settled, so it cannot overwrite the
 *    requested section with whatever is on screen mid-restore.
 *
 * Only the home page is mirrored; /resume and case studies keep their own
 * paths and are not rewritten with a section hash.
 */
export function useHashSync(activeId: string | null) {
  const pathname = usePathname();
  const deepLinkPending = useRef(false);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash === "") {
      return;
    }

    const target = document.getElementById(hash);
    if (target === null) {
      return;
    }

    deepLinkPending.current = true;

    const jump = () =>
      target.scrollIntoView({ block: "start", behavior: "instant" });

    // Jump now, again after the first frame, and after the points where the
    // router's own scroll restoration tends to land, then hand the hash back
    // to the spy.
    jump();
    const frame = requestAnimationFrame(jump);
    const retries = [150, 400, 800, 1300].map((delay) =>
      window.setTimeout(jump, delay),
    );
    const settle = window.setTimeout(() => {
      deepLinkPending.current = false;
    }, 1600);

    return () => {
      deepLinkPending.current = false;
      cancelAnimationFrame(frame);
      retries.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(settle);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/" || activeId === null || deepLinkPending.current) {
      return;
    }

    const url = new URL(window.location.href);
    url.hash = activeId === "top" ? "" : activeId;

    if (url.hash === window.location.hash) {
      return;
    }

    window.history.replaceState(window.history.state, "", url);
  }, [activeId, pathname]);
}
