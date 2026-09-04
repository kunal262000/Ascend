"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@ascend/shared";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/data";
import { Heart, Share2, Truck, RotateCcw, Shield, Check, ChevronRight, Minus, Plus } from "lucide-react";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.variants.find((v) => v.color)?.color || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.variants[0]?.size || null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"description" | "details" | "shipping">("description");

  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
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
    
    setIsAdding(false);
  };

  const finalPrice = product.price + (selectedVariant?.price_adjustment || 0);
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - finalPrice) / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="container px-4 py-8 lg:py-12">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 animate-fade-in">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/products/${product.category?.slug}`} className="hover:text-foreground transition-colors">
          {product.category?.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="space-y-4 animate-fade-in">
          <div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden group">
            <Image
              src={product.images[selectedImage]?.url || "/placeholder.png"}
              alt={product.images[selectedImage]?.alt_text || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            {product.compare_at_price && (
              <div className="absolute top-4 left-4">
                <span className="bg-black text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  -{discount}% OFF
                </span>
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" size="icon" className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedImage === index 
                      ? "ring-2 ring-primary ring-offset-2" 
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt_text || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 animate-slide-up">
          <div>
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">{product.category?.name}</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{formatPrice(finalPrice)}</span>
                {product.compare_at_price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>
              {product.compare_at_price && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Save {formatPrice(product.compare_at_price - finalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(128 reviews)</span>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {colors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Color</span>
                <span className="text-sm text-muted-foreground">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color || null)}
                    className={`relative px-6 py-2.5 rounded-full border-2 font-medium text-sm transition-all duration-200 ${
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Size</span>
                <button className="text-sm text-primary hover:underline font-medium">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => {
                  const variantForSize = product.variants.find(v => v.size === size);
                  const isOutOfStock = variantForSize && variantForSize.stock === 0;
                  
                  return (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size || null)}
                      disabled={isOutOfStock}
                      className={`min-w-[56px] px-5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : isOutOfStock
                          ? "border-border bg-muted text-muted-foreground cursor-not-allowed line-through"
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

          <div className="space-y-3">
            <span className="font-semibold">Quantity</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 rounded-xl overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="rounded-none h-12 w-12"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-none h-12 w-12"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {selectedVariant && selectedVariant.stock < 10 && selectedVariant.stock > 0 && (
                <span className="text-sm text-orange-600 font-medium animate-pulse">
                  Only {selectedVariant.stock} left in stock!
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              size="lg"
              className="flex-1 h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/25"
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
              ) : !selectedVariant ? (
                "Select options"
              ) : (
                `Add to Cart - ${formatPrice(finalPrice * quantity)}`
              )}
            </Button>
            <Button size="lg" variant="outline" className="h-14 w-14 p-0 rounded-xl">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {selectedVariant && selectedVariant.stock > 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="font-medium">In Stock — Ships within 2-3 business days</span>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                  <p className="text-sm font-medium">Orders ₹2000+</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Easy Returns</p>
                  <p className="text-sm font-medium">30 Days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Secure</p>
                  <p className="text-sm font-medium">SSL Encrypted</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex border-b">
              {(["description", "details", "shipping"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-6 py-3 font-medium text-sm capitalize transition-colors relative ${
                    selectedTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  {selectedTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="py-4">
              {selectedTab === "description" && (
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              )}
              {selectedTab === "details" && (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">SKU</span>
                    <span className="text-muted-foreground">{product.sku}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Material</span>
                    <span className="text-muted-foreground">100% Premium Cotton</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Fit</span>
                    <span className="text-muted-foreground">Oversized</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Care</span>
                    <span className="text-muted-foreground">Machine wash cold</span>
                  </div>
                </div>
              )}
              {selectedTab === "shipping" && (
                <div className="space-y-4 text-muted-foreground">
                  <p>Free standard shipping (5-7 business days) on all orders over ₹2000.</p>
                  <p>Express shipping (2-3 business days) available for ₹149.</p>
                  <p>Returns accepted within 30 days of delivery. Items must be unworn with tags attached.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
