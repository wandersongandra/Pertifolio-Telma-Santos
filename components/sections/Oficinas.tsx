import { siteData } from "@/content/site-data";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { NumberBadge } from "@/components/motion/NumberBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Oficinas() {
  const { oficinas } = siteData;

  return (
    <section id="oficinas" className="py-24 md:py-32 border-y border-warm-gray/20 bg-charcoal/40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading eyebrow={oficinas.eyebrow} heading={oficinas.heading} className="mb-6" />
        <Reveal>
          <p className="text-ivory/80 leading-relaxed max-w-2xl mb-14">{oficinas.intro}</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-px bg-warm-gray/20">
          {oficinas.items.map((item, index) => (
            <Reveal key={item.id} delay={Math.min(index * 0.08, 0.24)}>
              <TiltCard className="h-full bg-ink p-8 md:p-10">
                <NumberBadge className="block font-display text-gold-muted text-sm">
                  {String(index + 1).padStart(2, "0")}
                </NumberBadge>
                <h3 className="font-display text-2xl md:text-3xl text-ivory mt-3 mb-2">
                  {item.title}
                </h3>
                <p className="text-ivory/70 leading-relaxed">{item.summary}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
