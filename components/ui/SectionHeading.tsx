"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Kicker } from "./Kicker";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.5 }}
        >
          <Kicker className="mb-3">{eyebrow}</Kicker>
        </motion.div>
      )}
      <motion.h2
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
        className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.1] text-ivory text-balance"
      >
        {heading}
      </motion.h2>
    </div>
  );
}
