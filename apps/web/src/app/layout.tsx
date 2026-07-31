import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASCEND — Premium Streetwear",
  description: "Premium streetwear for the modern man. Oversized tees, cargos, hoodies, and accessories with a minimal, confident aesthetic.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">{children}</body>
    </html>
  );
}
