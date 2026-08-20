"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

const TYPE_DELAY_MIN = 45;
const TYPE_DELAY_MAX = 65;
const DELETE_DELAY_MIN = 25;
const DELETE_DELAY_MAX = 40;
const HOLD_DELAY = 2100;
const PAUSE_DELAY = 400;

const HEADLINE_CLASSES =
  "font-display font-normal text-[clamp(48px,5.4vw,92px)] leading-[0.95] tracking-[-0.03em] text-ivory max-w-xl";

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
  const [started, setStarted] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const phrases = useMemo(() => (lines.length > 0 ? lines : [""]), [lines]);
  const longestPhrase = phrases.reduce(
    (longest, line) => (line.length > longest.length ? line : longest),
    ""
  );

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setTimeout(() => setStarted(true), startDelay);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, startDelay]);

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

  if (reducedMotion) {
    return (
      <h1 className={cn(HEADLINE_CLASSES, className)}>
        {phrases.slice(0, 2).join(" ")}
      </h1>
    );
  }

  return (
    <h1 className={cn(HEADLINE_CLASSES, className)}>
      <span className="sr-only">{phrases.join(" ")}</span>
      <span aria-hidden="true" className="relative block">
        <span className="invisible">{longestPhrase}</span>
        <span className="absolute inset-0">
          {text}
          <span className="typing-caret" />
        </span>
      </span>
    </h1>
  );
}
