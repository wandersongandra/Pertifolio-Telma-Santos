import { siteData } from "@/content/site-data";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { CurtainReveal } from "@/components/motion/CurtainReveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EditorialPhoto } from "@/components/media/EditorialPhoto";

export function Sobre() {
  const { sobre } = siteData;

  return (
    <section id="sobre" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <SectionHeading eyebrow={sobre.eyebrow} heading={sobre.heading} className="mb-8" />
          <Reveal>
            <div className="space-y-5">
              {sobre.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-ivory/80 leading-relaxed max-w-lg">
                  {paragraph}
                </p>
              ))}
            </div>
            <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-warm-gray/20 pt-8">
              {sobre.quickFacts.map((fact) => {
                const asNumber = /^\d+$/.test(fact.label) ? Number(fact.label) : null;
                return (
                  <div key={fact.label}>
                    <dt className="font-display text-lg text-gold mb-1 tabular-nums">
                      {asNumber !== null ? (
                        <CountUp to={asNumber} from={asNumber - 20} />
                      ) : (
                        fact.label
                      )}
                    </dt>
                    <dd className="text-sm text-ivory/70">{fact.value}</dd>
                  </div>
                );
              })}
            </dl>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="order-1 md:order-2">
          <TiltCard strength={3} lift={0} className="max-w-md mx-auto">
            <CurtainReveal>
              <EditorialPhoto
                photoId="blue-blazer-macbook"
                variant="natural"
                crop="portrait-full"
                sizes="(min-width: 768px) 40vw, 85vw"
                parallax
              />
            </CurtainReveal>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
