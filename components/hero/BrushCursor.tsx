"use client";

import { useEffect, useState, type RefObject } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface BrushCursorProps {
  containerRef: RefObject<HTMLElement | null>;
  active: boolean;
}

export function BrushCursor({ containerRef, active }: BrushCursorProps) {
  const [hasPosition, setHasPosition] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 28, stiffness: 400, mass: 0.4 });
  const springY = useSpring(y, { damping: 28, stiffness: 400, mass: 0.4 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !active) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      x.set(event.clientX - rect.left);
      y.set(event.clientY - rect.top);
      setHasPosition(true);
    };

    const handleLeave = () => setHasPosition(false);

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [containerRef, active, x, y]);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute z-30 hidden h-12 w-12 rounded-full border border-gold bg-gold/10 md:block"
      animate={{ opacity: hasPosition ? 1 : 0 }}
      transition={{ duration: 0.15 }}
      style={{
        left: springX,
        top: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
}
