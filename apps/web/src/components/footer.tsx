import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold tracking-tight">ASCEND</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Premium streetwear for the modern man. Elevated basics with a
              minimal, confident aesthetic.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=tees"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Tees
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=hoodies"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Hoodies
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=cargos"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cargos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-10 border-t border-border pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold">
                Sign up for new drops &amp; offers
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                No spam, just the good stuff.
              </p>
            </div>
            <div className="flex gap-2 sm:w-80">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {currentYear} ASCEND. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
