"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch, resolveImageUrl } from "@/lib/api";
import Link from "next/link";
import Cookies from "js-cookie";

type Ingredient = {
  name: string;
  quantity?: string;
};

type Review = {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type Recipe = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  ingredients: Ingredient[];
  instructions?: string[];
  reviews?: Review[];
  averageRating?: number;
};

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const currentUserId = Cookies.get("userId");
  const currentRole = Cookies.get("role");

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchRecipe = async () => {
    try {
      setError("");
      const data = await apiFetch<{ recipe: Recipe }>(`/api/recipes/${id}`);
      setRecipe(data.recipe);
    } catch (e: any) {
      setError(e.message || "Failed to load recipe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  if (loading) return <div className="p-10">Loading recipe...</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;
  if (!recipe) return <div className="p-10">Recipe not found.</div>;

  return (
    <div className="min-h-screen bg-white text-black">

      <div className="max-w-6xl mx-auto px-6 py-12">

        <Link
          href="/recipes"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to recipes
        </Link>

        {/* MAIN GRID */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT SIDE */}
          <div>

            {recipe.image && (
              <img
                src={resolveImageUrl(recipe.image)}
                alt={recipe.title}
                className="rounded-2xl w-full h-96 object-cover shadow-md"
              />
            )}

            <h1 className="mt-6 text-4xl font-bold">
              {recipe.title}
            </h1>

            {recipe.averageRating !== undefined && (
              <p className="mt-2 text-yellow-600 font-medium">
                ⭐ {recipe.averageRating.toFixed(1)} / 5
              </p>
            )}

            {recipe.description && (
              <p className="mt-4 text-gray-600 leading-relaxed">
                {recipe.description}
              </p>
            )}

            <button
              onClick={async () => {
                try {
                  await apiFetch("/api/auth/save-recipe", {
                    method: "POST",
                    auth: true,
                    body: JSON.stringify({
                      recipeId: recipe._id,
                    }),
                  });

                  alert("Recipe saved!");
                } catch (e: any) {
                  alert(e.message || "Failed to save recipe");
                }
              }}
              className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
            >
              Save Recipe
            </button>

          </div>

          {/* RIGHT SIDE */}

          <div>

            <h2 className="text-2xl font-semibold mb-6">
              Ingredients
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {recipe.ingredients?.map((ing, idx) => (

                <div
                  key={`${ing.name}-${idx}`}
                  className="flex justify-between items-center border border-gray-200 rounded-xl p-4 hover:shadow-sm"
                >

                  <div>
                    <p className="font-medium">
                      {ing.name}
                    </p>

                    {ing.quantity && (
                      <p className="text-sm text-gray-500">
                        {ing.quantity}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        await apiFetch("/api/cart", {
                          method: "POST",
                          auth: true,
                          body: JSON.stringify({
                            name: ing.name,
                            quantity: 1,
                          }),
                        });

                        alert(`${ing.name} added to cart`);
                      } catch (e: any) {
                        alert(e.message || "Failed to add");
                      }
                    }}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                  >
                    Add
                  </button>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* PROCEDURE */}

        <div className="mt-16">

          <h2 className="text-3xl font-semibold mb-6">
            Procedure
          </h2>

          <div className="space-y-4">

            {recipe.instructions?.map((step, i) => (

              <div
                key={i}
                className="border border-gray-200 rounded-xl p-5"
              >

                <p className="font-semibold mb-2">
                  Step {i + 1}
                </p>

                <p className="text-gray-600">
                  {step}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* ADD REVIEW */}

        <div className="mt-16">

          <h2 className="text-3xl font-semibold mb-6">
            Add Review
          </h2>

          <div className="border border-gray-200 rounded-xl p-6 max-w-lg">

            <div className="mb-4">

              <label className="block text-sm mb-1">
                Rating
              </label>

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                {[1,2,3,4,5].map((r) => (
                  <option key={r} value={r}>
                    {r} Star
                  </option>
                ))}
              </select>

            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)} 
              placeholder="Write your review..."
              className="w-full border border-gray-300 rounded-lg p-3"
            />

            <button
              onClick={async () => {
                try {
                  await apiFetch(`/api/recipes/review${recipe._id}`, {
                    method: "POST",
                    auth: true,
                    body: JSON.stringify({
                      rating,
                      comment,
                    }),
                  });

                  setComment("");
                  fetchRecipe();
                } catch (e: any) {
                  alert(e.message || "Failed to add review");
                }
              }}
              className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Submit Review
            </button>

          </div>

        </div>

        {/* REVIEWS */}

        <div className="mt-16">

          <h2 className="text-3xl font-bold">
            Reviews ({recipe.reviews?.length || 0})
          </h2>

          <div className="mt-6 space-y-4">

            {recipe.reviews?.map((review) => (

              <div
                key={review._id}
                className="border border-gray-200 rounded-xl p-5"
              >

                <div className="flex justify-between">

                  <span className="font-semibold text-yellow-600">
                    ⭐ {review.rating}
                  </span>

                  {(currentUserId === review.userId ||
                    currentRole === "admin") && (

                    <button
                      onClick={async () => {
                        try {
                          await apiFetch(
                            `/api/recipes/review/${recipe._id}/${review._id}`,
                            {
                              method: "DELETE",
                              auth: true,
                            }
                          );
                          fetchRecipe();
                        } catch {}
                      }}
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>

                  )}

                </div>

                <p className="mt-2 text-gray-600">
                  {review.comment}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>
    </div>
  );
}