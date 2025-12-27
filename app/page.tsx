import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const isLoggedIn = false; // Set to true after login

  return (
    <div className="min-h-screen bg-white font-serif">
      {/* Navbar */}
      <nav className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 border-b">
        <h1 className="text-3xl font-bold text-green-600">RecipeFinder</h1>

        <input
          type="text"
          placeholder="Search recipes..."
          className="mt-4 sm:mt-0 w-full sm:w-1/3 rounded-full border px-5 py-2 text-sm"
        />

        <div className="flex gap-4 mt-4 sm:mt-0 text-sm font-medium text-gray-700">
          {!isLoggedIn && (
            <>
              <Link href="/login" className="hover:text-green-600">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:brightness-95 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="px-8 py-8">
        <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden rounded-2xl shadow-lg">
          <Image
            src="/images/banner.jpeg"
            alt="Food Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-2xl">
            <h2 className="text-3xl sm:text-5xl text-white font-bold text-center">
              Find Delicious Recipes Easily
            </h2>
          </div>
        </div>
      </section>

      {/* Recipes Section */}
      <section className="px-8 py-12 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">What We’re Loving Right Now</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-2xl border shadow-sm hover:shadow-lg transition overflow-hidden bg-white"
            >
              <div className="relative h-48">
                <Image
                  src="/images/next.svg"
                  alt="Recipe Image"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-bold shadow">
                  ★ 4.5
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg">Delicious Recipe {item}</h3>
                <p className="text-sm text-gray-500">Time · 15 mins</p>
                <Link
                  href={`/recipe/${item}`}
                  className="text-green-600 text-sm font-semibold mt-2 inline-block hover:underline"
                >
                  View Recipe
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action for Guests */}
      {!isLoggedIn && (
        <section className="px-8 py-12 bg-green-600 text-white text-center rounded-2xl mx-8 my-12">
          <h2 className="text-3xl font-bold mb-4">Ready to start cooking?</h2>
          <p className="mb-6 text-lg">
            Sign up and explore hundreds of recipes tailored for you.
          </p>
          <Link
            href="/register"
            className="bg-white text-green-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </section>
      )}
    </div>
  );
}
