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

  const fetchRecipe = async () => {
    try {
      setError("");
      const data = await apiFetch<{ recipe: Recipe }>(
        `/api/recipes/${id}`
      );
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
  <div className="min-h-screen bg-bgsoft">
    <div className="max-w-6xl mx-auto px-6 py-10">

      <Link href="/recipes" className="text-sm text-gray-500 hover:text-gray-700">
        ← Back to recipes
      </Link>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div>

          {recipe.image && (
            <img
              src={resolveImageUrl(recipe.image)}
              alt={recipe.title}
              className="rounded-2xl w-full h-80 object-cover shadow-md"
            />
          )}

          <h1 className="mt-6 text-3xl font-bold">
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
            className="mt-6 btn-primary"
          >
            Save Recipe
          </button>

        </div>

        {/* RIGHT SIDE */}

        <div>

          <h2 className="text-xl font-semibold mb-4">
            Ingredients
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {recipe.ingredients?.map((ing, idx) => (

              <div
                key={`${ing.name}-${idx}`}
                className="ingredient-card"
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
                  className="btn-accent"
                >
                  Add
                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* PROCEDURE */}

      <div className="mt-12">

        <h2 className="text-2xl font-semibold mb-6">
          Procedure
        </h2>

        <div className="space-y-4">

          {recipe.instructions?.map((step, i) => (

            <div key={i} className="step-card">

              <p className="font-semibold mb-1">
                Step {i + 1}
              </p>

              <p className="text-gray-600">
                {step}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* REVIEWS */}

      <div className="mt-14">

        <h2 className="text-2xl font-bold">
          Reviews ({recipe.reviews?.length || 0})
        </h2>

        <div className="mt-6 space-y-4">

          {recipe.reviews?.map((review) => (

            <div
              key={review._id}
              className="card p-4"
            >

              <div className="flex justify-between">

                <span className="font-semibold">
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
                      } catch (e) {}
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