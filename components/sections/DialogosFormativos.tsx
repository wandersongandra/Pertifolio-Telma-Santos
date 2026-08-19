import { siteData } from "@/content/site-data";
import { DenseListIndex } from "@/components/ui/DenseListIndex";

export function DialogosFormativos() {
  const { dialogosFormativos } = siteData;
  const themeCount = dialogosFormativos.items.length;

  return (
    <section className="border-y border-warm-gray/20 bg-charcoal/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="lg:grid lg:grid-cols-[minmax(280px,0.65fr)_minmax(0,1.35fr)] lg:gap-x-[clamp(48px,5vw,88px)]">
          <aside className="mb-16 lg:mb-0 lg:sticky lg:top-20 lg:self-start">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
              {dialogosFormativos.eyebrow}
            </p>
            <h2 className="mt-6 font-display text-[clamp(52px,5vw,78px)] leading-[0.95] tracking-[-0.03em] text-ivory">
              {dialogosFormativos.heading}
            </h2>
            <div className="mt-12">
              <span className="block font-display text-[clamp(64px,6vw,96px)] leading-[0.85] text-ivory">
                {themeCount}
              </span>
              <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Temas formativos
              </span>
            </div>
            <p className="mt-8 max-w-[360px] text-[clamp(17px,1.15vw,20px)] leading-[1.6] text-ivory/70">
              {dialogosFormativos.intro}
            </p>
          </aside>

          <DenseListIndex items={dialogosFormativos.items} />
        </div>
      </div>
    </section>
  );
}