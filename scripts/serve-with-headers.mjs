// Serve out/ aplicando exatamente os headers de public/_headers.
//
// Esses headers são aplicados pelo Cloudflare Pages e por mais nada — `next
// dev` e `next start` ignoram o arquivo. Sem este script a
// Content-Security-Policy só é exercitada quando já está em produção, onde um
// erro aparece como página em branco.
//
//     npm run build && npm run preview:headers
//
// Depois abra http://localhost:4321 e olhe o console do navegador: uma
// política correta não produz nenhum erro "Refused to ...", e a página
// hidrata (as abas de Áreas de Atuação respondem ao clique).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.argv[2] ?? process.cwd();
const HEADERS_FILE = path.join(ROOT, "public", "_headers");
const OUT = path.join(ROOT, "out");
const PORT = 4321;
const OUT_ROOT = path.resolve(OUT);

// public/_headers é uma lista de padrões de caminho, cada um seguido de linhas
// indentadas no formato "Header: valor". O Cloudflare aplica toda regra cujo
// padrão casa com o caminho da requisição, então um arquivo em /telma/ recebe
// tanto as regras globais de /* quanto o seu próprio Cache-Control. Ler apenas
// o /* testaria menos do que o que vai para produção, sem avisar.
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

// Casamento de padrão no estilo glob do _headers do Cloudflare, feito sem
// regex para nunca precisar escapar a pontuação do próprio padrão.
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
    const relative = path.relative(OUT_ROOT, path.resolve(candidate));
    const outsideRoot =
      relative === ".." ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative);
    if (outsideRoot) continue;
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
  return null;
}

createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    res.writeHead(405);
    return res.end("method not allowed");
  }

  let pathname;
  try {
    pathname = decodeURIComponent((req.url ?? "/").split("?")[0]);
  } catch {
    res.writeHead(400);
    return res.end("bad request");
  }
  for (const [key, value] of Object.entries(headersFor(pathname))) res.setHeader(key, value);

  const file = await resolveFile(pathname);
  if (!file) {
    // O Cloudflare Pages serve 404.html para rotas que não casam.
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
  res.end(req.method === "HEAD" ? undefined : body);
}).listen(PORT, () => {
  console.log("Regras lidas de public/_headers:");
  for (const rule of rules) {
    console.log(`  ${rule.pattern} -> ${Object.keys(rule.headers).join(", ")}`);
  }
  console.log(`\nREADY http://localhost:${PORT}`);
});
