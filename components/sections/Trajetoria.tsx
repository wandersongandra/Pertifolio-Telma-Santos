"use client";

import { Fragment, useState } from "react";
import { siteData } from "@/content/site-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface TrajetoriaGroup {
  label?: string;
  ids: string[];
}

/** Mesmo desenho do acordeão de Áreas de Atuação: um mais que vira menos. */
function GroupIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative ml-auto block h-3 w-3 shrink-0 text-gold">
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
      <span
        className={cn(
          "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-out motion-reduce:transition-none",
          open ? "scale-y-0" : "scale-y-100"
        )}
      />
    </span>
  );
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

  /*
    Os três grupos rotulados abrem sob demanda — abaixo do `md` e só ali.

    A lista tem oito itens e, empilhada no celular, dava três telas de entradas
    do mesmo peso, uma atrás da outra. Os dois primeiros são os que vendem (o
    começo da trajetória e o Instituto Ayrton Senna) e ficam sempre abertos; os
    seis restantes viram um índice de três linhas que a pessoa abre se quiser.

    Independentes, não exclusivos: quem está conferindo credencial costuma
    querer dois grupos abertos ao mesmo tempo, e fechar um para abrir outro
    seria trabalho a mais sem nenhum ganho.

    Não há compensação de rolagem aqui, ao contrário do acordeão de Atuação.
    Lá abrir um item fechava outro, que podia estar acima, e a página saltava.
    Aqui cada grupo só mexe no que vem depois do seu próprio cabeçalho — o
    botão tocado nunca sai do lugar.
  */
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (label: string) =>
    setOpenGroups((current) => ({ ...current, [label]: !current[label] }));

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
      <div className="mx-auto max-w-6xl shell grid gap-10 md:grid-cols-[260px_minmax(0,1fr)] md:gap-16">
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
              /*
                Os dois primeiros itens são os que vendem: o começo da
                trajetória e o Instituto Ayrton Senna. Os outros seis são
                lastro — verdadeiros, necessários, mas não é por eles que
                alguém decide contratar.

                No desktop a coluna fixa à esquerda dá referência e o olho
                percorre a lista de relance. No celular ela some, e sobravam
                três telas de itens do mesmo tamanho, com o mesmo peso, um
                atrás do outro (medido: 2.551px num iPhone 14, 2.608px num
                iPhone SE — 3,91 telas). A diferença de escala abaixo do `md`
                devolve a hierarquia que o grid entregava; do `md` para cima
                tudo continua como estava.
              */
              const isLead = isOpening || isHighlight;
              const meta = [entry.organization, entry.location].filter(Boolean).join(" · ");
              // Sem rótulo não há grupo a recolher: os dois itens de abertura
              // ficam sempre visíveis.
              const collapsible = Boolean(group.label);
              const openOnMobile = collapsible ? Boolean(openGroups[group.label!]) : true;
              return (
                <Fragment key={entry.id}>
                  {collapsible && firstInGroup && (
                    /*
                      Um `<li>` a mais, só no celular. No `md` ele é
                      `display: none` — sai do desenho e da árvore de
                      acessibilidade junto, então a lista do desktop continua
                      sendo exatamente os mesmos oito itens de antes.

                      É uma faixa divisória, não um nó da linha do tempo: sem
                      ponto e sem trilho, porque um grupo não é um evento. O
                      filete no topo é o que fecha o bloco anterior.
                    */
                    <li className="md:hidden">
                      <button
                        type="button"
                        aria-expanded={openOnMobile}
                        aria-controls={group.ids
                          .map((id) => `trajetoria-item-${id}`)
                          .join(" ")}
                        onClick={() => toggleGroup(group.label!)}
                        className="flex w-full min-h-12 items-center gap-3 border-t border-gold/20 py-4 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                      >
                        <span className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
                          {group.label}
                        </span>
                        <span className="text-[12px] font-medium tabular-nums text-ivory/50">
                          {String(group.ids.length).padStart(2, "0")}
                        </span>
                        <GroupIcon open={openOnMobile} />
                      </button>
                    </li>
                  )}
                <li
                  id={`trajetoria-item-${entry.id}`}
                  className={cn(
                    "relative pl-7 md:pl-8",
                    isLast
                      // No celular o último item é seguido pelo filete que
                      // fecha a pilha de faixas; sem folga o texto encostaria
                      // nele. No desktop não há filete e o `pb-0` continua.
                      ? "pb-0 max-md:pb-10"
                      : lastInGroup
                        ? "pb-10 md:pb-20"
                        : "pb-6 md:pb-10",
                    isHighlight && "pt-8 md:pt-10",
                    // Recolhido, o item some no celular e continua inteiro no
                    // desktop. `display: none` também o tira do caminho do Tab
                    // e do leitor de tela, que é o comportamento certo para
                    // conteúdo que a pessoa ainda não pediu para ver.
                    collapsible && !openOnMobile && "max-md:hidden",
                    // Respiro entre a faixa e o primeiro item do grupo aberto.
                    // Margem, não preenchimento: o ponto e o trilho são
                    // absolutos contra a caixa do `<li>`, então um `pt` os
                    // deixaria flutuando 20px acima do título, enquanto a
                    // margem desloca o item inteiro com eles junto.
                    collapsible && firstInGroup && "max-md:mt-5"
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
                    // Só no desktop. No celular quem mostra o rótulo é a faixa
                    // divisória acima, que também é o botão — repeti-lo aqui
                    // diria a mesma coisa duas vezes seguidas.
                    <p className="mb-4 hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-muted md:block">
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
                        : isLead
                          ? "text-[clamp(24px,6vw,30px)] md:text-[clamp(24px,1.9vw,38px)] leading-[1.12] tracking-[-0.02em]"
                          : "text-[20px] md:text-[clamp(24px,1.9vw,38px)] leading-[1.18] md:leading-[1.12] tracking-[-0.015em] md:tracking-[-0.02em]"
                    )}
                  >
                    {entry.title}
                  </h3>
                  {meta && (
                    <p
                      className={cn(
                        "mt-2",
                        isHighlight
                          // 13px no celular: em caixa-alta com `tracking`
                          // aberto, 12px é onde a leitura começa a exigir
                          // esforço numa tela pequena.
                          ? "text-[13px] font-semibold uppercase tracking-[0.12em] text-gold md:text-xs"
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
                        : isLead
                          ? "mt-3 text-[16px] md:text-[clamp(16px,1.05vw,20px)] leading-[1.6] text-ivory/70 max-w-[760px]"
                          : "mt-2 text-[15px] leading-[1.55] text-ivory/60 md:mt-3 md:text-[clamp(16px,1.05vw,20px)] md:leading-[1.6] md:text-ivory/70 max-w-[760px]"
                    )}
                  >
                    {entry.description}
                  </p>
                </li>
                </Fragment>
              );
            })}
          </ol>
          {/*
            Fecha a pilha de faixas no celular. Com os três grupos recolhidos a
            lista termina numa faixa divisória, e sem este filete a última ficava
            aberta embaixo, parecendo cortada. No desktop não existe faixa
            nenhuma para fechar.
          */}
          <div aria-hidden className="h-px w-full bg-gold/20 md:hidden" />
        </div>
      </div>
    </section>
  );
}