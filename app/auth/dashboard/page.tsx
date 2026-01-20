"use client";

import Cookies from 'js-cookie';
import {  useEffect, useState } from "react";

export default function DashboardPage() {
  const [name, setName] = useState<string>(""); // default empty

  useEffect(() => {
    // Read username from cookie
    const username = Cookies.get("username"); // change key if you stored differently
    if (username) setName(username);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
            AB
          </div>
          <span className="font-semibold text-lg text-black">NepaBite</span>
          <p className="text-gray-700 font-medium">Hello {name}</p>
        </div>

        <div className="flex items-center gap-6 text-sm text-black">
          <span className="cursor-pointer hover:text-green-600">Recipes</span>
          <span className="cursor-pointer hover:text-green-600">Categories</span>
          <span className="cursor-pointer hover:text-green-600">Cart</span>
          <span className="cursor-pointer hover:text-green-600">Saved Recipes</span>
        </div>
      </header>

      {/* Hero Banner (UPDATED) */}
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

      {/* Content */}
      <section className="px-8 mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">What We’re Loving Right Now</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="relative">
              <img
                src="/images/chataamari.jpg"
                alt="Chatamari"
                className="h-44 w-full object-cover"
              />
              <span className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded-full shadow">
                ⭐ 4.5
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-black">Chatamari</h3>
              <p className="text-sm text-black mt-1">Time</p>
              <p className="text-sm font-medium text-black">15 Mins</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="relative">
              <img
                src="/images/bara.jpg"
                alt="Bara"
                className="h-44 w-full object-cover"
              />
              <span className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded-full shadow">
                ⭐ 4.5
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-black">Bara</h3>
              <p className="text-sm text-black mt-1">Time</p>
              <p className="text-sm font-medium text-black">15 Mins</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="relative">
              <img
                src="/images/yomari.png"
                alt="Yomari"
                className="h-44 w-full object-cover"
              />
              <span className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded-full shadow">
                ⭐ 4.5
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-black">Yomari</h3>
              <p className="text-sm text-black mt-1">Time</p>
              <p className="text-sm font-medium text-black">15 Mins</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
