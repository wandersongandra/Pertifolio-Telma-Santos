"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
}

export function CountUp({ to, from = 0, duration = 1.4, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  useEffect(() => {
    const node = ref.current;
    if (!node || !isInView) return;

    // The DOM/SSR fallback renders the correct final value (see below) so
    // no-JS and pre-hydration reads never show the decoy starting number.
    // Only once JS is confirmed running and about to animate do we drop
    // back to `from` as the visual starting point.
    node.textContent = from.toString();

    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(value) {
        node.textContent = Math.round(value).toString();
      },
    });

    return () => controls.stop();
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {to}
    </span>
  );
}
