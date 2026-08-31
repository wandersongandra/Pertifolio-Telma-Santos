import type { PhotoId } from "@/content/site-data";

// Os arquivos servidos são WebP, gerados a partir dos PNGs de assets/portraits
// por `node scripts/optimize-portraits.mjs`. Não troque de volta para .png
// aqui: o export estático não otimiza imagem, então o que está em public/ é
// exatamente o que o visitante baixa, e os PNGs são cerca de 12x maiores.

interface PhotoAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const photos: Record<PhotoId, PhotoAsset> = {
  "hero-vignette": {
    src: "/telma/portraits/telma-hero-vignette.webp",
    width: 1024,
    height: 1536,
    alt: "Telma Santos, formadora educacional, em pé, vestindo terno preto.",
  },
  "arms-crossed": {
    src: "/telma/portraits/telma-arms-crossed.webp",
    width: 1086,
    height: 1448,
    alt: "Telma Santos, formadora educacional, retrato com braços cruzados.",
  },
  "seated-laptop": {
    src: "/telma/portraits/telma-seated-laptop.webp",
    width: 1086,
    height: 1448,
    alt: "Telma Santos, formadora educacional, sentada com notebook.",
  },
  "book-pen": {
    src: "/telma/portraits/telma-book-pen.webp",
    width: 1086,
    height: 1448,
    alt: "Telma Santos, formadora educacional, segurando um livro e uma caneta.",
  },
  "blue-blazer-macbook": {
    src: "/telma/portraits/telma-blue-blazer-macbook.webp",
    width: 1086,
    height: 1448,
    alt: "Telma Santos, formadora educacional, vestindo blazer azul, com notebook.",
  },
};

/*
  O monograma aparece em dois tamanhos: 40px no cabeçalho e 64px no preloader.

  O arquivo era o PNG de origem, 819x694 e 323KB, servido inteiro — o export
  estático não redimensiona nada, então o visitante baixava 323KB para desenhar
  40px, com `priority`, disputando banda com o retrato do hero, que pesa 95KB e
  é o elemento de LCP. O WebP de 128px cobre 40px em DPR 3,2 e 64px em DPR 2
  (o preloader não existe em toque, onde os DPR altos moram) e custa 7,2KB.

  Para regerar depois de mexer na marca: `node scripts/optimize-logo.mjs`.
*/
export const logo = {
  mark: {
    src: "/telma/logo/logo-mark.webp",
    width: 128,
    height: 108,
    alt: "Monograma TS — Telma Santos, Formadora",
  },
};
