"use client";

import { motion } from "motion/react";
import { siteData } from "@/content/site-data";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, staggerItem } from "@/components/motion/StaggerGroup";
import { CurtainReveal } from "@/components/motion/CurtainReveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EditorialPhoto } from "@/components/media/EditorialPhoto";

export function FormacaoContinuada() {
  const { formacaoContinuada } = siteData;

  return (
    <section className="py-24 md:py-32 border-y border-warm-gray/20 bg-charcoal/40">
      <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <TiltCard strength={3} lift={0} className="max-w-md mx-auto">
            <CurtainReveal direction="left">
              <EditorialPhoto
                photoId="seated-laptop"
                variant="natural"
                crop="portrait-full"
                sizes="(min-width: 768px) 40vw, 85vw"
                parallax
              />
            </CurtainReveal>
          </TiltCard>
        </Reveal>
        <div>
          <SectionHeading
            eyebrow={formacaoContinuada.eyebrow}
            heading={formacaoContinuada.heading}
            className="mb-6"
          />
          <Reveal>
            <p className="text-ivory/80 leading-relaxed max-w-lg mb-10">
              {formacaoContinuada.intro}
            </p>
          </Reveal>
          <StaggerGroup as="ul" staggerDelay={0.08} className="space-y-6">
            {formacaoContinuada.items.map((item) => (
              <motion.li
                key={item.id}
                variants={staggerItem}
                className="border-l-2 border-gold/60 pl-5"
              >
                <h3 className="font-display text-xl text-ivory mb-1">{item.title}</h3>
                {item.location && (
                  <p className="text-sm text-warm-gray mb-1">{item.location}</p>
                )}
                <p className="text-ivory/70 leading-relaxed">{item.description}</p>
              </motion.li>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
