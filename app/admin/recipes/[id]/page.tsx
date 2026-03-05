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

  const fetchRecipes = async () => {
    try {
      setLoading(true);

      const data = await apiFetch<{
        success: boolean;
        recipes: Recipe[];
      }>("/api/recipes");

      setRecipes(data.recipes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this recipe?");
    if (!confirmDelete) return;

    try {
      await apiFetch(`/api/admin/recipes/${id}`, {
        method: "DELETE",
        auth: true,
      });

      fetchRecipes();
    } catch (e: any) {
      alert(e.message || "Failed to delete recipe");
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Recipes
            </h1>

            <Link
              href="/admin/recipes/create"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Create Recipe
            </Link>
          </div>

          {loading ? (
            <div className="mt-8">Loading recipes...</div>
          ) : recipes.length === 0 ? (
            <div className="mt-8 text-gray-600">
              No recipes found.
            </div>
          ) : (
            <div className="mt-8 bg-white rounded-2xl shadow-md overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {recipes.map((r) => (
                    <tr key={r._id} className="border-t">
                      <td className="p-4">
                        {r.image && (
                          <img
                            src={resolveImageUrl(r.image)}
                            className="w-20 h-16 object-cover rounded-lg"
                            alt={r.title}
                          />
                        )}
                      </td>

                      <td className="p-4 font-medium">
                        {r.title}
                      </td>

                      <td className="p-4">
                        {r.category || "—"}
                      </td>

                      <td className="p-4">
                        {r.averageRating
                          ? `⭐ ${r.averageRating.toFixed(1)}`
                          : "—"}
                      </td>

                      <td className="p-4 text-right space-x-4">
                        {/* ✅ FIXED: View now goes to admin route */}
                        <Link
                          href={`/admin/recipes/${r._id}`}
                          className="text-green-600 hover:underline"
                        >
                          View
                        </Link>

                        {/* ✅ Correct edit route */}
                        <Link
                          href={`/admin/recipes/edit/${r._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}