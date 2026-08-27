import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// `output: "export"` requires metadata routes to be statically generated.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
