// Converte os retratos de origem (PNG) para WebP e gera o JPEG usado como
// imagem de compartilhamento (Open Graph).
//
//     node scripts/optimize-portraits.mjs
//
// Roda sob demanda, não durante o build: as saídas são versionadas em
// public/telma/portraits/. Execute novamente somente quando entrar uma foto nova.
//
// Por que WebP: `next.config.ts` usa `output: "export"` com
// `images.unoptimized`, então não existe otimização de imagem em tempo de
// execução: o arquivo em public/ é exatamente o que o visitante baixa. Os PNGs
// de origem têm cerca de 1,2 MB cada; com os retratos em rotação, esse volume
// seria multiplicado pela quantidade de fotos do ciclo.
//
// Por que o JPEG: o Open Graph aponta para uma única imagem, e o suporte a WebP
// em leitores de prévias de links, especialmente no LinkedIn, é irregular.
// JPEG é um formato universal.
//
// `sharp` vem junto do Next e não está no package.json — se um dia sumir do
// node_modules, instale com `npm i -D sharp` antes de executar o script.
import sharp from "sharp";
import { readdir, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

// Os PNGs originais ficam em assets/, fora de public/: `output: "export"`
// copia public/ inteiro para out/, mas os arquivos originais somam cerca de
// 6,5 MB que ninguém baixa. Eles permanecem versionados para permitir a
// regeneração dos WebP quando o tratamento mudar.
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
