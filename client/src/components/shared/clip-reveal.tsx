"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface ClipRevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds. Used to stagger sibling reveals. */
  delay?: number;
}

/**
 * Masked text reveal.
 *
 * The content is uncovered through a bottom-up clip mask while it rises a
 * few pixels — the type reads as being printed into place rather than
 * faded in, which is what separates an editorial reveal from a generic
 * fade. Used for the display headings, where the mask is most legible.
 *
 * Reduced motion returns the children untouched: the server markup is
 * already the final state, so nothing is delayed or hidden for those
 * visitors. Follows the same contract as `Reveal`.
 */
export function ClipReveal({ children, className, delay = 0 }: ClipRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20, clipPath: "inset(0% 0% 100% 0%)" }}
        whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "-72px" }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
