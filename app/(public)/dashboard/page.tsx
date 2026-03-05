"use client";

import { useEffect, useState } from "react";
import Hero from "@/app/(public)/_components/Hero";
import FoodCard from "@/app/(public)/_components/FoodCard";
import { apiFetch, resolveImageUrl } from "@/lib/api";

type Recipe = {
  _id: string;
  title: string;
  cookTime?: string;
  averageRating?: number;
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
    <div className="min-h-screen bg-white">

      <Hero />

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            What We're Loving Right Now
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">
            Loading recipes...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {recipes.map((r) => (
              <FoodCard
                key={r._id}
                id={r._id}
                name={r.title}
                time={r.cookTime || "—"}
                rating={String(r.averageRating ?? "—")}
                image={resolveImageUrl(r.image)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}