import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { products, categories, formatPrice } from "@/lib/data";

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col">
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600"
          alt="Streetwear fashion"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center text-white max-w-3xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            RISE ABOVE
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            Premium streetwear for those who refuse to blend in. Oversized fits, 
            bold designs, unmatched quality.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-white/90" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
              <Link href="/products/hoodies">View Collection</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 container px-4">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group relative h-48 md:h-64 overflow-hidden rounded-lg"
            >
              <Image
                src={
                  category.slug === "t-shirts" ? "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" :
                  category.slug === "hoodies" ? "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" :
                  category.slug === "cargos" ? "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400" :
                  "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400"
                }
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg md:text-xl font-bold">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button variant="outline" asChild>
              <Link href="/products">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group">
                <div className="relative aspect-[3/4] bg-card rounded-lg overflow-hidden mb-3">
                  <Image
                    src={product.images[0]?.url || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.compare_at_price && (
                    <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                      Sale
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold">{formatPrice(product.price)}</span>
                  {product.compare_at_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 container px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800"
              alt="New arrivals"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">New Arrivals</h3>
                <Button className="bg-white text-black hover:bg-white/90" asChild>
                  <Link href="/products">Shop Now</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
              alt="Summer collection"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Summer Essentials</h3>
                <Button className="bg-white text-black hover:bg-white/90" asChild>
                  <Link href="/products/t-shirts">Explore</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black text-white">
        <div className="container px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join the ASCEND Community</h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Sign up for exclusive drops, early access, and 10% off your first order.
          </p>
          <form className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-black hover:bg-white/90">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
