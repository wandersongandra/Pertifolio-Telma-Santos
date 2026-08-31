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

/*
  O mesmo conteúdo serve as duas composições da seção: o painel de abas do
  desktop, que entra animado, e o acordeão do celular, que abre e fecha na hora.

  `animated` é o que separa os dois. No painel, cada bloco nasce com
  `opacity: 0` inline e um `data-motion` pelo qual a Motion o encontra para
  revelar. No acordeão isso seria um defeito: o conteúdo abriria invisível,
  porque quem o revelaria é a sequência de animação da troca de aba, que ali não
  existe. Sem `animated` os blocos nascem visíveis e sem marcador.
*/
function PanelContent({
  area,
  index,
  compact,
  animated = true,
  showEyebrow = true,
}: {
  area: AreaOfPractice;
  index: number;
  compact: boolean;
  animated?: boolean;
  showEyebrow?: boolean;
}) {
  const slideY = compact ? 10 : 16;
  const hidden = animated
    ? { opacity: 0, transform: `translateY(${slideY}px)` }
    : undefined;
  const motionAttr = (name: string) => (animated ? name : undefined);

  return (
    <>
      {showEyebrow && (
        <p
          data-motion={motionAttr("eyebrow")}
          style={hidden}
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold"
        >
          {String(index + 1).padStart(2, "0")} / {area.label}
        </p>
      )}
      <div data-motion={motionAttr("headline-mask")} className={animated ? "overflow-hidden" : undefined}>
        <h3
          data-motion={motionAttr("headline")}
          style={animated ? { transform: "translateY(105%)" } : undefined}
          className={cn(
            "max-w-[720px] font-display text-[clamp(30px,7.5vw,42px)] font-normal leading-[1.1] tracking-[-0.025em] text-ivory text-balance md:text-[clamp(42px,4vw,68px)] md:leading-[1.02] md:tracking-[-0.03em]",
            // No acordeão o rótulo da área já está no botão logo acima; o
            // título não precisa do respiro que o separa do olho no painel.
            showEyebrow ? "mt-5 md:mt-6" : "mt-1"
          )}
        >
          {area.title}
        </h3>
      </div>
      {area.description && (
        <p
          data-motion={motionAttr("desc")}
          style={hidden}
          className="mt-7 max-w-[620px] text-[clamp(18px,1.4vw,22px)] leading-[1.55] text-ivory/70"
        >
          {area.description}
        </p>
      )}
      <div
        data-motion={motionAttr("detail")}
        style={hidden}
        className="mt-10 border-t border-ivory/10 pt-9 md:mt-14 md:pt-12"
      >
        <AreaDetailPanel detail={area.detail} />
      </div>
    </>
  );
}

function AccordionIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative ml-auto block h-3 w-3 shrink-0 text-gold">
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
      <span
        className={cn(
          "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-out motion-reduce:transition-none",
          open ? "scale-y-0" : "scale-y-100"
        )}
      />
    </span>
  );
}

