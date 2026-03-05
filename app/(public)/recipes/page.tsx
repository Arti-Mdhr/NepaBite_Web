"use client";

import { useEffect, useState } from "react";
import FoodCard from "@/app/(public)/_components/FoodCard";
import { apiFetch, resolveImageUrl } from "@/lib/api";

type Recipe = {
  _id: string;
  title: string;
  image?: string;
  cookTime?: string;
  averageRating?: number;
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 6;

  const fetchRecipes = async (pageNumber: number) => {
    try {
      setLoading(true);

      const data = await apiFetch<{
        success: boolean;
        recipes: Recipe[];
        page: number;
        limit: number;
      }>(`/api/recipes?page=${pageNumber}&limit=${limit}`);

      setRecipes(data.recipes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(page);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
        <p className="text-gray-600 mt-2">
          Explore authentic Nepali recipes.
        </p>

        {loading ? (
          <div className="mt-8 text-gray-600">Loading recipes...</div>
        ) : recipes.length === 0 ? (
          <div className="mt-8 text-gray-600">
            No recipes found.
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recipes.map((r) => (
                <FoodCard
                  key={r._id}
                  id={r._id}
                  name={r.title}
                  time={r.cookTime || "—"}
                  rating={String(r.averageRating ?? "—")}
                  image={resolveImageUrl(r.image)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Previous
              </button>

              <span className="px-4 py-2 font-semibold">
                Page {page}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}