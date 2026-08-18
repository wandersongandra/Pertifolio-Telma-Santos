import { siteData } from "@/content/site-data";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DenseListIndex } from "@/components/ui/DenseListIndex";

export function DialogosFormativos() {
  const { dialogosFormativos } = siteData;

  return (
    <section className="py-24 md:py-32 border-y border-warm-gray/20 bg-charcoal/40">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <SectionHeading
          eyebrow={dialogosFormativos.eyebrow}
          heading={dialogosFormativos.heading}
          className="mb-6"
        />
        <Reveal>
          <p className="text-ivory/80 leading-relaxed max-w-2xl mb-12">
            {dialogosFormativos.intro}
          </p>
        </Reveal>
        <DenseListIndex items={dialogosFormativos.items} />
      </div>
    </section>
  );
}
