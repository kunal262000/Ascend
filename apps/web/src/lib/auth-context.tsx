"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@ascend/shared";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: "1",
  email: "alex@example.com",
  full_name: "Alex Morgan",
  phone: "+91 9876543210",
  is_admin: false,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("ascend_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("ascend_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (email && password) {
      setUser(mockUser);
      localStorage.setItem("ascend_user", JSON.stringify(mockUser));
      localStorage.setItem("access_token", "mock_token");
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const register = async (data: { email: string; password: string; full_name: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      full_name: data.full_name,
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("ascend_user", JSON.stringify(newUser));
    localStorage.setItem("access_token", "mock_token");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ascend_user");
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
