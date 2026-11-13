"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds. Used to stagger siblings; kept small on purpose. */
  delay?: number;
  /** Starting vertical offset in pixels. */
  y?: number;
  as?: "div" | "li" | "section";
}

/**
 * Subtle scroll reveal.
 *
 * Returns plain markup when the visitor prefers reduced motion, so nothing
 * moves, fades or delays for them — the content is simply there.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  as = "div",
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
