"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useLenis } from "lenis/react";
import { MagneticButton } from "./MagneticButton";

export function BackToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (value) => {
    setVisible(value > 800);
  });

  const handleClick = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <MagneticButton>
            <button
              type="button"
              onClick={handleClick}
              aria-label="Voltar ao topo"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-ink/80 text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 13V3M8 3L3 8M8 3L13 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
