import Link from "next/link";
import { AreaDetailPanel } from "@/components/sections/AreaDetailPanel";
import { siteData } from "@/content/site-data";
import {
  getAreaForService,
  getServicePageByAreaId,
  servicePages,
  type ServicePage,
} from "@/content/service-pages";

export function ServiceLanding({ service }: { service: ServicePage }) {
  const area = getAreaForService(service);
  const related = servicePages.filter((item) => item.slug !== service.slug).slice(0, 4);
  const whatsapp = siteData.contato.channels.find((channel) => channel.type === "whatsapp");
  const email = siteData.contato.channels.find((channel) => channel.type === "email");

  return (
    <article className="py-14 md:py-24">
      <div className="mx-auto max-w-7xl shell">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.14em] text-ivory/55">
          <Link href="/" className="transition-colors hover:text-gold">
            Início
          </Link>
          <span aria-hidden="true" className="mx-2 text-ivory/30">/</span>
          <Link href="/#atuacao" className="transition-colors hover:text-gold">
            Atuação
          </Link>
          <span aria-hidden="true" className="mx-2 text-ivory/30">/</span>
          <span aria-current="page" className="text-ivory/80">{area.label}</span>
        </nav>

        <header className="mt-12 max-w-5xl md:mt-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {area.label}
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(42px,9vw,72px)] leading-[0.98] tracking-[-0.035em] text-ivory md:text-[clamp(58px,6vw,88px)]">
            {service.headline}
          </h1>
          <p className="mt-8 max-w-3xl text-[clamp(18px,1.5vw,22px)] leading-[1.65] text-ivory/72">
            {service.intro}
          </p>
        </header>

        <section className="mt-16 border-t border-ivory/10 pt-12 md:mt-24 md:pt-16" aria-labelledby="service-scope-title">
          <div className="grid gap-10 lg:grid-cols-[minmax(220px,0.55fr)_minmax(0,1.45fr)] lg:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Escopo apresentado
              </p>
              <h2 id="service-scope-title" className="mt-4 font-display text-[clamp(30px,5vw,46px)] leading-[1.04] tracking-[-0.025em] text-ivory">
                Temas e frentes de atuação.
              </h2>
              {area.description && (
                <p className="mt-5 text-[16px] leading-[1.65] text-ivory/62">
                  {area.description}
                </p>
              )}
            </div>
            <div>
              <AreaDetailPanel detail={area.detail} />
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-ivory/10 pt-12 md:mt-24 md:pt-16" aria-labelledby="related-services-title">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Outras áreas
          </p>
          <h2 id="related-services-title" className="mt-4 max-w-3xl font-display text-[clamp(30px,5vw,48px)] leading-[1.04] tracking-[-0.025em] text-ivory">
            Outras frentes do trabalho educacional.
          </h2>
          <div className="mt-8 grid gap-0 border-t border-ivory/10 md:grid-cols-2">
            {related.map((item) => {
              const relatedArea = getAreaForService(item);
              return (
                <Link
                  key={item.slug}
                  href={`/servicos/${item.slug}`}
                  className="group border-b border-ivory/10 py-5 text-[17px] text-ivory/72 transition-colors hover:text-gold md:pr-8"
                >
                  <span>{relatedArea.label}</span>
                  <span aria-hidden="true" className="ml-2 transition-transform group-hover:translate-x-1">↗</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16 border-t border-ivory/10 pt-12 md:mt-24 md:pt-16" aria-labelledby="service-contact-title">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Contato
          </p>
          <h2 id="service-contact-title" className="mt-4 max-w-3xl font-display text-[clamp(32px,5.5vw,54px)] leading-[1.04] tracking-[-0.025em] text-ivory">
            Quer conversar sobre esta frente de trabalho?
          </h2>
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-ivory/65">
            Entre em contato para apresentar o contexto, a equipe e o objetivo do projeto educacional.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
            {whatsapp && (
              <a
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw pb-1 text-sm font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:text-gold"
              >
                WhatsApp ↗
              </a>
            )}
            {email && (
              <a
                href={email.href}
                className="link-draw pb-1 text-sm font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:text-gold"
              >
                E-mail ↗
              </a>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}
