"use client";

import Link from "next/link";
import Image from "next/image";
import { useRecentlyViewed } from "@/lib/use-recently-viewed";
import { formatPrice } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

export function RecentlyViewed() {
  const { getRecentlyViewedProducts } = useRecentlyViewed();
  const products = getRecentlyViewedProducts();

  if (products.length < 2) return null;

  return (
    <section className="py-16 container px-4 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Recently Viewed</h2>
        </div>
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/products">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {products.slice(0, 6).map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="flex-shrink-0 w-48 group"
          >
            <div className="relative aspect-[3/4] bg-secondary/50 rounded-xl overflow-hidden mb-3 transition-shadow group-hover:shadow-lg">
              <Image
                src={product.images[0]?.url || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="font-bold text-sm">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
