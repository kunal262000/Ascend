"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { useToast } from "@/lib/toast-context";

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const { addToast } = useToast();
  const shippingCost = subtotal > 2000 ? 0 : 99;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="container px-4 py-24 text-center max-w-lg mx-auto animate-fade-in">
        <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button size="lg" asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-card border rounded-xl animate-fade-in"
            >
              <Link href={`/products/${item.product.slug}`} className="relative w-24 h-24 bg-secondary rounded-lg overflow-hidden shrink-0">
                <Image
                  src={item.product.images[0]?.url || "/placeholder.png"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-semibold hover:text-primary transition-colors line-clamp-1"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {item.variant.color} / {item.variant.size}
                </p>
                <p className="font-bold mt-1">
                  {formatPrice(item.product.price + item.variant.price_adjustment)}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeItem(item.variant_id);
                          addToast("info", "Item removed from cart");
                        } else {
                          updateQuantity(item.variant_id, item.quantity - 1);
                        }
                      }}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      removeItem(item.variant_id);
                      addToast("info", "Item removed from cart");
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold">
                  {formatPrice((item.product.price + item.variant.price_adjustment) * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border rounded-xl p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              {subtotal < 2000 && (
                <p className="text-xs text-green-600">
                  Add {formatPrice(2000 - subtotal)} more for free shipping!
                </p>
              )}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Button size="lg" className="w-full rounded-xl" asChild>
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full mt-3 rounded-xl" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
