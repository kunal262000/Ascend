import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-black tracking-tighter">ASCEND</h3>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Premium streetwear for the modern individual. Elevated basics with a
              minimal, confident aesthetic. Rise above the ordinary.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wider uppercase text-primary">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/t-shirts"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/products/hoodies"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Hoodies
                </Link>
              </li>
              <li>
                <Link
                  href="/products/cargos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cargos
                </Link>
              </li>
              <li>
                <Link
                  href="/products/accessories"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wider uppercase text-primary">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wider uppercase text-primary">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 border-t border-border pt-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h4 className="text-base font-bold">
                Join the ASCEND Newsletter
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Subscribe for exclusive drops, early access, and 10% off your first order.
              </p>
            </div>
            <div className="flex gap-3 sm:w-96">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ASCEND. All rights reserved. Crafted with passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
