"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { siteData } from "@/content/site-data";
import { photos } from "@/lib/photos";
import { useRotatingPhoto } from "@/lib/useRotatingPhoto";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { TypingHeadline } from "./TypingHeadline";

export function ScratchHero() {
  const { hero } = siteData;
  // Os três retratos em pé da sessão, no mesmo enquadramento. O primeiro é o
  // que carrega com `priority` e conta para o LCP; os outros entram depois,
  // conforme o hook os libera. As fotos com notebook ficam no Sobre.
  const slides = [photos["hero-vignette"], photos["arms-crossed"], photos["book-pen"]];
  const { containerRef, index, mounted } = useRotatingPhoto(slides.length, 7000);

  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scrollCueOpacity = useTransform(heroScrollProgress, [0, 0.15], [1, 0]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-svh flex items-center overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-ink to-charcoal" />

      {/*
        Duas composições diferentes, não uma empilhada.

        No desktop continua a divisão em duas colunas: texto à esquerda,
        retrato à direita, os dois no mesmo quadro. No celular essa divisão não
        existe — e empilhá-la produzia o pior dos dois mundos: quatro blocos de
        texto seguidos e, embaixo deles, um retrato que a dobra cortava ao meio
        (medido: 46% da foto visível num iPhone SE, 82% num iPhone 14).

        Abaixo do `md` o retrato passa a abrir a página, sangrado até as bordas
        da tela, e o texto vem depois. A primeira tela deixa de ser uma coluna
        de texto e passa a ser rosto, posicionamento e oferta — que é o que o
        desktop já entregava de outro jeito.
      */}
      <div className="relative mx-auto max-w-7xl w-full shell pt-20 pb-12 grid gap-7 md:grid-cols-2 md:gap-12 md:pt-28 md:pb-16 md:items-center">
        <div className="order-2 md:order-1">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-5 text-[13px] font-medium tracking-[0.18em] uppercase text-gold md:mb-8 md:text-[15px] md:tracking-[0.2em]">
              {hero.kicker}
            </p>
          </motion.div>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <TypingHeadline lines={hero.rotatingHeadlines} startDelay={1550} />
          </motion.div>
          {/*
            O h1 da página. As frases rotativas acima são h2: elas dizem o
            posicionamento, esta linha diz o ofício. Fica visível e legível —
            texto escondido para buscador é punido e atrapalha leitor de tela.
          */}
          <motion.h1
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-[560px] font-display text-[clamp(18px,4.6vw,21px)] leading-[1.35] tracking-[-0.01em] text-gold-light md:mt-7 md:text-[clamp(19px,1.45vw,24px)] md:text-gold-muted"
          >
            {hero.headline}
          </motion.h1>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-[600px] text-[clamp(16px,4.2vw,18px)] leading-[1.5] text-ivory/85 md:mt-6 md:text-[clamp(18px,1.3vw,22px)] md:leading-[1.55]"
          >
            {hero.paragraph}
          </motion.p>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 md:mt-11"
          >
            <MagneticButton>
              <Button href={hero.ctaHref}>{hero.ctaLabel} →</Button>
            </MagneticButton>
          </motion.div>
        </div>

        <div className="relative order-1 md:order-2">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            ref={containerRef}
            /*
              No celular o retrato é uma faixa sangrada até as bordas da tela.
              A altura em `svh` equilibra duas coisas: quanto da foto sobrevive
              ao recorte e quanto da dobra sobra para o texto.

              Eram 44svh, e o quadro ficava largo demais para um retrato de
              corpo inteiro — proporção 1,05 contra 0,67 da foto, o que jogava
              fora 36% da altura dela. 48svh baixam esse descarte para 28% e o
              corte de baixo passa da cintura para a barra do blazer, que é um
              lugar bem mais natural para a imagem terminar. Os limites em px
              seguram os extremos — abaixo de 300 a foto vira um friso, acima
              de 430 ela empurra o botão para fora da tela.

              Do `md` para cima tudo volta ao que era: proporção 3/4, largura
              máxima, alinhado à direita e dentro da goteira.
            */
            className="shell-bleed relative h-[48svh] max-h-[430px] min-h-[300px] md:mx-0 md:h-auto md:max-h-none md:min-h-0 md:aspect-[3/4] md:max-w-md md:ml-auto"
          >
            {slides.map((slide, position) =>
              position < mounted ? (
                <Image
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  // As escondidas saem da árvore de acessibilidade: sem isso
                  // o leitor de tela anunciaria os três textos alternativos.
                  aria-hidden={position !== index}
                  fill
                  priority={position === 0}
                  // `100vw` no celular porque a foto agora sangra: pedir 85vw
                  // entregaria um arquivo menor do que a área onde ele é
                  // desenhado, e o retrato sairia borrado justamente no
                  // elemento que conta para o LCP.
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className={cn(
                    /*
                      Ancorado no topo no celular, e isso não é escolha
                      estética: o arquivo de origem não tem folga acima da
                      cabeça. Medido no proprio arquivo, o topo do cabelo fica
                      em torno de 0,5% da altura — a coroa encosta na borda de
                      cima do original.

                      Qualquer `object-position` acima de 0% come cabeça. Com
                      `14%` a janela comecava em 4,9% da foto num iPhone 14 e
                      em 6,7% num SE: eram cinco a sete por cento de cabelo
                      cortados fora, e era isso que se via.

                      No `md` o quadro volta a ser 3/4, o recorte vertical cai
                      para ~11% e os 10% de `object-position` valem só 1,1% da
                      foto — por isso o desktop sempre esteve certo e continua
                      exatamente como estava.
                    */
                    "hero-photo-fade object-cover object-[50%_0%] md:object-[50%_10%]",
                    "transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    position === index ? "opacity-100" : "opacity-0"
                  )}
                />
              ) : null
            )}
          </motion.div>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        style={reducedMotion ? undefined : { opacity: scrollCueOpacity }}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: reducedMotion ? 0 : 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        /*
          Só do `md` para cima. A dica está ancorada na base da *seção*, e
          abaixo do `md` a seção é mais alta que a tela — a seta nascia fora da
          dobra, avisando sobre uma rolagem para quem já teria rolado até ela.
          No desktop o hero cabe numa tela e a âncora coincide com a dobra.
        */
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 hidden flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase text-ivory/50">
          Rolar
        </span>
        <motion.svg
          animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          width="14"
          height="20"
          viewBox="0 0 14 20"
          fill="none"
        >
          <path
            d="M7 1V19M7 19L1 13M7 19L13 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ivory/50"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
