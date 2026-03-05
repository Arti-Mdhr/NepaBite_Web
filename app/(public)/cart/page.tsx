"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type CartItem = {
  name: string;
  quantity: number;
};

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const data = await apiFetch<{ cart: { items: CartItem[] } }>(
        "/api/cart",
        { auth: true }
      );

      setItems(data.cart?.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchCart();
  }, []);

  const removeItem = async (name: string) => {
    try {
      await apiFetch(`/api/cart/${encodeURIComponent(name)}`, {
        method: "DELETE",
        auth: true,
      });

      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Cart</h1>

        {loading ? (
          <div className="mt-6">Loading...</div>
        ) : items.length === 0 ? (
          <div className="mt-6 text-gray-600">Cart is empty.</div>
        ) : (
          <div className="mt-8 bg-white rounded-xl shadow-sm border divide-y">
            {items.map((item) => (
              <div
                key={item.name}
                className="p-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.name)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}