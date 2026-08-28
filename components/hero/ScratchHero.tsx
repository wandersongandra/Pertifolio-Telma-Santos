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

      <div className="relative mx-auto max-w-7xl w-full px-6 md:px-10 pt-28 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-8 text-[15px] font-medium tracking-[0.2em] uppercase text-gold">
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
            className="mt-7 max-w-[560px] font-display text-[clamp(19px,1.45vw,24px)] leading-[1.35] tracking-[-0.01em] text-gold-muted"
          >
            {hero.headline}
          </motion.h1>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-[600px] text-[clamp(18px,1.3vw,22px)] leading-[1.55] text-ivory/85"
          >
            {hero.paragraph}
          </motion.p>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="mt-11"
          >
            <MagneticButton>
              <Button href={hero.ctaHref}>{hero.ctaLabel} →</Button>
            </MagneticButton>
          </motion.div>
        </div>

        <div className="relative">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            ref={containerRef}
            className="relative aspect-[3/4] max-w-md mx-auto md:mx-0 md:ml-auto"
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
                  sizes="(min-width: 768px) 40vw, 85vw"
                  className={cn(
                    "hero-photo-fade object-cover object-[50%_10%]",
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
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 hidden flex-col items-center gap-2 sm:flex"
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
