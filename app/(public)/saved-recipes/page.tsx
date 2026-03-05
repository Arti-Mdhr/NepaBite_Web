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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          Loading saved recipes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="text-3xl font-bold text-black">
          Saved Recipes
        </h1>

        {recipes.length === 0 ? (

          <div className="mt-10 text-center">
            <p className="text-gray-600">
              You haven't saved any recipes yet.
            </p>

            <Link
              href="/recipes"
              className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Browse Recipes
            </Link>
          </div>

        ) : (

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {recipes.map((recipe) => (

              <div
                key={recipe._id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition"
              >

                <Link href={`/recipes/${recipe._id}`}>
                  <img
                    src={
                      recipe.image
                        ? resolveImageUrl(recipe.image)
                        : "/images/img1.jpg"
                    }
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>

                <div className="p-5">

                  <Link href={`/recipes/${recipe._id}`}>
                    <h2 className="text-lg font-semibold text-black hover:text-green-600">
                      {recipe.title}
                    </h2>
                  </Link>

                  {recipe.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {recipe.description}
                    </p>
                  )}

                  <button
                    onClick={() => removeSavedRecipe(recipe._id)}
                    className="mt-5 w-full border border-red-300 text-red-600 py-2 rounded-lg hover:bg-red-50 transition"
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}