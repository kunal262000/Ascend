"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { HeroBanner } from "@/components/hero-banner";
import { ProductGrid } from "@/components/product-grid";

export default function HomePage() {
  const featuredQuery = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => fetchProducts({ page: 1, size: 4, sort_by: "created_at" }),
  });

  const newArrivalsQuery = useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: () => fetchProducts({ page: 1, size: 4, sort_by: "created_at" }),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const featuredProducts = featuredQuery.data?.items || [];
  const newArrivals = newArrivalsQuery.data?.items || [];
  const categories = categoriesQuery.data || [];

  return (
    <div>
      {/* Hero */}
      <HeroBanner />

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured</h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductGrid
          products={featuredProducts}
          isLoading={featuredQuery.isLoading}
          isError={featuredQuery.isError}
          isEmpty={!featuredQuery.isLoading && featuredProducts.length === 0}
          onRetry={() => featuredQuery.refetch()}
          emptyMessage="Featured products coming soon."
          cols={4}
        />
      </section>

      {/* Categories */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Shop by Category
          </h2>
          {categoriesQuery.isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-24 w-40 flex-shrink-0 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : categoriesQuery.isError ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Could not load categories.
              </p>
              <button
                onClick={() => categoriesQuery.refetch()}
                className="mt-2 text-sm font-medium underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No categories available yet.
            </p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="flex h-28 w-40 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-card p-4 text-center transition-colors hover:border-primary hover:shadow-md"
                >
                  <span className="text-sm font-semibold">{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">New Arrivals</h2>
          <Link
            href="/products?sort_by=newest"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductGrid
          products={newArrivals}
          isLoading={newArrivalsQuery.isLoading}
          isError={newArrivalsQuery.isError}
          isEmpty={!newArrivalsQuery.isLoading && newArrivals.length === 0}
          onRetry={() => newArrivalsQuery.refetch()}
          emptyMessage="New arrivals coming soon."
          cols={4}
        />
      </section>
    </div>
  );
}
