"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, ShoppingBag, User, LogOut, Package, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/products", label: "All Products" },
  { href: "/products/t-shirts", label: "T-Shirts" },
  { href: "/products/hoodies", label: "Hoodies" },
  { href: "/products/cargos", label: "Cargos" },
  { href: "/products/accessories", label: "Accessories" },
];

export function Header() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-lg font-medium hover:text-primary",
                        pathname === link.href && "text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="text-xl font-bold tracking-tight">
              ASCEND
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                    pathname === link.href && "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {isAuthenticated ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="mt-8 space-y-4">
                    <div className="border-b pb-4">
                      <p className="font-medium">{user?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <nav className="space-y-2">
                      <Link href="/account" className="flex items-center gap-2 py-2 hover:text-primary">
                        <User className="h-4 w-4" />
                        My Account
                      </Link>
                      <Link href="/account/orders" className="flex items-center gap-2 py-2 hover:text-primary">
                        <Package className="h-4 w-4" />
                        Orders
                      </Link>
                      <Link href="/wishlist" className="flex items-center gap-2 py-2 hover:text-primary">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 py-2 text-destructive hover:text-destructive/80 w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={openCart} className="relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="pb-4 md:hidden">
            <form action="/products" method="GET">
              <Input
                type="search"
                name="q"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
