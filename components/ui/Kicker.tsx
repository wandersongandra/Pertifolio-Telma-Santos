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
      className={cn(
        "text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-gold",
        className
      )}
    >
      {children}
    </p>
  );
}
