import apiClient from "./api-client";
import type {
  Product,
  Category,
  AuthResponse,
  User,
} from "@ascend/shared";

// ── Auth API ───────────────────────────────────────────────────

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      "/api/v1/auth/login",
      { email, password }
    );
    return data;
  },

  async register(payload: {
    email: string;
    password: string;
    full_name: string;
  }): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      "/api/v1/auth/register",
      payload
    );
    return data;
  },

  async refresh(): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      "/api/v1/auth/refresh"
    );
    return data;
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>("/api/v1/auth/me");
    return data;
  },
};

// ── Response interceptor for 401 → refresh → retry ─────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 and not already retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh if the failing request was itself a refresh call
    if (originalRequest.url === "/api/v1/auth/refresh") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("auth_user");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await apiClient.post<AuthResponse>(
        "/api/v1/auth/refresh"
      );
      const newToken = data.access_token;

      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", newToken);
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }

      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("auth_user");
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// ── Product API ────────────────────────────────────────────────

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

export default apiClient;
