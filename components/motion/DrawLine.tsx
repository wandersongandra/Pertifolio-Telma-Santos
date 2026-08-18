"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface DrawLineProps {
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
}

export function DrawLine({ className, containerRef }: DrawLineProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.4"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className={cn("absolute inset-y-0 w-px", className)} aria-hidden="true">
      <div className="absolute inset-0 bg-warm-gray/20" />
      <motion.div className="absolute inset-0 bg-gold origin-top" style={{ scaleY }} />
    </div>
  );
}
