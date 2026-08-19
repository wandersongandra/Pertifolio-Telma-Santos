interface DenseListIndexProps {
  items: { id: string; title: string }[];
}

export function DenseListIndex({ items }: DenseListIndexProps) {
  return (
    <ol className="grid list-none grid-cols-1 gap-x-[clamp(56px,5vw,90px)] md:grid-cols-2">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="flex items-baseline gap-4 border-b border-ivory/10 py-6 lg:py-7"
        >
          <span className="w-8 shrink-0 font-display text-xs md:text-sm leading-none tabular-nums text-gold">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[clamp(18px,1.35vw,23px)] leading-[1.35] text-ivory/90">
            {item.title}
          </span>
        </li>
      ))}
    </ol>
  );
}