import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { products, categories, formatPrice } from "@/lib/data";

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  return (
    <div className="flex flex-col">
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
            alt="Streetwear fashion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </div>
        
        <div className="relative z-20 container px-4 mx-auto">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium mb-6 animate-slide-down">
              Spring/Summer 2026 Collection
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-6 animate-slide-up">
              RISE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">ABOVE</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-md leading-relaxed animate-slide-up stagger-1">
              Premium streetwear crafted for those who refuse to blend in. 
              Oversized fits, bold statements, unmatched quality.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up stagger-2">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 h-12 px-8 text-base font-semibold shadow-lg shadow-white/25" asChild>
                <Link href="/products">Shop Collection</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold border-white/30 text-white hover:bg-white/10 hover:text-white" asChild>
                <Link href="/products/hoodies">Explore Hoodies</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <section className="py-20 container px-4 mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">Curated Selection</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Shop by Category</h2>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2" asChild>
            <Link href="/products">
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group relative h-[400px] md:h-[450px] overflow-hidden rounded-2xl animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Image
                src={
                  category.slug === "t-shirts" ? "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600" :
                  category.slug === "hoodies" ? "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600" :
                  category.slug === "cargos" ? "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600" :
                  "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600"
                }
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{category.name}</h3>
                <p className="text-white/70 text-sm mb-3">{category.description}</p>
                <span className="inline-flex items-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop Now
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Don't Miss Out</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Featured Products</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, index) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[3/4] bg-card rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={product.images[0]?.url || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  {product.compare_at_price && (
                    <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      -{Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-sm font-medium">Quick View</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">{product.category?.name}</span>
                  <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{formatPrice(product.price)}</span>
                    {product.compare_at_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.compare_at_price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="px-8" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="relative h-[500px] rounded-2xl overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800"
              alt="New arrivals"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
              <span className="text-white/70 text-sm font-semibold tracking-wider uppercase mb-3">Just Dropped</span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">New Arrivals</h3>
              <p className="text-white/70 mb-6 max-w-sm">Fresh styles just landed. Be the first to cop the latest drops.</p>
              <Button className="w-fit bg-white text-black hover:bg-white/90" asChild>
                <Link href="/products">Shop New In</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative h-[500px] rounded-2xl overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
              alt="Summer collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
              <span className="text-white/70 text-sm font-semibold tracking-wider uppercase mb-3">Limited Edition</span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Graphic Tees</h3>
              <p className="text-white/70 mb-6 max-w-sm">Statement pieces for those who aren't afraid to stand out.</p>
              <Button className="w-fit bg-white text-black hover:bg-white/90" asChild>
                <Link href="/products/t-shirts">Explore Graphics</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black text-white">
        <div className="container px-4 mx-auto text-center">
          <span className="text-white/50 text-sm font-semibold tracking-wider uppercase">Stay Connected</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Join the ASCEND Community</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Subscribe for exclusive drops, early access, and 10% off your first order.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
            <Button className="bg-white text-black hover:bg-white/90 px-8 rounded-full font-semibold">
              Subscribe
            </Button>
          </form>
          <p className="text-white/40 text-xs mt-4">By subscribing, you agree to our Privacy Policy</p>
        </div>
      </section>

      <section className="py-16 container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On orders over ₹2000" },
            { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
            { icon: "🔒", title: "Secure Payment", desc: "SSL encrypted checkout" },
            { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
          ].map((feature, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <span className="text-3xl mb-3 block">{feature.icon}</span>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
