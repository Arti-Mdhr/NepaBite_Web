"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    try {
      // Check if user is logged in (you can get this from cookies or localStorage)
      const token = Cookies.get("token");
      const userRole = (Cookies.get("role") || "").toLowerCase();

      if (!token) {
        // Not logged in, redirect to login
        router.push("/login");
        return;
      }

      if (requireAdmin && userRole !== "admin") {
        // Logged in but not admin, redirect to dashboard
        router.push("/dashboard");
        return;
      }

      // User is authorized
      setIsAuthorized(true);
    } catch (error) {
      console.error("Authorization error:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}