import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">ASCEND</h1>
        <p className="text-xl text-muted-foreground">
          Premium streetwear for the modern man. Oversized tees, cargos, hoodies, and accessories
          with a minimal, confident aesthetic.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Shop Now</Button>
          <Button variant="outline" size="lg">
            View Lookbook
          </Button>
        </div>
      </div>
    </main>
  );
}
