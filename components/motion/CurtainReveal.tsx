"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CurtainRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
}

export function CurtainReveal({
  children,
  className,
  direction = "right",
}: CurtainRevealProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        style={{ originX: direction === "right" ? 1 : 0 }}
        className="absolute inset-0 bg-gold pointer-events-none"
      />
    </div>
  );
}
