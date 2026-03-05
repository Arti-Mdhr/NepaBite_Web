"use client";

import { useEffect, useState } from "react";
import Hero from "@/app/(public)/_components/Hero";
import FoodCard from "@/app/(public)/_components/FoodCard";
import { apiFetch, resolveImageUrl } from "@/lib/api";

type Recipe = {
  _id: string;
  title: string;
  cookTime?: string;
  rating?: number;
  image?: string;
};

export default function DashboardPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch<{ success?: boolean; recipes: Recipe[] }>(
          "/api/recipes"
        );
        setRecipes(data.recipes || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      <section className="px-8 mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          What We’re Loving Right Now
        </h2>

        {loading ? (
          <div className="text-gray-600">Loading recipes...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recipes.map((r) => (
              <FoodCard
                key={r._id}
                id={r._id}
                name={r.title}
                time={r.cookTime || "—"}
                rating={String(r.rating ?? "—")}
                image={resolveImageUrl(r.image)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}