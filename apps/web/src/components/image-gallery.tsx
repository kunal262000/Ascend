"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductImage } from "@ascend/shared";

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const allImages =
    images.length > 0
      ? images.sort((a, b) => a.sort_order - b.sort_order)
      : [];
  const activeImage = allImages[activeIndex];
  const initial = productName?.charAt(0)?.toUpperCase() || "P";

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
        {activeImage?.url ? (
          <img
            src={activeImage.url}
            alt={activeImage.alt_text || productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-8xl font-bold text-muted-foreground/20">
              {initial}
            </span>
          </div>
        )}

        {/* Navigation arrows for multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveIndex(
                  (activeIndex - 1 + allImages.length) % allImages.length
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow backdrop-blur hover:bg-background"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() =>
                setActiveIndex((activeIndex + 1) % allImages.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow backdrop-blur hover:bg-background"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "h-20 w-20 flex-shrink-0 overflow-hidden rounded border-2 transition-colors",
                idx === activeIndex
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground"
              )}
            >
              {img.url ? (
                <img
                  src={img.url}
                  alt={img.alt_text || `${productName} ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary">
                  <span className="text-lg font-bold text-muted-foreground/40">
                    {initial}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
