"use client";

import { useState, useEffect } from "react";
import { Product } from "@ascend/shared";
import { products as allProducts } from "@/lib/data";

const MAX_RECENTLY_VIEWED = 8;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("ascend_recently_viewed");
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch {
        localStorage.removeItem("ascend_recently_viewed");
      }
    }
  }, []);

  const addToRecentlyViewed = (productSlug: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((slug) => slug !== productSlug);
      const updated = [productSlug, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      localStorage.setItem("ascend_recently_viewed", JSON.stringify(updated));
      return updated;
    });
  };

  const getRecentlyViewedProducts = (): Product[] => {
    return recentlyViewed
      .map((slug) => allProducts.find((p) => p.slug === slug))
      .filter((p): p is Product => p !== undefined);
  };

  return { recentlyViewed, addToRecentlyViewed, getRecentlyViewedProducts };
}
