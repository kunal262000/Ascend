"use client";

import { X } from "lucide-react";
import type { FilterState } from "./filter-sidebar";

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveCategory: (slug: string) => void;
  onRemoveSize: (size: string) => void;
  onRemoveColor: (color: string) => void;
  onRemovePrice: () => void;
}

export function ActiveFilters({
  filters,
  onRemoveCategory,
  onRemoveSize,
  onRemoveColor,
  onRemovePrice,
}: ActiveFiltersProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  filters.categories.forEach((cat) =>
    chips.push({ label: cat, onRemove: () => onRemoveCategory(cat) })
  );
  filters.sizes.forEach((size) =>
    chips.push({ label: `Size: ${size}`, onRemove: () => onRemoveSize(size) })
  );
  filters.colors.forEach((color) =>
    chips.push({
      label: `Color: ${color}`,
      onRemove: () => onRemoveColor(color),
    })
  );
  if (filters.minPrice > 0 || filters.maxPrice < 10000) {
    chips.push({
      label: `₹${filters.minPrice} – ₹${filters.maxPrice}`,
      onRemove: onRemovePrice,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip.label}
          className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
