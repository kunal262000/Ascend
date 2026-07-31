"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "./product-card";
import type { Product } from "@ascend/shared";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  isEmpty?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
  className?: string;
  cols?: 2 | 3 | 4;
}

export function ProductGrid({
  products,
  isLoading,
  isEmpty,
  isError,
  onRetry,
  emptyMessage = "No products found.",
  className,
  cols = 4,
}: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  if (isLoading) {
    return (
      <div className={cn("grid gap-4 sm:gap-6", gridCols[cols], className)}>
        {Array.from({ length: cols === 2 ? 4 : 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-border">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">
          Something went wrong loading products.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (isEmpty || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 sm:gap-6", gridCols[cols], className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
