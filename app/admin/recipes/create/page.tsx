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

      const ingredientsArray = ingredients
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [name, quantity] = line.split("|");
          return { name: name.trim(), quantity: quantity?.trim() };
        });

      formData.append("ingredients", JSON.stringify(ingredientsArray));

      const instructionsArray = instructions.split("\n").filter(Boolean);
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

      // ✅ FIXED REDIRECT
      router.push("/admin/recipes");

    } catch (e: any) {
      alert(e.message || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 text-black">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1">
            Recipes
          </p>
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Create Recipe
          </h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-8 max-w-3xl">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-black uppercase mb-2">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-black uppercase mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-black uppercase mb-2">
              Category
            </label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-xs font-semibold text-black uppercase mb-2">
              Ingredients
            </label>
            <p className="text-xs text-zinc-500 mb-2">
              Format: name | quantity (one per line)
            </p>

            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={5}
              required
              placeholder="Flour | 2 cups&#10;Salt | 1 tsp"
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-semibold text-black uppercase mb-2">
              Instructions
            </label>

            <p className="text-xs text-zinc-500 mb-2">
              One step per line
            </p>

            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
              required
              placeholder="Mix ingredients&#10;Cook for 10 minutes"
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-semibold text-black uppercase mb-2">
              Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
              className="text-sm"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Recipe"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}