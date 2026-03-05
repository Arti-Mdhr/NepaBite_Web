"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function CreateRecipePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);

      // Parse ingredients textarea into array
      const ingredientsArray = ingredients
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [name, quantity] = line.split("|");
          return { name: name.trim(), quantity: quantity?.trim() };
        });

      formData.append("ingredients", JSON.stringify(ingredientsArray));

      // Parse instructions
      const instructionsArray = instructions
        .split("\n")
        .filter(Boolean);

      formData.append("instructions", JSON.stringify(instructionsArray));

      if (image) {
        formData.append("image", image);
      }

      await apiFetch("/api/admin/recipes", {
        method: "POST",
        auth: true,
        body: formData,
      });

      alert("Recipe created successfully!");
      router.push("/recipes");
    } catch (e: any) {
      alert(e.message || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Create New Recipe
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-md"
        >
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
              onChange={(e) => setDescription(e.target.value)}
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
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-2 w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Ingredients
            </label>
            <p className="text-sm text-gray-500">
              Format: name | quantity (one per line)
            </p>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={5}
              required
              placeholder="Flour | 2 cups&#10;Salt | 1 tsp"
              className="mt-2 w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Instructions
            </label>
            <p className="text-sm text-gray-500">
              One step per line
            </p>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
              required
              placeholder="Mix ingredients&#10;Cook for 10 minutes"
              className="mt-2 w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
              className="mt-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {loading ? "Creating..." : "Create Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
}