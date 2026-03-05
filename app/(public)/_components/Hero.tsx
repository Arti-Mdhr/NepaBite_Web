export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="relative h-[420px] w-full rounded-3xl overflow-hidden shadow-lg">

        {/* Background Image */}
        <img
          src="/images/img1.jpg"
          alt="Food banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-xl px-10 text-white">

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Discover Delicious
              <span className="text-green-400"> Nepali Recipes</span>
            </h1>

            <p className="text-white/90 text-lg mb-6">
              Cook authentic Nepali dishes at home. Browse recipes,
              save your favorites, and plan your ingredients effortlessly.
            </p>

            <div className="flex gap-4">
              <a
                href="/recipes"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold transition shadow-md"
              >
                Browse Recipes
              </a>

              <a
                href="/login"
                className="px-6 py-3 bg-white/90 hover:bg-white text-gray-900 rounded-xl font-semibold transition"
              >
                Get Started
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}