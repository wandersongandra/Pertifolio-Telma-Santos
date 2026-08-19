import { siteData } from "@/content/site-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

const CELL_BORDERS = [
  "",
  "border-t sm:border-t-0 sm:border-l",
  "border-t",
  "border-t sm:border-l",
];

export function Oficinas() {
  const { oficinas } = siteData;

  return (
    <section id="oficinas" className="py-24 md:py-32 border-y border-warm-gray/20 bg-charcoal/40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading eyebrow={oficinas.eyebrow} heading={oficinas.heading} className="mb-6" />
        <p className="text-[clamp(18px,1.3vw,22px)] leading-[1.55] text-ivory/80 max-w-[860px] mb-14">
          {oficinas.intro}
        </p>
        <ol className="grid sm:grid-cols-2">
          {oficinas.items.map((item, index) => (
            <li
              key={item.id}
              className={cn("border-ivory/10 p-8 md:p-12 lg:p-16", CELL_BORDERS[index])}
            >
              <p className="text-[11px] font-semibold tracking-[0.18em] text-gold">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-5 font-display text-[clamp(30px,2.5vw,44px)] leading-[1.08] tracking-[-0.025em] text-ivory">
                {item.title}
              </h3>
              <p className="mt-4 text-[clamp(16px,1.1vw,19px)] leading-[1.5] text-ivory/70 max-w-[520px]">
                {item.summary}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}