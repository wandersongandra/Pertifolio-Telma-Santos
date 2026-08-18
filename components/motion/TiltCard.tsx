"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. Cards read well around 6; large photos want something gentler, e.g. 3. */
  strength?: number;
  /** Vertical lift (px) on hover. Set 0 to disable — appropriate for photos already mid-page. */
  lift?: number;
}

export function TiltCard({
  children,
  className,
  strength = 6,
  lift: liftAmount = -6,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), springConfig);
  const lift = useSpring(useMotionValue(0), springConfig);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleEnter = () => lift.set(liftAmount);
  const handleLeave = () => {
    x.set(0);
    y.set(0);
    lift.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, y: lift, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
