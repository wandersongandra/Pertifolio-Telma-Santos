import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Com `output: "export"` as rotas de metadados precisam ser geradas
// estaticamente.
export const dynamic = "force-static";

// "main" é a branch de produção do Pages e recebe apenas commits de "master"
 // que já passaram pelo CI. "master" também é aceito aqui para builds locais/CI
 // que não recebem a variável CF_PAGES_BRANCH.
const PRODUCTION_BRANCHES = ["main", "master"];

// O Cloudflare Pages publica cada branch numa URL de preview própria, e esses
// previews servem o mesmo robots.txt. Sem esta proteção, cópias não lançadas
// do site ficam indexáveis e competem com a produção na busca.
// CF_PAGES_BRANCH é fornecida pelo Cloudflare Pages no build integrado ao Git,
// permitindo bloquear indexação automaticamente em deployments de preview.
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
