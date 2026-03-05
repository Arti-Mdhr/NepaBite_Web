"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch, resolveImageUrl } from "@/lib/api";
import Link from "next/link";

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

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await apiFetch<{ recipe: any }>(`/api/recipes/${id}`);
        const r = data?.recipe ?? (data as any);
        setTitle(r.title || "");
        setDescription(r.description || "");
        setCategory(r.category || "");
        setExistingImage(r.image);
        if (Array.isArray(r.ingredients)) {
          setIngredients(r.ingredients.map((i: any) => `${i.name} | ${i.quantity}`).join("\n"));
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

      const ingredientsArray = ingredients.split("\n").filter(Boolean).map((line) => {
        const [name, quantity] = line.split("|");
        return { name: name.trim(), quantity: quantity?.trim() };
      });
      formData.append("ingredients", JSON.stringify(ingredientsArray));
      formData.append("instructions", JSON.stringify(instructions.split("\n").filter(Boolean)));

      if (image) formData.append("image", image);

      await apiFetch(`/api/admin/recipes/${id}`, { method: "PUT", auth: true, body: formData });
      router.push("/admin/recipes");
    } catch (e: any) {
      setError(e.message || "Failed to update recipe");
    } finally {
      setSaving(false);
    }
  };

const inputClass = "w-full px-4 py-3 text-sm text-zinc-900 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-400";
  const labelClass = "block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2";

  if (loading) {
    return (
      <div className="p-10">
        <div className="space-y-4 max-w-2xl">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-zinc-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <Link href="/admin/recipes" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors mb-8 inline-block">
        ← Recipes
      </Link>

      <div className="mb-8">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1">Editing</p>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{title || "Recipe"}</h1>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white border border-zinc-100 rounded-2xl p-7 space-y-5">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pb-1 border-b border-zinc-100">Basic Info</p>

          <div>
            <label className={labelClass}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} placeholder="Recipe name" />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} placeholder="Brief description..." />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} placeholder="e.g. Momo, Dal Bhat" />
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-7 space-y-5">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pb-1 border-b border-zinc-100">Content</p>

          <div>
            <label className={labelClass}>Ingredients</label>
            <p className="text-xs text-zinc-400 mb-2">One per line — format: <code className="bg-zinc-100 px-1 rounded">name | quantity</code></p>
            <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={6} className={inputClass} placeholder={"Flour | 2 cups\nSalt | 1 tsp"} />
          </div>

          <div>
            <label className={labelClass}>Instructions</label>
            <p className="text-xs text-zinc-400 mb-2">One step per line</p>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={6} className={inputClass} placeholder={"Mix dry ingredients\nAdd water and knead"} />
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-7">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pb-4 border-b border-zinc-100 mb-5">Image</p>
          {existingImage && !image && (
            <div className="mb-4">
              <p className="text-xs text-zinc-400 mb-2">Current image</p>
              <img src={resolveImageUrl(existingImage)} alt="current" className="w-32 h-24 object-cover rounded-xl border border-zinc-100" />
            </div>
          )}
          <label className={labelClass}>Replace image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="text-sm text-zinc-500 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/admin/recipes"
            className="px-6 py-3 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}