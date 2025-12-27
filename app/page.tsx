import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
    
      <header className="flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="NepaBite" width={40} height={40} />
          <span className="text-2xl font-bold text-green-700">NepaBite</span>
        </div>

        <div className="space-x-4">
          <Link
            href="/login"
            className="px-5 py-2 border border-green-600 text-green-700 rounded-full hover:bg-green-50"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
          >
            Sign Up
          </Link>
        </div>
      </header>

    
      <section className="flex flex-1 items-center justify-between px-20">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold leading-tight text-gray-900">
            Discover Authentic <span className="text-green-600">Nepali Recipes</span>
          </h1>
          <p className="mt-6 text-gray-600 text-lg">
            Find, cook, and enjoy traditional Nepali dishes — all in one place.
          </p>

          <div className="mt-10 space-x-4">
            <Link
              href="/login"
              className="px-8 py-3 bg-green-600 text-white rounded-full text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 border border-gray-300 rounded-full text-lg"
            >
              Create Account
            </Link>
          </div>
        </div>

        <Image
          src="/images/banner.jpg"
          alt="Food"
          width={520}
          height={520}
          className="rounded-3xl shadow-lg"
        />
      </section>
    </main>
  );
}
