// Converte os retratos de origem (PNG) para WebP e gera o JPEG usado como
// imagem de compartilhamento (Open Graph).
//
//     node scripts/optimize-portraits.mjs
//
// Roda sob demanda, NAO no build: as saidas sao versionadas em
// public/telma/portraits/. Rode de novo so quando entrar uma foto nova.
//
// Por que WebP: `next.config.ts` usa `output: "export"` com
// `images.unoptimized`, entao nao existe otimizacao de imagem em runtime — o
// arquivo em public/ e exatamente o que o visitante baixa. Os PNGs de origem
// tem ~1,2MB cada; com os retratos girando em rotacao isso seria multiplicado
// por quantas fotos estao no ciclo.
//
// Por que o JPEG: o Open Graph aponta para uma imagem so, e o suporte a WebP
// em raspadores de link (LinkedIn em especial) e irregular. JPEG e universal.
//
// `sharp` vem junto do Next e nao esta no package.json — se um dia sumir do
// node_modules, instale com `npm i -D sharp` antes de rodar.
import sharp from "sharp";
import { readdir, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

// Os PNGs originais ficam em assets/, fora de public/: `output: "export"`
// copia public/ inteiro para out/, e os masters somam ~6,5MB que ninguem
// baixa. Ficam versionados aqui para dar pra regerar os WebP quando o
// tratamento mudar.
const SOURCE = fileURLToPath(new URL("../assets/portraits/", import.meta.url));
const DEST = fileURLToPath(new URL("../public/telma/portraits/", import.meta.url));
const OG_SOURCE = "telma-hero-vignette.png";

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

const files = (await readdir(SOURCE)).filter((f) => f.endsWith(".png"));
if (files.length === 0) {
  console.log("Nenhum PNG em assets/portraits — nada a fazer.");
}

for (const file of files) {
  const source = join(SOURCE, file);
  const dest = join(DEST, file);
  const before = (await stat(source)).size;

  const webp = await sharp(source, { limitInputPixels: false })
    .webp({ quality: 86, effort: 6, smartSubsample: true })
    .toBuffer();
  await writeFile(dest.replace(/\.png$/, ".webp"), webp);
  console.log(`${file} -> .webp  ${kb(before)} -> ${kb(webp.length)}`);

  if (file === OG_SOURCE) {
    const jpeg = await sharp(source, { limitInputPixels: false })
      .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toBuffer();
    await writeFile(dest.replace(/\.png$/, ".jpg"), jpeg);
    console.log(`${file} -> .jpg   ${kb(before)} -> ${kb(jpeg.length)}  (Open Graph)`);
  }
}
