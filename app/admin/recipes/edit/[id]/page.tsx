"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, resolveImageUrl } from "@/lib/api";
import ProtectedRoute from "@/app/_components/ProtectedRoute";


type Ingredient = {
  name: string;
  quantity?: string;
};

type Recipe = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  ingredients: Ingredient[];
  instructions?: string[];
  image?: string;
};

export default function EditRecipePage() {
  const { id } = useParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const fetchRecipe = async () => {
    try {
      const data = await apiFetch<{ recipe: Recipe }>(
        `/api/recipes/${id}`
      );

      const r = data.recipe;

      setRecipe(r);
      setTitle(r.title);
      setDescription(r.description || "");
      setCategory(r.category || "");

      setIngredientsText(
        r.ingredients
          .map((i) =>
            i.quantity ? `${i.name} | ${i.quantity}` : i.name
          )
          .join("\n")
      );

      setInstructionsText(
        r.instructions?.join("\n") || ""
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);

      const ingredientsArray = ingredientsText
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [name, quantity] = line.split("|");
          return {
            name: name.trim(),
            quantity: quantity?.trim(),
          };
        });

      const instructionsArray = instructionsText
        .split("\n")
        .filter(Boolean);

      formData.append(
        "ingredients",
        JSON.stringify(ingredientsArray)
      );
      formData.append(
        "instructions",
        JSON.stringify(instructionsArray)
      );

      if (image) {
        formData.append("image", image);
      }

      await apiFetch(`/api/admin/recipes/${id}`, {
        method: "PUT",
        auth: true,
        body: formData,
      });

      alert("Recipe updated successfully!");
      router.push("/admin/recipes");
    } catch (e: any) {
      alert(e.message || "Failed to update recipe");
    }
  };

  if (loading) {
    return <div className="p-10">Loading recipe...</div>;
  }

  if (!recipe) {
    return <div className="p-10">Recipe not found.</div>;
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Recipe
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-md"
          >
            {recipe.image && (
              <img
                src={resolveImageUrl(recipe.image)}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            <div>
              <label className="block font-medium text-gray-700">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-2 w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={3}
                className="mt-2 w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Category
              </label>
              <input
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                required
                className="mt-2 w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Ingredients
              </label>
              <textarea
                value={ingredientsText}
                onChange={(e) =>
                  setIngredientsText(e.target.value)
                }
                rows={5}
                className="mt-2 w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Instructions
              </label>
              <textarea
                value={instructionsText}
                onChange={(e) =>
                  setInstructionsText(e.target.value)
                }
                rows={5}
                className="mt-2 w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Replace Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(
                    e.target.files
                      ? e.target.files[0]
                      : null
                  )
                }
                className="mt-2"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Update Recipe
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}