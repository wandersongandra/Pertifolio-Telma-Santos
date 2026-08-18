"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { siteData } from "@/content/site-data";
import { logo } from "@/lib/photos";

export function Header() {
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 140], [0, 1]);
  const paddingY = useTransform(scrollY, [0, 140], [24, 14]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-ink/90 backdrop-blur-md border-b border-warm-gray/10"
        style={{ opacity: backgroundOpacity }}
      />
      <motion.div
        className="relative mx-auto max-w-7xl px-6 md:px-10 flex items-center justify-between"
        style={{ paddingTop: paddingY, paddingBottom: paddingY }}
      >
        <Link href="#top" className="flex items-center gap-3">
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
        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {siteData.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="link-draw text-sm tracking-wide text-ivory/80 pb-0.5 hover:text-gold transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="#contato"
          className="text-sm font-semibold tracking-wide uppercase text-gold hover:text-ivory transition-colors"
        >
          Contato
        </Link>
      </motion.div>
    </header>
  );
}
