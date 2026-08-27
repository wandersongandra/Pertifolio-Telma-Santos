// TODO: set NEXT_PUBLIC_SITE_URL in the Cloudflare Pages build environment to
// the real production domain. Until then, metadataBase, canonical URLs,
// sitemap.xml, robots.txt and JSON-LD all fall back to this placeholder.
const FALLBACK_SITE_URL = "https://telmasantos.com.br";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/$/, "");
