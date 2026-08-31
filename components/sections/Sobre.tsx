import { siteData } from "@/content/site-data";
import { Reveal } from "@/components/motion/Reveal";
import { CurtainReveal } from "@/components/motion/CurtainReveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RotatingEditorialPhoto } from "@/components/media/RotatingEditorialPhoto";

export function Sobre() {
  const { sobre } = siteData;

  return (
    <section id="sobre" className="py-16 md:py-32">
      <div className="mx-auto max-w-7xl shell grid gap-12 md:grid-cols-2 md:gap-16 md:items-center">
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
          {/*
            No celular o retrato vai até as bordas da tela. Com `max-w-md
            mx-auto` ele ficava com 342px de largura no meio de uma faixa preta,
            lido como um cartão dentro de uma coluna de texto — que é o que
            sobra quando as duas colunas do desktop empilham e tudo passa a
            viver na mesma goteira. Do `md` para cima volta a ser a caixa
            centralizada de antes.
          */}
          <TiltCard strength={3} lift={0} className="shell-bleed md:mx-auto md:max-w-md">
            <CurtainReveal>
              {/* As duas fotos com notebook. Cada uma leva o seu próprio
                  enquadramento: o zoom de 1,25 do portrait-editorial tira o
                  corte cru da base do retrato em pé, mas cortaria a borda
                  esquerda do notebook na foto sentada, que por isso usa o
                  portrait-continuada (1,06). Os retratos em pé ficam no
                  hero. */}
              <RotatingEditorialPhoto
                slides={[
                  { photoId: "blue-blazer-macbook", crop: "portrait-editorial" },
                  { photoId: "seated-laptop", crop: "portrait-continuada" },
                ]}
                variant="natural"
                // 100vw abaixo do `md` porque a foto agora sangra: pedir 85vw
                // entregaria um arquivo menor que a área desenhada.
                sizes="(min-width: 768px) 40vw, 100vw"
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
