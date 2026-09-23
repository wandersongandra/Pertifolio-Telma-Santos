import Link from "next/link";
import { siteData } from "@/content/site-data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ivory/[0.08]">
      <div className="mx-auto max-w-7xl shell py-8 md:py-10">
        <p className="font-display text-[clamp(26px,6vw,32px)] leading-none text-ivory md:text-[clamp(30px,2.5vw,44px)]">
          {siteData.meta.name}
        </p>
        <p className="mt-3 text-sm tracking-[0.05em] text-ivory/60">
          {siteData.hero.kicker}
        </p>

        <div className="mt-10 md:mt-12 flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
          {/*
            "Privacidade" e "Termos" ficam com cerca de 20px de altura, abaixo
            dos 44px usados no resto do site. É deliberado: a WCAG 2.5.8
            dispensa do tamanho mínimo o alvo embutido numa frase, e forçar
            44px aqui quebraria a linha do rodapé em três blocos soltos. São
            links secundários, dentro de texto corrido, e a frase inteira é
            uma área de leitura, não de toque.
          */}
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

          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory/60 md:pr-16">
            Design e desenvolvimento —{" "}
            <a
              href="https://gandra.tech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Wanderson Gandra — Gandra Tech (abre em nova aba)"
              className="link-draw pb-0.5 text-[12px] font-medium tracking-[0.08em] text-ivory transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Wanderson Gandra
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}