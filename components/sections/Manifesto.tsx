import { siteData } from "@/content/site-data";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { Kicker } from "@/components/ui/Kicker";

export function Manifesto() {
  const { manifesto } = siteData;

  return (
    <section className="border-y border-warm-gray/20 bg-charcoal/40">
      <div className="mx-auto max-w-4xl px-6 md:px-10 py-24 md:py-32">
        <Reveal>
          <Kicker className="mb-6">{manifesto.eyebrow}</Kicker>
        </Reveal>
        <div className="space-y-6">
          {manifesto.paragraphs.map((paragraph, index) => (
            <WordReveal
              key={index}
              text={paragraph}
              delay={index * 0.1}
              className="font-display text-2xl md:text-3xl leading-snug text-ivory text-balance"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