export function AreasDeAtuacao() {
  const { areasDeAtuacao } = siteData;
  const [activeId, setActiveId] = useState(areasDeAtuacao[0].id);
  const [renderedId, setRenderedId] = useState(areasDeAtuacao[0].id);
  /*
    O acordeão do celular tem estado próprio, separado de `activeId`.

    Não é duplicação por descuido. `activeId` arrasta atrás de si toda a
    máquina de troca do painel de abas — animação de saída, troca de conteúdo,
    animação de entrada e o `keepSectionInView`, que puxa a rolagem de volta
    quando o painel novo é mais curto. No acordeão nada disso deve acontecer: o
    conteúdo abre logo abaixo do item tocado e a página não pode saltar debaixo
    do dedo. Ligar os dois estados significaria disparar essa máquina toda,
    invisível, a cada toque.

    `null` é um estado válido: tudo recolhido. Quem quer só passar pela seção vê
    cinco linhas em vez de duas telas e meia de conteúdo.
  */
  const [openId, setOpenId] = useState<AreaOfPractice["id"] | null>(areasDeAtuacao[0].id);
  const accordionAnchorRef = useRef<{ id: AreaOfPractice["id"]; top: number } | null>(null);

  /*
    Abrir um item fecha o anterior — e se o anterior estava ACIMA, o conteúdo
    dele some do fluxo e tudo o que vinha depois sobe junto. Medido: tocando
    "Oficinas Pedagógicas" logo depois de "Assessoria Pedagógica", o painel que
    fechava tinha 981px e o botão tocado saltava de y=451 para y=-543 — a página
    inteira escapava por cima, com o dedo ainda na tela.

    A compensação é a de sempre em acordeão: guardar onde o botão estava na
    janela antes da troca e, depois que o React comita o novo layout, rolar
    exatamente a diferença. O botão fica parado sob o dedo e o conteúdo abre
    embaixo dele.

    `behavior: "instant"` porque `globals.css` liga `scroll-behavior: smooth`
    em ponteiro grosso: sem isso a correção viraria uma animação, e a tela
    deslizaria sozinha depois do toque em vez de simplesmente não se mexer.
  */
  useLayoutEffect(() => {
    const anchor = accordionAnchorRef.current;
    accordionAnchorRef.current = null;
    if (!anchor) return;
    const button = document.getElementById(`atuacao-acordeao-${anchor.id}`);
    if (!button) return;
    const delta = button.getBoundingClientRect().top - anchor.top;
    if (Math.abs(delta) < 1) return;
    window.scrollTo({ top: window.scrollY + delta, behavior: "instant" });
  }, [openId]);

  const toggleAccordion = (id: AreaOfPractice["id"]) => {
    const button = document.getElementById(`atuacao-acordeao-${id}`);
    accordionAnchorRef.current = button
      ? { id, top: button.getBoundingClientRect().top }
      : null;
    setOpenId((current) => (current === id ? null : id));
  };
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
      setOpenId(area.id);
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
      <div className="mx-auto max-w-7xl shell">
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

        {/*
          Duas composições, não uma empilhada — pelo mesmo motivo do hero.

          Aba é um padrão de tela larga: os rótulos ficam ao lado do painel e a
          troca acontece dentro do campo de visão. Empilhados no celular, os
          cinco rótulos viravam uma lista de texto sem borda, sem fundo e sem
          seta — lia-se como sumário, não como controle — e o painel que eles
          comandavam começava 716px abaixo do topo da seção. Tocar um rótulo
          mudava algo que estava quase todo fora da tela.

          Abaixo do `lg` a mesma informação vira acordeão: o conteúdo abre logo
          embaixo do item tocado, o gesto tem resposta imediata e a seção em
          repouso ocupa cinco linhas em vez de até 2,7 telas. As abas continuam
          exatamente como estavam do `lg` para cima.
        */}
        <motion.div
          variants={listVariants}
          className="mt-10 border-t border-ivory/10 md:mt-14 lg:hidden"
        >
          {areasDeAtuacao.map((area, index) => {
            const isOpen = openId === area.id;
            return (
              <motion.div
                key={area.id}
                variants={itemVariants}
                className="border-b border-ivory/10"
              >
                <button
                  type="button"
                  id={`atuacao-acordeao-${area.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`atuacao-acordeao-painel-${area.id}`}
                  onClick={() => toggleAccordion(area.id)}
                  className={cn(
                    "flex w-full min-h-14 cursor-pointer items-center gap-4 py-4 text-left transition-colors duration-200",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                    isOpen ? "text-ivory" : "text-ivory/65"
                  )}
                >
                  <span className="w-7 shrink-0 text-[11px] font-semibold tracking-[0.18em] text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[clamp(20px,5.6vw,28px)] font-normal leading-[1.15] tracking-[-0.02em]">
                    {area.label}
                  </span>
                  <AccordionIcon open={isOpen} />
                </button>
                {/*
                  O atributo `hidden`, não uma classe: recolhido, o bloco sai da
                  árvore de acessibilidade e do caminho do Tab junto com o
                  desenho. Uma altura zero com `overflow: hidden` deixaria links
                  e títulos focáveis dentro de um painel que ninguém vê.
                */}
                <div
                  id={`atuacao-acordeao-painel-${area.id}`}
                  role="region"
                  aria-labelledby={`atuacao-acordeao-${area.id}`}
                  hidden={!isOpen}
                  className="pb-12"
                >
                  <PanelContent
                    area={area}
                    index={index}
                    compact
                    animated={false}
                    showEyebrow={false}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-10 hidden grid-cols-1 gap-8 md:mt-16 md:gap-12 lg:mt-20 lg:grid lg:grid-cols-[minmax(360px,0.9fr)_minmax(480px,1.1fr)] lg:gap-x-16">
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
                    linha ocupa cerca de 10,2x o corpo da fonte — daí o 2.3vw
                    contra a coluna do grid.

                    Uma escala só, agora: esta lista existe apenas do `lg` para
                    cima. No celular quem mostra os rótulos é o acordeão, onde
                    eles podem quebrar em duas linhas sem desalinhar nada.
                    Ao mexer no corpo, na `grid-cols` ou ao entrar um rótulo
                    mais longo, refaça a medição: a folga aqui é de poucos
                    pixels.
                  */}
                  <span className="whitespace-nowrap font-display text-[clamp(23px,2.3vw,36px)] font-normal leading-[1.15] tracking-[-0.02em]">
                    {area.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* O contêiner inteiro só existe do `lg` para cima, então o filete e
              o recuo que separavam a lista do painel quando eles empilhavam
              deixaram de fazer sentido — quem faz essa separação no celular
              agora é a borda de cada item do acordeão. */}
          <div ref={panelWrapperRef}>
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