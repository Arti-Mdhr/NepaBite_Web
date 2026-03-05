"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch, resolveImageUrl } from "@/lib/api";
import Link from "next/link";

type Review = {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | undefined>();

  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchRecipe = async () => {
    try {
      const data = await apiFetch<{ recipe: any }>(`/api/recipes/${id}`);
      const r = data?.recipe ?? (data as any);

      setTitle(r.title || "");
      setDescription(r.description || "");
      setCategory(r.category || "");
      setExistingImage(r.image);
      setReviews(r.reviews || []);

      if (Array.isArray(r.ingredients)) {
        setIngredients(
          r.ingredients
            .map((i: any) => `${i.name} | ${i.quantity}`)
            .join("\n")
        );
      }

      if (Array.isArray(r.instructions)) {
        setInstructions(r.instructions.join("\n"));
      }
    } catch (e: any) {
      setError(e.message || "Failed to load recipe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchRecipe();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

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
      formData.append(
        "instructions",
        JSON.stringify(instructions.split("\n").filter(Boolean))
      );

      if (image) formData.append("image", image);

      await apiFetch(`/api/admin/recipes/${id}`, {
        method: "PUT",
        auth: true,
        body: formData,
      });

      router.push("/admin/recipes");
    } catch (e: any) {
      setError(e.message || "Failed to update recipe");
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;

    try {
      await apiFetch(`/api/recipes/review/${id}/${reviewId}`, {
        method: "DELETE",
        auth: true,
      });

      fetchRecipe();
    } catch (e: any) {
      alert(e.message || "Failed to delete review");
    }
  };

  const inputClass =
    "w-full px-4 py-3 text-sm text-zinc-900 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-400";

  const labelClass =
    "block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2";

  if (loading) {
    return (
      <div className="p-10 text-black">
        <div className="space-y-4 max-w-2xl">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-zinc-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 text-black">
      <Link
        href="/admin/recipes"
        className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors mb-8 inline-block"
      >
        ← Recipes
      </Link>

      <div className="mb-8">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1">
          Editing
        </p>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
          {title || "Recipe"}
        </h1>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* BASIC INFO */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-7 space-y-5">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pb-1 border-b border-zinc-100">
            Basic Info
          </p>

          <div>
            <label className={labelClass}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
              placeholder="Recipe name"
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="Brief description..."
            />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
              placeholder="e.g. Momo, Dal Bhat"
            />
          </div>
        </div>

        {/* INGREDIENTS + INSTRUCTIONS */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-7 space-y-5">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pb-1 border-b border-zinc-100">
            Content
          </p>

          <div>
            <label className={labelClass}>Ingredients</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={6}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={6}
              className={inputClass}
            />
          </div>
        </div>

        {/* IMAGE */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-7">
          {existingImage && !image && (
            <img
              src={resolveImageUrl(existingImage)}
              alt="current"
              className="w-32 h-24 object-cover rounded-xl border border-zinc-100"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* ⭐ ADMIN REVIEWS SECTION */}
      <div className="mt-12 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          Reviews ({reviews.length})
        </h2>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border border-zinc-200 rounded-xl p-4 flex justify-between"
            >
              <div>
                <p className="text-yellow-600 font-semibold">
                  ⭐ {review.rating}
                </p>
                <p className="text-zinc-700">{review.comment}</p>
                <p className="text-xs text-black">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => deleteReview(review._id)}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}