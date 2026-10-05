import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoots = ["app", "components", "content", "lib"];
const extensions = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs"]);
const failures = [];

function visit(current) {
  if (!fs.existsSync(current)) return;
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const absolute = path.join(current, entry.name);
    const relative = path.relative(root, absolute);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", "out", ".git"].includes(entry.name)) continue;
      visit(absolute);
      continue;
    }
    if (!extensions.has(path.extname(entry.name).toLowerCase())) continue;
    const source = fs.readFileSync(absolute, "utf8");
    const rules = [
      ["console.log", /\bconsole\.log\s*\(/],
      ["debugger", /\bdebugger\s*;?/],
      ["@ts-ignore", /@ts-ignore/],
      ["eval", /\beval\s*\(/],
      ["new Function", /\bnew\s+Function\s*\(/],
      ["document.write", /\bdocument\.write\s*\(/],
      ["javascript URL", /javascript\s*:/i],
    ];
    for (const [label, pattern] of rules) {
      if (pattern.test(source)) failures.push(`${relative}: padrão proibido ${label}`);
    }
    if (source.includes("dangerouslySetInnerHTML") && relative !== path.join("components", "seo", "StructuredData.tsx")) {
      failures.push(`${relative}: dangerouslySetInnerHTML fora do emissor JSON-LD auditado`);
    }
    if (/target\s*=\s*["\']_blank["\']/i.test(source) && !/rel\s*=\s*["\'][^"\']*noopener[^"\']*noreferrer[^"\']*["\']/i.test(source)) {
      failures.push(`${relative}: target=_blank sem noopener noreferrer`);
    }
  }
}

for (const sourceRoot of sourceRoots) visit(path.join(root, sourceRoot));

const structuredDataPath = path.join(root, "components", "seo", "StructuredData.tsx");
if (fs.existsSync(structuredDataPath)) {
  const source = fs.readFileSync(structuredDataPath, "utf8");
  if (!source.includes("toSafeJsonLd") || !source.includes("dangerouslySetInnerHTML")) {
    failures.push("components/seo/StructuredData.tsx: emissor JSON-LD perdeu sanitização esperada");
  }
  if (!source.includes("replace(/</g")) {
    failures.push("components/seo/StructuredData.tsx: escape de < ausente na serialização JSON-LD");
  }
}

if (failures.length) {
  console.error("Lint estrutural falhou:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Lint estrutural passou: sem debug, sinks inseguros ou links externos frágeis.");
