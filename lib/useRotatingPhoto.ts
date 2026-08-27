"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

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
 * - **Fora da tela não gira.** Sem isso a foto do Sobre trocaria enquanto o
 *   visitante ainda está no topo, e ele chegaria à seção no meio de um ciclo —
 *   além de manter um timer rodando à toa. Aba em segundo plano também pausa.
 * - **Montagem progressiva.** Todas as fotos ocupam o mesmo lugar, então o
 *   `loading="lazy"` do next/image não resolve: assim que a seção entra na
 *   tela, o navegador considera todas visíveis e baixa o conjunto inteiro.
 *   `mounted` libera a foto seguinte um ciclo antes de ela aparecer, o que
 *   espalha os downloads no tempo e deixa a primeira imagem (a que conta para
 *   o LCP no hero) disputar banda sozinha.
 */
export function useRotatingPhoto(count: number, intervalMs: number): RotatingPhoto {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(() => Math.min(2, count));
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = containerRef.current;
    if (reducedMotion || count < 2 || !node) return;

    let timer: number | undefined;
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
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, [count, intervalMs, reducedMotion]);

  return { containerRef, index, mounted };
}
