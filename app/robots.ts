import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// `output: "export"` requires metadata routes to be statically generated.
export const dynamic = "force-static";

/** Branch whose Cloudflare Pages build is the live site. */
const PRODUCTION_BRANCH = "master";

// Cloudflare Pages builds and publishes *every* branch, each on its own
// preview URL. Those previews serve the same robots.txt, so without this guard
// unreleased copies of the site are crawlable and compete with production in
// search results. CF_PAGES_BRANCH is absent outside Pages (local builds), and
// those are never published, so they keep the production rules.
const branch = process.env.CF_PAGES_BRANCH;
const isPreviewDeployment = Boolean(branch) && branch !== PRODUCTION_BRANCH;

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
