"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { siteData } from "@/content/site-data";
import { photos } from "@/lib/photos";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useHasMounted } from "./useHasMounted";
import { useReducedMotion } from "./useReducedMotion";
import { useScratchState } from "./useScratchState";
import { useMouseParallax } from "./useMouseParallax";
import { ScratchCanvas } from "./ScratchCanvas";
import { BrushCursor } from "./BrushCursor";

const WORD_LAYOUT: { top: string; left: string; size: string; rotate: string }[] = [
  { top: "8%", left: "6%", size: "text-2xl md:text-3xl", rotate: "-rotate-3" },
  { top: "20%", left: "52%", size: "text-lg md:text-xl", rotate: "rotate-2" },
  { top: "36%", left: "10%", size: "text-3xl md:text-4xl", rotate: "rotate-1" },
  { top: "50%", left: "48%", size: "text-lg md:text-xl", rotate: "-rotate-2" },
  { top: "63%", left: "8%", size: "text-xl md:text-2xl", rotate: "rotate-3" },
  { top: "76%", left: "46%", size: "text-2xl md:text-3xl", rotate: "-rotate-1" },
  { top: "89%", left: "12%", size: "text-lg md:text-xl", rotate: "rotate-2" },
];

export function ScratchHero() {
  const { hero } = siteData;
  const photo = photos["hero-vignette"];

  const mounted = useHasMounted();
  const reducedMotion = useReducedMotion();
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const parallax = useMouseParallax(photoContainerRef, 14);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scrollCueOpacity = useTransform(heroScrollProgress, [0, 0.15], [1, 0]);

  const {
    state,
    hasInteracted,
    onScratchStart,
    onCoverageChange,
    revealAll,
    onRevealAnimationComplete,
  } = useScratchState();

  const interactiveExperience = mounted && !reducedMotion;
  const showScratchLayer = interactiveExperience && state !== "revealed";
  const showBaseImage = !interactiveExperience || state === "revealing" || state === "revealed";

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
            <Kicker className="mb-5">{hero.kicker}</Kicker>
          </motion.div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-ivory">
            {hero.heading.map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reducedMotion ? false : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.9,
                    delay: 0.3 + index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-md text-lg text-ivory/80 leading-relaxed"
          >
            {hero.subheading}
          </motion.p>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9"
          >
            <MagneticButton>
              <Button href={hero.ctaHref}>{hero.ctaLabel} →</Button>
            </MagneticButton>
          </motion.div>
        </div>

        <div className="relative">
          <div
            ref={photoContainerRef}
            className="relative aspect-[3/4] max-w-md mx-auto md:mx-0 md:ml-auto"
          >
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: showBaseImage ? 1 : 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority
                sizes="(min-width: 768px) 40vw, 85vw"
                className="object-cover object-[50%_10%]"
              />
            </motion.div>

            {showScratchLayer && (
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: state === "revealing" ? 0 : 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() => {
                  if (state === "revealing") onRevealAnimationComplete();
                }}
              >
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 overflow-hidden bg-charcoal"
                  style={{ x: parallax.x, y: parallax.y }}
                >
                  {WORD_LAYOUT.map((position, index) => {
                    const word = hero.scratchWords[index % hero.scratchWords.length];
                    return (
                      <span
                        key={word}
                        className={`absolute font-display ${position.size} ${position.rotate} text-gold/80 whitespace-nowrap`}
                        style={{ top: position.top, left: position.left }}
                      >
                        {word}
                      </span>
                    );
                  })}
                </motion.div>

                <ScratchCanvas
                  src={photo.src}
                  interactive={state === "idle" || state === "scratching"}
                  onScratchStart={onScratchStart}
                  onCoverageChange={onCoverageChange}
                />
                <BrushCursor
                  containerRef={photoContainerRef}
                  active={state === "idle" || state === "scratching"}
                />
              </motion.div>
            )}

            {showScratchLayer && !hasInteracted && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs tracking-[0.15em] uppercase text-ivory/70 bg-ink/60 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                <span className="hidden md:inline">{hero.hint.desktop}</span>
                <span className="md:hidden">{hero.hint.mobile}</span>
              </div>
            )}
          </div>

          {showScratchLayer && (
            <button
              type="button"
              onClick={revealAll}
              className="mt-4 block mx-auto md:ml-auto md:mr-0 text-xs font-semibold tracking-[0.15em] uppercase text-ivory/60 hover:text-gold transition-colors"
            >
              Revelar tudo
            </button>
          )}
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
          Role
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
