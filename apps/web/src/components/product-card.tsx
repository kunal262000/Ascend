"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@ascend/shared";
import { formatPrice } from "@/lib/data";
import { Heart, Eye, ShoppingBag } from "lucide-react";
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
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500 glass-card">
          <Image
            src={product.images[currentImageIndex]?.url || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
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
            <span className="absolute top-3 left-3 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
              -{discount}% OFF
            </span>
          )}

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="w-10 h-10 glass flex items-center justify-center rounded-full hover:bg-white/90 transition-all duration-200 hover:scale-110"
            >
              <Heart className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowQuickView(true);
              }}
              className="w-10 h-10 glass flex items-center justify-center rounded-full hover:bg-white/90 transition-all duration-200 hover:scale-110"
            >
              <Eye className="w-5 h-5 text-foreground" />
            </button>
          </div>

          <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs text-primary font-semibold tracking-wider uppercase bg-primary/10 px-3 py-1 rounded-full inline-block">{product.category?.name}</span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
          
          {product.variants.some(v => v.color) && (
            <div className="flex gap-1.5 pt-1">
              {[...new Set(product.variants.map(v => v.color))].filter(Boolean).slice(0, 5).map((color) => (
                <span
                  key={color}
                  className="w-5 h-5 rounded-full border-2 border-border shadow-sm"
                  style={{
                    backgroundColor: 
                      color === 'Black' ? '#000' :
                      color === 'White' ? '#fff' :
                      color === 'Charcoal' ? '#36454F' :
                      color === 'Grey' || color === 'Gray' ? '#808080' :
                      color === 'Olive' ? '#808000' :
                      color === 'Navy' ? '#000080' :
                      color === 'Red' ? '#FF0000' :
                      color === 'Brown' ? '#A52A2A' :
                      color === 'Tan' ? '#D2B48C' :
                      color === 'Gold' ? '#FFD700' :
                      color === 'Silver' ? '#C0C0C0' :
                      color === 'Dark Wash' ? '#1E3A5F' :
                      color === 'Washed Blue' ? '#7BAFD4' :
                      color === 'Black/White' ? 'linear-gradient(135deg, #000 50%, #fff 50%)' :
                      'hsl(var(--primary))'
                  }}
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
