"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/products?category=tees", label: "Tees" },
  { href: "/products?category=hoodies", label: "Hoodies" },
  { href: "/products?category=cargos", label: "Cargos" },
];

export function Header() {
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
          <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
            <Link href="/account">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Link>
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
        </nav>
      </div>
    </header>
  );
}
