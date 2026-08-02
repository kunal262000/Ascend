"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-context";

export function CartSheet() {
  const { items, itemCount, subtotal, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  return <Sheet open={isOpen} onOpenChange={(open) => open ? undefined : closeCart()}>
    <SheetContent className="flex w-full flex-col p-0 sm:max-w-[400px]">
      <SheetHeader className="border-b p-6 pr-12"><SheetTitle className="flex items-center gap-2">Your Cart <span className="rounded-full bg-[#d4a574] px-2 py-0.5 text-xs text-black">{itemCount}</span></SheetTitle></SheetHeader>
      {items.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center"><p className="text-muted-foreground">Your cart is empty</p><Button asChild onClick={closeCart}><Link href="/products">Start Shopping</Link></Button></div> : <>
        <div className="flex-1 space-y-5 overflow-y-auto p-6">{items.map((item) => { const price = Number(item.product.price) + Number(item.variant?.price_adjustment ?? 0); return <div key={item.id} className="flex gap-3 border-b pb-5">
          <div className="h-24 w-20 shrink-0 overflow-hidden rounded bg-secondary">{item.product.images?.[0]?.url && <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />}</div>
          <div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="line-clamp-2 text-sm font-medium">{item.product.name}</p><button aria-label={`Remove ${item.product.name}`} onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button></div>
            {(item.variant?.size || item.variant?.color) && <p className="mt-1 text-xs text-muted-foreground">{[item.variant.size, item.variant.color].filter(Boolean).join(" / ")}</p>}
            <p className="mt-1 text-sm">₹{price.toLocaleString("en-IN")}</p><div className="mt-2 flex items-center justify-between"><div className="flex items-center rounded border"><button className="p-1.5" aria-label="Decrease quantity" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></button><span className="w-7 text-center text-xs">{item.quantity}</span><button className="p-1.5" aria-label="Increase quantity" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></button></div><span className="text-sm font-semibold">₹{(price * item.quantity).toLocaleString("en-IN")}</span></div>
          </div>
        </div>; })}</div>
        <div className="border-t p-6"><div className="mb-2 flex justify-between font-semibold"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div><p className="mb-4 text-xs text-muted-foreground">Free shipping on orders over ₹999</p><Button asChild className="w-full" onClick={closeCart}><Link href="/checkout">Checkout</Link></Button></div>
      </>}
    </SheetContent>
  </Sheet>;
}
