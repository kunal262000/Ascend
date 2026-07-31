"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useState, useEffect, Suspense } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/search-bar";
import {
  FilterSidebar,
  type FilterState,
} from "@/components/filter-sidebar";
import { ActiveFilters } from "@/components/active-filters";
import { ProductGrid } from "@/components/product-grid";
import { fetchProducts, fetchCategories } from "@/lib/api";

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  minPrice: 0,
  maxPrice: 10000,
  sizes: [],
  colors: [],
};

function ProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── State ──────────────────────────────────────────────
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.get("category")
      ? [searchParams.get("category")!]
      : [],
    minPrice: Number(searchParams.get("min_price")) || 0,
    maxPrice: Number(searchParams.get("max_price")) || 10000,
    sizes: searchParams.get("sizes")?.split(",").filter(Boolean) || [],
    colors: searchParams.get("colors")?.split(",").filter(Boolean) || [],
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ── Sync URL params ────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filters.categories.length === 1)
      params.set("category", filters.categories[0]);
    if (filters.minPrice > 0) params.set("min_price", String(filters.minPrice));
    if (filters.maxPrice < 10000) params.set("max_price", String(filters.maxPrice));
    if (filters.sizes.length) params.set("sizes", filters.sizes.join(","));
    if (filters.colors.length) params.set("colors", filters.colors.join(","));
    if (sortBy) params.set("sort_by", sortBy);
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { scroll: false });
  }, [search, filters, sortBy, router]);

  // ── Queries ─────────────────────────────────────────────
  const productsQuery = useQuery({
    queryKey: ["products", search, filters.categories, sortBy, page],
    queryFn: () =>
      fetchProducts({
        page,
        size: 12,
        search: search || undefined,
        category: filters.categories[0] || undefined,
        min_price: filters.minPrice > 0 ? filters.minPrice : undefined,
        max_price: filters.maxPrice < 10000 ? filters.maxPrice : undefined,
        sort_by: sortBy || undefined,
      }),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // ── Accumulate products for load-more ───────────────────
  useEffect(() => {
    if (productsQuery.data?.items) {
      if (page === 1) {
        setAllProducts(productsQuery.data.items);
      } else {
        setAllProducts((prev) => [...prev, ...productsQuery.data.items]);
      }
    }
  }, [productsQuery.data, page]);

  // Reset when filters/search change
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [search, filters, sortBy]);

  // ── Handlers ────────────────────────────────────────────
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => setFilters(newFilters),
    []
  );

  const handleLoadMore = () => setPage((p) => p + 1);

  const totalPages = productsQuery.data
    ? Math.ceil(productsQuery.data.total / 12)
    : 0;
  const hasMore = page < totalPages;

  const filterContent = (
    <FilterSidebar
      categories={categoriesQuery.data || []}
      filters={filters}
      onFiltersChange={handleFiltersChange}
    />
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
        <p className="mt-1 text-muted-foreground">
          Discover premium streetwear essentials
        </p>
      </div>

      {/* Search & Sort Row */}
      <div className="sticky top-16 z-30 -mx-4 bg-background px-4 pb-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchBar value={search} onChange={handleSearch} />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] shrink-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">Price: Low–High</SelectItem>
              <SelectItem value="price_desc">Price: High–Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name_asc">Name: A–Z</SelectItem>
            </SelectContent>
          </Select>
          {/* Mobile filter sheet trigger */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">{filterContent}</div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active filters */}
        <div className="mt-3">
          <ActiveFilters
            filters={filters}
            onRemoveCategory={(slug) =>
              setFilters((f) => ({
                ...f,
                categories: f.categories.filter((c) => c !== slug),
              }))
            }
            onRemoveSize={(size) =>
              setFilters((f) => ({
                ...f,
                sizes: f.sizes.filter((s) => s !== size),
              }))
            }
            onRemoveColor={(color) =>
              setFilters((f) => ({
                ...f,
                colors: f.colors.filter((c) => c !== color),
              }))
            }
            onRemovePrice={() =>
              setFilters((f) => ({ ...f, minPrice: 0, maxPrice: 10000 }))
            }
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden w-60 flex-shrink-0 lg:block">
          <div className="sticky top-44">{filterContent}</div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid
            products={allProducts}
            isLoading={productsQuery.isLoading && page === 1}
            isError={productsQuery.isError}
            isEmpty={!productsQuery.isLoading && allProducts.length === 0}
            onRetry={() => productsQuery.refetch()}
            emptyMessage={
              search || filters.categories.length > 0
                ? "No products match your filters. Try adjusting them."
                : "No products available yet. Check back soon!"
            }
            cols={3}
          />

          {/* Load More */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                disabled={productsQuery.isFetching}
              >
                {productsQuery.isFetching ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}

          {/* Loading more skeleton */}
          {productsQuery.isFetching && page > 1 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Loading more products...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 h-9 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
        </div>
      }
    >
      <ProductsPageInner />
    </Suspense>
  );
}
