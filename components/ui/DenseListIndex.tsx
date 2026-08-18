"use client";

import { motion } from "motion/react";
import { StaggerGroup, staggerItem } from "@/components/motion/StaggerGroup";
import { NumberBadge } from "@/components/motion/NumberBadge";

interface DenseListIndexProps {
  items: { id: string; title: string }[];
}

export function DenseListIndex({ items }: DenseListIndexProps) {
  return (
    <StaggerGroup
      as="ol"
      staggerDelay={0.035}
      className="grid grid-cols-1 md:grid-cols-2 gap-x-10"
    >
      {items.map((item, index) => (
        <motion.li
          key={item.id}
          variants={staggerItem}
          className="group relative flex items-baseline gap-4 py-3 pl-0 hover:pl-4 border-b border-warm-gray/20 transition-[padding] duration-300 ease-out"
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-1 bottom-1 w-[3px] origin-center scale-y-0 bg-gold opacity-0 transition-all duration-300 ease-out group-hover:scale-y-100 group-hover:opacity-100"
          />
          <NumberBadge className="block font-display text-gold-muted text-sm tabular-nums shrink-0">
            {String(index + 1).padStart(2, "0")}
          </NumberBadge>
          <span className="text-ivory/90 leading-snug">{item.title}</span>
        </motion.li>
      ))}
    </StaggerGroup>
  );
}
