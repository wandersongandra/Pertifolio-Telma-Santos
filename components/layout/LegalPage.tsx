import type { ReactNode } from "react";

export interface LegalSection {
  title: string;
  paragraphs: ReactNode[];
}

export function LegalPage({
  eyebrow,
  title,
  updatedAt,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32">
      <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
        {eyebrow}
      </p>
      <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-ivory text-balance">
        {title}
      </h1>
      <p className="mt-5 text-sm text-ivory/60">Última atualização: {updatedAt}</p>

      <p className="mt-12 text-[clamp(18px,1.25vw,21px)] leading-[1.6] text-ivory/80">
        {intro}
      </p>

      <div className="mt-14">
        {sections.map((section, index) => (
          <section key={section.title} className="border-t border-ivory/[0.08] py-8">
            <h2 className="font-display text-xl md:text-2xl leading-[1.15] text-ivory">
              {index + 1}. {section.title}
            </h2>
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                key={paragraphIndex}
                className="mt-4 text-[16px] leading-[1.7] text-ivory/75"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}