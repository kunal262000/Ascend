"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Shop", icon: Search },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account", label: "Account", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          const isCart = item.href === "/account" && isAuthenticated;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-lg transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.href === "/account" && isAuthenticated && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        <Link
          href="/cart"
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-lg transition-colors relative",
            pathname === "/cart" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </Link>
      </div>
    </nav>
  );
}
