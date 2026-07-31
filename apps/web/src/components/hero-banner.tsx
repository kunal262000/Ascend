import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#0a0a0a] px-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#2a2020]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,165,116,0.15),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          ASCEND
        </h1>
        <p className="mt-4 text-lg text-neutral-400 sm:text-xl">
          Premium Streetwear. Elevated Basics.
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Oversized tees, cargos, hoodies, and accessories with a minimal,
          confident aesthetic.
        </p>
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-block rounded-md bg-[#d4a574] px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#c49664]"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
