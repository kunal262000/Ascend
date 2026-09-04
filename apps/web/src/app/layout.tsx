import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/header";
import { CartSheet } from "@/components/cart-sheet";

export const metadata: Metadata = {
  title: "ASCEND — Premium Streetwear",
  description: "Premium streetwear for the modern man. Oversized tees, cargos, hoodies, and accessories with a minimal, confident aesthetic.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <CartSheet />
          <footer className="border-t py-12 mt-12">
            <div className="container px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold mb-4">Shop</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/products/t-shirts" className="hover:text-foreground">T-Shirts</a></li>
                    <li><a href="/products/hoodies" className="hover:text-foreground">Hoodies</a></li>
                    <li><a href="/products/cargos" className="hover:text-foreground">Cargos</a></li>
                    <li><a href="/products/accessories" className="hover:text-foreground">Accessories</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Help</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/faq" className="hover:text-foreground">FAQ</a></li>
                    <li><a href="/shipping" className="hover:text-foreground">Shipping</a></li>
                    <li><a href="/returns" className="hover:text-foreground">Returns</a></li>
                    <li><a href="/contact" className="hover:text-foreground">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Company</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/about" className="hover:text-foreground">About</a></li>
                    <li><a href="/careers" className="hover:text-foreground">Careers</a></li>
                    <li><a href="/press" className="hover:text-foreground">Press</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Connect</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Instagram</a></li>
                    <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Twitter</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} ASCEND. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
