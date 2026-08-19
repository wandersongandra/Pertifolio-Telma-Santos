import { siteData } from "@/content/site-data";
import { Reveal } from "@/components/motion/Reveal";
import { CurtainReveal } from "@/components/motion/CurtainReveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EditorialPhoto } from "@/components/media/EditorialPhoto";
import { AboutTimeline } from "@/components/sections/AboutTimeline";

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
          </Reveal>
        </div>
        <Reveal delay={0.1} className="order-1 md:order-2">
          <TiltCard strength={3} lift={0} className="max-w-md mx-auto">
            <CurtainReveal>
              <EditorialPhoto
                photoId="blue-blazer-macbook"
                variant="natural"
                crop="portrait-editorial"
                sizes="(min-width: 768px) 40vw, 85vw"
                parallax
                fade="bottom"
              />
            </CurtainReveal>
          </TiltCard>
        </Reveal>
      </div>
      <div className="mx-auto max-w-7xl px-6 md:px-10 mt-20 lg:mt-24">
        <div className="border-t border-ivory/10 pt-12 lg:pt-16">
          <AboutTimeline items={sobre.quickFacts} />
        </div>
      </div>
    </section>
  );
}
