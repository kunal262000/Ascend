import axios from "axios";
import type {
  Product,
  Category,
  PaginatedResponse,
} from "@ascend/shared";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// ── Product API ──────────────────────────────────────────────

export interface ProductListParams {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductDetailResponse extends Product {
  category?: Category;
}

export async function fetchProducts(
  params: ProductListParams = {}
): Promise<ProductListResponse> {
  const { data } = await apiClient.get<ProductListResponse>(
    "/api/v1/products",
    { params }
  );
  return data;
}

export async function fetchProductBySlug(
  slug: string
): Promise<ProductDetailResponse> {
  const { data } = await apiClient.get<ProductDetailResponse>(
    `/api/v1/products/${slug}`
  );
  return data;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>(
    "/api/v1/products/categories"
  );
  return data;
}

// ── Auth API (placeholder) ────────────────────────────────────

export async function login(email: string, password: string) {
  const { data } = await apiClient.post("/api/v1/auth/login", {
    email,
    password,
  });
  if (data.access_token && typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
  }
  return data;
}

export async function register(payload: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}) {
  const { data } = await apiClient.post("/api/v1/auth/register", payload);
  if (data.access_token && typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
  }
  return data;
}
