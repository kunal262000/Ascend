"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <form action="/products" method="GET" className="hidden md:block w-64 lg:w-96">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          placeholder="Search products..."
          className="pl-10 bg-secondary/50"
        />
      </div>
    </form>
  );
}
