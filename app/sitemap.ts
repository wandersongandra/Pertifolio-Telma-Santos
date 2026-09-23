import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Com `output: "export"` as rotas de metadados precisam ser geradas
// estaticamente.
export const dynamic = "force-static";

// A data da home vem do momento do build, não de uma constante escrita à mão.
//
// A constante anterior estava congelada em 27/08/2026: o site mudou depois
// disso — endereço canônico, dados estruturados, correções de conteúdo — e o
// sitemap continuou anunciando a mesma data. Para o buscador isso significa
// "nada mudou aqui", e é justamente o sinal que faz ele adiar a nova visita.
//
// Como o Cloudflare Pages recompila o site após merge/push no branch de
// produção, a data do build acompanha uma publicação real. Não é uma data
// inventada apenas para parecer recente.
const HOME_LAST_MODIFIED = new Date();

// As páginas legais são a exceção: elas não mudam quando o restante do site
// muda. Anunciá-las como alteradas a cada deploy seria falso, e `lastmod` que
// não corresponde à realidade é ignorado pelo Google. Esta data se atualiza à
// mão, quando o texto jurídico for realmente revisado.
const LEGAL_LAST_MODIFIED = new Date("2026-08-27");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: HOME_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/privacidade`,
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/termos`,
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
