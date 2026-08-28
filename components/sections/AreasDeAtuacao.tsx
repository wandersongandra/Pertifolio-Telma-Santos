"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  animate,
  motion,
  useInView,
  type AnimationPlaybackControls,
  type Variants,
} from "motion/react";
import { useLenis } from "lenis/react";
import { siteData, type AreaOfPractice } from "@/content/site-data";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Kicker } from "@/components/ui/Kicker";
import { AreaDetailPanel } from "@/components/sections/AreaDetailPanel";
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
          className="mt-5 max-w-[720px] font-display text-[clamp(30px,7.5vw,42px)] font-normal leading-[1.1] tracking-[-0.025em] text-ivory text-balance md:mt-6 md:text-[clamp(42px,4vw,68px)] md:leading-[1.02] md:tracking-[-0.03em]"
        >
          {area.title}
        </h3>
      </div>
      {area.description && (
        <p
          data-motion="desc"
          style={{ opacity: 0, transform: `translateY(${slideY}px)` }}
          className="mt-7 max-w-[620px] text-[clamp(18px,1.4vw,22px)] leading-[1.55] text-ivory/70"
        >
          {area.description}
        </p>
      )}
      <div
        data-motion="detail"
        style={{ opacity: 0, transform: `translateY(${slideY}px)` }}
        className="mt-14 border-t border-ivory/10 pt-12"
      >
        <AreaDetailPanel detail={area.detail} />
      </div>
    </>
  );
}

export function AreasDeAtuacao() {
  const { areasDeAtuacao } = siteData;
  const [activeId, setActiveId] = useState(areasDeAtuacao[0].id);
  const [renderedId, setRenderedId] = useState(areasDeAtuacao[0].id);
  const reduce = useReducedMotion();
  const compact = useIsCompact();
  const lenis = useLenis();

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

  // Os painéis têm alturas muito diferentes (4 oficinas contra 20 temas
  // formativos), então trocar para uma aba mais curta pode deixar a tela
  // parada depois do fim da seção inteira. Só puxa de volta quando isso
  // realmente aconteceu. Fica num ref para não entrar na lista de dependências
  // do efeito de entrada: reexecutar aquele efeito no meio da transição
  // cancela a animação de saída em curso (ver a proteção de fase).
  const keepSectionInView = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top >= 0 || rect.bottom > window.innerHeight) return;
    if (lenis) lenis.scrollTo(section);
    else section.scrollIntoView({ block: "start" });
  }, [lenis]);
  const keepSectionInViewRef = useRef(keepSectionInView);
  useEffect(() => {
    keepSectionInViewRef.current = keepSectionInView;
  });

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

  // As cinco áreas já foram seções independentes, cada uma com sua âncora.
  // Hoje elas vivem neste painel de abas, então um hash do tipo `#oficinas` não
  // tem elemento para onde saltar — resolvemos para a aba correspondente.
  const selectRef = useRef(select);
  useEffect(() => {
    selectRef.current = select;
  });

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.slice(1);
      const area = areasDeAtuacao.find((item) => item.id === hash);
      if (!area) return;
      if (enteredRef.current) {
        selectRef.current(area.id);
      } else {
        targetRef.current = area.id;
        setActiveId(area.id);
        setRenderedId(area.id);
      }
      const section = sectionRef.current;
      if (!section) return;
      if (lenis) lenis.scrollTo(section);
      else section.scrollIntoView({ block: "start" });
    };
    const raf = requestAnimationFrame(applyHash);
    window.addEventListener("hashchange", applyHash);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", applyHash);
    };
  }, [areasDeAtuacao, lenis]);

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
    const detail = panel.querySelector<HTMLElement>('[data-motion="detail"]');
    if (detail) animate(detail, { opacity: 1, y: 0 }, { duration: d(0.5), ease: CONTENT_EASE, delay: d(0.45) });
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
    const detail = panel.querySelector<HTMLElement>('[data-motion="detail"]');
    if (detail) {
      controls.push(animate(detail, { opacity: 1, y: 0 }, { duration: d(0.45), ease: CONTENT_EASE, delay: d(0.22) }));
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
            keepSectionInViewRef.current();
          },
        })
      );
    }
    seqRef.current = controls;
    return () => controls.forEach((control) => control.stop());
  // `compact` está fora das dependências de propósito: o corpo do efeito nunca
  // lê essa variável, e reexecutá-lo no meio da saída dispara uma animação de
  // entrada no mesmo elemento, o que cancela a saída sem chamar o onComplete
  // dela — a troca se perde e o painel fica preso na área anterior.
  }, [renderedId, reduce]);

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
      className="py-16 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.header variants={headerVariants} className="max-w-2xl">
          <motion.div variants={headerItemVariants}>
            <Kicker>Como atua</Kicker>
          </motion.div>
          <motion.h2
            variants={headerItemVariants}
            className="mt-5 font-display text-[clamp(36px,9vw,48px)] leading-[1.0] tracking-[-0.03em] text-ivory md:mt-7 md:text-[clamp(44px,4vw,64px)] md:leading-[0.95]"
          >
            Áreas de
            <span className="block">Atuação</span>
          </motion.h2>
        </motion.header>

        <div className="mt-10 grid grid-cols-1 gap-8 md:mt-16 md:gap-12 lg:mt-20 lg:grid-cols-[minmax(360px,0.9fr)_minmax(480px,1.1fr)] lg:gap-x-16">
          <motion.div
            role="tablist"
            aria-label="Áreas de atuação"
            ref={tablistRef}
            variants={listVariants}
            className="relative flex flex-col lg:sticky lg:top-28 lg:self-start"
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
                    isActive ? "text-ivory" : "text-ivory/55 hover:text-ivory/80"
                  )}
                >
                  <span className="w-7 shrink-0 text-[11px] font-semibold tracking-[0.18em] text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {/*
                    Cada rótulo ocupa exatamente uma linha. Com a quebra
                    automática a lista saía irregular: "Oficinas Pedagógicas" e
                    "Diálogos Formativos" cabiam numa linha e os outros três
                    não, então a altura dos itens alternava.
                    O `whitespace-nowrap` sozinho estouraria a coluna, então o
                    corpo da fonte foi calibrado contra a largura realmente
                    disponível para o texto (a coluna menos o número e o recuo).
                    Medindo o rótulo mais largo, "Palestras Educacionais", a
                    linha ocupa cerca de 10,2x o corpo da fonte.
                    São duas escalas porque essa largura cai de golpe no `lg`,
                    quando a lista deixa de ocupar a tela inteira e vira uma
                    coluna do grid: abaixo o corpo acompanha a tela (5.4vw, de
                    18px a 26px), acima acompanha a coluna (2.3vw, de 23px a
                    36px). Ao mexer no corpo, na `grid-cols` ou ao entrar um
                    rótulo mais longo, refaça a medição: a folga aqui é de
                    poucos pixels.
                  */}
                  <span className="whitespace-nowrap font-display text-[clamp(18px,5.4vw,26px)] font-normal leading-[1.15] tracking-[-0.02em] lg:text-[clamp(23px,2.3vw,36px)]">
                    {area.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          <div ref={panelWrapperRef} className="border-t border-ivory/10 pt-8 md:pt-12 lg:border-0 lg:pt-0">
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