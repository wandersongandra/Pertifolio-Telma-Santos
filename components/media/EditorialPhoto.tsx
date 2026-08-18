"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { PhotoId } from "@/content/site-data";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";

type Variant = "natural" | "grayscale";
type Crop = "wide-context" | "portrait-full" | "bust" | "headshot-tight";

const CROP_STYLES: Record<
  Crop,
  { aspect: string; position: string; scale: string; origin: string; scaleFactor: number }
> = {
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
}

export function EditorialPhoto({
  photoId,
  variant = "natural",
  crop = "portrait-full",
  sizes,
  priority = false,
  className,
  parallax = false,
}: EditorialPhotoProps) {
  const photo = photos[photoId];
  const cropStyle = CROP_STYLES[crop];
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], parallax ? ["-6%", "6%"] : ["0%", "0%"]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", cropStyle.aspect, className)}
    >
      <motion.div
        className={parallax ? "absolute -inset-y-[8%] inset-x-0" : "absolute inset-0"}
        style={parallax ? { y } : undefined}
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
