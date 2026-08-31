"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useCoarsePointer } from "@/lib/useCoarsePointer";

const TYPE_DELAY_MIN = 45;
const TYPE_DELAY_MAX = 65;
const DELETE_DELAY_MIN = 25;
const DELETE_DELAY_MAX = 40;
const HOLD_DELAY = 2100;
const PAUSE_DELAY = 400;

// Duas escalas. A anterior era uma só, com mínimo de 48px: num aparelho de
// 320px de largura a frase mais longa ocupava 137px de altura e empurrava a
// foto da Telma para 730px, muito abaixo de uma dobra de 568px. Abaixo do `md`
// o corpo passa a acompanhar a tela a partir de 40px; do `md` para cima o
// desktop segue exatamente como era.
const HEADLINE_CLASSES =
  "font-display font-normal text-[clamp(40px,10vw,52px)] leading-[1.02] tracking-[-0.025em] text-ivory max-w-xl md:text-[clamp(48px,5.4vw,92px)] md:leading-[0.95] md:tracking-[-0.03em]";

function randomBetween(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

interface TypingHeadlineProps {
  lines: string[];
  startDelay?: number;
  className?: string;
}

export function TypingHeadline({
  lines,
  startDelay = 0,
  className,
}: TypingHeadlineProps) {
  const reducedMotion = useReducedMotion();
  const coarsePointer = useCoarsePointer();
  const [started, setStarted] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  // Começa com a primeira frase inteira, não vazia. Antes o texto nascia em ""
  // e só aparecia quando a digitação começava — com o atraso de 1550ms do hero,
  // a área de maior destaque da página ficava em branco por mais de um segundo
  // e meio, num aparelho que já havia terminado de carregar. Agora a proposta
  // de valor está legível no primeiro quadro, inclusive sem JavaScript, e a
  // digitação apenas assume a partir dali.
  const [text, setText] = useState(() => (lines.length > 0 ? lines[0] : ""));
  const [deleting, setDeleting] = useState(false);

  const phrases = useMemo(() => (lines.length > 0 ? lines : [""]), [lines]);
  const longestPhrase = phrases.reduce(
    (longest, line) => (line.length > longest.length ? line : longest),
    ""
  );

  // Em toque a frase fica parada. Trocar a manchete sozinha sob o polegar
  // atrapalha a leitura, e o ciclo mantém um timer vivo durante toda a visita
  // sem nada em troca. No desktop o ciclo continua, e o atraso inicial deixa de
  // importar porque a frase já está na tela desde o começo.
  useEffect(() => {
    if (reducedMotion || coarsePointer) return;
    const timer = window.setTimeout(() => setStarted(true), startDelay);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, coarsePointer, startDelay]);

  useEffect(() => {
    if (reducedMotion || !started) return;

    const full = phrases[phraseIndex];
    let delay: number;
    let next: () => void;

    if (deleting) {
      if (text.length === 0) {
        delay = PAUSE_DELAY;
        next = () => {
          setDeleting(false);
          setPhraseIndex((index) => (index + 1) % phrases.length);
        };
      } else {
        delay = randomBetween(DELETE_DELAY_MIN, DELETE_DELAY_MAX);
        next = () => setText(full.slice(0, text.length - 1));
      }
    } else if (text.length < full.length) {
      delay = randomBetween(TYPE_DELAY_MIN, TYPE_DELAY_MAX);
      next = () => setText(full.slice(0, text.length + 1));
    } else {
      delay = HOLD_DELAY;
      next = () => setDeleting(true);
    }

    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [text, deleting, phraseIndex, started, reducedMotion, phrases]);

  // h2, e não h1: estas frases são posicionamento, não descrição. O h1 da
  // página é a linha logo abaixo, que diz o que a Telma faz — ver
  // `hero.headline` em content/site-data.ts. Trocar a tag não muda um pixel na
  // tela; muda o peso que o buscador dá a cada texto.
  if (reducedMotion) {
    return (
      <h2 className={cn(HEADLINE_CLASSES, className)}>
        {phrases.slice(0, 2).join(" ")}
      </h2>
    );
  }

  return (
    <h2 className={cn(HEADLINE_CLASSES, className)}>
      {/*
        A primeira frase, e só ela. Antes as quatro entravam concatenadas e o
        leitor de tela anunciava um título de página com quatro sentenças sem
        relação entre si — "Presença que deixa marcas. Educação que inspira.
        Conhecimento que transforma. Experiências que despertam." Em toque,
        onde a digitação nunca começa, isso descrevia uma tela que mostrava
        uma frase só.

        O nome acessível de um cabeçalho precisa ser estável: as outras três
        frases são variação de posicionamento, não informação nova, e o que a
        página de fato oferece está no h1 logo abaixo.
      */}
      <span className="sr-only">{phrases[0]}</span>
      <span aria-hidden="true" className="relative block">
        <span className="invisible">{longestPhrase}</span>
        <span className="absolute inset-0">
          {text}
          {/*
            O cursor só existe enquanto o ciclo roda. Em toque, e no intervalo
            antes de a digitação começar, a frase está parada — um cursor
            piscando ali sugeriria que algo vai acontecer e não vai.
          */}
          {started ? <span className="typing-caret" /> : null}
        </span>
      </span>
    </h2>
  );
}
