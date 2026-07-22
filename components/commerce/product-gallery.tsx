"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import type { ShopifyImage } from "@/lib/shopify/types";
import { getImageRadiusClass } from "@/lib/theme/theme-utils";
import { cn } from "@/lib/utils/cn";

type ProductGalleryProps = {
  images: ShopifyImage[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    queueMicrotask(() => {
      onSelect();
    });

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!images.length) {
    return (
      <div
        className={cn(
          "flex aspect-square items-center justify-center bg-surface-sky text-muted-foreground",
          getImageRadiusClass(),
        )}
      >
        No image available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          className={cn("overflow-hidden bg-surface-sky", getImageRadiusClass())}
          ref={emblaRef}
        >
          <div className="flex">
            {images.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className="relative min-w-0 flex-[0_0_100%] aspect-square"
              >
                <Image
                  src={image.url}
                  alt={image.altText || alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 ? (
          <>
            <IconButton
              label="Previous image"
              variant="soft"
              className="absolute left-3 top-1/2 -translate-y-1/2"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft className="size-5" aria-hidden />
            </IconButton>
            <IconButton
              label="Next image"
              variant="soft"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRight className="size-5" aria-hidden />
            </IconButton>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={`thumb-${image.url}-${index}`}
              type="button"
              role="tab"
              aria-selected={selected === index}
              aria-label={`View image ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-input border transition-colors duration-fast",
                selected === index
                  ? "border-accent"
                  : "border-border hover:border-accent",
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
