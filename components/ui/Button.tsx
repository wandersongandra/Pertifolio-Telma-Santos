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

const VARIANTS = {
  solid:
    "bg-gold text-ink hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-18px_rgba(200,162,77,0.45)]",
  outline: "border border-gold text-gold hover:bg-gold hover:text-ink",
  ghost: "text-ivory hover:text-gold",
};

export function Button({
  href,
  children,
  variant = "solid",
  className,
  target,
  rel,
}: ButtonProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

  const classes = cn(
    "inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide uppercase rounded-sm transition-[transform,background-color,box-shadow] duration-[250ms]",
    VARIANTS[variant],
    className
  );

  if (isExternal) {
    return (
      <a href={href} className={classes} target={target} rel={rel}>
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
