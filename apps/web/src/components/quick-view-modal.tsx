"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Heart, Ruler, Check } from "lucide-react";
import { Product } from "@ascend/shared";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { formatPrice } from "@/lib/data";
import { SizeGuideModal } from "./size-guide-modal";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      addToast("error", "Please select size and color");
      return;
    }

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    addItem({
      product_id: product.id,
      variant_id: selectedVariant.id,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        images: product.images,
      },
      variant: selectedVariant,
    });

    addToast("cart", "Added to cart", product.name);
    setIsAdding(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative bg-secondary/30 aspect-square md:aspect-auto">
              <Image
                src={product.images[selectedImage]?.url || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              />
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt=""
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 flex flex-col">
              <div className="mb-4">
                <span className="text-sm font-medium text-muted-foreground">{product.category?.name}</span>
                <h2 className="text-2xl font-bold mt-1">{product.name}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xl font-bold">{formatPrice(product.price)}</span>
                  {product.compare_at_price && (
                    <span className="text-muted-foreground line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{product.description}</p>

              {colors.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Color</span>
                    <span className="text-sm text-muted-foreground">{selectedColor}</span>
                  </div>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color || null)}
                        className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                          selectedColor === color
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Size</span>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Ruler className="w-3 h-3" />
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map((size) => {
                      const variantForSize = product.variants.find((v) => v.size === size);
                      const isOutOfStock = variantForSize && variantForSize.stock === 0;

                      return (
                        <button
                          key={size}
                          onClick={() => !isOutOfStock && setSelectedSize(size || null)}
                          disabled={isOutOfStock}
                          className={`min-w-[48px] px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                            selectedSize === size
                              ? "border-primary bg-primary text-primary-foreground"
                              : isOutOfStock
                              ? "border-border bg-muted text-muted-foreground cursor-not-allowed"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <span className="text-sm font-medium mb-2 block">Quantity</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-xl overflow-hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="rounded-none h-10 w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="rounded-none h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <Button
                  size="lg"
                  className="w-full rounded-xl"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || isAdding}
                >
                  {isAdding ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg" className="w-full rounded-xl">
                  <Heart className="h-5 w-5 mr-2" />
                  Add to Wishlist
                </Button>
              </div>

              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="text-center text-sm text-primary hover:underline mt-4"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </>
  );
}
