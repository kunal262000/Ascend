// API Response Types

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiError {
  detail: string;
  code?: string;
}

// User
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// Category
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

// Product
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  cost_price?: number;
  sku: string;
  is_active: boolean;
  category_id?: string;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color?: string;
  sku: string;
  price_adjustment: number;
  stock: number;
  is_active: boolean;
}

// Cart
export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}

// Order
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  discount: number;
  total: number;
  coupon_code?: string;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
  payment?: Payment;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Product;
}

export interface Payment {
  id: string;
  order_id: string;
  method: string;
  status: string;
  transaction_id?: string;
  amount: number;
  created_at: string;
}

// Address
export interface Address {
  id: string;
  user_id: string;
  type: "shipping" | "billing";
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

// Wishlist
export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  created_at: string;
}

// Review
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title?: string;
  body?: string;
  is_approved: boolean;
  user?: Pick<User, "id" | "full_name" | "avatar_url">;
  created_at: string;
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
