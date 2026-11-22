"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const CLINICAL_EASE = [0.22, 1, 0.36, 1] as const;

export const SHARED_PILL_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
};

export const REVEAL_VIEWPORT = {
  once: true,
  amount: "some" as const,
};

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  y = 14,
  duration = 0.35,
  className,
}: RevealProps) {
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
