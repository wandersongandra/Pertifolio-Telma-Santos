"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useCoarsePointer } from "@/lib/useCoarsePointer";

interface RotatingPhoto {
  /** Prender no elemento que envolve as fotos empilhadas. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Índice da foto visível agora. */
  index: number;
  /** Quantas fotos já podem ser montadas no DOM (ver o comentário abaixo). */
  mounted: number;
}

/**
 * Avança um índice em intervalo fixo para um conjunto de fotos empilhadas.
 *
 * Três cuidados que o `setInterval` sozinho não tem:
 *
 * - **`prefers-reduced-motion`**: quem pediu menos movimento fica na primeira
 *   foto, parada. Trocar a foto sob o leitor é exatamente o tipo de movimento
 *   automático que essa preferência existe para desligar.
 * - **Em toque não gira.** Pelo mesmo motivo da manchete digitada: é conteúdo
 *   que se troca sozinho a cada 7 segundos, para sempre, sem nenhum controle
 *   de pausa — a WCAG 2.2.2 pede um. No desktop o cursor está ali e o ciclo é
 *   um detalhe de marca; no celular ele é uma imagem que muda sob o polegar
 *   enquanto a pessoa lê, e mantém um timer vivo durante toda a visita.
 * - **Fora da tela não gira.** Sem isso a foto do Sobre trocaria enquanto o
 *   visitante ainda está no topo, e ele chegaria à seção no meio de um ciclo —
 *   além de manter um timer rodando à toa. Aba em segundo plano também pausa.
 * - **Montagem progressiva.** Todas as fotos ocupam o mesmo lugar, então o
 *   `loading="lazy"` do next/image não resolve: assim que a seção entra na
 *   tela, o navegador considera todas visíveis e baixa o conjunto inteiro.
 *   `mounted` libera a foto seguinte um ciclo antes de ela aparecer, o que
 *   espalha os downloads no tempo e deixa a primeira imagem (a que conta para
 *   o LCP no hero) disputar banda sozinha.
 *
 *   Começa em 1, não em 2. Em 2 a segunda foto entrava já no HTML do servidor
 *   e era baixada por todo mundo — inclusive em toque, onde o ciclo não roda e
 *   ela nunca apareceria: 90KB jogados fora em dado móvel. Quem a libera agora
 *   é o efeito abaixo, que só roda quando o ciclo existe de fato.
 */
export function useRotatingPhoto(count: number, intervalMs: number): RotatingPhoto {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(1);
  const reducedMotion = useReducedMotion();
  const coarsePointer = useCoarsePointer();

  useEffect(() => {
    const node = containerRef.current;
    if (reducedMotion || coarsePointer || count < 2 || !node) return;

    let timer: number | undefined;

    /*
      A segunda foto entra 1,5s depois da montagem, não imediatamente.

      O atraso não é estético: `useCoarsePointer` devolve `false` no primeiro
      quadro do cliente (é o snapshot de servidor, e tem que ser, senão a
      hidratação diverge) e só then corrige para `true` num segundo render. Sem
      o atraso, este efeito rodaria uma vez com `false` num celular e montaria
      a foto que ele existe para não montar. 1,5s é folga larga: a correção
      chega no mesmo tique, e a limpeza cancela o timer bem antes.
    */
    const warmUp = window.setTimeout(() => {
      setMounted((reached) => Math.min(count, Math.max(reached, 2)));
    }, 1500);
    let onScreen = false;

    const stop = () => {
      if (timer === undefined) return;
      window.clearInterval(timer);
      timer = undefined;
    };
    const sync = () => {
      if (onScreen && !document.hidden) {
        timer ??= window.setInterval(() => {
          setIndex((current) => {
            const next = (current + 1) % count;
            setMounted((reached) => Math.min(count, Math.max(reached, next + 2)));
            return next;
          });
        }, intervalMs);
      } else {
        stop();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);

    return () => {
      window.clearTimeout(warmUp);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, [count, intervalMs, reducedMotion, coarsePointer]);

  return { containerRef, index, mounted };
}
