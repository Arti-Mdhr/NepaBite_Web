"use client";

import { useEffect, useState } from "react";
import { apiFetch, resolveImageUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

type Recipe = {
  _id: string;
  title: string;
  image?: string;
  description?: string;
};

export default function SavedRecipesPage() {
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // FETCH SAVED RECIPES
  // ===============================
  const fetchSavedRecipes = async () => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const data = await apiFetch<any>("/api/saved-recipes", {
        auth: true,
      });

      const saved =
        data?.savedRecipes ||
        data?.recipes ||
        data?.data ||
        [];

      setRecipes(Array.isArray(saved) ? saved : []);
    } catch (err: any) {
      console.error("Failed to load saved recipes:", err);
      setError(err.message || "Failed to load saved recipes");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // REMOVE SAVED RECIPE
  // ===============================
  const removeSavedRecipe = async (recipeId: string) => {
    try {
      await apiFetch(`/api/saved-recipes/remove/${recipeId}`, {
        method: "DELETE",
        auth: true,
      });

      setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
    } catch (err) {
      console.error("Failed to remove recipe:", err);
      alert("Failed to remove recipe");
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchSavedRecipes();
  }, []);

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading saved recipes...</p>
      </div>
    );
  }

  // ===============================
  // ERROR STATE
  // ===============================
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Saved Recipes
      </h1>

      {recipes.length === 0 ? (
        <p className="mt-6 text-gray-600">
          No saved recipes yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <Link href={`/recipes/${recipe._id}`}>
                <img
                  src={
                    recipe.image
                      ? resolveImageUrl(recipe.image)
                      : "/images/img1.jpg"
                  }
                  alt={recipe.title}
                  className="w-full h-44 object-cover"
                />
              </Link>

              <div className="p-4">
                <Link href={`/recipes/${recipe._id}`}>
                  <h2 className="text-lg font-semibold text-gray-900 hover:text-green-600">
                    {recipe.title}
                  </h2>
                </Link>

                {recipe.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {recipe.description}
                  </p>
                )}

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => removeSavedRecipe(recipe._id)}
                  className="mt-4 w-full bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}