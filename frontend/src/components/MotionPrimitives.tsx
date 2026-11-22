"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const CLINICAL_EASE = [0.22, 1, 0.36, 1] as const;

export const SHARED_PILL_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 30,
};

export const TAB_PANEL_TRANSITION = {
  duration: 0.22,
  ease: CLINICAL_EASE,
};

export const REVEAL_VIEWPORT = {
  once: true,
  amount: "some" as const,
};

interface RevealSectionProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}

export function RevealSection({
  children,
  delay = 0,
  y = 24,
  duration = 0.4,
  className,
}: RevealSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration, delay, ease: CLINICAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface RevealStaggerProps {
  children: ReactNode;
  index: number;
  step?: number;
  y?: number;
  duration?: number;
  className?: string;
}

export function RevealStagger({
  children,
  index,
  step = 0.06,
  y = 24,
  duration = 0.4,
  className,
}: RevealStaggerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration, delay: index * step, ease: CLINICAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const Reveal = RevealSection;
