"use client";

import { motion } from "motion/react";
import { siteData } from "@/content/site-data";
import { StaggerGroup, staggerItem } from "@/components/motion/StaggerGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FormacaoAcademica() {
  const { formacaoAcademica } = siteData;
  const graduacoes = formacaoAcademica.items.filter((item) => item.category === "graduacao");
  const posGraduacoes = formacaoAcademica.items.filter(
    (item) => item.category === "pos-graduacao"
  );

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <SectionHeading
          eyebrow={formacaoAcademica.eyebrow}
          heading={formacaoAcademica.heading}
          className="mb-12"
        />
        <div className="grid sm:grid-cols-2 gap-10">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-warm-gray mb-4">
              Graduação
            </p>
            <StaggerGroup as="ul" className="space-y-3">
              {graduacoes.map((item) => (
                <motion.li
                  key={item.id}
                  variants={staggerItem}
                  className="font-display text-2xl text-ivory"
                >
                  {item.title}
                </motion.li>
              ))}
            </StaggerGroup>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-warm-gray mb-4">
              Pós-graduação
            </p>
            <StaggerGroup as="ul" className="space-y-3">
              {posGraduacoes.map((item) => (
                <motion.li
                  key={item.id}
                  variants={staggerItem}
                  className="font-display text-2xl text-ivory"
                >
                  {item.title}
                </motion.li>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
