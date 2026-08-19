"use client";

import { createContext, useContext, type ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

const HIGHLIGHT_COLOR = "#c8a24d";
const BASE_COLOR = "#f2ede4";

const HighlightColorContext = createContext<MotionValue<string> | null>(null);

interface LineRevealProps {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: ReactNode;
}

export function LineReveal({ progress, start, end, children }: LineRevealProps) {
  const span = end - start;
  const y = useTransform(progress, [start, end], ["110%", "0%"]);
  const opacity = useTransform(
    progress,
    [start, end, end + span * 0.5, end + span],
    [0, 1, 1, 0.7]
  );
  const highlightColor = useTransform(
    progress,
    [start + span * 0.25, start + span * 0.75],
    [BASE_COLOR, HIGHLIGHT_COLOR]
  );

  return (
    <div className="overflow-hidden">
      <motion.div style={{ y, opacity }}>
        <HighlightColorContext.Provider value={highlightColor}>
          {children}
        </HighlightColorContext.Provider>
      </motion.div>
    </div>
  );
}

export function HighlightWord({ children }: { children: ReactNode }) {
  const color = useContext(HighlightColorContext);
  if (!color) return <span className="text-gold">{children}</span>;
  return <motion.span style={{ color }}>{children}</motion.span>;
}