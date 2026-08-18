"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HoverAccentRowProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function HoverAccentRow({ children, className, delay = 0 }: HoverAccentRowProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative pl-0 hover:pl-4 transition-[padding] duration-300 ease-out",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-1 bottom-1 w-[3px] origin-center scale-y-0 bg-gold opacity-0 transition-all duration-300 ease-out group-hover:scale-y-100 group-hover:opacity-100"
      />
      {children}
    </motion.li>
  );
}
