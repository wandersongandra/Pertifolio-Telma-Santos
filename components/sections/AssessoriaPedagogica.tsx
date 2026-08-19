"use client";

import { siteData } from "@/content/site-data";
import { Kicker } from "@/components/ui/Kicker";

export function AssessoriaPedagogica() {
  const { assessoriaPedagogica } = siteData;

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <Kicker className="mb-4">{assessoriaPedagogica.eyebrow}</Kicker>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-6">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.1] text-ivory text-balance">
            {assessoriaPedagogica.heading}
          </h2>
          <span className="text-sm md:text-base font-semibold tracking-[0.15em] text-gold">
            {assessoriaPedagogica.period}
          </span>
        </div>
        <p className="text-[clamp(18px,1.3vw,22px)] leading-[1.55] text-ivory/80 max-w-[760px] mb-10 md:mb-12">
          {assessoriaPedagogica.summary}
        </p>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-20">
          {assessoriaPedagogica.capabilities.map((capability, index) => (
            <li
              key={capability}
              className="flex items-baseline gap-4 border-b border-ivory/10 py-6 md:py-7"
            >
              <p className="shrink-0 text-[11px] font-semibold tracking-[0.18em] text-gold">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="text-[clamp(18px,1.35vw,24px)] font-medium leading-[1.3] text-ivory">
                {capability}
              </h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}