// URL pública do site, usada em metadataBase, URLs canônicas, sitemap.xml,
// robots.txt e nas imagens de OpenGraph.
//
// O site é publicado pelo Cloudflare Pages via integração com o GitHub:
// merge/push no branch `master` dispara o build e o deploy de produção.
// Em builds executados pelo Pages, CF_PAGES_URL/CF_PAGES_BRANCH ficam
// disponíveis. O domínio próprio continua como fallback seguro para builds
// locais e CI, evitando metadata apontando para localhost.
//
// Ordem de resolução:
//   1. NEXT_PUBLIC_SITE_URL — sobrescreve tudo; use para builds de teste.
//   2. CF_PAGES_URL — fornecida pelo Cloudflare Pages no build integrado ao Git.
//   3. PRODUCTION_URL — o domínio próprio, com `www`.
//
// Por que `www` e não o apex: hoje só `www.telmaformadoraeducacional.com.br`
// está registrado como domínio personalizado do projeto Pages e responde 200.
// O apex (`telmaformadoraeducacional.com.br`) está sem registro DNS. Declarar
// como canônico um endereço que não resolve manda o Google indexar uma página
// morta, então o canônico acompanha o que de fato responde.
//
// Quando o apex voltar, o certo é inverter: apex como canônico e `www` com
// redirect 301 para ele. Basta trocar a constante abaixo e republicar.
const PRODUCTION_URL = "https://www.telmaformadoraeducacional.com.br";

const resolved =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.CF_PAGES_URL ?? PRODUCTION_URL;

export const siteUrl = resolved.replace(/\/$/, "");
