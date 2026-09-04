"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { formatPrice, products } from "@/lib/data";

export default function WishlistPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(products.slice(0, 3).map(p => p.id));

  if (isLoading) {
    return <div className="container px-4 py-16 text-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    redirect("/login?redirect=/wishlist");
  }

  const wishlistProducts = products.filter((p) => wishlistItems.includes(p.id));

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((id) => id !== productId));
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>

      {wishlistProducts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-lg font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save items you like to your wishlist</p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <Card key={product.id} className="group">
              <div className="relative aspect-square bg-secondary rounded-t-lg overflow-hidden">
                <Image
                  src={product.images[0]?.url || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-medium line-clamp-1 hover:underline">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold">{formatPrice(product.price)}</span>
                  {product.compare_at_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href={`/products/${product.slug}`}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
