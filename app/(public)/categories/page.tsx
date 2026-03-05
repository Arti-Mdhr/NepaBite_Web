"use client";

import Header from "@/app/(public)/_components/Header";
import Link from "next/link";

const DUMMY_CATEGORIES = [
  { id: "1", name: "Nepali Cuisine", description: "Traditional Nepali dishes", icon: "🇳🇵" },
  { id: "2", name: "Street Food", description: "Popular street food recipes", icon: "🍢" },
  { id: "3", name: "Desserts", description: "Sweets and festival treats", icon: "🍰" },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
     

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-2">Browse recipe categories (dummy UI).</p>
          </div>

          <Link
            href="/admin/categories"
            className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Admin Manage
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {DUMMY_CATEGORIES.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="text-4xl">{c.icon}</div>
              <h3 className="mt-3 text-xl font-bold text-gray-900">{c.name}</h3>
              <p className="mt-2 text-sm text-gray-600">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
