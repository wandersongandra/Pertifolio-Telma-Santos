"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { logo } from "@/lib/photos";
import { SiteMenu } from "@/components/layout/SiteMenu";
import { useCoarsePointer } from "@/lib/useCoarsePointer";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-3 w-4">
      <span
        className={`absolute left-0 top-0 h-px w-full bg-current transition-all duration-300 ease-out ${
          open ? "top-1/2 -translate-y-1/2 rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 h-px w-3 bg-current transition-all duration-300 ease-out ${
          open ? "top-1/2 -translate-y-1/2 -rotate-45 w-full" : "bottom-0"
        }`}
      />
    </span>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const coarsePointer = useCoarsePointer();
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 140], [0, 1]);
  // O recolhimento do cabeçalho anima `padding`, e padding é propriedade de
  // layout: a cada quadro de rolagem o navegador remede a barra inteira e tudo
  // dentro dela. Num aparelho intermediário isso aparece como travadinha
  // durante a rolagem, justamente no elemento que está sempre visível.
  //
  // No desktop o efeito fica: a rolagem por roda é mais lenta e a máquina
  // aguenta. Em toque a barra passa a ter altura fixa — o fundo continua
  // aparecendo conforme a rolagem, que é a parte que se percebe, e essa é uma
  // animação de opacidade, composta sem remedir nada.
  const paddingY = useTransform(scrollY, [0, 140], [24, 14]);

  return (
    <>
      {/*
        `env(safe-area-inset-top)` é 0 em tela normal e passa a valer no iPhone
        em paisagem, onde a faixa do sistema avançaria sobre a marca.
      */}
      <header
        className="fixed top-0 left-0 right-0 z-[49]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-ink/90 backdrop-blur-md border-b border-warm-gray/10"
          style={{ opacity: menuOpen ? 1 : backgroundOpacity }}
        />
        <motion.div
          className="relative mx-auto max-w-7xl px-6 md:px-10 flex items-center justify-between"
          style={
            coarsePointer
              ? { paddingTop: 18, paddingBottom: 18 }
              : { paddingTop: paddingY, paddingBottom: paddingY }
          }
        >
          <Link
            href="/#top"
            // `min-h-11` são 44px: o alvo media 34px, abaixo do mínimo
            // confortável para o polegar. A altura extra é do alvo, não da
            // marca — a imagem continua com os mesmos 40px.
            className="flex min-h-11 items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <motion.div whileHover={{ rotate: 8, scale: 1.08 }} transition={{ duration: 0.3 }}>
              <Image
                src={logo.mark.src}
                alt={logo.mark.alt}
                width={40}
                height={Math.round((40 * logo.mark.height) / logo.mark.width)}
                priority
              />
            </motion.div>
            <span className="font-display text-lg text-ivory hidden sm:inline">
              Telma Santos
            </span>
          </Link>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            // O alvo media 20x53px. `min-h-11` e o recuo à esquerda levam a
            // área tocável a 44px de altura sem deslocar o rótulo: o recuo
            // negativo à direita mantém o alinhamento do "Menu" com a borda.
            className="group -mr-1 flex min-h-11 items-center gap-3 pl-4 pr-1 text-sm font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <span>{menuOpen ? "Fechar" : "Menu"}</span>
            <MenuIcon open={menuOpen} />
          </button>
        </motion.div>
      </header>
      <SiteMenu open={menuOpen} onClose={closeMenu} triggerRef={triggerRef} />
    </>
  );
}
