"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useLenis } from "lenis/react";
import { MagneticButton } from "./MagneticButton";

export function BackToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();

  /*
    O limiar acompanha a altura da tela, não um número fixo.

    Eram 800px. Num monitor isso é quase uma tela e o botão aparecia tarde; num
    celular de 844px de altura era a *segunda* tela — o botão surgia logo depois
    do hero e acompanhava os 7.500px restantes de rolagem, flutuando sobre o
    conteúdo o tempo todo, inclusive por cima do formulário de contato.

    Uma tela e meia é o ponto em que voltar ao topo deixa de ser um gesto
    trivial e passa a valer um atalho, em qualquer aparelho.
  */
  useMotionValueEvent(scrollY, "change", (value) => {
    setVisible(value > window.innerHeight * 1.5);
  });

  const handleClick = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
          // Instalado como aplicativo (`display: standalone` no manifest) nao
          // ha barra do navegador embaixo: com 24px fixos o botao caia em cima
          // da barra de gestos do iPhone. `env()` vale 0 onde ela nao existe.
          className="fixed z-40 bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] right-[calc(1.5rem+env(safe-area-inset-right,0px))]"
        >
          <MagneticButton>
            <button
              type="button"
              onClick={handleClick}
              aria-label="Voltar ao topo"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-ink/80 text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 13V3M8 3L3 8M8 3L13 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
