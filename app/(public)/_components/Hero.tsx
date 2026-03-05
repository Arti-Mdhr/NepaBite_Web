export default function Hero() {
  return (
    <section className="px-8 mt-6">
      <div className="relative h-64 w-full rounded-2xl overflow-hidden">
        <img
          src="/images/img1.jpg"
          alt="Food banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="px-10">
            <h1 className="text-4xl font-bold text-white mb-2">
              What’s Cooking Today?
            </h1>
            <p className="text-white/90 max-w-xl">
              Explore authentic Nepali recipes, save your favorites, and plan
              your grocery list with ease.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}