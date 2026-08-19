"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { PhotoId } from "@/content/site-data";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";

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
  /** Optional parallax overrides — some crops carry their own zoom and need a
   * gentler drift (or none at all) to keep the subject inside the frame. */
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
  // The source PNGs are cut mid-subject at the very bottom edge of the file
  // (laptop/arms reach y=100%). Showing the full frame puts that raw cut on
  // the container's edge. Zooming in anchors the top (face stays, headroom
  // preserved), pushes the cut out of frame, and with the bottom fade the
  // photo dissolves into the section background instead of ending in a hard
  // line. Drift is reduced to ±4% so the head never leaves the window.
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
  // Formação Continuada — the seated-laptop source has the same raw bottom
  // cut, but its subject is ~92% of the source width and its widest band
  // (the laptop, at ~58% height) reaches x=2.6%, so any zoom beyond ~1.06
  // clips the laptop's left edge. 1.06 pushes the bottom cut out of frame
  // (window bottom at 94.3% vs the cut at ~100%) while keeping the laptop
  // margin. Drift is ±3%: the worst-case window top (2.8%) stays below the
  // face top (4%) and the worst-case window bottom (97.2%) never reaches
  // the source cut. The wrapper scale stays 1 — no nested transforms.
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
  // Zoom must anchor from the TOP of the frame (origin-top), not the CSS
  // default center — a center-anchored scale zooms into whatever sits at the
  // vertical middle of the pre-scale crop window (the torso, for these
  // photos), pushing the face further out of frame instead of toward it.
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
 * A crop's zoom (CSS transform: scale) enlarges the rendered image beyond its
 * container, so the `sizes` hint given to next/image must be inflated by the
 * same factor — otherwise the browser fetches a source too small for the
 * zoomed-in display size and the result looks soft/blurred.
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

interface EditorialPhotoProps {
  photoId: PhotoId;
  variant?: Variant;
  crop?: Crop;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Subtle scroll-linked drift on the image, independent of the crop's own transform. */
  parallax?: boolean;
  /** Dissolve the base of the frame into the section background (soft edge
   * instead of a hard line where the photo ends). "bottom" mirrors the hero
   * treatment; "soft" starts the dissolve lower and more gradually. */
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    parallax ? [cropStyle.parallaxFrom ?? "-6%", cropStyle.parallaxTo ?? "6%"] : ["0%", "0%"]
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
        style={parallax ? { y, scale: cropStyle.parallaxScale ?? 1.15 } : undefined}
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
