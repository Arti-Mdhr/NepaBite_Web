"use client"

import { useState, useEffect } from "react";
import Link from "next/link";

interface Recipe {
  id: string;
  title: string;
  category: string;
  author: string;
  difficulty: "Easy" | "Medium" | "Hard";
  cookTime: string;
  servings: number;
  image?: string;
  status: "published" | "draft";
  views: number;
  likes: number;
  createdAt: string;
}

// Dummy recipes data
const DUMMY_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Traditional Chicken Momo",
    category: "Momo Varieties",
    author: "Rajesh Kumar",
    difficulty: "Medium",
    cookTime: "45 mins",
    servings: 4,
    status: "published",
    views: 1243,
    likes: 189,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Dal Bhat with Achar",
    category: "Rice Dishes",
    author: "Maya Gurung",
    difficulty: "Easy",
    cookTime: "30 mins",
    servings: 6,
    status: "published",
    views: 2156,
    likes: 342,
    createdAt: "2024-01-20T14:45:00Z",
  },
  {
    id: "3",
    title: "Newari Khaja Set",
    category: "Newari Cuisine",
    author: "Deepak Tamang",
    difficulty: "Hard",
    cookTime: "90 mins",
    servings: 8,
    status: "published",
    views: 876,
    likes: 156,
    createdAt: "2024-02-05T09:15:00Z",
  },
  {
    id: "4",
    title: "Spicy Chatamari",
    category: "Street Food",
    author: "Sita Sharma",
    difficulty: "Medium",
    cookTime: "25 mins",
    servings: 2,
    status: "published",
    views: 1534,
    likes: 267,
    createdAt: "2024-02-12T16:20:00Z",
  },
  {
    id: "5",
    title: "Sel Roti Recipe",
    category: "Desserts & Sweets",
    author: "Arjun Thapa",
    difficulty: "Medium",
    cookTime: "60 mins",
    servings: 10,
    status: "draft",
    views: 432,
    likes: 78,
    createdAt: "2024-02-18T11:00:00Z",
  },
  {
    id: "6",
    title: "Vegetable Thukpa",
    category: "Vegetarian",
    author: "Priya Adhikari",
    difficulty: "Easy",
    cookTime: "35 mins",
    servings: 4,
    status: "published",
    views: 1823,
    likes: 298,
    createdAt: "2024-02-25T13:30:00Z",
  },
  {
    id: "7",
    title: "Masala Chiya",
    category: "Beverages",
    author: "Bikash Rai",
    difficulty: "Easy",
    cookTime: "10 mins",
    servings: 2,
    status: "published",
    views: 987,
    likes: 145,
    createdAt: "2024-03-02T08:45:00Z",
  },
  {
    id: "8",
    title: "Panipuri (Golgappa)",
    category: "Street Food",
    author: "Anjali Magar",
    difficulty: "Medium",
    cookTime: "40 mins",
    servings: 6,
    status: "published",
    views: 2341,
    likes: 412,
    createdAt: "2024-03-10T15:10:00Z",
  },
  {
    id: "9",
    title: "Aloo Tama",
    category: "Nepali Cuisine",
    author: "Kamala Shrestha",
    difficulty: "Easy",
    cookTime: "50 mins",
    servings: 5,
    status: "draft",
    views: 654,
    likes: 92,
    createdAt: "2024-03-15T10:25:00Z",
  },
  {
    id: "10",
    title: "Festival Special Yomari",
    category: "Festival Specials",
    author: "Rajesh Kumar",
    difficulty: "Hard",
    cookTime: "75 mins",
    servings: 8,
    status: "published",
    views: 1432,
    likes: 234,
    createdAt: "2024-03-20T12:40:00Z",
  },
];

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [filterDifficulty, setFilterDifficulty] = useState<"all" | "Easy" | "Medium" | "Hard">("all");

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setRecipes(DUMMY_RECIPES);
      setLoading(false);
    }, 500);
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || recipe.status === filterStatus;
    const matchesDifficulty = filterDifficulty === "all" || recipe.difficulty === filterDifficulty;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const publishedCount = recipes.filter(r => r.status === "published").length;
  const draftCount = recipes.filter(r => r.status === "draft").length;
  const totalViews = recipes.reduce((sum, r) => sum + r.views, 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Recipes</h1>
              <p className="mt-1 text-sm text-slate-600">Manage all recipes and culinary content</p>
            </div>
            <Link
              href="/admin/recipes/create"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              + Add New Recipe
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Recipes</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? "..." : recipes.length}
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
                <p className="text-sm font-medium text-slate-600">Published</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? "..." : publishedCount}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                ✅
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Drafts</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? "..." : draftCount}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                📝
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Views</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? "..." : totalViews.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                👁️
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Difficulty
              </label>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value as any)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="all">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recipes Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading recipes...</div>
          ) : filteredRecipes.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No recipes found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Recipe
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRecipes.map((recipe) => (
                    <tr key={recipe.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{recipe.title}</div>
                          <div className="text-xs text-slate-500">
                            {recipe.cookTime} • {recipe.servings} servings
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">{recipe.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">{recipe.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                          {recipe.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-slate-600">
                          <div>👁️ {recipe.views} views</div>
                          <div>❤️ {recipe.likes} likes</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          recipe.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {recipe.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <Link
                          href={`/admin/recipes/${recipe.id}`}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/recipes/${recipe.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(recipe.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}