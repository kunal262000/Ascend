"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@ascend/shared";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedSize: string;
  selectedColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

export function VariantSelector({
  variants,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: VariantSelectorProps) {
  const sizes = [...new Set(variants.map((v) => v.size).filter((s): s is string => !!s))];
  const colors = [...new Set(variants.map((v) => v.color).filter((c): c is string => !!c))];

  return (
    <div className="space-y-4">
      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Size</span>
            {selectedSize && (
              <span className="text-sm text-muted-foreground">
                {selectedSize}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variant = variants.find(
                (v) => v.size === size && v.is_active
              );
              const isOutOfStock = !variant || variant.stock === 0;
              return (
                <button
                  key={size}
                  disabled={isOutOfStock}
                  onClick={() => onSizeChange(size)}
                  className={cn(
                    "min-w-[3rem] rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : isOutOfStock
                        ? "cursor-not-allowed border-border bg-muted text-muted-foreground line-through"
                        : "border-border hover:border-primary"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Color</span>
            {selectedColor && (
              <span className="text-sm text-muted-foreground">
                {selectedColor}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  selectedColor === color
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
