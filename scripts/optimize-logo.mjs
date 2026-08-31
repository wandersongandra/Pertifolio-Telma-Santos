// Gera o monograma servido ao visitante e os ícones do manifesto, a partir do
// PNG de origem em assets/logo/.
//
//     node scripts/optimize-logo.mjs
//
// Roda sob demanda, não durante o build — mesma regra de
// scripts/optimize-portraits.mjs. As saídas são versionadas em
// public/telma/logo/. Execute de novo só quando a marca mudar.
//
// Por que existe: `next.config.ts` usa `output: "export"` com
// `images.unoptimized`, então não há otimização em tempo de execução. O arquivo
// em public/ é exatamente o que o navegador baixa. O PNG de origem tem 819x694
// e 323KB; o cabeçalho desenha a marca com 40px de largura e o preloader com
// 64px. Servir o original custava 323KB, com `priority`, para pintar 40px — e
// esses bytes disputavam banda com o retrato do hero, que é o LCP da página e
// pesa 95KB.
//
// Por que 128px: cobre 40px num aparelho de DPR 3,2 e 64px em DPR 2. O
// preloader é `display: none` em ponteiro grosso (ver globals.css), então os
// DPR altos só precisam dar conta dos 40px do cabeçalho.
//
// `sharp` vem junto do Next e não está no package.json — se um dia sumir do
// node_modules, instale com `npm i -D sharp` antes de executar.

import sharp from "sharp";
import path from "node:path";
import { statSync, writeFileSync } from "node:fs";

sharp.cache(false);
sharp.concurrency(1);

const root = process.cwd();
const source = path.join(root, "assets/logo/logo-mark.png");
const outDir = path.join(root, "public/telma/logo");

const MARK_WIDTH = 128;

const kb = (bytes) => `${(bytes / 1024).toFixed(1)}KB`;

const markBuffer = await sharp(source)
  .resize({ width: MARK_WIDTH })
  .webp({ quality: 90, effort: 6, alphaQuality: 100 })
  .toBuffer();

const markPath = path.join(outDir, "logo-mark.webp");
writeFileSync(markPath, markBuffer);

const meta = await sharp(markBuffer).metadata();
console.log(
  `logo-mark.webp  ${meta.width}x${meta.height}  ${kb(statSync(source).size)} -> ${kb(markBuffer.length)}`
);
console.log(
  `  atualize width/height em lib/photos.ts se a proporção da marca mudar`
);

// Ícones do manifesto (PWA). A marca entra centralizada sobre o fundo do site,
// com 72% do lado — os ícones adaptativos do Android recortam as bordas, e essa
// folga é o que impede o monograma de ser cortado.
async function makeIcon(size) {
  const padded = Math.round(size * 0.72);
  const mark = await sharp(source).resize(padded, padded, { fit: "inside" }).toBuffer();
  const out = path.join(outDir, `icon-${size}.png`);
  await sharp({
    create: { width: size, height: size, channels: 4, background: "#050505" },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(out);
  console.log(`icon-${size}.png  ${kb(statSync(out).size)}`);
}

await makeIcon(192);
await makeIcon(512);
