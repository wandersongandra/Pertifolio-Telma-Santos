"use client";

import { useMemo, useState } from "react";
import { siteData, whatsappPhone, contactEmail } from "@/content/site-data";
import { buildMailtoLink, buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Contato() {
  const { contato } = siteData;
  const [interest, setInterest] = useState(contato.interests[0]);
  const [name, setName] = useState("");

  const message = useMemo(() => {
    const base = contato.whatsappMessageTemplate.replace("{interesse}", interest.phrase);
    return name.trim() ? `${base} Meu nome é ${name.trim()}.` : base;
  }, [contato.whatsappMessageTemplate, interest, name]);

  const whatsappHref = buildWhatsAppLink(whatsappPhone, message);
  const mailtoHref = buildMailtoLink(
    contactEmail,
    `Contato via portfólio — ${interest.label}`,
    message
  );

  return (
    <section
      id="contato"
      className="relative pt-20 pb-16 md:pt-40 md:pb-32 bg-charcoal/60 [clip-path:polygon(0_5vw,100%_0,100%_100%,0_100%)]"
    >
      <div className="mx-auto max-w-7xl shell">
        {/*
          Três blocos, não duas colunas.

          No desktop a leitura é lado a lado e a ordem vertical dentro da coluna
          esquerda não custa nada. Empilhada no celular, ela custava: título,
          intro, assinatura e redes sociais vinham inteiros antes do formulário,
          e quem tinha chegado até a última seção com intenção de falar com a
          Telma ainda precisava rolar mais de meia tela para achar o botão.

          Agora são três blocos irmãos, na ordem em que se lê no celular:
          abertura, formulário, assinatura. Do `lg` para cima o grid recoloca a
          assinatura embaixo da abertura, na primeira coluna, e o formulário
          ocupa as duas linhas da segunda — exatamente o desenho anterior.
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:grid-rows-[auto_1fr] lg:gap-x-[clamp(48px,5vw,96px)]">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
              {contato.eyebrow}
            </p>

            <h2 className="mt-5 font-display text-[clamp(36px,9vw,48px)] leading-[1.02] tracking-[-0.03em] text-ivory text-balance md:mt-6 md:text-[clamp(56px,5.5vw,88px)] md:leading-[0.95] md:tracking-[-0.035em]">
              {contato.heading}
            </h2>

            <p className="mt-6 max-w-[520px] text-[clamp(17px,1.25vw,21px)] leading-[1.6] text-ivory/75 md:mt-8">
              {contato.intro}
            </p>

          </div>

          <div className="mt-12 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mt-0 lg:pt-16 xl:border-l xl:border-ivory/[0.08] xl:pl-14">
            <div>
              <label
                htmlFor="contato-nome"
                className="block text-[13px] font-semibold uppercase tracking-[0.16em]"
              >
                <span className="text-gold">01</span>{" "}
                <span className="text-ivory/80">— Como posso chamar você?</span>
              </label>
              <input
                id="contato-nome"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                // O nome entra na URL do WhatsApp e do `mailto:`. Sem limite, um
                // texto colado por engano gera uma URL longa demais, que o
                // WhatsApp e alguns clientes de e-mail truncam ou recusam sem
                // avisar. 80 caracteres cobrem qualquer nome real.
                maxLength={80}
                // A borda era `ivory/20`: 1,70:1 sobre o fundo composto desta
                // seção. A WCAG 1.4.11 pede 3:1 para o contorno de um
                // componente de interface, e esse fio é o único contorno que o
                // campo tem — abaixo disso ele lê como texto corrido com um
                // risco embaixo, não como algo onde se digita. `ivory/40` dá
                // 3,41:1 sem mudar a estética.
                //
                // O `focus:outline-none` saiu junto. Ele trocava o anel de foco
                // por uma mudança de cor de 1px: para quem navega por teclado,
                // o indicador do único campo da página era um fio mudando de
                // cinza para dourado.
                className="mt-3 w-full max-w-[620px] border-0 border-b border-ivory/40 bg-transparent px-0 py-3 text-[clamp(18px,1.15vw,21px)] text-ivory transition-colors duration-200 placeholder:text-ivory/55 focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                placeholder="Seu nome (opcional)"
              />
            </div>

            <fieldset className="mt-10">
              <legend className="text-[13px] font-semibold uppercase tracking-[0.16em]">
                <span className="text-gold">02</span>{" "}
                <span className="text-ivory/80">— Sobre o que vamos conversar?</span>
              </legend>
              <div className="mt-4 grid grid-cols-1 gap-x-8 [@media(min-width:480px)]:grid-cols-2">
                {contato.interests.map((option, index) => {
                  const selected = interest.label === option.label;
                  const optionId = `contato-interesse-${index}`;
                  return (
                    <label
                      key={option.label}
                      htmlFor={optionId}
                      className={cn(
                        "group relative flex min-h-11 cursor-pointer items-start gap-3 py-2.5 text-[16px] transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
                        selected ? "text-ivory" : "text-ivory/70 hover:text-ivory/90"
                      )}
                    >
                      {/*
                        O estado NÃO selecionado precisa ter forma.

                        Antes o único sinal era um travessão dourado ao lado da
                        opção ativa: as outras cinco eram texto cinza, sem
                        círculo, sem caixa, sem borda — indistinguíveis de uma
                        lista qualquer. Num celular ninguém entendia que aquilo
                        era escolhível, e a seção é a última antes da conversão.

                        O anel usa `ivory/40` (3,41:1 sobre o fundo desta seção)
                        porque é o contorno de um controle: a WCAG 1.4.11 pede
                        3:1 para ele, e o anel vazio é justamente o que comunica
                        que existe uma escolha a fazer.
                      */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-[3px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border transition-colors duration-200",
                          selected ? "border-gold" : "border-ivory/40 group-hover:border-ivory/70"
                        )}
                      >
                        <span
                          className={cn(
                            "h-[8px] w-[8px] rounded-full bg-gold transition-opacity duration-200",
                            selected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </span>
                      <span>{option.label}</span>
                      <input
                        id={optionId}
                        type="radio"
                        name="contato-interesse"
                        value={option.label}
                        checked={selected}
                        onChange={() => setInterest(option)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-10">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                // O anel de foco é marfim, não dourado: dourado sobre um botão
                // dourado não aparece. Com o recuo de 4px ele cai fora do
                // botão, sobre o fundo escuro da seção.
                className="inline-flex w-full items-center justify-center gap-3 bg-gold px-8 py-4 text-ink text-sm font-semibold tracking-[0.08em] transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory sm:w-auto"
              >
                Conversar pelo WhatsApp <span aria-hidden="true">→</span>
              </a>

              <p className="mt-6 text-ivory/70">
                Prefere e-mail?{" "}
                {/*
                  O alvo media 36px, não os 44px que a versão anterior deste
                  comentário afirmava: `py-2.5` punha 10px em cima e embaixo, e
                  o `pb-0.5` logo em seguida devolvia o de baixo para 2px —
                  10 + 24 da linha + 2 = 36. O `pb-0.5` existia para o
                  sublinhado do `.link-draw` não descolar do texto, já que ele é
                  desenhado na base da caixa.

                  Agora são dois elementos: a âncora carrega o alvo (44px de
                  altura, medido) e o span interno carrega o traço, colado ao
                  texto. O `group-hover`/`group-focus-visible` mantém o
                  sublinhado respondendo à âncora inteira, e não só à parte dela
                  que tem letra embaixo do dedo.
                */}
                <a
                  href={mailtoHref}
                  className="group inline-block py-2.5 text-ivory transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <span className="link-draw pb-0.5 group-hover:[background-size:100%_1px] group-focus-visible:[background-size:100%_1px]">
                    Enviar mensagem <span aria-hidden="true">→</span>
                  </span>
                </a>
              </p>
            </div>
          </div>

          {/*
            A assinatura vem depois do formulário também na marcação, não só na
            tela. Reordenar com `order` teria posto o teclado em desacordo com
            os olhos — o Tab passaria por Instagram e LinkedIn antes de chegar
            ao campo de nome, que é o oposto do que a tela mostra (WCAG 2.4.3).

            Nesta ordem os dois coincidem nas duas composições: no celular, uma
            coluna — abertura, formulário, assinatura; no desktop, o grid põe
            abertura e assinatura na primeira coluna e o formulário na segunda,
            e a leitura em Z passa por abertura, formulário e assinatura, na
            mesma sequência do documento.
          */}
          <div className="mt-14 lg:col-start-1 lg:row-start-2 lg:mt-10">
            <div>
              <p className="font-display text-xl md:text-2xl text-ivory">{siteData.meta.name}</p>
              <p className="mt-1.5 text-[13px] uppercase tracking-[0.16em] text-gold-muted">
                {siteData.hero.kicker}
              </p>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 lg:mt-10">
              {contato.channels
                .filter((channel) => channel.type === "instagram" || channel.type === "linkedin")
                .map((channel) => (
                  <li key={channel.type}>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw inline-flex min-h-11 items-center pb-0.5 text-sm text-ivory/75 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    >
                      {channel.label} · {channel.value}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}