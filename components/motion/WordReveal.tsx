"use client";

import { Fragment } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

const wordVariant: Variants = {
  hidden: { opacity: 0.12, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export function WordReveal({ text, className, delay = 0 }: WordRevealProps) {
  const words = text.split(" ");

  return (
    <motion.p
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
      transition={{ staggerChildren: 0.032, delayChildren: delay }}
    >
      {words.map((word, index) => (
        <Fragment key={index}>
          <motion.span className="inline-block" variants={wordVariant}>
            {word}
          </motion.span>
          {index < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </motion.p>
  );
}
