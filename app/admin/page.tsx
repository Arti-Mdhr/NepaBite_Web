"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { apiFetch } from "@/lib/api";

export default function AdminPage() {
  const [counts, setCounts] = useState({ users: 0, recipes: 0 });
  const [loading, setLoading] = useState(true);
  const username = Cookies.get("username") || "Admin";

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, recipesRes] = await Promise.allSettled([
          apiFetch<any>("/api/admin/users?page=1&limit=1", { auth: true }),
          apiFetch<any>("/api/recipes"),
        ]);

        setCounts({
          users: usersRes.status === "fulfilled" ? (usersRes.value?.totalUsers ?? usersRes.value?.users?.length ?? 0) : 0,
          recipes: recipesRes.status === "fulfilled" ? (recipesRes.value?.totalRecipes ?? recipesRes.value?.recipes?.length ?? 0) : 0,
        });
      } catch (_) {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const stats = [
    { label: "Total Users", value: counts.users, href: "/admin/users", sub: "Registered accounts" },
    { label: "Total Recipes", value: counts.recipes, href: "/admin/recipes", sub: "Published recipes" },
  ];

  const actions = [
    { label: "Manage Users", href: "/admin/users", desc: "View, edit and delete users" },
    { label: "Manage Recipes", href: "/admin/recipes", desc: "Add, edit and remove recipes" },
    { label: "Back to Site", href: "/dashboard", desc: "Return to public dashboard" },
  ];

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1">Overview</p>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Good to see you, {username}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl border border-zinc-100 p-7 hover:border-zinc-300 hover:shadow-sm transition-all group"
          >
            <p className="text-xs text-zinc-400 uppercase tracking-widest mb-3">{s.label}</p>
            <p className="text-5xl font-bold text-zinc-900 mb-1 tabular-nums">
              {loading ? "—" : s.value}
            </p>
            <p className="text-sm text-zinc-400 group-hover:text-zinc-600 transition-colors">{s.sub} →</p>
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-100 mb-8" />

      {/* Quick Actions */}
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">Quick Actions</p>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="bg-white border border-zinc-100 rounded-xl px-5 py-5 hover:bg-zinc-900 hover:border-zinc-900 transition-all group"
          >
            <p className="text-sm font-semibold text-zinc-900 group-hover:text-white mb-1">{a.label}</p>
            <p className="text-xs text-zinc-400 group-hover:text-zinc-300">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}