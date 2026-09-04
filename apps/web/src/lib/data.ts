import { Product, Category } from "@ascend/shared";

export const categories: Category[] = [
  { id: "1", name: "T-Shirts", slug: "t-shirts", description: "Premium oversized tees" },
  { id: "2", name: "Hoodies", slug: "hoodies", description: "Comfortable hoodies" },
  { id: "3", name: "Cargos", slug: "cargos", description: "Streetwear cargos" },
  { id: "4", name: "Accessories", slug: "accessories", description: "Complete your look" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Essential Oversized Tee",
    slug: "essential-oversized-tee",
    description: "Premium cotton oversized t-shirt with a relaxed fit. Features dropped shoulders and a longer body length for that perfect streetwear look.",
    price: 2499,
    compare_at_price: 2999,
    sku: "ASC-TS-001",
    is_active: true,
    category_id: "1",
    category: categories[0],
    images: [
      { id: "1", product_id: "1", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", alt_text: "Essential Oversized Tee", sort_order: 0, is_primary: true },
      { id: "2", product_id: "1", url: "https://images.unsplash.com/photo-1622445275576-721325763afe?w=600", alt_text: "Essential Oversized Tee Back", sort_order: 1, is_primary: false },
    ],
    variants: [
      { id: "1", product_id: "1", size: "S", color: "Black", sku: "ASC-TS-001-BK-S", price_adjustment: 0, stock: 10, is_active: true },
      { id: "2", product_id: "1", size: "M", color: "Black", sku: "ASC-TS-001-BK-M", price_adjustment: 0, stock: 15, is_active: true },
      { id: "3", product_id: "1", size: "L", color: "Black", sku: "ASC-TS-001-BK-L", price_adjustment: 0, stock: 12, is_active: true },
      { id: "4", product_id: "1", size: "XL", color: "Black", sku: "ASC-TS-001-BK-XL", price_adjustment: 0, stock: 8, is_active: true },
      { id: "5", product_id: "1", size: "S", color: "White", sku: "ASC-TS-001-WH-S", price_adjustment: 0, stock: 10, is_active: true },
      { id: "6", product_id: "1", size: "M", color: "White", sku: "ASC-TS-001-WH-M", price_adjustment: 0, stock: 14, is_active: true },
      { id: "7", product_id: "1", size: "L", color: "White", sku: "ASC-TS-001-WH-L", price_adjustment: 0, stock: 11, is_active: true },
      { id: "8", product_id: "1", size: "XL", color: "White", sku: "ASC-TS-001-WH-XL", price_adjustment: 0, stock: 7, is_active: true },
      { id: "9", product_id: "1", size: "S", color: "Grey", sku: "ASC-TS-001-GY-S", price_adjustment: 0, stock: 9, is_active: true },
      { id: "10", product_id: "1", size: "M", color: "Grey", sku: "ASC-TS-001-GY-M", price_adjustment: 0, stock: 13, is_active: true },
      { id: "11", product_id: "1", size: "L", color: "Grey", sku: "ASC-TS-001-GY-L", price_adjustment: 0, stock: 10, is_active: true },
      { id: "12", product_id: "1", size: "XL", color: "Grey", sku: "ASC-TS-001-GY-XL", price_adjustment: 0, stock: 6, is_active: true },
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Heavyweight Hoodie",
    slug: "heavyweight-hoodie",
    description: "Ultra-premium 450gsm cotton fleece hoodie. Features a double-layered hood, kangaroo pocket, and ribbed cuffs. The ultimate streetwear essential.",
    price: 4999,
    compare_at_price: 5999,
    sku: "ASC-HD-001",
    is_active: true,
    category_id: "2",
    category: categories[1],
    images: [
      { id: "3", product_id: "2", url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600", alt_text: "Heavyweight Hoodie", sort_order: 0, is_primary: true },
      { id: "4", product_id: "2", url: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600", alt_text: "Heavyweight Hoodie Back", sort_order: 1, is_primary: false },
    ],
    variants: [
      { id: "13", product_id: "2", size: "S", color: "Black", sku: "ASC-HD-001-BK-S", price_adjustment: 0, stock: 8, is_active: true },
      { id: "14", product_id: "2", size: "M", color: "Black", sku: "ASC-HD-001-BK-M", price_adjustment: 0, stock: 12, is_active: true },
      { id: "15", product_id: "2", size: "L", color: "Black", sku: "ASC-HD-001-BK-L", price_adjustment: 0, stock: 10, is_active: true },
      { id: "16", product_id: "2", size: "XL", color: "Black", sku: "ASC-HD-001-BK-XL", price_adjustment: 0, stock: 6, is_active: true },
      { id: "17", product_id: "2", size: "S", color: "Charcoal", sku: "ASC-HD-001-CH-S", price_adjustment: 0, stock: 7, is_active: true },
      { id: "18", product_id: "2", size: "M", color: "Charcoal", sku: "ASC-HD-001-CH-M", price_adjustment: 0, stock: 11, is_active: true },
      { id: "19", product_id: "2", size: "L", color: "Charcoal", sku: "ASC-HD-001-CH-L", price_adjustment: 0, stock: 9, is_active: true },
      { id: "20", product_id: "2", size: "XL", color: "Charcoal", sku: "ASC-HD-001-CH-XL", price_adjustment: 0, stock: 5, is_active: true },
    ],
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "Cargo pants",
    slug: "cargo-pants",
    description: "Technical cargo pants with 8 pockets. Made from water-resistant nylon blend with articulated knees for maximum mobility.",
    price: 3999,
    compare_at_price: 4499,
    sku: "ASC-CG-001",
    is_active: true,
    category_id: "3",
    category: categories[2],
    images: [
      { id: "5", product_id: "3", url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600", alt_text: "Cargo Pants", sort_order: 0, is_primary: true },
      { id: "6", product_id: "3", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600", alt_text: "Cargo Pants Detail", sort_order: 1, is_primary: false },
    ],
    variants: [
      { id: "21", product_id: "3", size: "30", color: "Black", sku: "ASC-CG-001-BK-30", price_adjustment: 0, stock: 6, is_active: true },
      { id: "22", product_id: "3", size: "32", color: "Black", sku: "ASC-CG-001-BK-32", price_adjustment: 0, stock: 10, is_active: true },
      { id: "23", product_id: "3", size: "34", color: "Black", sku: "ASC-CG-001-BK-34", price_adjustment: 0, stock: 8, is_active: true },
      { id: "24", product_id: "3", size: "36", color: "Black", sku: "ASC-CG-001-BK-36", price_adjustment: 0, stock: 5, is_active: true },
      { id: "25", product_id: "3", size: "30", color: "Olive", sku: "ASC-CG-001-OL-30", price_adjustment: 0, stock: 7, is_active: true },
      { id: "26", product_id: "3", size: "32", color: "Olive", sku: "ASC-CG-001-OL-32", price_adjustment: 0, stock: 9, is_active: true },
      { id: "27", product_id: "3", size: "34", color: "Olive", sku: "ASC-CG-001-OL-34", price_adjustment: 0, stock: 6, is_active: true },
      { id: "28", product_id: "3", size: "36", color: "Olive", sku: "ASC-CG-001-OL-36", price_adjustment: 0, stock: 4, is_active: true },
    ],
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
  {
    id: "4",
    name: "Logo Cap",
    slug: "logo-cap",
    description: "Premium 6-panel structured cap with embroidered logo. Adjustable strap with metal buckle.",
    price: 1299,
    compare_at_price: 1499,
    sku: "ASC-AC-001",
    is_active: true,
    category_id: "4",
    category: categories[3],
    images: [
      { id: "7", product_id: "4", url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600", alt_text: "Logo Cap", sort_order: 0, is_primary: true },
    ],
    variants: [
      { id: "29", product_id: "4", size: "One Size", color: "Black", sku: "ASC-AC-001-BK-OS", price_adjustment: 0, stock: 20, is_active: true },
      { id: "30", product_id: "4", size: "One Size", color: "White", sku: "ASC-AC-001-WH-OS", price_adjustment: 0, stock: 18, is_active: true },
      { id: "31", product_id: "4", size: "One Size", color: "Navy", sku: "ASC-AC-001-NV-OS", price_adjustment: 0, stock: 15, is_active: true },
    ],
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
  },
  {
    id: "5",
    name: "Graphic Print Tee",
    slug: "graphic-print-tee",
    description: "Oversized t-shirt with high-quality screen print graphics. 100% organic cotton with a relaxed drop-shoulder fit.",
    price: 2799,
    compare_at_price: 3299,
    sku: "ASC-TS-002",
    is_active: true,
    category_id: "1",
    category: categories[0],
    images: [
      { id: "8", product_id: "5", url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600", alt_text: "Graphic Print Tee", sort_order: 0, is_primary: true },
    ],
    variants: [
      { id: "32", product_id: "5", size: "S", color: "Black", sku: "ASC-TS-002-BK-S", price_adjustment: 0, stock: 8, is_active: true },
      { id: "33", product_id: "5", size: "M", color: "Black", sku: "ASC-TS-002-BK-M", price_adjustment: 0, stock: 12, is_active: true },
      { id: "34", product_id: "5", size: "L", color: "Black", sku: "ASC-TS-002-BK-L", price_adjustment: 0, stock: 10, is_active: true },
      { id: "35", product_id: "5", size: "XL", color: "Black", sku: "ASC-TS-002-BK-XL", price_adjustment: 0, stock: 6, is_active: true },
    ],
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "6",
    name: "Zip-Up Hoodie",
    slug: "zip-up-hoodie",
    description: "Full-zip heavyweight hoodie with side pockets. Perfect for layering in any season.",
    price: 5499,
    compare_at_price: 6499,
    sku: "ASC-HD-002",
    is_active: true,
    category_id: "2",
    category: categories[1],
    images: [
      { id: "9", product_id: "6", url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600", alt_text: "Zip-Up Hoodie", sort_order: 0, is_primary: true },
    ],
    variants: [
      { id: "36", product_id: "6", size: "S", color: "Black", sku: "ASC-HD-002-BK-S", price_adjustment: 0, stock: 5, is_active: true },
      { id: "37", product_id: "6", size: "M", color: "Black", sku: "ASC-HD-002-BK-M", price_adjustment: 0, stock: 8, is_active: true },
      { id: "38", product_id: "6", size: "L", color: "Black", sku: "ASC-HD-002-BK-L", price_adjustment: 0, stock: 7, is_active: true },
      { id: "39", product_id: "6", size: "XL", color: "Black", sku: "ASC-HD-002-BK-XL", price_adjustment: 0, stock: 4, is_active: true },
    ],
    created_at: "2024-01-06T00:00:00Z",
    updated_at: "2024-01-06T00:00:00Z",
  },
  {
    id: "7",
    name: "Tech Cargo Shorts",
    slug: "tech-cargo-shorts",
    description: "Above-knee length cargo shorts with 6 pockets. Quick-dry nylon blend material.",
    price: 2499,
    compare_at_price: 2999,
    sku: "ASC-CG-002",
    is_active: true,
    category_id: "3",
    category: categories[2],
    images: [
      { id: "10", product_id: "7", url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600", alt_text: "Tech Cargo Shorts", sort_order: 0, is_primary: true },
    ],
    variants: [
      { id: "40", product_id: "7", size: "30", color: "Black", sku: "ASC-CG-002-BK-30", price_adjustment: 0, stock: 10, is_active: true },
      { id: "41", product_id: "7", size: "32", color: "Black", sku: "ASC-CG-002-BK-32", price_adjustment: 0, stock: 12, is_active: true },
      { id: "42", product_id: "7", size: "34", color: "Black", sku: "ASC-CG-002-BK-34", price_adjustment: 0, stock: 8, is_active: true },
      { id: "43", product_id: "7", size: "36", color: "Black", sku: "ASC-CG-002-BK-36", price_adjustment: 0, stock: 5, is_active: true },
    ],
    created_at: "2024-01-07T00:00:00Z",
    updated_at: "2024-01-07T00:00:00Z",
  },
  {
    id: "8",
    name: "Crossbody Bag",
    slug: "crossbody-bag",
    description: "Compact crossbody bag with adjustable strap. Multiple compartments for essentials.",
    price: 1999,
    compare_at_price: 2499,
    sku: "ASC-AC-002",
    is_active: true,
    category_id: "4",
    category: categories[3],
    images: [
      { id: "11", product_id: "8", url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600", alt_text: "Crossbody Bag", sort_order: 0, is_primary: true },
    ],
    variants: [
      { id: "44", product_id: "8", size: "One Size", color: "Black", sku: "ASC-AC-002-BK-OS", price_adjustment: 0, stock: 15, is_active: true },
      { id: "45", product_id: "8", size: "One Size", color: "Tan", sku: "ASC-AC-002-TN-OS", price_adjustment: 0, stock: 12, is_active: true },
    ],
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-08T00:00:00Z",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category?.slug === categorySlug);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.category?.name.toLowerCase().includes(lowerQuery)
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(price);
}
