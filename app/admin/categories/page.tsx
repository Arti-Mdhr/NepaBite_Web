"use client"

import { useState, useEffect } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  recipeCount: number;
  icon: string;
  createdAt: string;
}

// Dummy categories data
const DUMMY_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Nepali Cuisine",
    slug: "nepali-cuisine",
    description: "Traditional Nepali dishes and recipes",
    recipeCount: 45,
    icon: "🇳🇵",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    name: "Momo Varieties",
    slug: "momo-varieties",
    description: "Different types of momos and dumplings",
    recipeCount: 28,
    icon: "🥟",
    createdAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "3",
    name: "Street Food",
    slug: "street-food",
    description: "Popular Nepali street food recipes",
    recipeCount: 32,
    icon: "🍢",
    createdAt: "2024-02-01T09:15:00Z",
  },
  {
    id: "4",
    name: "Vegetarian",
    slug: "vegetarian",
    description: "Delicious vegetarian Nepali dishes",
    recipeCount: 56,
    icon: "🥗",
    createdAt: "2024-02-10T11:20:00Z",
  },
  {
    id: "5",
    name: "Desserts & Sweets",
    slug: "desserts-sweets",
    description: "Traditional Nepali desserts and sweet treats",
    recipeCount: 22,
    icon: "🍰",
    createdAt: "2024-02-20T16:45:00Z",
  },
  {
    id: "6",
    name: "Rice Dishes",
    slug: "rice-dishes",
    description: "Dal Bhat and other rice-based meals",
    recipeCount: 38,
    icon: "🍚",
    createdAt: "2024-03-05T13:10:00Z",
  },
  {
    id: "7",
    name: "Newari Cuisine",
    slug: "newari-cuisine",
    description: "Traditional Newari food and delicacies",
    recipeCount: 19,
    icon: "🍛",
    createdAt: "2024-03-15T10:30:00Z",
  },
  {
    id: "8",
    name: "Beverages",
    slug: "beverages",
    description: "Traditional Nepali drinks and beverages",
    recipeCount: 15,
    icon: "🍵",
    createdAt: "2024-03-25T15:00:00Z",
  },
  {
    id: "9",
    name: "Snacks & Appetizers",
    slug: "snacks-appetizers",
    description: "Quick snacks and appetizer recipes",
    recipeCount: 41,
    icon: "🍿",
    createdAt: "2024-04-05T12:20:00Z",
  },
  {
    id: "10",
    name: "Festival Specials",
    slug: "festival-specials",
    description: "Special dishes for Nepali festivals",
    recipeCount: 27,
    icon: "🎉",
    createdAt: "2024-04-15T09:45:00Z",
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setCategories(DUMMY_CATEGORIES);
      setLoading(false);
    }, 500);
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRecipes = categories.reduce((sum, cat) => sum + cat.recipeCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage recipe categories and organization
              </p>
            </div>
            <Link
              href="/admin/categories/create"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              + Add New Category
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Categories</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? "..." : categories.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                📁
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Recipes</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? "..." : totalRecipes}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                🍳
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Recipes/Category</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? "..." : Math.round(totalRecipes / categories.length)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                📊
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center text-slate-500">
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center text-slate-500">
            No categories found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Category Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8">
                  <div className="flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-4xl shadow-lg">
                      {category.icon}
                    </div>
                  </div>
                </div>

                {/* Category Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  {/* Recipe Count */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {category.recipeCount} recipes
                    </span>
                    <span className="text-xs text-slate-500">
                      Created {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-4 border-t border-slate-200">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors text-center"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}