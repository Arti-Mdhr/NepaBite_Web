import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white font-serif">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Nepabite Logo"
            width={36}
            height={36}
          />
          <h1 className="text-2xl font-bold text-black">Nepabite</h1>
        </div>

        {/* Search */}
        <div className="flex-1 mx-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Recipes..."
              className="w-full px-12 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brandPink"
            />
            <span className="absolute left-4 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Navbar links */}
        <div className="flex items-center gap-8 text-sm font-medium text-black">
          <Link href="#" className="hover:text-brandPink transition">
            Recipes
          </Link>
          <Link href="#" className="hover:text-brandPink transition">
            Categories
          </Link>
          <Link href="#" className="hover:text-brandPink transition">
            Cart
          </Link>
          <Link href="#" className="hover:text-brandPink transition">
            Saved Recipes
          </Link>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="px-10 py-6">
        <div className="w-full rounded-2xl overflow-hidden" style={{ height: 160 }}>
          <Image
            src="/images/banner.jpg"
            alt="Food Banner"
            width={1200}
            height={160}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </section>

      {/* Recipe Cards Section */}
      <section className="px-10 py-8">
        <h2 className="text-2xl font-bold text-black mb-6">
          Recommended Recipes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Chatamari", image: "/images/chataamari.jpg" },
            { title: "Bara", image: "/images/bara.jpg" },
            { title: "Yomari", image: "/images/yomari.png" },
          ].map((recipe) => (
            <div key={recipe.title} className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden group">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  width={400}
                  height={160}
                  className="object-cover w-full h-[160px]"
                />
              </div>
              <div>
                <p className="font-bold text-black">{recipe.title}</p>
                <p className="text-sm text-gray-500">Prep Time</p>
                <p className="text-sm text-black">15 mins</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grocery List Section */}
      <section className="px-10 py-8">
        <h2 className="text-2xl font-bold text-black mb-6">Your Grocery List</h2>
        <ul className="space-y-2">
          {["Rice", "Milk", "Eggs", "Vegetables", "Flour"].map((item) => (
            <li key={item} className="px-4 py-2 border rounded-lg bg-gray-50 flex justify-between items-center">
              <span>{item}</span>
              <button className="text-red-500 font-bold">Remove</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Nearby Mart Section */}
      <section className="px-10 py-8">
        <h2 className="text-2xl font-bold text-black mb-6">Nearby Marts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Mart A", image: "/images/mart1.jpg" },
            { name: "Mart B", image: "/images/mart2.jpg" },
            { name: "Mart C", image: "/images/mart3.jpg" },
          ].map((mart) => (
            <div key={mart.name} className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
              <Image
                src={mart.image}
                alt={mart.name}
                width={400}
                height={160}
                className="object-cover w-full h-[160px]"
              />
              <div className="px-4 py-2 font-bold text-black">{mart.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
