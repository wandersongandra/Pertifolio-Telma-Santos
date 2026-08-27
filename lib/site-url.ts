// URL pública do site, usada em metadataBase, URLs canônicas, sitemap.xml,
// robots.txt e nas imagens de OpenGraph.
//
// O site é publicado por upload direto (`npm run deploy`), ou seja, o build
// roda nesta máquina e não dentro do Cloudflare — então CF_PAGES_URL não existe
// no momento do build. Por isso o último recurso é o endereço real de produção,
// e não localhost: um sitemap apontando para localhost seria publicado.
//
// Ordem de resolução:
//   1. NEXT_PUBLIC_SITE_URL — defina quando houver domínio próprio.
//   2. CF_PAGES_URL — só existe se o build passar a rodar no Cloudflare
//      (caso o projeto seja conectado ao git no futuro).
//   3. PRODUCTION_URL — o endereço atual do projeto no Pages.
const PRODUCTION_URL = "https://telma-santos.pages.dev";

const resolved =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.CF_PAGES_URL ?? PRODUCTION_URL;

export const siteUrl = resolved.replace(/\/$/, "");
