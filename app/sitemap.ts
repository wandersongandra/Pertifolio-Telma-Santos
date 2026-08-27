import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Com `output: "export"` as rotas de metadados precisam ser geradas
// estaticamente.
export const dynamic = "force-static";

const LAST_MODIFIED = new Date("2026-08-27");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/privacidade`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/termos`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
