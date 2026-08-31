"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { PhotoId } from "@/content/site-data";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Variant = "natural" | "grayscale";
type Crop =
  | "wide-context"
  | "portrait-full"
  | "bust"
  | "headshot-tight"
  | "portrait-editorial"
  | "portrait-continuada";

interface CropStyle {
  aspect: string;
  position: string;
  scale: string;
  origin: string;
  scaleFactor: number;
  /** Ajustes opcionais de parallax. Alguns enquadramentos já têm o seu próprio
   * zoom e precisam de uma deriva mais contida (ou nenhuma) para não empurrar
   * a pessoa para fora do quadro. */
  parallaxFrom?: string;
  parallaxTo?: string;
  parallaxScale?: number;
}

const CROP_STYLES: Record<Crop, CropStyle> = {
  "wide-context": {
    aspect: "aspect-[3/4]",
    position: "object-[50%_18%]",
    scale: "",
    origin: "",
    scaleFactor: 1,
  },
  "portrait-full": {
    aspect: "aspect-[3/4]",
    position: "object-[50%_8%]",
    scale: "",
    origin: "",
    scaleFactor: 1,
  },
  // Os originais terminam cortando a pessoa rente à borda de baixo do arquivo
  // (notebook e braços chegam a y=100%). Mostrar o quadro inteiro joga esse
  // corte cru bem na borda do container. O zoom ancora o topo (o rosto fica,
  // o respiro acima é preservado), empurra o corte para fora do quadro, e com
  // o esmaecimento da base a foto se dissolve no fundo da seção em vez de
  // terminar numa linha dura. A deriva cai para ±4% para a cabeça nunca sair
  // da janela.
  "portrait-editorial": {
    aspect: "aspect-[3/4]",
    position: "object-[50%_0%]",
    scale: "scale-[1.25]",
    origin: "origin-top",
    scaleFactor: 1.25,
    parallaxFrom: "-4%",
    parallaxTo: "4%",
    parallaxScale: 1,
  },
  // A foto sentada tem o mesmo corte cru na base, mas a pessoa ocupa ~92% da
  // largura do original e a faixa mais larga (o notebook, na altura de ~58%)
  // chega a x=2,6% — qualquer zoom acima de ~1,06 corta a borda esquerda do
  // notebook. 1,06 empurra o corte da base para fora do quadro (base da janela
  // em 94,3% contra o corte em ~100%) sem perder a margem do notebook. A
  // deriva é de ±3%: no pior caso o topo da janela (2,8%) fica acima do topo
  // do rosto (4%) e a base (97,2%) nunca alcança o corte do original. A escala
  // do wrapper continua 1, para não aninhar transforms.
  "portrait-continuada": {
    aspect: "aspect-[3/4]",
    position: "object-[50%_0%]",
    scale: "scale-[1.06]",
    origin: "origin-top",
    scaleFactor: 1.06,
    parallaxFrom: "-3%",
    parallaxTo: "3%",
    parallaxScale: 1,
  },
  // O zoom tem que ancorar no TOPO do quadro (origin-top), não no centro que
  // é o padrão do CSS: ancorado no centro, a escala aproxima o que estiver no
  // meio vertical da janela antes do zoom — nestas fotos, o tronco — e empurra
  // o rosto para fora do quadro em vez de trazê-lo para perto.
  bust: {
    aspect: "aspect-[4/5]",
    position: "object-[50%_0%]",
    scale: "scale-[1.8]",
    origin: "origin-top",
    scaleFactor: 1.8,
  },
  "headshot-tight": {
    aspect: "aspect-square",
    position: "object-[50%_0%]",
    scale: "scale-[2.6]",
    origin: "origin-top",
    scaleFactor: 2.6,
  },
};

/**
 * O zoom de um enquadramento (transform: scale) desenha a imagem maior que o
 * container, então a dica de `sizes` passada ao next/image precisa crescer no
 * mesmo fator. Sem isso o navegador baixa um arquivo menor do que o tamanho em
 * que a imagem vai aparecer, e o resultado sai borrado.
 */
function inflateSizes(sizes: string, factor: number): string {
  if (factor === 1) return sizes;
  return sizes
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      const match = trimmed.match(/^(\(.*\))\s+(.+)$/);
      if (match) return `${match[1]} calc(${match[2]} * ${factor})`;
      return `calc(${trimmed} * ${factor})`;
    })
    .join(", ");
}

const VARIANT_CLASS: Record<Variant, string> = {
  natural: "",
  grayscale: "grayscale",
};

export interface EditorialPhotoProps {
  photoId: PhotoId;
  variant?: Variant;
  crop?: Crop;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Deriva sutil da imagem conforme a rolagem, independente do transform do
   * próprio enquadramento. */
  parallax?: boolean;
  /** Dissolve a base do quadro no fundo da seção, para a foto não terminar
   * numa linha dura. "bottom" repete o tratamento do hero; "soft" começa a
   * dissolver mais embaixo e de forma mais gradual. */
  fade?: "bottom" | "soft";
}

const FADE_CLASS: Record<NonNullable<EditorialPhotoProps["fade"]>, string> = {
  bottom: "photo-fade-bottom",
  soft: "photo-fade-soft",
};

export function EditorialPhoto({
  photoId,
  variant = "natural",
  crop = "portrait-full",
  sizes,
  priority = false,
  className,
  parallax = false,
  fade,
}: EditorialPhotoProps) {
  const photo = photos[photoId];
  const cropStyle = CROP_STYLES[crop];
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // A deriva é movimento amarrado à rolagem: a foto se desloca sozinha
  // enquanto a pessoa lê, sem que ela tenha pedido. É o caso central de
  // `prefers-reduced-motion`, e o bloco global em globals.css não alcança este
  // efeito — quem escreve o `transform` aqui é a Motion, por script, não uma
  // transição CSS. Com a preferência ligada a foto fica parada; o
  // enquadramento e o zoom continuam iguais, só a deriva some.
  const parallaxOn = parallax && !reducedMotion;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxOn ? [cropStyle.parallaxFrom ?? "-6%", cropStyle.parallaxTo ?? "6%"] : ["0%", "0%"]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        cropStyle.aspect,
        fade && FADE_CLASS[fade],
        className
      )}
    >
      <motion.div
        className="absolute inset-0"
        style={parallaxOn ? { y, scale: cropStyle.parallaxScale ?? 1.15 } : undefined}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          sizes={inflateSizes(sizes, cropStyle.scaleFactor)}
          className={cn(
            "object-cover",
            cropStyle.position,
            cropStyle.scale,
            cropStyle.origin,
            VARIANT_CLASS[variant]
          )}
        />
      </motion.div>
    </div>
  );
}
