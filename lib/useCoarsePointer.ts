"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(pointer: coarse)";

/**
 * `true` quando o ponteiro principal do aparelho é grosso — dedo, não mouse.
 *
 * Serve para desligar o que só existe para cursor: campo magnético do botão,
 * inclinação de cartão sob o mouse, rolagem suave por roda. Em toque esses
 * efeitos nunca disparam, mas continuam custando: motion values, molas
 * montadas e, no caso da rolagem, um laço de animação permanente.
 *
 * `useSyncExternalStore` com um snapshot de servidor `false` — mesmo padrão de
 * [useReducedMotion]. O servidor e o primeiro quadro rendem igual, o que evita
 * divergência de hidratação; por isso não use este hook para decidir o que
 * aparece na tela, ou o conteúdo mudaria depois da hidratação e produziria
 * salto. Para diferença visual, use media query no CSS ou a classe `md:`.
 */
function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useCoarsePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
