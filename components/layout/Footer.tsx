import Link from "next/link";
import { siteData } from "@/content/site-data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ivory/[0.08]">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-8 md:py-10">
        <p className="font-display text-[clamp(30px,2.5vw,44px)] leading-none text-ivory">
          {siteData.meta.name}
        </p>
        <p className="mt-3 text-sm tracking-[0.05em] text-ivory/60">
          {siteData.hero.kicker}
        </p>

        <div className="mt-10 md:mt-12 flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
          <p className="text-[13px] leading-[1.7] text-ivory/55">
            © {year} {siteData.meta.name}. Todos os direitos reservados.{" "}
            <span aria-hidden="true" className="text-ivory/35">
              ·
            </span>{" "}
            <Link
              href="/privacidade"
              className="link-draw pb-0.5 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Privacidade
            </Link>{" "}
            <span aria-hidden="true" className="text-ivory/35">
              ·
            </span>{" "}
            <Link
              href="/termos"
              className="link-draw pb-0.5 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Termos
            </Link>
          </p>

          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory/40 md:pr-16">
            Design e desenvolvimento —{" "}
            <span className="text-[12px] font-medium tracking-[0.08em] text-ivory">
              Wanderson Gandra
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}