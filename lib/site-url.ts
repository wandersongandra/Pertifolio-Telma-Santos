// The production domain is not defined yet, so there is deliberately no
// hard-coded fallback here: shipping a sitemap, robots.txt, canonical URLs and
// OpenGraph images that point at a domain which does not resolve is worse than
// pointing them at the address the site is actually served from.
//
// Resolution order:
//   1. NEXT_PUBLIC_SITE_URL — set this once the real domain is live.
//   2. CF_PAGES_URL — injected by Cloudflare Pages into every build; on a
//      production deployment this is the project's .pages.dev address.
//   3. localhost — only reached by `next build` run outside Pages.
//
// Only build-time code imports this (app/layout.tsx, app/sitemap.ts,
// app/robots.ts), so a non-NEXT_PUBLIC variable is read correctly.
const resolved =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.CF_PAGES_URL ?? "http://localhost:3000";

export const siteUrl = resolved.replace(/\/$/, "");
