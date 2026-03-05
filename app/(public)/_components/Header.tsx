"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Cookies from "js-cookie";

export default function Header() {
  const token = Cookies.get("token");
  const username = Cookies.get("username");

  const [cartCount, setCartCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("role");
    Cookies.remove("userId");

    window.location.href = "/dashboard";
  };

  useEffect(() => {
    if (!token) return;

    const loadCounts = async () => {
      try {
        // =========================
        // CART COUNT
        // =========================
        const cartRes: any = await apiFetch("/api/cart", { auth: true });

        const items =
          cartRes?.items ||
          cartRes?.cart?.items ||
          cartRes?.cartItems ||
          [];

        setCartCount(Array.isArray(items) ? items.length : 0);

        // =========================
        // SAVED RECIPES COUNT
        // =========================
        const savedRes: any = await apiFetch("/api/saved-recipes", {
          auth: true,
        });

        const saved =
          savedRes?.savedRecipes ||
          savedRes?.recipes ||
          savedRes?.data ||
          [];

        setSavedCount(Array.isArray(saved) ? saved.length : 0);
      } catch (error) {
        console.error("Header count load failed:", error);
      }
    };

    loadCounts();
  }, [token]);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/dashboard" className="font-bold text-xl text-gray-900">
          NepaBite
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-gray-900"
          >
            Dashboard
          </Link>

          {/* Recipes */}
          <Link
            href="/recipes"
            className="text-gray-700 hover:text-gray-900"
          >
            Recipes
          </Link>

          {/* Saved Recipes */}
          {token && (
            <Link
              href="/saved-recipes"
              className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
            >
              Saved
              <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                {savedCount}
              </span>
            </Link>
          )}

          {/* Cart */}
          {token && (
            <Link
              href="/cart"
              className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
            >
              Cart
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">
                {cartCount}
              </span>
            </Link>
          )}

          {/* Profile */}
          {token && (
            <Link
              href="/user/profile"
              className="text-gray-700 hover:text-gray-900"
            >
              Profile
            </Link>
          )}

          {/* Login / Logout */}
          {token ? (
            <>
              <span className="text-gray-700 font-medium">
                Hello {username}
              </span>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}