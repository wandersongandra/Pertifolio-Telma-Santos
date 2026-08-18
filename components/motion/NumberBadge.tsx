"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface NumberBadgeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function NumberBadge({ children, className, delay = 0 }: NumberBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
