"use client";

import { useCallback, useState } from "react";

export type HeroState = "idle" | "scratching" | "revealing" | "revealed";

const COVERAGE_THRESHOLD = 0.55;

export function useScratchState() {
  const [state, setState] = useState<HeroState>("idle");
  const [hasInteracted, setHasInteracted] = useState(false);

  const onScratchStart = useCallback(() => {
    setHasInteracted(true);
    setState((current) => (current === "idle" ? "scratching" : current));
  }, []);

  const onCoverageChange = useCallback((coverage: number) => {
    if (coverage >= COVERAGE_THRESHOLD) {
      setState((current) =>
        current === "revealing" || current === "revealed" ? current : "revealing"
      );
    }
  }, []);

  const revealAll = useCallback(() => {
    setHasInteracted(true);
    setState((current) => (current === "revealed" ? current : "revealing"));
  }, []);

  const onRevealAnimationComplete = useCallback(() => {
    setState("revealed");
  }, []);

  const skipToRevealed = useCallback(() => {
    setState("revealed");
  }, []);

  return {
    state,
    hasInteracted,
    onScratchStart,
    onCoverageChange,
    revealAll,
    onRevealAnimationComplete,
    skipToRevealed,
  };
}
