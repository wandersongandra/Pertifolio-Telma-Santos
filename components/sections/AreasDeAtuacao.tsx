"use client";

import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  animate,
  motion,
  useInView,
  type AnimationPlaybackControls,
  type Variants,
} from "motion/react";
import { siteData, type AreaOfPractice } from "@/content/site-data";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Kicker } from "@/components/ui/Kicker";
import { cn } from "@/lib/utils";

const INDICATOR_HEIGHT = 48;
const INDICATOR_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const CONTENT_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const EXIT_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const HEIGHT_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

type Phase = "idle" | "exiting" | "entering";

function useIsCompact() {
  const getSnapshot = () => window.matchMedia("(max-width: 1023px)").matches;
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia("(max-width: 1023px)");
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    getSnapshot,
    () => false
  );
}

function PanelContent({ area, index, compact }: { area: AreaOfPractice; index: number; compact: boolean }) {
  const slideY = compact ? 10 : 16;
  return (
    <>
      <p
        data-motion="eyebrow"
        style={{ opacity: 0, transform: `translateY(${slideY}px)` }}
        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold"
      >
        {String(index + 1).padStart(2, "0")} / {area.label}
      </p>
      <div data-motion="headline-mask" className="overflow-hidden">
        <h3
          data-motion="headline"
          style={{ transform: "translateY(105%)" }}
          className="mt-6 max-w-[720px] font-display text-[clamp(42px,4vw,68px)] font-normal leading-[1.02] tracking-[-0.03em] text-ivory text-balance"
        >
          {area.title}
        </h3>
      </div>
      <p
        data-motion="desc"
        style={{ opacity: 0, transform: `translateY(${slideY}px)` }}
        className="mt-7 max-w-[620px] text-[clamp(18px,1.4vw,22px)] leading-[1.55] text-ivory/70"
      >
        {area.description}
      </p>
    </>
  );
}

