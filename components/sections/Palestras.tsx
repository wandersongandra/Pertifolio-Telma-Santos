import { siteData } from "@/content/site-data";
import { Reveal } from "@/components/motion/Reveal";
import { NumberBadge } from "@/components/motion/NumberBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HoverAccentRow } from "@/components/ui/HoverAccentRow";

export function Palestras() {
  const { palestras } = siteData;

  return (
    <section id="palestras" className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <SectionHeading eyebrow={palestras.eyebrow} heading={palestras.heading} className="mb-6" />
        <Reveal>
          <p className="text-ivory/80 leading-relaxed max-w-2xl mb-12">{palestras.intro}</p>
        </Reveal>
        <ul className="divide-y divide-warm-gray/20">
          {palestras.items.map((talk, index) => (
            <HoverAccentRow
              key={talk.id}
              delay={Math.min(index * 0.05, 0.25)}
              className="py-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
            >
              <NumberBadge className="block font-display text-gold-muted text-sm shrink-0 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </NumberBadge>
              <div>
                <h3 className="font-display text-xl md:text-2xl text-ivory">{talk.title}</h3>
                {talk.summary && (
                  <p className="text-ivory/70 mt-1">{talk.summary}</p>
                )}
              </div>
            </HoverAccentRow>
          ))}
        </ul>
      </div>
    </section>
  );
}
