"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import type { User, AuthResponse } from "@ascend/shared";
import apiClient from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    full_name: string
  ) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Helpers ────────────────────────────────────────────────────

const TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeAuth(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function jwtDecode(token: string): { exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = jwtDecode(token);
  if (!decoded?.exp) return false;
  return Date.now() >= decoded.exp * 1000;
}

// ── Provider ───────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // ── Initialise on mount ──────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      const token = getStoredToken();
      const user = getStoredUser();

      if (!token || !user) {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      // If token is still valid, use cached user
      if (!isTokenExpired(token)) {
        setState({ user, isAuthenticated: true, isLoading: false });
        return;
      }

      // Token expired — try to refresh
      try {
        const { data } = await apiClient.post<AuthResponse>(
          "/api/v1/auth/refresh"
        );
        storeAuth(data.access_token, data.user);
        setState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        clearAuth();
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    init();
  }, []);

  // ── login ────────────────────────────────────────────────────

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await apiClient.post<AuthResponse>(
        "/api/v1/auth/login",
        { email, password }
      );
      storeAuth(data.access_token, data.user);
      setState({ user: data.user, isAuthenticated: true, isLoading: false });
      router.push("/");
    },
    [router]
  );

  // ── register ─────────────────────────────────────────────────

  const register = useCallback(
    async (email: string, password: string, full_name: string) => {
      const { data } = await apiClient.post<AuthResponse>(
        "/api/v1/auth/register",
        { email, password, full_name }
      );
      storeAuth(data.access_token, data.user);
      setState({ user: data.user, isAuthenticated: true, isLoading: false });
      router.push("/");
    },
    [router]
  );

  // ── logout ───────────────────────────────────────────────────

  const logout = useCallback(() => {
    clearAuth();
    setState({ user: null, isAuthenticated: false, isLoading: false });
    router.push("/");
  }, [router]);

  // ── refreshToken ─────────────────────────────────────────────

  const refreshToken = useCallback(async () => {
    const token = getStoredToken();
    if (!token) throw new Error("No token to refresh");

    const { data } = await apiClient.post<AuthResponse>(
      "/api/v1/auth/refresh"
    );
    storeAuth(data.access_token, data.user);
    setState({
      user: data.user,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}

export default AuthContext;
