"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/products?category=tees", label: "Tees" },
  { href: "/products?category=hoodies", label: "Hoodies" },
  { href: "/products?category=cargos", label: "Cargos" },
];

export function Header() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:opacity-80"
        >
          ASCEND
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isLoading && (
            <>
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-normal">
                      <p className="text-sm font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex sm:items-center sm:gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d4a574] px-1 text-[10px] font-bold text-black">{itemCount > 99 ? "99+" : itemCount}</span>}
            <span className="sr-only">Cart</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "border-t border-border bg-background md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="container mx-auto flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
          <div className="my-1 border-t border-border" />
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <span className="px-3 py-2 text-sm font-medium text-muted-foreground">
                    {user?.full_name}
                  </span>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="rounded-md px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-secondary"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
