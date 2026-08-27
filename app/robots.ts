import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Com `output: "export"` as rotas de metadados precisam ser geradas
// estaticamente.
export const dynamic = "force-static";

// O projeto no Cloudflare Pages tem "main" como branch de produção, enquanto
// este repositório usa "master". As duas são aceitas para que a proteção
// abaixo não confunda um build de produção com um preview.
const PRODUCTION_BRANCHES = ["main", "master"];

// O Cloudflare Pages publica cada branch numa URL de preview própria, e esses
// previews servem o mesmo robots.txt. Sem esta proteção, cópias não lançadas
// do site ficam indexáveis e competem com a produção na busca.
// CF_PAGES_BRANCH só existe quando o build roda dentro do Cloudflare; hoje o
// site é buildado nesta máquina e enviado por upload, então a variável não
// existe e valem as regras de produção. A proteção está aqui para o dia em que
// o projeto for conectado ao git.
const branch = process.env.CF_PAGES_BRANCH;
const isPreviewDeployment = branch !== undefined && !PRODUCTION_BRANCHES.includes(branch);

export default function robots(): MetadataRoute.Robots {
  if (isPreviewDeployment) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
