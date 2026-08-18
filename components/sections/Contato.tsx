"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { siteData, whatsappPhone, contactEmail } from "@/content/site-data";
import { buildMailtoLink, buildWhatsAppLink } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Kicker } from "@/components/ui/Kicker";
import { cn } from "@/lib/utils";

export function Contato() {
  const { contato } = siteData;
  const [interest, setInterest] = useState(contato.interests[0]);
  const [name, setName] = useState("");

  const message = useMemo(() => {
    const base = contato.whatsappMessageTemplate.replace(
      "{interesse}",
      interest.toLowerCase()
    );
    return name.trim() ? `${base} Meu nome é ${name.trim()}.` : base;
  }, [contato.whatsappMessageTemplate, interest, name]);

  const whatsappHref = buildWhatsAppLink(whatsappPhone, message);
  const mailtoHref = buildMailtoLink(contactEmail, `Contato via portfólio — ${interest}`, message);

  return (
    <section
      id="contato"
      className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-charcoal/60 [clip-path:polygon(0_5vw,100%_0,100%_100%,0_100%)]"
    >
      <div className="mx-auto max-w-2xl px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.5 }}
        >
          <Kicker className="mb-5">{contato.eyebrow}</Kicker>
        </motion.div>
        <motion.h2
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
          className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-ivory mb-6 text-balance"
        >
          {contato.heading}
        </motion.h2>
        <Reveal>
          <p className="text-lg text-ivory/80 leading-relaxed mx-auto max-w-md mb-10">
            {contato.intro}
          </p>

          <div className="space-y-6 mx-auto max-w-md text-left">
            <div>
              <label htmlFor="contato-nome" className="block text-sm text-warm-gray mb-2">
                Seu nome (opcional)
              </label>
              <motion.input
                id="contato-nome"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                whileFocus={{ scale: 1.01, borderColor: "var(--color-gold)" }}
                transition={{ duration: 0.2 }}
                className="w-full bg-transparent border border-warm-gray/40 rounded-sm px-4 py-3 text-ivory placeholder:text-warm-gray/60 focus:outline-none"
                placeholder="Nome"
              />
            </div>

            <fieldset>
              <legend className="block text-sm text-warm-gray mb-3">Interesse</legend>
              <div className="flex flex-wrap gap-2">
                {contato.interests.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setInterest(option)}
                    aria-pressed={interest === option}
                    className={cn(
                      "px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded-sm border transition-colors",
                      interest === option
                        ? "bg-gold text-ink border-gold"
                        : "border-warm-gray/40 text-ivory/80 hover:border-gold hover:text-gold"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <MagneticButton>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold text-ink text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-ivory transition-colors"
                >
                  Chamar no WhatsApp
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href={mailtoHref}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gold text-gold text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-gold hover:text-ink transition-colors"
                >
                  Enviar e-mail
                </a>
              </MagneticButton>
            </div>
          </div>

          <ul className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {contato.channels
              .filter((channel) => channel.type === "instagram" || channel.type === "linkedin")
              .map((channel) => (
                <li key={channel.type}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-draw pb-0.5 text-ivory/70 hover:text-gold transition-colors"
                  >
                    {channel.label} · {channel.value}
                  </a>
                </li>
              ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
