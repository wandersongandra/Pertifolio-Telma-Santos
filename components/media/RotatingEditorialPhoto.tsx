"use client";

import type { PhotoId } from "@/content/site-data";
import { EditorialPhoto, type EditorialPhotoProps } from "@/components/media/EditorialPhoto";
import { useRotatingPhoto } from "@/lib/useRotatingPhoto";
import { cn } from "@/lib/utils";

export interface PortraitSlide {
  photoId: PhotoId;
  /** Cada foto tem seu proprio enquadramento seguro — o zoom que tira o corte
   * bruto da base de um retrato em pe corta o notebook de outro. */
  crop: NonNullable<EditorialPhotoProps["crop"]>;
}

interface Props extends Omit<EditorialPhotoProps, "photoId" | "crop"> {
  slides: PortraitSlide[];
  /** Tempo de cada foto em tela, em ms. */
  intervalMs?: number;
}

/**
 * Empilha os retratos no mesmo quadro e faz a troca em fade lento.
 *
 * O empilhamento e uma grid de uma celula so (`[grid-area:1/1]`): cada
 * `EditorialPhoto` traz sua propria proporcao, entao a grid ja nasce com a
 * altura certa e nao ha `position: absolute` para o layout ter que adivinhar.
 */
export function RotatingEditorialPhoto({
  slides,
  intervalMs = 7000,
  className,
  priority = false,
  ...photoProps
}: Props) {
  const { containerRef, index, mounted } = useRotatingPhoto(slides.length, intervalMs);

  return (
    <div ref={containerRef} className={cn("grid", className)}>
      {slides.map((slide, position) => {
        const isActive = position === index;
        // A foto so entra no DOM quando `mounted` a libera; ver o hook.
        if (position >= mounted) return null;
        return (
          <div
            key={slide.photoId}
            // As escondidas saem da arvore de acessibilidade: sem isso o leitor
            // de tela anunciaria os cinco textos alternativos em sequencia.
            aria-hidden={!isActive}
            className={cn(
              "[grid-area:1/1] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              isActive ? "opacity-100" : "opacity-0"
            )}
          >
            <EditorialPhoto
              {...photoProps}
              photoId={slide.photoId}
              crop={slide.crop}
              priority={priority && position === 0}
            />
          </div>
        );
      })}
    </div>
  );
}
