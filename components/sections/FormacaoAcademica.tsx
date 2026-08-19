import { siteData } from "@/content/site-data";
import { Kicker } from "@/components/ui/Kicker";

export function FormacaoAcademica() {
  const { formacaoAcademica } = siteData;
  const graduacoes = formacaoAcademica.items.filter((item) => item.category === "graduacao");
  const posGraduacoes = formacaoAcademica.items.filter(
    (item) => item.category === "pos-graduacao"
  );

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Kicker className="mb-4">{formacaoAcademica.eyebrow}</Kicker>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.1] text-ivory text-balance">
          {formacaoAcademica.heading}
        </h2>

        <div className="mt-12 md:mt-16 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="mb-16 lg:mb-0">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-gold">01</p>
            <p className="mt-3 text-[13px] font-medium uppercase tracking-[0.16em] text-ivory/55">
              Graduação
            </p>
            <ul className="mt-8">
              {graduacoes.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-ivory/[0.08] py-6 font-display text-[clamp(28px,2.2vw,40px)] leading-[1.1] tracking-[-0.02em] text-ivory"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:border-l lg:border-ivory/[0.08] lg:pl-[clamp(56px,6vw,112px)]">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-gold">02</p>
            <p className="mt-3 text-[13px] font-medium uppercase tracking-[0.16em] text-ivory/55">
              Pós-graduação
            </p>
            <ul className="mt-8">
              {posGraduacoes.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-ivory/[0.08] py-6 font-display text-[clamp(28px,2.2vw,40px)] leading-[1.1] tracking-[-0.02em] text-ivory"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}