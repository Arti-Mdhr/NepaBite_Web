import Link from "next/link";

const recipes = [
  { title: "Chatamari", time: "15 Mins", rating: "4.5" },
  { title: "Bara", time: "15 Mins", rating: "4.5" },
  { title: "Yomari", time: "15 Mins", rating: "4.5" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-10 py-5 border-b">

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="text-xl font-bold text-gray-900">NepaBite</span>
        </div>
        <div className="flex-1 mx-10">
          <input
            type="text"
            placeholder="Search Recipes..."
            className="w-full max-w-lg px-5 py-2 border rounded-full focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/login">Log In</Link>
          <Link href="#">Recipes</Link>
          <Link href="#">Categories</Link>
          <Link href="#">Cart</Link>
          <Link href="#">Saved Recipes</Link>
        </nav>
      </header>
      <section className="px-10 py-16 bg-gray-50">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Discover Authentic Nepali Recipes
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Explore, cook, and save traditional Nepali dishes from all over Nepal.
          </p>

          <div className="mt-8 space-x-4">
            <Link
              href="/login"
              className="px-7 py-3 bg-green-600 text-white rounded-full text-base font-medium"
            >
              Get Started
            </Link>
            <Link
              href="/register"
              className="px-7 py-3 border border-gray-300 rounded-full text-base font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
      <section className="px-10 py-12">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">
          What We’re Loving Right Now
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div
              key={recipe.title}
              className="border rounded-xl p-6 hover:shadow-md transition cursor-pointer"
            >
              <div className="w-full h-36 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                Recipe Image
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {recipe.title}
                  </h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    ⭐ {recipe.rating}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-2">Time</p>
                <p className="text-sm font-medium text-gray-800">
                  {recipe.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
