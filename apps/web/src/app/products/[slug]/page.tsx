"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Star, ShoppingCart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageGallery } from "@/components/image-gallery";
import { VariantSelector } from "@/components/variant-selector";
import { QuantitySelector } from "@/components/quantity-selector";
import { ProductGrid } from "@/components/product-grid";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import type { Product } from "@ascend/shared";
import { useCart } from "@/contexts/cart-context";

const SIZE_CHART = [
  { size: "S", chest: '38"', length: '28"', sleeve: '8.5"' },
  { size: "M", chest: '40"', length: '29"', sleeve: '9"' },
  { size: "L", chest: '42"', length: '30"', sleeve: '9.5"' },
  { size: "XL", chest: '44"', length: '31"', sleeve: '10"' },
  { size: "XXL", chest: '46"', length: '32"', sleeve: '10.5"' },
];

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">
        {count > 0 ? `(${count} reviews)` : "No reviews yet"}
      </span>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const slug = params.slug as string;

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const productQuery = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });

  const product = productQuery.data as Product | undefined;

  // Related products
  const relatedQuery = useQuery({
    queryKey: ["products", "related", product?.category_id],
    queryFn: () =>
      fetchProducts({
        page: 1,
        size: 4,
        category: product?.category?.slug,
      }),
    enabled: !!product?.category_id,
  });

  const relatedProducts =
    relatedQuery.data?.items?.filter((p) => p.id !== product?.id).slice(0, 4) ||
    [];

  const hasDiscount =
    product?.compare_at_price && product.compare_at_price > product.price;
  const displayPrice = product ? Number(product.price) : 0;

  // ── Loading State ──────────────────────────────────────
  if (productQuery.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-6 h-4 w-48" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────
  if (productQuery.isError || !product) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          {productQuery.isError
            ? "Failed to load product. The backend may be unavailable."
            : "The product you're looking for doesn't exist or has been removed."}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => productQuery.refetch()}>
            Try Again
          </Button>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-foreground"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <ImageGallery
          images={product.images || []}
          productName={product.name}
        />

        {/* Info */}
        <div className="flex flex-col gap-6">
          {/* Name & Price */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-2xl font-semibold">
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹
                  {Number(product.compare_at_price).toLocaleString("en-IN")}
                </span>
              )}
              {hasDiscount && (
                <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                  {Math.round(
                    ((product.compare_at_price! - product.price) /
                      product.compare_at_price!) *
                      100
                  )}
                  % OFF
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          <StarRating rating={4} count={0} />

          {/* Description */}
          {product.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          {/* Variants */}
          <VariantSelector
            variants={product.variants || []}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSizeChange={setSelectedSize}
            onColorChange={setSelectedColor}
          />

          {/* Quantity & Add to Cart */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity</span>
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="flex-1" onClick={() => {
                const variant = product.variants?.find((v) => v.is_active && (!selectedSize || v.size === selectedSize) && (!selectedColor || v.color === selectedColor));
                addItem(product, variant, quantity);
                openCart();
              }}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="flex-1" onClick={() => {
                const variant = product.variants?.find((v) => v.is_active && (!selectedSize || v.size === selectedSize) && (!selectedColor || v.color === selectedColor));
                addItem(product, variant, quantity);
                router.push("/checkout");
              }}>
                Buy Now
              </Button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 rounded-lg border border-border p-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Secure Checkout
            </div>
            <div>Free Shipping over ₹999</div>
            <div>Easy 7-day Returns</div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="size-guide">Size Guide</TabsTrigger>
            <TabsTrigger value="shipping">Shipping &amp; Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p>No description available for this product.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="size-guide" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full max-w-lg text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 pr-4 font-semibold">Size</th>
                    <th className="pb-2 pr-4 font-semibold">Chest</th>
                    <th className="pb-2 pr-4 font-semibold">Length</th>
                    <th className="pb-2 font-semibold">Sleeve</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART.map((row) => (
                    <tr key={row.size} className="border-b border-border">
                      <td className="py-2 pr-4 font-medium">{row.size}</td>
                      <td className="py-2 pr-4">{row.chest}</td>
                      <td className="py-2 pr-4">{row.length}</td>
                      <td className="py-2">{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-4">
            <div className="max-w-2xl space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="mb-1 font-semibold text-foreground">Shipping</h4>
                <p>
                  Free standard shipping on all orders over ₹999. Standard
                  delivery takes 5–7 business days. Express shipping is available
                  at checkout for a flat ₹199 fee (2–3 business days).
                </p>
              </div>
              <div>
                <h4 className="mb-1 font-semibold text-foreground">Returns</h4>
                <p>
                  We offer easy 7-day returns on all unworn, unwashed items with
                  original tags attached. Simply initiate a return from your
                  account or contact our support team. Refunds are processed
                  within 5 business days of receiving the returned item.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            You May Also Like
          </h2>
          <ProductGrid
            products={relatedProducts}
            isLoading={relatedQuery.isLoading}
            isError={relatedQuery.isError}
            isEmpty={!relatedQuery.isLoading && relatedProducts.length === 0}
            onRetry={() => relatedQuery.refetch()}
            emptyMessage="No related products found."
            cols={4}
          />
        </section>
      )}
    </div>
  );
}
