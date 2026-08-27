// Serves out/ with the exact headers from public/_headers.
//
// The headers in public/_headers are applied by Cloudflare Pages and by nothing
// else — `next dev` and `next start` ignore the file entirely. Without this
// script the Content-Security-Policy is never exercised until it is already in
// production, where a mistake shows up as a blank page.
//
//     npm run build && npm run preview:headers
//
// Then load http://localhost:4321 and check the browser console: a working
// policy produces no "Refused to ..." errors, and the page hydrates (the
// Areas de Atuacao tabs respond to clicks).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.argv[2] ?? process.cwd();
const HEADERS_FILE = path.join(ROOT, "public", "_headers");
const OUT = path.join(ROOT, "out");
const PORT = 4321;

// public/_headers is a list of path patterns, each followed by indented
// "Header: value" lines. Cloudflare applies every rule whose pattern matches
// the request path, so a file under /telma/ gets both the global /* rules and
// its own Cache-Control. Parsing only /* would silently under-test the config.
const raw = await readFile(HEADERS_FILE, "utf8");
const rules = [];
let current = null;
for (const line of raw.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  if (!/^\s/.test(line)) {
    current = { pattern: trimmed, headers: {} };
    rules.push(current);
    continue;
  }
  if (!current) continue;
  const i = trimmed.indexOf(":");
  if (i === -1) continue;
  current.headers[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
}

// Glob match for a Cloudflare _headers pattern, done without a regex so the
// pattern's own punctuation never needs escaping.
function matches(pattern, pathname) {
  const parts = pattern.split("*");
  if (parts.length === 1) return pattern === pathname;
  if (!pathname.startsWith(parts[0])) return false;
  let cursor = parts[0].length;
  for (let i = 1; i < parts.length - 1; i++) {
    const found = pathname.indexOf(parts[i], cursor);
    if (found === -1) return false;
    cursor = found + parts[i].length;
  }
  const tail = parts[parts.length - 1];
  return pathname.length - cursor >= tail.length && pathname.endsWith(tail);
}

function headersFor(pathname) {
  const out = {};
  for (const rule of rules) {
    if (matches(rule.pattern, pathname)) Object.assign(out, rule.headers);
  }
  return out;
}

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain",
  ".webmanifest": "application/manifest+json", ".json": "application/json",
};

async function resolveFile(pathname) {
  for (const candidate of [
    path.join(OUT, pathname),
    path.join(OUT, pathname, "index.html"),
    path.join(OUT, pathname + ".html"),
  ]) {
    if (!path.resolve(candidate).startsWith(path.resolve(OUT))) continue;
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  const pathname = decodeURIComponent(req.url.split("?")[0]);
  for (const [key, value] of Object.entries(headersFor(pathname))) res.setHeader(key, value);

  const file = await resolveFile(pathname);
  if (!file) {
    // Cloudflare Pages serves 404.html for unmatched routes.
    try {
      const body = await readFile(path.join(OUT, "404.html"));
      res.writeHead(404, { "Content-Type": TYPES[".html"] });
      return res.end(body);
    } catch {
      res.writeHead(404);
      return res.end("not found");
    }
  }

  const body = await readFile(file);
  res.writeHead(200, {
    "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream",
  });
  res.end(body);
}).listen(PORT, () => {
  console.log("Regras lidas de public/_headers:");
  for (const rule of rules) {
    console.log(`  ${rule.pattern} -> ${Object.keys(rule.headers).join(", ")}`);
  }
  console.log(`\nREADY http://localhost:${PORT}`);
});
