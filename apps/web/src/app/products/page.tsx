"use client";

import { Suspense, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products, categories, formatPrice } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, SlidersHorizontal } from "lucide-react";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const searchQuery = searchParams.get("q") || "";

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [gridSize, setGridSize] = useState<"small" | "large">("small");

  const allColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) => p.variants.forEach((v) => v.color && colors.add(v.color)));
    return Array.from(colors);
  }, []);

  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) => p.variants.forEach((v) => v.size && sizes.add(v.size)));
    return Array.from(sizes);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categorySlug) {
      result = result.filter((p) => p.category?.slug === categorySlug);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.variants.some((v) => v.color && selectedColors.includes(v.color))
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.variants.some((v) => v.size && selectedSizes.includes(v.size))
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [categorySlug, searchQuery, priceRange, selectedColors, selectedSizes, sortBy]);

  const categoryName = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.name
    : searchQuery
    ? `Search: "${searchQuery}"`
    : "All Products";

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="mb-3 block">Price Range</Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={10000}
          step={100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Colors</Label>
        <div className="flex flex-wrap gap-2">
          {allColors.map((color) => (
            <button
              key={color}
              onClick={() =>
                setSelectedColors((prev) =>
                  prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
                )
              }
              className={`px-3 py-1 text-sm rounded-full border ${
                selectedColors.includes(color)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:border-primary"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Sizes</Label>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() =>
                setSelectedSizes((prev) =>
                  prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                )
              }
              className={`px-3 py-1 text-sm rounded-md border min-w-[40px] ${
                selectedSizes.includes(size)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:border-primary"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {(selectedColors.length > 0 || selectedSizes.length > 0) && (
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedColors([]);
            setSelectedSizes([]);
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{categoryName}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredProducts.length} products
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={gridSize === "small" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setGridSize("small")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={gridSize === "large" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setGridSize("large")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="font-semibold mb-4">Filters</h2>
            <FilterContent />
          </div>
        </aside>

        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">No products found</p>
              <Button variant="outline" onClick={() => {
                setPriceRange([0, 10000]);
                setSelectedColors([]);
                setSelectedSizes([]);
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={
              gridSize === "small"
                ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                : "flex flex-col gap-4"
            }>
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className={`group ${gridSize === "large" ? "flex gap-4 p-4 border rounded-lg" : ""}`}
                >
                  <div className={`relative bg-secondary rounded-lg overflow-hidden ${
                    gridSize === "small" ? "aspect-[3/4]" : "w-48 h-48 flex-shrink-0"
                  }`}>
                    <Image
                      src={product.images[0]?.url || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.compare_at_price && (
                      <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                        Sale
                      </span>
                    )}
                  </div>
                  <div className={gridSize === "large" ? "flex-1" : ""}>
                    <h3 className={`font-medium line-clamp-1 ${gridSize === "large" ? "text-lg" : "mt-3 text-sm"}`}>
                      {product.name}
                    </h3>
                    {gridSize === "large" && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold">{formatPrice(product.price)}</span>
                      {product.compare_at_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.compare_at_price)}
                        </span>
                      )}
                    </div>
                    {gridSize === "large" && (
                      <div className="mt-3">
                        <span className="text-sm font-medium">{product.category?.name}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container px-4 py-8">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