export function AreasDeAtuacao() {
  const { areasDeAtuacao } = siteData;
  const [activeId, setActiveId] = useState(areasDeAtuacao[0].id);
  const [renderedId, setRenderedId] = useState(areasDeAtuacao[0].id);
  const reduce = useReducedMotion();
  const compact = useIsCompact();

  const sectionRef = useRef<HTMLElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const panelWrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const inView = useInView(sectionRef, { once: true, margin: "-80px 0px" });
  const enteredRef = useRef(false);
  const phaseRef = useRef<Phase>("idle");
  const targetRef = useRef(renderedId);
  const hasSwappedRef = useRef(false);
  const seqRef = useRef<AnimationPlaybackControls[]>([]);

  const activeIndex = Math.max(
    0,
    areasDeAtuacao.findIndex((area) => area.id === activeId)
  );
  const rendered = areasDeAtuacao.find((area) => area.id === renderedId) ?? areasDeAtuacao[0];
  const renderedIndex = Math.max(
    0,
    areasDeAtuacao.findIndex((area) => area.id === renderedId)
  );

  const stopSeq = () => {
    seqRef.current.forEach((control) => control.stop());
    seqRef.current = [];
  };

  const positionIndicator = useCallback(
    (animated: boolean) => {
      const tablist = tablistRef.current;
      const indicator = indicatorRef.current;
      if (!tablist || !indicator) return;
      const btn = tablist.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!btn) return;
      const y = btn.offsetTop + (btn.offsetHeight - INDICATOR_HEIGHT) / 2;
      if (animated && !reduce) {
        animate(indicator, { y }, { duration: 0.42, ease: INDICATOR_EASE });
      } else {
        animate(indicator, { y }, { duration: 0 });
      }
    },
    [reduce]
  );

  const swapRendered = () => {
    phaseRef.current = "entering";
    hasSwappedRef.current = true;
    setRenderedId(targetRef.current);
  };

  const startExit = () => {
    phaseRef.current = "exiting";
    const panel = panelRef.current;
    const wrapper = panelWrapperRef.current;
    if (wrapper) wrapper.style.height = `${wrapper.offsetHeight}px`;
    if (!panel) {
      swapRendered();
      return;
    }
    const control = animate(
      panel,
      {
        opacity: 0,
        y: reduce ? 0 : compact ? -10 : -16,
        clipPath: reduce ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
      },
      {
        duration: reduce ? 0.12 : 0.26,
        ease: EXIT_EASE,
        onComplete: swapRendered,
      }
    );
    seqRef.current = [control];
  };

  const select = (id: AreaOfPractice["id"]) => {
    if (id === activeId) return;
    if (phaseRef.current === "exiting" && id === renderedId) {
      stopSeq();
      targetRef.current = id;
      phaseRef.current = "idle";
      setActiveId(id);
      const panel = panelRef.current;
      if (panel) {
        animate(
          panel,
          { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" },
          { duration: reduce ? 0 : 0.2, ease: CONTENT_EASE }
        );
      }
      return;
    }
    targetRef.current = id;
    setActiveId(id);
    if (phaseRef.current === "idle") {
      startExit();
    } else if (phaseRef.current === "entering") {
      stopSeq();
      startExit();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const count = areasDeAtuacao.length;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (activeIndex + 1) % count;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (activeIndex - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    if (next === null) return;
    event.preventDefault();
    const id = areasDeAtuacao[next].id;
    select(id);
    document.getElementById(`atuacao-tab-${id}`)?.focus();
  };

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (panel) {
      panel.style.opacity = "0";
      panel.style.transform = "translateY(20px)";
      panel.style.clipPath = "inset(0% 0% 0% 0%)";
    }
    const indicator = indicatorRef.current;
    if (indicator && !reduce) {
      indicator.style.transform = "scaleY(0)";
    }
    positionIndicator(false);
  }, [reduce, positionIndicator]);

  useLayoutEffect(() => {
    positionIndicator(true);
  }, [activeId, reduce, positionIndicator]);

  useLayoutEffect(() => {
    const tablist = tablistRef.current;
    if (!tablist) return;
    const observer = new ResizeObserver(() => positionIndicator(false));
    observer.observe(tablist);
    return () => observer.disconnect();
  }, [positionIndicator]);

  useLayoutEffect(() => {
    if (!inView || enteredRef.current) return;
    enteredRef.current = true;
    const panel = panelRef.current;
    const indicator = indicatorRef.current;
    if (!panel) return;
    const d = (s: number) => (reduce ? 0 : s);
    animate(panel, { opacity: 1, y: 0 }, { duration: d(0.7), ease: CONTENT_EASE, delay: d(0.15) });
    const eyebrow = panel.querySelector<HTMLElement>('[data-motion="eyebrow"]');
    const headline = panel.querySelector<HTMLElement>('[data-motion="headline"]');
    const desc = panel.querySelector<HTMLElement>('[data-motion="desc"]');
    if (eyebrow) animate(eyebrow, { opacity: 1, y: 0 }, { duration: d(0.5), ease: CONTENT_EASE, delay: d(0.25) });
    if (headline) animate(headline, { y: 0 }, { duration: d(0.5), ease: CONTENT_EASE, delay: d(0.31) });
    if (desc) animate(desc, { opacity: 1, y: 0 }, { duration: d(0.5), ease: CONTENT_EASE, delay: d(0.38) });
    if (indicator && !reduce) {
      animate(indicator, { scaleY: [0, 1] }, { duration: 0.5, ease: CONTENT_EASE, delay: 0.35 });
    }
  }, [inView, reduce]);

  useLayoutEffect(() => {
    if (!hasSwappedRef.current) return;
    const panel = panelRef.current;
    if (!panel) return;
    const d = (s: number) => (reduce ? 0 : s);
    const controls: AnimationPlaybackControls[] = [];
    controls.push(
      animate(
        panel,
        { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" },
        { duration: d(0.3), ease: CONTENT_EASE }
      )
    );
    const eyebrow = panel.querySelector<HTMLElement>('[data-motion="eyebrow"]');
    const headline = panel.querySelector<HTMLElement>('[data-motion="headline"]');
    const desc = panel.querySelector<HTMLElement>('[data-motion="desc"]');
    if (eyebrow) {
      controls.push(animate(eyebrow, { opacity: 1, y: 0 }, { duration: d(0.3), ease: CONTENT_EASE }));
    }
    if (headline) {
      controls.push(animate(headline, { y: 0 }, { duration: d(0.55), ease: CONTENT_EASE, delay: d(0.08) }));
    }
    if (desc) {
      controls.push(animate(desc, { opacity: 1, y: 0 }, { duration: d(0.45), ease: CONTENT_EASE, delay: d(0.16) }));
    }
    const wrapper = panelWrapperRef.current;
    if (wrapper) {
      const pinned = wrapper.offsetHeight;
      wrapper.style.height = "auto";
      const target = wrapper.getBoundingClientRect().height;
      controls.push(
        animate(wrapper, { height: [pinned, target] }, {
          duration: d(0.3),
          ease: HEIGHT_EASE,
          onComplete: () => {
            wrapper.style.height = "auto";
          },
        })
      );
    }
    seqRef.current = controls;
    return () => controls.forEach((control) => control.stop());
  }, [renderedId, reduce, compact]);

  const sectionVariants: Variants = {
    hidden: {},
    visible: { transition: reduce ? {} : { staggerChildren: 0.08 } },
  };

  const headerVariants: Variants = {
    hidden: {},
    visible: { transition: reduce ? {} : { staggerChildren: 0.08 } },
  };

  const headerItemVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.55, ease: CONTENT_EASE } },
  };

  const listVariants: Variants = {
    hidden: {},
    visible: { transition: reduce ? {} : { staggerChildren: 0.05 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.55, ease: CONTENT_EASE } },
  };

  return (
    <motion.section
      id="atuacao"
      ref={sectionRef}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.header variants={headerVariants} className="max-w-2xl">
          <motion.div variants={headerItemVariants}>
            <Kicker>Como atua</Kicker>
          </motion.div>
          <motion.h2
            variants={headerItemVariants}
            className="mt-6 font-display text-[clamp(44px,4vw,64px)] leading-[0.95] tracking-[-0.03em] text-ivory md:mt-7"
          >
            Áreas de
            <span className="block">Atuação</span>
          </motion.h2>
        </motion.header>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-[minmax(360px,0.8fr)_minmax(520px,1.2fr)] lg:gap-x-16">
          <motion.div
            role="tablist"
            aria-label="Áreas de atuação"
            ref={tablistRef}
            variants={listVariants}
            className="relative flex flex-col"
          >
            <span
              ref={indicatorRef}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 h-12 w-px bg-gold"
              style={{ transformOrigin: "50% 50%" }}
            />
            {areasDeAtuacao.map((area, index) => {
              const isActive = area.id === activeId;
              return (
                <motion.button
                  key={area.id}
                  id={`atuacao-tab-${area.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`atuacao-panel-${area.id}`}
                  tabIndex={isActive ? 0 : -1}
                  variants={itemVariants}
                  onClick={() => select(area.id)}
                  onFocus={() => select(area.id)}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "relative flex w-full cursor-pointer items-baseline gap-5 py-3.5 pl-5 text-left transition-colors duration-200 md:py-4 md:pl-6",
                    "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold",
                    isActive ? "text-ivory" : "text-ivory/38 hover:text-ivory/75"
                  )}
                >
                  <span className="w-7 shrink-0 text-[11px] font-semibold tracking-[0.18em] text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[clamp(34px,3.2vw,56px)] font-normal leading-[1.05] tracking-[-0.025em]">
                    {area.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          <div ref={panelWrapperRef} className="border-t border-ivory/10 pt-12 lg:border-0 lg:pt-0">
            <div
              id={`atuacao-panel-${renderedId}`}
              role="tabpanel"
              aria-labelledby={`atuacao-tab-${activeId}`}
              ref={panelRef}
            >
              <PanelContent key={renderedId} area={rendered} index={renderedIndex} compact={compact} />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}