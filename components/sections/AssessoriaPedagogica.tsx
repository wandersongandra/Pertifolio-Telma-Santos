"use client";

import { motion } from "motion/react";
import { siteData } from "@/content/site-data";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, staggerItem } from "@/components/motion/StaggerGroup";
import { Kicker } from "@/components/ui/Kicker";

export function AssessoriaPedagogica() {
  const { assessoriaPedagogica } = siteData;

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.5 }}
        >
          <Kicker className="mb-4">{assessoriaPedagogica.eyebrow}</Kicker>
        </motion.div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-6">
          <motion.h2
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
            className="font-display text-3xl sm:text-4xl md:text-5xl text-ivory"
          >
            {assessoriaPedagogica.heading}
          </motion.h2>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-gold font-semibold tracking-wide"
          >
            {assessoriaPedagogica.period}
          </motion.span>
        </div>
        <Reveal>
          <p className="text-lg text-ivory/80 leading-relaxed max-w-2xl mb-10">
            {assessoriaPedagogica.summary}
          </p>
        </Reveal>
        <StaggerGroup
          as="ul"
          staggerDelay={0.06}
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4"
        >
          {assessoriaPedagogica.capabilities.map((capability) => (
            <motion.li
              key={capability}
              variants={staggerItem}
              className="flex items-start gap-3 text-ivory/90"
            >
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
              {capability}
            </motion.li>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
