import { siteData } from "@/content/site-data";
import { Reveal } from "@/components/motion/Reveal";
import { CurtainReveal } from "@/components/motion/CurtainReveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RotatingEditorialPhoto } from "@/components/media/RotatingEditorialPhoto";

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
              {/* As duas fotos "de trabalho" da sessao. Cada uma leva o seu
                  proprio enquadramento: o zoom de 1.25 do portrait-editorial
                  tira o corte bruto da base do retrato em pe, mas cortaria a
                  borda esquerda do notebook na foto sentada, que por isso usa
                  o portrait-continuada (1.06). Os retratos em pe estao no
                  hero. */}
              <RotatingEditorialPhoto
                slides={[
                  { photoId: "blue-blazer-macbook", crop: "portrait-editorial" },
                  { photoId: "seated-laptop", crop: "portrait-continuada" },
                ]}
                variant="natural"
                sizes="(min-width: 768px) 40vw, 85vw"
                parallax
                fade="bottom"
              />
            </CurtainReveal>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
