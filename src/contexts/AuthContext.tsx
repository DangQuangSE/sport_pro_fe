"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient, ApiResponse } from "@/lib/api-client";
import { authService, UserMe } from "@/services/authService";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserMe | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserMe | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const clearCookies = () => {
    if (typeof window !== "undefined") {
      document.cookie = "is_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    }
  };

  const fetchUser = async () => {
    try {
      const response = await authService.getMe();
      setUser(response.data);
      setIsLoggedIn(true);
      if (typeof window !== "undefined") {
        document.cookie = `is_logged_in=true; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `user_role=${response.data.role}; path=/; max-age=86400; SameSite=Lax`;
      }
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
      clearCookies();
    }
  };

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // Attempt to refresh token silently on load
      const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/auth/refresh-token`;
      const response = await fetch(refreshUrl, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json() as ApiResponse<{ accessToken: string }>;
        apiClient.setAccessToken(data.data.accessToken);
        await fetchUser();
      } else {
        setIsLoggedIn(false);
        setUser(null);
        clearCookies();
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      clearCookies();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for unauthorized events from api-client to force logout
    const handleUnauthorized = () => {
      setUser(null);
      setIsLoggedIn(false);
      clearCookies();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:unauthorized", handleUnauthorized);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:unauthorized", handleUnauthorized);
      }
    };
  }, []);

  const login = async (accessToken: string) => {
    apiClient.setAccessToken(accessToken);
    await fetchUser();
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      apiClient.setAccessToken(null);
      setUser(null);
      setIsLoggedIn(false);
      clearCookies();
      setIsLoading(false);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
