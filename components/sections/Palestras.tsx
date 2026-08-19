import { siteData } from "@/content/site-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Palestras() {
  const { palestras } = siteData;

  return (
    <section id="palestras" className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <SectionHeading eyebrow={palestras.eyebrow} heading={palestras.heading} className="mb-6" />
        <p className="text-[clamp(18px,1.3vw,22px)] leading-[1.55] text-ivory/80 max-w-[760px] mb-12">
          {palestras.intro}
        </p>
        <ol>
          {palestras.items.map((talk, index) => {
            const isLead = index === 0;
            return (
              <li
                key={talk.id}
                className={cn(
                  "grid grid-cols-[36px_minmax(0,1fr)] gap-x-[18px] border-ivory/8",
                  isLead ? "py-10 md:py-14" : "py-7 md:py-9",
                  index < palestras.items.length - 1 && "border-b"
                )}
              >
                <p className="mt-1.5 text-[11px] font-semibold tracking-[0.18em] text-gold">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3
                    className={cn(
                      "font-display text-ivory text-balance",
                      isLead
                        ? "text-[clamp(34px,3vw,52px)] leading-[1.05] tracking-[-0.025em]"
                        : "text-[clamp(26px,2.1vw,38px)] leading-[1.12] tracking-[-0.02em]"
                    )}
                  >
                    {talk.title}
                  </h3>
                  {talk.summary && (
                    <p className="mt-3 text-[clamp(16px,1.1vw,19px)] leading-[1.55] text-ivory/65 max-w-[760px]">
                      {talk.summary}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}