"use client";

import { useEffect, useState } from "react";
import { apiFetch, resolveImageUrl } from "@/lib/api";
import Link from "next/link";
import ProtectedRoute from "@/app/_components/ProtectedRoute";

type Recipe = {
  _id: string;
  title: string;
  image?: string;
  category?: string;
  averageRating?: number;
};

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<{ success: boolean; recipes: Recipe[] }>("/api/recipes");
      setRecipes(data.recipes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipes(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this recipe? This cannot be undone.")) return;
    try {
      await apiFetch(`/api/admin/recipes/${id}`, { method: "DELETE", auth: true });
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (e: any) {
      alert(e.message || "Failed to delete recipe");
    }
  };

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute requireAdmin>
      <div className="p-10 text-black">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1">Content</p>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Recipes</h1>
          </div>
          <Link
            href="/admin/recipes/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-700 transition-colors"
          >
            <span className="text-base leading-none">+</span> New Recipe
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-400"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[64px_1fr_160px_100px_120px] gap-4 px-6 py-3 border-b border-zinc-100 bg-zinc-50">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Image</div>
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Title</div>
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Category</div>
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Rating</div>
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-zinc-400">Loading recipes...</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-zinc-400">No recipes found.</div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {filtered.map((r) => (
                <div
                  key={r._id}
                  className="grid grid-cols-[64px_1fr_160px_100px_120px] gap-4 px-6 py-4 items-center hover:bg-zinc-50/60 transition-colors"
                >
                  {/* Image */}
                  <div className="w-14 h-11 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                    {r.image ? (
                      <img
                        src={resolveImageUrl(r.image)}
                        className="w-full h-full object-cover"
                        alt={r.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs">—</div>
                    )}
                  </div>

                  {/* Title */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{r.title}</p>
                    <p className="text-xs text-zinc-400 mt-0.5 font-mono truncate">{r._id}</p>
                  </div>

                  {/* Category */}
                  <div>
                    {r.category ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-100 text-xs font-medium text-zinc-600">
                        {r.category}
                      </span>
                    ) : (
                      <span className="text-zinc-300 text-sm">—</span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="text-sm text-zinc-600">
                    {r.averageRating ? (
                      <span className="flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        {r.averageRating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/recipes/edit/${r._id}`}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer count */}
          {!loading && (
            <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50">
              <p className="text-xs text-zinc-400">{filtered.length} recipe{filtered.length !== 1 ? "s" : ""}</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}