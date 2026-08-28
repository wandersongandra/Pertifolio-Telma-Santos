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
      className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-charcoal/60 [clip-path:polygon(0_5vw,100%_0,100%_100%,0_100%)]"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-x-[clamp(48px,5vw,96px)]">
          <div className="mb-16 lg:mb-0">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
              {contato.eyebrow}
            </p>

            <h2 className="mt-6 font-display text-[clamp(56px,5.5vw,88px)] leading-[0.95] tracking-[-0.035em] text-ivory text-balance">
              {contato.heading}
            </h2>

            <p className="mt-8 max-w-[520px] text-[clamp(18px,1.25vw,21px)] leading-[1.6] text-ivory/70">
              {contato.intro}
            </p>

            <div className="mt-12">
              <p className="font-display text-xl md:text-2xl text-ivory">{siteData.meta.name}</p>
              <p className="mt-1.5 text-[12px] md:text-[13px] uppercase tracking-[0.16em] text-gold-muted">
                {siteData.hero.kicker}
              </p>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {contato.channels
                .filter((channel) => channel.type === "instagram" || channel.type === "linkedin")
                .map((channel) => (
                  <li key={channel.type}>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw pb-0.5 text-sm text-ivory/70 hover:text-gold transition-colors"
                    >
                      {channel.label} · {channel.value}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div className="xl:border-l xl:border-ivory/[0.08] xl:pl-14 lg:pt-16">
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
                className="mt-3 w-full max-w-[620px] border-0 border-b border-ivory/20 bg-transparent px-0 py-3 text-[clamp(18px,1.15vw,21px)] text-ivory transition-colors duration-200 placeholder:text-ivory/40 focus:border-gold focus:outline-none"
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
                        "group relative flex min-h-11 cursor-pointer items-baseline gap-3 py-2 text-[16px] transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold/60",
                        selected ? "text-ivory" : "text-ivory/55 hover:text-ivory/80"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "inline-block w-[1.1em] shrink-0 font-display text-gold transition-opacity duration-200",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                      >
                        —
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
                className="inline-flex w-full items-center justify-center gap-3 bg-gold px-8 py-4 text-ink text-sm font-semibold tracking-[0.08em] transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-light sm:w-auto"
              >
                Conversar pelo WhatsApp <span aria-hidden="true">→</span>
              </a>

              <p className="mt-6 text-ivory/70">
                Prefere e-mail?{" "}
                <a
                  href={mailtoHref}
                  className="link-draw pb-0.5 text-ivory transition-colors hover:text-gold"
                >
                  Enviar mensagem <span aria-hidden="true">→</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}