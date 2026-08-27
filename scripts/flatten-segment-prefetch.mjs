// O pré-carregamento do App Router (cache de segmentos) pede os payloads com os segmentos
// unidos por ponto, por exemplo `/privacidade/__next.privacidade.__PAGE__.txt`.
// O `output: "export"` do Next 16.3 grava esses arquivos em pastas
// (`/privacidade/__next.privacidade/__PAGE__.txt`), o que devolve 404 em um
// host estático como o Cloudflare Pages. Este passo cria a versão com nome
// achatado que o cliente realmente busca, mantendo a original intacta.
import { readdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, relative, sep } from "node:path";

const outDir = fileURLToPath(new URL("../out/", import.meta.url));

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) {
      await flatten(dir, path);
    } else {
      await walk(path);
    }
  }
}

async function flatten(parent, segmentDir) {
  const files = await readdir(segmentDir, { recursive: true, withFileTypes: true });
  for (const file of files) {
    if (!file.isFile()) continue;
    const source = join(file.parentPath, file.name);
    const suffix = relative(segmentDir, source).split(sep).join(".");
    const target = join(parent, `${relative(parent, segmentDir)}.${suffix}`);
    await copyFile(source, target);
    console.log(`flatten: ${relative(outDir, source)} -> ${relative(outDir, target)}`);
  }
}

await walk(outDir);
