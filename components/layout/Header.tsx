"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { logo } from "@/lib/photos";
import { SiteMenu } from "@/components/layout/SiteMenu";

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

  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 140], [0, 1]);
  const paddingY = useTransform(scrollY, [0, 140], [24, 14]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[49]">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-ink/90 backdrop-blur-md border-b border-warm-gray/10"
          style={{ opacity: menuOpen ? 1 : backgroundOpacity }}
        />
        <motion.div
          className="relative mx-auto max-w-7xl px-6 md:px-10 flex items-center justify-between"
          style={{ paddingTop: paddingY, paddingBottom: paddingY }}
        >
          <Link
            href="#top"
            className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
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
            className="group flex items-center gap-3 text-sm font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
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
