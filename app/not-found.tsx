import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página não encontrada | Telma Santos",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start px-6 py-24 md:px-10 md:py-40">
      <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
        Erro 404
      </p>
      <h1 className="mt-6 font-display text-4xl leading-[1.05] text-ivory text-balance sm:text-5xl md:text-6xl">
        Esta página não foi encontrada.
      </h1>
      <p className="mt-6 max-w-[560px] text-[clamp(17px,1.2vw,20px)] leading-[1.6] text-ivory/70">
        O endereço acessado pode ter sido alterado ou não existe mais. Volte à página
        inicial para conhecer a trajetória e as áreas de atuação de Telma Santos.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center justify-center gap-3 bg-gold px-8 py-4 text-sm font-semibold tracking-[0.08em] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        Voltar ao início <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
