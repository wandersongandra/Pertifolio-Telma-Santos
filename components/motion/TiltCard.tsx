"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCoarsePointer } from "@/lib/useCoarsePointer";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Rotação máxima em graus. Cartões funcionam bem perto de 6; fotos grandes
   * pedem algo mais contido, como 3. */
  strength?: number;
  /** Elevação vertical em px no hover. Use 0 para desligar, o que faz sentido
   * em fotos que já estão no meio da página. */
  lift?: number;
}

export function TiltCard({
  children,
  className,
  strength = 6,
  lift: liftAmount = -6,
}: TiltCardProps) {
  const coarsePointer = useCoarsePointer();
  const reducedMotion = useReducedMotion();
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

  // Duas razões distintas para devolver o filho puro.
  //
  // `coarsePointer`: sem cursor não há inclinação, e o `transformPerspective`
  // mantinha um contexto 3D vivo em volta de fotos grandes, o que encarece
  // cada repintura durante a rolagem.
  //
  // `reducedMotion`: a inclinação é movimento disparado por interação, que é
  // exatamente o que a WCAG 2.3.3 pede para desligar sob essa preferência. O
  // bloco de `prefers-reduced-motion` em globals.css não alcança este efeito —
  // ele não é uma transição CSS, é uma mola que a Motion aplica por script.
  if (coarsePointer || reducedMotion) {
    return <div className={className}>{children}</div>;
  }

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
