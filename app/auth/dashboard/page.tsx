export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-4xl font-bold mb-6">Welcome to NepaBite 🍽️</h1>
      <p className="text-gray-600 mb-10">
        Start discovering and saving your favorite Nepali recipes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow">
          🔍 Search Recipes
        </div>
        <div className="p-6 bg-white rounded-xl shadow">
          ❤️ Saved Recipes
        </div>
        <div className="p-6 bg-white rounded-xl shadow">
          👩‍🍳 My Profile
        </div>
      </div>
    </div>
  );
}
