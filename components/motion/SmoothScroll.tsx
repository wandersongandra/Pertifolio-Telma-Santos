"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.1,
        wheelMultiplier: 1,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
