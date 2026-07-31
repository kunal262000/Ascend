"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { Category } from "@ascend/shared";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Black", value: "#0a0a0a" },
  { name: "White", value: "#ffffff" },
  { name: "Grey", value: "#808080" },
  { name: "Navy", value: "#1e3a5f" },
  { name: "Beige", value: "#d4a574" },
  { name: "Olive", value: "#556b2f" },
];

export interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
}

interface FilterSidebarProps {
  categories: Category[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose?: () => void;
  className?: string;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  minPrice: 0,
  maxPrice: 10000,
  sizes: [],
  colors: [],
};

export function FilterSidebar({
  categories,
  filters,
  onFiltersChange,
  onClose,
  className,
}: FilterSidebarProps) {
  const toggleCategory = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onFiltersChange({ ...filters, categories: next });
  };

  const toggleSize = (size: string) => {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFiltersChange({ ...filters, sizes: next });
  };

  const toggleColor = (color: string) => {
    const next = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFiltersChange({ ...filters, colors: next });
  };

  const clearFilters = () => onFiltersChange({ ...DEFAULT_FILTERS });

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 10000;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded p-1 hover:bg-secondary lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="mb-3 text-sm font-medium">Category</h4>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              {cat.name}
            </label>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No categories available
            </p>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="mb-3 text-sm font-medium">Price Range</h4>
        <div className="space-y-3">
          <Slider
            defaultValue={[filters.minPrice, filters.maxPrice]}
            max={10000}
            step={100}
            onValueChange={([min, max]) =>
              onFiltersChange({ ...filters, minPrice: min, maxPrice: max })
            }
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>₹{filters.minPrice.toLocaleString("en-IN")}</span>
            <span>₹{filters.maxPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="mb-3 text-sm font-medium">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                filters.sizes.includes(size)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="mb-3 text-sm font-medium">Color</h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              title={color.name}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-all",
                filters.colors.includes(color.name)
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              )}
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
