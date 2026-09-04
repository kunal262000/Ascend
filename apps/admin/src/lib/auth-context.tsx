"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "Iamadmin";

const mockAdminUser: AdminUser = {
  id: "admin-1",
  email: ADMIN_EMAIL,
  full_name: "Admin User",
  is_admin: true,
};

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("ascend_admin");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("ascend_admin");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser(mockAdminUser);
      localStorage.setItem("ascend_admin", JSON.stringify(mockAdminUser));
      localStorage.setItem("ascend_admin_token", "mock_admin_token");
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ascend_admin");
    localStorage.removeItem("ascend_admin_token");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
