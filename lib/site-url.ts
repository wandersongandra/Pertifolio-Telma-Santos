// URL pública canônica do site, usada em metadataBase, URLs canônicas,
// sitemap.xml, robots.txt, Open Graph e dados estruturados.
//
// IMPORTANTE: a URL de deployment do Cloudflare Pages (CF_PAGES_URL) não deve
// ser usada como canônica. Em produção, cada build recebe uma URL imutável como
// `https://<hash>.telma-santos.pages.dev`; se ela entra no metadataBase,
// sitemap e JSON-LD, o domínio próprio passa a apontar para a URL técnica do
// Pages e o Google canonicaliza as páginas para o preview/deployment.
//
// Previews já são bloqueados em app/robots.ts. Portanto, mesmo nos builds de
// branch/preview, manter o domínio público como referência canônica é a opção
// mais segura e evita competir com a produção.
//
// NEXT_PUBLIC_SITE_URL continua disponível apenas como override explícito para
// testes controlados. Na ausência dele, sempre usamos o domínio público real.
const PRODUCTION_URL = "https://www.telmaformadoraeducacional.com.br";

const resolved = process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_URL;

export const siteUrl = resolved.replace(/\/$/, "");
