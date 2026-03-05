"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Role = "admin" | "user";

interface AuthUser {
  id?: string;
  fullName?: string;
  email?: string;
  role?: Role;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: AuthUser | null;
  role: Role | null;
  loading: boolean;
  setUser: (u: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const cookieRole = (Cookies.get("role") || "") as Role;
    const userId = Cookies.get("userId");
    const username = Cookies.get("username");

    if (token) {
      setIsAuthenticated(true);
      setRole(cookieRole || "user");
      setUser({
        id: userId || undefined,
        fullName: username || undefined,
        role: cookieRole || "user",
      });
    }

    setLoading(false);
  }, []);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("userId");
    Cookies.remove("username");

    setIsAuthenticated(false);
    setRole(null);
    setUser(null);

    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};