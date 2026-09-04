"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, Search, ShoppingBag, User, LogOut, Package, Heart, X, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/products", label: "New Arrivals", highlight: true },
  { href: "/products/t-shirts", label: "T-Shirts" },
  { href: "/products/hoodies", label: "Hoodies" },
  { href: "/products/cargos", label: "Cargos" },
  { href: "/products/accessories", label: "Accessories" },
];

export function Header() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "glass-nav shadow-lg shadow-primary/5 py-2"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden glass">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 glass-dark">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <Link href="/" className="text-xl font-bold tracking-tight">
                      ASCEND
                    </Link>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                  </div>
                  <nav className="flex-1 p-6 space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                          pathname === link.href
                            ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20"
                            : "hover:bg-white/10"
                        )}
                      >
                        {link.label}
                        {link.highlight && (
                          <span className="text-[10px] bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold">
                            NEW
                          </span>
                        )}
                      </Link>
                    ))}
                  </nav>
                  <div className="p-6 border-t border-white/10">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium px-4 text-white/70">{user?.full_name}</p>
                        <Link
                          href="/account"
                          className="flex items-center gap-3 py-2.5 px-4 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-3 py-2.5 px-4 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          <Package className="h-4 w-4" />
                          Orders
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 py-2.5 px-4 rounded-xl hover:bg-white/10 transition-colors w-full text-red-400"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25" asChild>
                          <Link href="/login">Sign In</Link>
                        </Button>
                        <Button variant="outline" className="w-full glass border-white/20 hover:bg-white/10" asChild>
                          <Link href="/register">Create Account</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
              ASCEND
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-semibold transition-all duration-300 group",
                    pathname === link.href
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {link.label}
                  {link.highlight && (
                    <span className="absolute -top-1 -right-1 text-[9px] bg-gradient-to-r from-red-500 to-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                      NEW
                    </span>
                  )}
                  <span
                    className={cn(
                      "absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-accent transform origin-left transition-transform duration-300 rounded-full",
                      pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                "transition-all duration-500 overflow-hidden",
                isSearchOpen ? "w-56 md:w-72 opacity-100" : "w-0 opacity-0"
              )}
            >
              <form action="/products" method="GET" className="relative">
                <Input
                  type="search"
                  name="q"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 h-10 glass border-0 focus:bg-white/90 rounded-full"
                />
              </form>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex glass hover:bg-white/90"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="hidden md:flex glass hover:bg-white/90">
              <Heart className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative glass hover:bg-white/90">
                    <User className="h-5 w-5" />
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="glass">
                  <div className="mt-8 space-y-4">
                    <div className="border-b border-border pb-4">
                      <p className="font-bold text-lg">{user?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <nav className="space-y-1">
                      <Link href="/account" className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-secondary transition-colors">
                        <User className="h-4 w-4 text-primary" />
                        My Account
                      </Link>
                      <Link href="/account/orders" className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-secondary transition-colors">
                        <Package className="h-4 w-4 text-primary" />
                        Orders
                      </Link>
                      <Link href="/wishlist" className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-secondary transition-colors">
                        <Heart className="h-4 w-4 text-primary" />
                        Wishlist
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-secondary transition-colors w-full text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button variant="ghost" size="sm" className="hidden md:flex glass hover:bg-white/90 font-semibold" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              className="relative glass hover:bg-white/90"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-[10px] font-bold flex items-center justify-center animate-scale-in shadow-lg">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
