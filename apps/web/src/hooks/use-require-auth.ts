"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

/**
 * Client-side auth guard. While auth is initialising the hook reports
 * `isLoading: true` (render a skeleton). Once initialised, an
 * unauthenticated user is redirected to `/login?redirect=<current path>`
 * so they land back here after signing in.
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    const currentPath = window.location.pathname;
    const redirect = `/login?redirect=${encodeURIComponent(currentPath)}`;
    router.replace(redirect);
  }, [isLoading, isAuthenticated, router]);

  return { isAuthenticated, isLoading };
}
