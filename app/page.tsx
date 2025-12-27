import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-serif">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 border-b border-gray-100">
        {/* Logo */}
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

        {/* Nav Links */}
        <div className="flex items-center gap-8 text-sm font-medium text-black">
          <Link href="/login" className="hover:text-brandPink transition">
            Log In
          </Link>
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
  <div className="w-full h-[160px] rounded-2xl overflow-hidden">
    <Image
      src="/images/banner.jpg"
      alt="Food Banner"
      width={1200}
      height={160}
      className="w-full h-full object-cover"
      priority
    />
  </div>
</section>



{/* Content */}
<section className="px-10 py-8">
  <h2 className="text-2xl font-bold text-black mb-6">
    What We’re Loving Right Now
  </h2>

  {/* Recipe Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[ 
      {
        title: "Chatamari",
        image: "/images/chatamari.jpg",
      },
      {
        title: "Bara",
        image: "/images/bara.jpg",
      },
      {
        title: "Yomari",
        image: "/images/yomari.png",
      },
    ].map((recipe) => (
      <div key={recipe.title} className="space-y-3">
        <div className="relative rounded-2xl overflow-hidden group">
          <Image
            src={recipe.image}
            alt={recipe.title}
            width={400}
            height={220}
            className="object-cover w-full h-[160px]"
          />

          {/* Rating */}
          <span className="absolute top-3 right-3 bg-white text-xs font-bold px-2 py-1 rounded-full shadow">
            ⭐ 4.5
          </span>

          {/* Save */}
          <button className="absolute bottom-3 right-3 bg-white w-8 h-8 rounded-full shadow flex items-center justify-center">
            🔖
          </button>
        </div>

        <div>
          <p className="font-bold text-black">{recipe.title}</p>
          <p className="text-sm text-gray-500">Time</p>
          <p className="text-sm text-black">15 Mins</p>
        </div>
      </div>
    ))}
  </div>
</section>
    </div>
  );
}