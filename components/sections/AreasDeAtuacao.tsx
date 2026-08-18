"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { siteData } from "@/content/site-data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export function AreasDeAtuacao() {
  const { areasDeAtuacao } = siteData;
  const [activeId, setActiveId] = useState(areasDeAtuacao[0].id);
  const active = areasDeAtuacao.find((area) => area.id === activeId) ?? areasDeAtuacao[0];

  return (
    <section id="atuacao" className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10 text-center">
        <SectionHeading eyebrow="Como atua" heading="Áreas de Atuação" align="center" className="mb-14" />

        <div className="flex flex-wrap justify-center gap-3 mb-10" role="tablist" aria-label="Áreas de atuação">
          {areasDeAtuacao.map((area) => {
            const isActive = area.id === activeId;
            return (
              <motion.button
                key={area.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(area.id)}
                onFocus={() => setActiveId(area.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "relative px-5 py-2.5 text-sm font-semibold tracking-wide uppercase rounded-sm border transition-colors",
                  isActive
                    ? "text-ink border-gold"
                    : "border-warm-gray/40 text-ivory/80 hover:border-gold hover:text-gold"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-tab-pill"
                    className="absolute inset-0 -z-10 rounded-sm bg-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {area.label}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="font-display text-2xl md:text-3xl text-ivory leading-snug mx-auto max-w-2xl text-balance"
          >
            {active.description}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}
