"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { useCoarsePointer } from "@/lib/useCoarsePointer";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const coarsePointer = useCoarsePointer();

  // Em toque, rolagem nativa. O Lenis existe para dar inércia à roda do mouse;
  // no celular o sistema já entrega inércia própria, calibrada pelo fabricante
  // e integrada ao gesto. Mantê-lo ali significa um laço de animação
  // permanente e um interpolador entre o dedo e a tela — custo constante para
  // piorar, não melhorar, o que o aparelho já faz bem.
  //
  // A âncora continua funcionando: sem Lenis o CSS `scroll-behavior` do
  // documento assume os saltos de `#secao`.
  if (coarsePointer) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.1,
        wheelMultiplier: 1,
        // O mesmo recuo do `scroll-padding-top` em globals.css. Sem ele o
        // Lenis leva a seção para o topo absoluto e o título fica atrás do
        // cabeçalho fixo.
        anchors: { offset: -88 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
