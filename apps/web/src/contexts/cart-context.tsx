"use client";

import type { Product, ProductVariant } from "@ascend/shared";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "ascend_cart";

function itemId(product: Product, variant?: ProductVariant) {
  return `${product.id}:${variant?.id ?? "default"}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch { /* Ignore malformed local storage data. */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, variant?: ProductVariant, quantity = 1) => {
    if (quantity <= 0) return;
    const id = itemId(product, variant);
    setItems((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) return current.map((item) => item.id === id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { id, product, variant, quantity }];
    });
  }, []);

  const removeItem = useCallback((id: string) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => quantity <= 0 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item));
  }, []);
  const clearCart = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({
    items, addItem, removeItem, updateQuantity, clearCart,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + (Number(item.product.price) + Number(item.variant?.price_adjustment ?? 0)) * item.quantity, 0),
    isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
  }), [items, addItem, removeItem, updateQuantity, clearCart, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
