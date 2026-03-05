"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ProtectedRoute from "@/app/_components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(Cookies.get("username") || "Admin");
  }, []);

const exitAdmin = () => {
  // Remove cookies with explicit path
  Cookies.remove("token", { path: "/" });
  Cookies.remove("username", { path: "/" });
  Cookies.remove("role", { path: "/" });
  Cookies.remove("userId", { path: "/" });

  // Force full reload to clear React state
  window.location.href = "/login";
};
  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
        </svg>
      ),
    },
    {
      name: "Recipes",
      href: "/admin/recipes",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 1 0 10 10" />
          <path d="M12 6v6l4 2" />
          <path d="M18 2v4h4" />
          <path d="M22 2l-4 4" />
        </svg>
      ),
    },
  ];

  return (
    <ProtectedRoute requireAdmin>
      <div
        className="min-h-screen bg-[#f8f8f6] flex"
        style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
      >

        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-zinc-100 flex flex-col fixed h-full z-20">

          {/* Logo */}
          <div className="px-6 py-6 border-b border-zinc-100">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                <span className="text-white text-xs font-bold tracking-tight">NB</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900 leading-none">
                  NepaBite
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5 tracking-wide uppercase">
                  Admin
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-zinc-900 text-white font-medium"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-zinc-400"}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Footer */}
          <div className="px-3 py-4 border-t border-zinc-100">

            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-semibold">
                {username.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <div className="text-xs font-medium text-zinc-900 truncate">
                  {username}
                </div>
                <div className="text-[10px] text-zinc-400">
                  Administrator
                </div>
              </div>
            </div>

            {/* Exit Admin */}
            <button
              onClick={exitAdmin}
              className="flex items-center gap-2 px-3 py-2.5 w-full rounded-lg text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>

              Exit to Site
            </button>

          </div>

        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-56 min-h-screen">
          {children}
        </main>

      </div>
    </ProtectedRoute>
  );
}