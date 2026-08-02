"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import Link from "next/link";
import type { Product } from "@ascend/shared";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);
  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) /
          product.compare_at_price!) *
          100
      )
    : 0;

  const initial =
    product.name?.charAt(0)?.toUpperCase() || "P";

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg",
        className
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden bg-secondary"
      >
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt_text || product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-6xl font-bold text-muted-foreground/30">
              {initial}
            </span>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
            -{discountPercent}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-medium leading-tight hover:underline line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{Number(product.compare_at_price).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <Button
          size="sm"
          className="mt-auto w-full"
          onClick={(e) => {
            e.preventDefault();
            addItem(product, product.variants?.find((variant) => variant.is_active), 1);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1500);
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {added ? "Added ✓" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
