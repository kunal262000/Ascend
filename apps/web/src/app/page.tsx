import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { products, categories, formatPrice } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { RecentlyViewed } from "@/components/recently-viewed";
import { ArrowRight, Truck, RotateCcw, Shield, Headphones, Sparkles, Zap, Award } from "lucide-react";

export default function HomePage() {
  const featuredProducts = products.slice(0, 8);
  const newArrivals = products.slice(8, 16);

  return (
    <div className="flex flex-col">
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
            alt="Streetwear fashion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>
        
        <div className="relative z-20 container px-4 mx-auto">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-5 py-2 glass-dark text-white/90 text-sm font-semibold rounded-full mb-8 animate-slide-down">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Spring/Summer 2026 Collection
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-6 animate-slide-up">
              RISE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-accent">ABOVE</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed animate-slide-up stagger-1">
              Premium streetwear crafted for those who refuse to blend in. 
              Oversized fits, bold statements, unmatched quality.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up stagger-2">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/30 h-14 px-10 text-base font-bold rounded-full shadow-lg shadow-primary/20" asChild>
                <Link href="/products">Shop Collection</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-base font-semibold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full backdrop-blur-sm" asChild>
                <Link href="/products/hoodies">Explore Hoodies</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center pt-3 backdrop-blur-sm">
            <div className="w-1.5 h-3 bg-gradient-to-b from-primary to-accent rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <section className="py-24 container px-4 mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary tracking-wider uppercase">
              <Zap className="w-4 h-4" /> Curated Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">Shop by Category</h2>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2 font-semibold hover:bg-primary/10" asChild>
            <Link href="/products">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.slice(0, 4).map((category, index) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group relative h-[400px] md:h-[500px] overflow-hidden rounded-3xl animate-fade-in glass-card hover:shadow-2xl transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Image
                src={category.image_url || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/80 text-xs font-semibold mb-3">
                  {index + 1} Collection
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-white/70 text-sm mb-4">{category.description}</p>
                <span className="inline-flex items-center text-white text-sm font-bold bg-gradient-to-r from-primary to-accent px-5 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg shadow-primary/30">
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-secondary/30 via-background to-background">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-primary tracking-wider uppercase">
                <Award className="w-4 h-4" /> Don&apos;t Miss Out
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">Featured Products</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button variant="outline" size="lg" className="px-12 h-14 text-base font-semibold rounded-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="relative h-[600px] rounded-3xl overflow-hidden group glass-card">
            <Image
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800"
              alt="New arrivals"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
              <span className="inline-flex items-center gap-2 text-white/70 text-sm font-bold tracking-wider uppercase mb-4">
                <Sparkles className="w-4 h-4 text-yellow-400" /> Just Dropped
              </span>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-4">New Arrivals</h3>
              <p className="text-white/70 mb-8 max-w-sm text-lg">Fresh styles just landed. Be the first to cop the latest drops.</p>
              <Button className="w-fit bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/30 rounded-full px-8 h-12 font-semibold" asChild>
                <Link href="/products">Shop New In</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative h-[600px] rounded-3xl overflow-hidden group glass-card">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
              alt="Summer collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
              <span className="inline-flex items-center gap-2 text-white/70 text-sm font-bold tracking-wider uppercase mb-4">
                <Award className="w-4 h-4 text-purple-400" /> Limited Edition
              </span>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-4">Graphic Tees</h3>
              <p className="text-white/70 mb-8 max-w-sm text-lg">Statement pieces for those who aren&apos;t afraid to stand out.</p>
              <Button className="w-fit bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-xl hover:shadow-purple-500/30 rounded-full px-8 h-12 font-semibold" asChild>
                <Link href="/products/t-shirts">Explore Graphics</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <RecentlyViewed />

      <section className="py-24 bg-gradient-to-r from-primary via-accent to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
        </div>
        <div className="container px-4 mx-auto text-center relative z-10">
          <span className="text-white/70 text-sm font-bold tracking-wider uppercase mb-4 inline-block">Stay Connected</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Join the ASCEND Community</h2>
          <p className="text-white/80 mb-10 max-w-md mx-auto text-lg">
            Subscribe for exclusive drops, early access, and 10% off your first order.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
            />
            <Button className="bg-white text-primary hover:bg-white/90 px-10 rounded-full font-bold h-14 text-base shadow-xl">
              Subscribe
            </Button>
          </form>
          <p className="text-white/50 text-sm mt-6">By subscribing, you agree to our Privacy Policy</p>
        </div>
      </section>

      <section className="py-20 container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over ₹2000" },
            { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
            { icon: Shield, title: "Secure Payment", desc: "SSL encrypted checkout" },
            { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
          ].map((feature, index) => (
            <div key={index} className="animate-fade-in glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
