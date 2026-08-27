"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface RotatingPhoto {
  /** Prender no elemento que envolve as fotos empilhadas. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Indice da foto visivel agora. */
  index: number;
  /** Quantas fotos ja podem ser montadas no DOM (ver comentario abaixo). */
  mounted: number;
}

/**
 * Avanca um indice em intervalo fixo para um conjunto de fotos empilhadas.
 *
 * Tres cuidados que o `setInterval` sozinho nao tem:
 *
 * - **`prefers-reduced-motion`**: quem pediu menos movimento fica na primeira
 *   foto, parada. Trocar a foto sob o leitor e exatamente o tipo de movimento
 *   automatico que a preferencia existe para desligar.
 * - **Fora da tela nao gira.** Sem isso a foto do Sobre trocaria de slide
 *   enquanto o visitante ainda esta no topo, e ele chegaria na secao no meio
 *   de um ciclo — alem de manter um timer rodando a toa. Aba em segundo plano
 *   tambem pausa.
 * - **Montagem progressiva.** Todas as fotos ocupam o mesmo lugar, entao o
 *   `loading="lazy"` do next/image nao adianta: assim que a secao entra na
 *   tela, o navegador considera todas visiveis e baixa o conjunto inteiro.
 *   `mounted` libera a proxima foto um ciclo antes de ela aparecer, o que
 *   espalha o download no tempo e deixa a primeira imagem (a que conta para o
 *   LCP no hero) disputar banda sozinha.
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
