import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// `output: "export"` requires metadata routes to be statically generated.
export const dynamic = "force-static";

// The Cloudflare Pages project is configured with "main" as its production
// branch, while this repository uses "master". Both are accepted so the guard
// below cannot mistake a production build for a preview.
const PRODUCTION_BRANCHES = ["main", "master"];

// Cloudflare Pages publishes every branch on its own preview URL. Those
// previews serve the same robots.txt, so without this guard unreleased copies
// of the site are crawlable and compete with production in search results.
// CF_PAGES_BRANCH only exists when Cloudflare itself runs the build; today the
// site is built locally and uploaded, so it is absent and the production rules
// apply. The guard is here for the day the project is connected to git.
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
