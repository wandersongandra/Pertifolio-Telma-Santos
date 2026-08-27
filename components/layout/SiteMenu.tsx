"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { siteData } from "@/content/site-data";
import { useReducedMotion } from "@/lib/useReducedMotion";

const PANEL_EASE = [0.76, 0, 0.24, 1] as const;
const LINK_EASE = [0.22, 1, 0.36, 1] as const;

interface SiteMenuProps {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    // nav hrefs are route-absolute ("/#sobre") so they also work from the legal
    // pages — the observed element id is the part after the hash.
    const hrefById = new Map(
      siteData.nav
        .map((item) => [item.href.split("#")[1], item.href] as const)
        .filter((pair): pair is readonly [string, string] => Boolean(pair[0]))
    );
    const targets = [...hrefById.keys()]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const href = hrefById.get(entry.target.id);
          if (entry.isIntersecting && href) setActive(href);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return active;
}

export function SiteMenu({ open, onClose, triggerRef }: SiteMenuProps) {
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const wasOpenRef = useRef(false);
  const active = useActiveSection();

  useLayoutEffect(() => {
    if (!open) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    lenis?.stop();
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
      lenis?.start();
    };
  }, [open, lenis]);

  useLayoutEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      firstLinkRef.current?.focus();
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus();
    }
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!open || event.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const panelTransition = reducedMotion
    ? { duration: 0.001 }
    : { duration: open ? 0.7 : 0.55, ease: PANEL_EASE };
  const overlayTransition = reducedMotion
    ? { duration: 0.001 }
    : { duration: 0.45, ease: LINK_EASE };

  const listVariants = reducedMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
        visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
      };

  const itemVariants = reducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.001 } },
      }
    : {
        hidden: { opacity: 0, y: 8, transition: { duration: 0.18, ease: LINK_EASE } },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: LINK_EASE } },
      };

  return (
    <>
      <motion.div
        aria-hidden="true"
        className={`fixed inset-0 z-[45] bg-black/60 backdrop-blur-[2px] ${
          open ? "" : "pointer-events-none"
        }`}
        initial={false}
        animate={
          open
            ? { opacity: 1, transitionEnd: { visibility: "visible" } }
            : { opacity: 0, transitionEnd: { visibility: "hidden" } }
        }
        transition={overlayTransition}
        onClick={onClose}
      />
      <motion.div
        id="site-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={open ? undefined : true}
        inert={!open}
        className="fixed top-0 right-0 z-[48] h-dvh w-full flex-col overflow-y-auto border-l border-gold/15 bg-[#080808] sm:flex sm:w-[clamp(380px,32vw,520px)]"
        initial={false}
        animate={
          open
            ? { x: "0%", transitionEnd: { visibility: "visible" } }
            : { x: "100%", transitionEnd: { visibility: "hidden" } }
        }
        transition={panelTransition}
        onKeyDown={handlePanelKeyDown}
      >
        <div className="flex min-h-full flex-col px-6 pt-24 pb-10 md:px-10">
          <motion.nav aria-label="Seções do site">
            <motion.ul
              variants={listVariants}
              initial={false}
              animate={open ? "visible" : "hidden"}
              className="flex flex-col"
            >
              {siteData.nav.map((item, index) => {
                const isActive = active === item.href;
                return (
                  <li key={item.href}>
                    <motion.div variants={itemVariants}>
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className="group flex min-h-11 items-baseline gap-4 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                      >
                        <span
                          className={`w-7 shrink-0 text-sm font-medium tracking-wide transition-colors ${
                            isActive
                              ? "text-gold-light"
                              : "text-gold-muted group-hover:text-gold"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-display text-[clamp(32px,3vw,52px)] leading-[1.1] tracking-[-0.01em] transition-[color,transform] duration-300 group-hover:translate-x-2 ${
                            isActive ? "text-gold" : "text-ivory/85 group-hover:text-gold"
                          }`}
                        >
                          {item.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`ml-auto hidden self-center text-xl text-gold transition-all duration-300 sm:block ${
                            isActive
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                        >
                          →
                        </span>
                      </Link>
                    </motion.div>
                  </li>
                );
              })}
            </motion.ul>
          </motion.nav>

          <div className="mt-auto pt-12">
            <div className="mb-6 h-px w-10 bg-gold/70" aria-hidden="true" />
            <p className="font-display text-lg text-ivory">{siteData.meta.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-warm-gray">
              {siteData.meta.role}
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {siteData.contato.channels.map((channel) => (
                <li key={channel.type}>
                  <a
                    href={channel.href}
                    target={channel.type === "email" ? undefined : "_blank"}
                    rel={channel.type === "email" ? undefined : "noopener noreferrer"}
                    className="link-draw text-sm text-warm-gray pb-0.5 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {channel.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
}