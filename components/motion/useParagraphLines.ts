"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export type Token = { text: string; highlighted: boolean };

type ContainerElement = HTMLParagraphElement | HTMLDivElement;

export function tokenize(text: string, highlights: string[]): Token[] {
  const tokens = text
    .split(" ")
    .filter((w) => w.trim().length > 0)
    .map((w): Token => ({ text: w, highlighted: false }));

  for (const phrase of highlights) {
    const phraseWords = phrase
      .split(" ")
      .map((w) => w.replace(/[.,;:!?—–()]/g, "").toLowerCase());
    for (let i = 0; i + phraseWords.length <= tokens.length; i++) {
      const matches = phraseWords.every(
        (word, offset) =>
          tokens[i + offset].text.replace(/[.,;:!?—–()]/g, "").toLowerCase() === word
      );
      if (matches) {
        for (let j = 0; j < phraseWords.length; j++) tokens[i + j].highlighted = true;
        break;
      }
    }
  }

  return tokens;
}

export function useParagraphLines(tokens: Token[], enabled: boolean) {
  const containerRef = useRef<ContainerElement | null>(null);
  const [lines, setLines] = useState<Token[][] | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [version, setVersion] = useState(0);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const wordElements = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    if (wordElements.length !== tokens.length) return;

    const grouped: Token[][] = [];
    let currentTop: number | null = null;
    let currentLine: Token[] = [];

    wordElements.forEach((wordElement, index) => {
      const top = Math.round(wordElement.getBoundingClientRect().top);
      if (currentTop !== null && top !== currentTop) {
        grouped.push(currentLine);
        currentLine = [];
      }
      currentTop = top;
      currentLine.push(tokens[index]);
    });

    if (currentLine.length > 0) grouped.push(currentLine);
    if (grouped.length > 0) setLines(grouped);
  }, [tokens]);

  useLayoutEffect(() => {
    if (!enabled || !fontsReady || lines !== null) return;
    queueMicrotask(measure);
  }, [enabled, fontsReady, lines, version, measure]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const reset = () => {
      setLines(null);
      setVersion((v) => v + 1);
    };
    window.addEventListener("resize", reset);
    return () => {
      window.removeEventListener("resize", reset);
    };
  }, [enabled]);

  return { containerRef, lines };
}