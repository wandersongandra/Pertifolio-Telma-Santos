interface MarqueeProps {
  words: string[];
}

export function Marquee({ words }: MarqueeProps) {
  const text = words.join(" · ") + " · ";

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-warm-gray/20 py-6"
    >
      <div className="marquee-track">
        <span className="font-display text-2xl md:text-3xl text-gold-muted/70 whitespace-nowrap px-6">
          {text}
        </span>
        <span className="font-display text-2xl md:text-3xl text-gold-muted/70 whitespace-nowrap px-6">
          {text}
        </span>
      </div>
    </div>
  );
}
