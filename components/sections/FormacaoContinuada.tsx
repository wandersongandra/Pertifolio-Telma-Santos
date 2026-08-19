"use client";

import { siteData } from "@/content/site-data";
import { Reveal } from "@/components/motion/Reveal";
import { CurtainReveal } from "@/components/motion/CurtainReveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EditorialPhoto } from "@/components/media/EditorialPhoto";

export function FormacaoContinuada() {
  const { formacaoContinuada } = siteData;
  const itemCount = formacaoContinuada.items.length;

  return (
    <section className="py-24 md:py-32 border-y border-warm-gray/20 bg-charcoal/40">
      <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <TiltCard strength={3} lift={0} className="max-w-md mx-auto">
            <CurtainReveal direction="left">
              <EditorialPhoto
                photoId="seated-laptop"
                variant="natural"
                crop="portrait-continuada"
                sizes="(min-width: 768px) 40vw, 85vw"
                parallax
                fade="soft"
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
            <p className="text-[clamp(18px,1.3vw,22px)] leading-[1.55] text-ivory/80 max-w-lg mb-10 md:mb-12">
              {formacaoContinuada.intro}
            </p>
          </Reveal>
          <ol className="relative">
            {formacaoContinuada.items.map((item, index) => (
              <li key={item.id} className="relative pl-8 pb-10 last:pb-0 md:pb-12">
                {index < itemCount - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[2.5px] top-[5px] bottom-[-5px] w-px bg-gold/25"
                  />
                )}
                <span
                  aria-hidden
                  className="absolute left-0 top-[5px] h-1.5 w-1.5 rounded-full bg-gold"
                />
                <p className="text-[11px] font-semibold tracking-[0.18em] text-gold">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-[clamp(26px,2vw,34px)] leading-[1.1] tracking-[-0.02em] text-ivory md:mt-4">
                  {item.title}
                </h3>
                {item.meta && (
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-gold">
                    {item.meta}
                  </p>
                )}
                <p className="mt-2 text-[clamp(16px,1.1vw,19px)] leading-[1.5] text-ivory/70 max-w-[620px]">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}