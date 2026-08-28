"use client";

import { siteData } from "@/content/site-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface TrajetoriaGroup {
  label?: string;
  ids: string[];
}

const GROUPS: TrajetoriaGroup[] = [
  { ids: ["inicio"] },
  { ids: ["instituto-ayrton-senna"] },
  { label: "Coordenação", ids: ["coordenacao-ef"] },
  {
    label: "Currículo e documentos",
    ids: ["referenciais-curriculares", "ppp-tremedal-caraibas", "orientacao-tecnica"],
  },
  {
    label: "Diagnóstico e mobilização",
    ids: ["diagnosticos-indicadores", "projetos-educacionais"],
  },
];

export function Trajetoria() {
  const byId = new Map(siteData.trajetoria.map((entry) => [entry.id, entry]));

  const items = GROUPS.flatMap((group) =>
    group.ids
      .map((id, indexInGroup) => {
        const entry = byId.get(id);
        if (!entry) return null;
        return {
          entry,
          group,
          firstInGroup: indexInGroup === 0,
          lastInGroup: indexInGroup === group.ids.length - 1,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  );
  const lastIndex = items.length - 1;
  const total = items.length;

  return (
    <section id="trajetoria" className="py-16 md:py-32 bg-charcoal/40 border-y border-warm-gray/20">
      <div className="mx-auto max-w-6xl px-6 md:px-10 grid md:grid-cols-[260px_minmax(0,1fr)] gap-16">
        <div className="md:sticky md:top-28 self-start">
          <SectionHeading eyebrow="Trajetória" heading="Trajetória Profissional" />
          <div className="mt-6 md:mt-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-8 md:w-10 bg-gold/30" />
            <p className="text-sm font-medium tracking-[0.18em] text-gold tabular-nums">
              01 — {String(total).padStart(2, "0")}
            </p>
          </div>
        </div>
        <div className="relative">
          <ol>
            {items.map(({ entry, group, firstInGroup, lastInGroup }, index) => {
              const isLast = index === lastIndex;
              const isOpening = entry.id === "inicio";
              const isHighlight = entry.id === "instituto-ayrton-senna";
              const meta = [entry.organization, entry.location].filter(Boolean).join(" · ");
              return (
                <li
                  key={entry.id}
                  className={cn(
                    "relative pl-7 md:pl-8",
                    isLast
                      ? "pb-0"
                      : lastInGroup
                        ? "pb-14 md:pb-20"
                        : "pb-8 md:pb-10",
                    isHighlight && "pt-8 md:pt-10"
                  )}
                >
                  {!isLast && (
                    <span
                      aria-hidden
                      className="absolute left-[2.5px] top-[5px] bottom-[-5px] w-px bg-gold/28"
                    />
                  )}
                  <span
                    aria-hidden
                    className="absolute left-0 top-[5px] h-1.5 w-1.5 rounded-full bg-gold"
                  />
                  {isHighlight && (
                    <span
                      aria-hidden
                      className="absolute left-7 md:left-8 right-0 top-0 h-px bg-gold/15"
                    />
                  )}
                  {group.label && firstInGroup && (
                    <p className="mb-3 md:mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-muted">
                      {group.label}
                    </p>
                  )}
                  {isOpening && entry.period && (
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                      {entry.period}
                    </p>
                  )}
                  <h3
                    className={cn(
                      "font-display text-ivory text-balance",
                      isOpening
                        ? "mt-4 md:mt-5 text-[clamp(27px,6.5vw,34px)] md:text-[clamp(34px,2.8vw,48px)] leading-[1.12] md:leading-[1.08] tracking-[-0.02em] md:tracking-[-0.025em]"
                        : "text-[clamp(24px,1.9vw,38px)] leading-[1.12] tracking-[-0.02em]"
                    )}
                  >
                    {entry.title}
                  </h3>
                  {meta && (
                    <p
                      className={cn(
                        "mt-2",
                        isHighlight
                          ? "text-xs font-semibold uppercase tracking-[0.12em] text-gold"
                          : "text-[13px] font-medium tracking-[0.02em] text-ivory/65"
                      )}
                    >
                      {meta}
                    </p>
                  )}
                  <p
                    className={cn(
                      isOpening
                        ? "mt-5 md:mt-6 text-[clamp(18px,1.2vw,22px)] leading-[1.55] text-ivory/75 max-w-[720px]"
                        : "mt-3 text-[clamp(16px,1.05vw,20px)] leading-[1.6] text-ivory/70 max-w-[760px]"
                    )}
                  >
                    {entry.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}