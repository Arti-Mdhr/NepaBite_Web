export default function HomePage() {
  return (
    <div className="min-h-screen bg-green-50 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-4">Welcome to NepaBite 🍽️</h1>

        <p className="text-black mb-8">Discover recipes, plan your groceries, and find nearby marts — all in one place.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-2 text-black">🥗 Recipe Finder</h3>
            <p className="text-black">Search recipes based on ingredients you already have.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-2 text-black">🛒 Grocery List</h3>
            <p className="text-black">Automatically generate grocery lists from selected recipes.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-2 text-black">📍 Nearby Marts</h3>
            <p className="text-black">Locate nearby grocery marts based on your location.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
