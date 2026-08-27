import type { MetadataRoute } from "next";
import { siteData } from "@/content/site-data";

// Com `output: "export"` as rotas de metadados precisam ser geradas
// estaticamente.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteData.meta.name} — ${siteData.meta.role}`,
    short_name: siteData.meta.name,
    description: siteData.meta.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    lang: "pt-BR",
    icons: [
      {
        src: "/telma/logo/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/telma/logo/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
