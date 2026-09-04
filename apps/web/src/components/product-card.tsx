"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@ascend/shared";
import { formatPrice } from "@/lib/data";
import { Heart, Eye } from "lucide-react";
import { QuickViewModal } from "./quick-view-modal";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <>
      <div
        className="group animate-fade-in"
        style={{ animationDelay: `${index * 100}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
      >
        <div className="relative aspect-[3/4] bg-secondary/50 rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
          <Image
            src={product.images[currentImageIndex]?.url || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {product.images.length > 1 && isHovered && (
            <div
              className="absolute inset-0 transition-opacity duration-300"
              onMouseEnter={() => setCurrentImageIndex(1)}
            >
              <Image
                src={product.images[1]?.url || product.images[0]?.url}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {product.compare_at_price && (
            <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full">
              -{discount}%
            </span>
          )}

          <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

          <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowQuickView(true);
                }}
                className="flex-1 bg-white text-black py-2.5 rounded-lg font-medium text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Quick View
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Heart className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium">{product.category?.name}</span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-bold">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
          
          {product.variants.some(v => v.color) && (
            <div className="flex gap-1 pt-1">
              {[...new Set(product.variants.map(v => v.color))].filter(Boolean).slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="w-4 h-4 rounded-full border border-border"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}
