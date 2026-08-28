import { siteData, contactEmail, whatsappPhone } from "@/content/site-data";
import { siteUrl } from "@/lib/site-url";

/**
 * Dados estruturados (JSON-LD) do site.
 *
 * Metadata diz ao Google o que a *página* é. Isto diz quem a **pessoa** é: que
 * Telma Santos é uma profissional da Educação, o que ela faz, desde quando,
 * onde atua e quais perfis na internet são dela. É o que permite ao buscador
 * ligar o site aos perfis sociais e tratar as buscas pelo nome dela como sendo
 * sobre uma pessoa específica, em vez de uma sequência de palavras.
 *
 * Tudo aqui vem de `content/site-data.ts` — nada é inventado para o buscador.
 * Dado estruturado que não corresponde ao conteúdo visível é penalizado, e com
 * razão.
 */

// `JSON.stringify` pode produzir a sequência `</script>` se algum texto do
// conteúdo contiver isso, o que encerraria a tag mais cedo e jogaria o resto do
// JSON no HTML como marcação. Escapar `<` como `\u003c` fecha esse caminho: é
// uma sequência válida dentro de string JSON e o parser a lê como `<`.
function toSafeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\u003c");
}

export function StructuredData() {
  const { meta, sobre, areasDeAtuacao, contato } = siteData;

  const personId = `${siteUrl}/#telma-santos`;
  const websiteId = `${siteUrl}/#website`;

  const perfisSociais = contato.channels
    .filter((channel) => channel.type === "instagram" || channel.type === "linkedin")
    .map((channel) => channel.href);

  const graph = [
    {
      "@type": "Person",
      "@id": personId,
      name: meta.name,
      jobTitle: meta.role,
      description: meta.description,
      url: siteUrl,
      // O JPEG, e não o WebP que o site serve, pelo mesmo motivo documentado
      // no OpenGraph: o suporte a WebP entre raspadores é irregular.
      image: `${siteUrl}/telma/portraits/telma-hero-vignette.jpg`,
      email: `mailto:${contactEmail}`,
      telephone: `+${whatsappPhone}`,
      // Os perfis foram informados pela própria Telma e apontam para as contas
      // reais. `sameAs` é o que permite ao Google unir site e perfis numa
      // entidade só.
      sameAs: perfisSociais,
      knowsAbout: areasDeAtuacao.map((area) => area.label),
      // "atua profissionalmente na Educação desde 2001", em content/site-data.
      knowsLanguage: "pt-BR",
      areaServed: { "@type": "State", name: "Bahia", addressCountry: "BR" },
      makesOffer: areasDeAtuacao.map((area) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: area.label,
          description: area.title,
          serviceType: area.label,
          provider: { "@id": personId },
        },
      })),
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteUrl,
      name: `${meta.name} — ${meta.role}`,
      description: meta.description,
      inLanguage: "pt-BR",
      publisher: { "@id": personId },
      about: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#pagina-inicial`,
      url: siteUrl,
      name: `${meta.name} — ${meta.role}`,
      isPartOf: { "@id": websiteId },
      about: { "@id": personId },
      mainEntity: { "@id": personId },
      description: sobre.heading,
      inLanguage: "pt-BR",
    },
  ];

  return (
    <script
      type="application/ld+json"
      // Necessário: o React escaparia `"` e `&` como entidades HTML no texto do
      // elemento, e entidade não é decodificada dentro de <script> — o JSON
      // chegaria quebrado ao buscador. O conteúdo vem de site-data.ts, não do
      // visitante, e passa por toSafeJsonLd.
      dangerouslySetInnerHTML={{ __html: toSafeJsonLd({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
