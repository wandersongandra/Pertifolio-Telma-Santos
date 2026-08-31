import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
  target?: string;
  rel?: string;
}

/*
  Cada variante traz o seu próprio anel de foco, porque a cor depende do que
  está embaixo: num botão dourado sólido um anel dourado desaparece, então ali
  ele é marfim. O recuo joga o anel para fora da caixa, sobre o fundo escuro.

  Antes não havia nenhum: o botão principal do hero — o único elemento
  interativo da primeira tela — dependia do anel padrão do navegador, diferente
  do resto do site.
*/
const VARIANTS = {
  solid:
    "bg-gold text-ink hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-18px_rgba(200,162,77,0.45)] focus-visible:outline-ivory",
  outline: "border border-gold text-gold hover:bg-gold hover:text-ink focus-visible:outline-gold",
  ghost: "text-ivory hover:text-gold focus-visible:outline-gold",
};

export function Button({
  href,
  children,
  variant = "solid",
  className,
  target,
  rel,
}: ButtonProps) {
  const isExternal = /^(?:https?:|mailto:|tel:)/i.test(href);
  const externalRel =
    target === "_blank"
      ? [rel, "noopener", "noreferrer"].filter(Boolean).join(" ")
      : rel;

  const classes = cn(
    "inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide uppercase rounded-sm transition-[transform,background-color,box-shadow] duration-[250ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
    VARIANTS[variant],
    className
  );

  if (isExternal) {
    return (
      <a href={href} className={classes} target={target} rel={externalRel}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
