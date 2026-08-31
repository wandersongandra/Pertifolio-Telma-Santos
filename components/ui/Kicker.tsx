import { cn } from "@/lib/utils";

export function Kicker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      // 13px no celular, não 12px. É o olho de cada seção — "Posicionamento",
      // "Sobre", "Como atua", "Trajetória" — em caixa-alta e com `tracking` de
      // 0.2em, que espalha as letras e afina a palavra. A 12px isso vira um
      // fio cinza acima do título; 13px é o piso onde ainda se lê de relance.
      // Do `md` para cima segue nos 14px de antes.
      className={cn(
        "text-[13px] md:text-sm font-semibold tracking-[0.2em] uppercase text-gold",
        className
      )}
    >
      {children}
    </p>
  );
}
