"use client";

import { useEffect, type RefObject } from "react";
import { useMotionValue, useSpring } from "motion/react";

export function useMouseParallax(ref: RefObject<HTMLElement | null>, strength = 12) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 20, stiffness: 150, mass: 0.4 });
  const springY = useSpring(y, { damping: 20, stiffness: 150, mass: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      x.set(relX * strength);
      y.set(relY * strength);
    };

    const handleLeave = () => {
      x.set(0);
      y.set(0);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [ref, strength, x, y]);

  return { x: springX, y: springY };
}
