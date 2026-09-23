import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const expectedRoutes = ["/", "/privacidade", "/termos"];
const expectedPublicFiles = [
  "_headers",
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
  ".well-known/security.txt",
];
const failures = [];

function exists(relativePath) {
  return fs.existsSync(path.join(outDir, relativePath));
}

function routeExists(route) {
  if (route === "/") return exists("index.html");
  const normalized = route.replace(/^\//, "");
  return exists(path.join(normalized, "index.html")) || exists(`${normalized}.html`);
}

function collectFiles(directory) {
  const files = [];
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(absolute));
    else files.push(absolute);
  }
  return files;
}

function getDirective(csp, name) {
  return csp
    .split(";")
    .map((part) => part.trim())
    .find((part) => part === name || part.startsWith(`${name} `));
}

if (!fs.existsSync(outDir) || !fs.statSync(outDir).isDirectory()) {
  failures.push("a pasta out/ não foi gerada");
} else {
  for (const route of expectedRoutes) {
    if (!routeExists(route)) failures.push(`rota ausente no export: ${route}`);
  }

  for (const file of expectedPublicFiles) {
    if (!exists(file)) failures.push(`arquivo público ausente no export: ${file}`);
  }

  if (!exists("404.html")) failures.push("404.html ausente no export");

  const files = collectFiles(outDir);
  const sourceMaps = files.filter((file) => file.toLowerCase().endsWith(".map"));
  if (sourceMaps.length) failures.push(`source maps encontrados no export: ${sourceMaps.length}`);

  const sensitiveFiles = files.filter((file) => {
    const relative = path.relative(outDir, file);
    return (
      /(^|[\\/])\.env(?:\.|$)/i.test(relative) ||
      /(^|[\\/])(?:\.npmrc|\.gitconfig|id_rsa|id_ed25519)$/i.test(relative) ||
      /\.(?:pem|key|p12|pfx|sql|dump|bak|log|sqlite|sqlite3|db|kdbx|jks|keystore)$/i.test(relative)
    );
  });
  if (sensitiveFiles.length) {
    failures.push(`arquivos potencialmente sensíveis encontrados no export: ${sensitiveFiles.length}`);
  }

  for (const file of files.filter((item) => item.toLowerCase().endsWith(".html"))) {
    const html = fs.readFileSync(file, "utf8");
    const relative = path.relative(outDir, file);

    if (/\bon[a-z]+\s*=/i.test(html)) failures.push(`handler HTML inline encontrado em ${relative}`);
    if (/\bjavascript\s*:/i.test(html)) failures.push(`URL javascript: encontrada em ${relative}`);
    if (/\b(?:src|href|action)\s*=\s*["']http:\/\//i.test(html)) {
      failures.push(`recurso HTTP inseguro encontrado em ${relative}`);
    }
  }

  const indexHtml = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
  if (!indexHtml.includes("https://gandra.tech")) failures.push("link da Gandra Tech ausente na home exportada");
  if (!indexHtml.includes("Wanderson Gandra")) failures.push("crédito Wanderson Gandra ausente na home exportada");

  const headers = fs.readFileSync(path.join(outDir, "_headers"), "utf8");
  const requiredHeaders = [
    "X-Content-Type-Options: nosniff",
    "X-Frame-Options: DENY",
    "Strict-Transport-Security:",
    "Referrer-Policy:",
    "Permissions-Policy:",
    "Cross-Origin-Opener-Policy: same-origin",
    "Cross-Origin-Resource-Policy: same-origin",
    "Cross-Origin-Embedder-Policy: require-corp",
    "Access-Control-Allow-Origin: https://www.telmaformadoraeducacional.com.br",
    "X-Permitted-Cross-Domain-Policies: none",
    "X-DNS-Prefetch-Control: off",
    "Origin-Agent-Cluster: ?1",
    "Content-Security-Policy:",
  ];

  for (const header of requiredHeaders) {
    if (!headers.includes(header)) failures.push(`header de segurança ausente em out/_headers: ${header}`);
  }

  if (headers.includes("Content-Security-Policy-Report-Only:")) {
    failures.push("CSP ainda está em modo Report-Only");
  }
  if (headers.includes("Access-Control-Allow-Origin: *")) {
    failures.push("CORS curinga não é permitido no export");
  }
  if (/^\s*X-XSS-Protection:/im.test(headers)) {
    failures.push("X-XSS-Protection legado não deve ser enviado");
  }

  const cspMatch = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/im);
  if (!cspMatch) {
    failures.push("CSP não encontrada para validação detalhada");
  } else {
    const csp = cspMatch[1];
    const scriptSrc = getDirective(csp, "script-src") || "";
    const imageSrc = getDirective(csp, "img-src") || "";

    if (scriptSrc.includes("'unsafe-inline'")) failures.push("script-src não pode conter 'unsafe-inline'");
    if (scriptSrc.includes("'unsafe-eval'")) failures.push("script-src não pode conter 'unsafe-eval'");
    if (!scriptSrc.includes("'sha256-")) failures.push("script-src deve conter hashes SHA-256");
    if (!csp.includes("script-src-attr 'none'")) failures.push("CSP deve bloquear handlers inline");
    if (imageSrc.includes("https:") || imageSrc.includes("*")) failures.push("img-src está permissivo demais");
    if (!csp.includes("base-uri 'none'")) failures.push("CSP deve usar base-uri 'none'");
    if (!csp.includes("form-action 'none'")) failures.push("CSP deve usar form-action 'none'");
    if (!csp.includes("object-src 'none'")) failures.push("CSP deve usar object-src 'none'");
    if (!csp.includes("frame-ancestors 'none'")) failures.push("CSP deve usar frame-ancestors 'none'");
    if (!csp.includes("worker-src 'none'")) failures.push("CSP deve bloquear workers não usados");
  }

  const securityTxt = fs.readFileSync(path.join(outDir, ".well-known/security.txt"), "utf8");
  for (const field of ["Contact:", "Expires:", "Canonical:", "Preferred-Languages:"]) {
    if (!securityTxt.includes(field)) failures.push(`security.txt sem campo esperado: ${field}`);
  }
}

if (failures.length) {
  console.error("Validação de segurança do export falhou:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validação de segurança do export passou: ${expectedRoutes.length} rotas, CSP por hash, headers fortes, security.txt e nenhum artefato sensível.`
  );
}
