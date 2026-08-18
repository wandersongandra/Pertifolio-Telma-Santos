import type { PhotoId } from "@/content/site-data";

interface PhotoAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const photos: Record<PhotoId, PhotoAsset> = {
  "hero-vignette": {
    src: "/telma/portraits/telma-hero-vignette.png",
    width: 1024,
    height: 1536,
    alt: "Telma Santos, formadora educacional, em pé, vestindo terno preto.",
  },
  "arms-crossed": {
    src: "/telma/portraits/telma-arms-crossed.png",
    width: 1086,
    height: 1448,
    alt: "Telma Santos, formadora educacional, retrato com braços cruzados.",
  },
  "seated-laptop": {
    src: "/telma/portraits/telma-seated-laptop.png",
    width: 1086,
    height: 1448,
    alt: "Telma Santos, formadora educacional, sentada com notebook.",
  },
  "book-pen": {
    src: "/telma/portraits/telma-book-pen.png",
    width: 1086,
    height: 1448,
    alt: "Telma Santos, formadora educacional, segurando um livro e uma caneta.",
  },
  "blue-blazer-macbook": {
    src: "/telma/portraits/telma-blue-blazer-macbook.png",
    width: 1086,
    height: 1448,
    alt: "Telma Santos, formadora educacional, vestindo blazer azul, com notebook.",
  },
};

export const logo = {
  mark: {
    src: "/telma/logo/logo-mark.png",
    width: 819,
    height: 694,
    alt: "Monograma TS — Telma Santos, Formadora",
  },
  full: {
    src: "/telma/logo/logo-full.png",
    width: 1167,
    height: 672,
    alt: "Telma Santos — Formadora Educacional",
  },
};
