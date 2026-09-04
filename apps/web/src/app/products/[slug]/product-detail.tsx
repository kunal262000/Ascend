"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@ascend/shared";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/data";
import { Heart, Minus, Plus, Share2, Truck, RotateCcw, Shield, Check } from "lucide-react";

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
    <div className="container px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">Products</Link>
        <span>/</span>
        <Link href={`/products/${product.category?.slug}`} className="hover:text-foreground">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]?.url || "/placeholder.png"}
              alt={product.images[selectedImage]?.alt_text || product.name}
              fill
              className="object-cover"
              priority
            />
            {product.compare_at_price && (
              <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm font-medium px-3 py-1 rounded">
                -{discount}% OFF
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
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

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-2xl font-bold">{formatPrice(finalPrice)}</span>
              {product.compare_at_price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                  <span className="text-sm text-destructive font-medium">
                    Save {formatPrice(product.compare_at_price - finalPrice)}
                  </span>
                </>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Color</span>
                <span className="text-sm text-muted-foreground">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color || null)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-input hover:border-primary"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Size</span>
                <span className="text-sm text-muted-foreground">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size || null)}
                    className={`min-w-[48px] px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-input hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="font-medium mb-3 block">Quantity</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {selectedVariant && selectedVariant.stock < 10 && (
                <span className="text-sm text-destructive">
                  Only {selectedVariant.stock} left
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!selectedVariant || isAdding}
            >
              {isAdding ? "Adding..." : !selectedVariant ? "Select options" : "Add to Cart"}
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {selectedVariant && selectedVariant.stock > 0 && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>In Stock</span>
            </div>
          )}

          <Separator />

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span>Free shipping on orders over ₹2000</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span>30-day hassle-free returns</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span>Secure checkout with SSL encryption</span>
            </div>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">SKU:</span> {product.sku}</p>
            {selectedVariant && (
              <p><span className="font-medium text-foreground">Variant SKU:</span> {selectedVariant.sku}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
