"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const [token, setToken] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [cartCount, setCartCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const refreshUsername = () => {
    const u = Cookies.get("username");
    setUsername(u);
  };

  useEffect(() => {
    const t = Cookies.get("token");
    const u = Cookies.get("username");
    setToken(t);
    setUsername(u);
    setMounted(true);

    if (!t) return;

    const loadCounts = async () => {
      try {
        const cartRes: any = await apiFetch("/api/cart", { auth: true });
        const items =
          cartRes?.items ?? cartRes?.cart?.items ?? cartRes?.cartItems ?? [];
        setCartCount(Array.isArray(items) ? items.length : 0);

        const savedRes: any = await apiFetch("/api/saved-recipes", { auth: true });
        const saved =
          savedRes?.savedRecipes ?? savedRes?.recipes ?? savedRes?.data ?? [];
        setSavedCount(Array.isArray(saved) ? saved.length : 0);
      } catch (error) {
        console.error("Header count load failed:", error);
      }
    };

    loadCounts();

    window.addEventListener("username-updated", refreshUsername);
    return () => window.removeEventListener("username-updated", refreshUsername);
  }, []);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("role");
    Cookies.remove("userId");
    window.location.href = "/dashboard";
  };

  if (!mounted) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="w-full px-12 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
            Nepa<span className="text-green-600">Bite</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition">Home</Link>
            <Link href="/recipes" className="text-gray-700 hover:text-green-600 transition">Recipes</Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="w-full px-12 py-4 flex items-center justify-between">

        <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
          Nepa<span className="text-green-600">Bite</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">

          <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition">
            Home
          </Link>

          <Link href="/recipes" className="text-gray-700 hover:text-green-600 transition">
            Recipes
          </Link>

          {token && (
            <Link
              href="/saved-recipes"
              className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
            >
              Saved
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                {savedCount}
              </span>
            </Link>
          )}

          {token && (
            <Link
              href="/cart"
              className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
            >
              Cart
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                {cartCount}
              </span>
            </Link>
          )}

          {token && (
            <Link href="/user/profile" className="text-gray-700 hover:text-green-600 transition">
              Profile
            </Link>
          )}

          {token ? (
            <>
              <span className="text-gray-700 font-medium">Hello {username}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            !isAuthPage && (
              <Link
                href="/login"
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Login
              </Link>
            )
          )}

        </nav>
      </div>
    </header>
  );
}