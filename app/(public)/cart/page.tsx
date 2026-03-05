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
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
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

  const toggleCheck = (name: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

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

  const clearCart = async () => {
    try {
      for (const item of items) {
        await apiFetch(`/api/cart/${encodeURIComponent(item.name)}`, {
          method: "DELETE",
          auth: true,
        });
      }

      setItems([]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-4xl mx-auto px-6 py-12">

        <h1 className="text-3xl font-bold text-black">
          Ingredient Cart
        </h1>

        {loading ? (
          <div className="mt-6 text-gray-600">Loading...</div>
        ) : items.length === 0 ? (
          <div className="mt-6 text-gray-600">
            Your ingredient cart is empty.
          </div>
        ) : (

          <>
            <div className="mt-8 border border-gray-200 rounded-2xl divide-y">

              {items.map((item) => {

                const checked = checkedItems[item.name];

                return (
                  <div
                    key={item.name}
                    className="p-5 flex items-center justify-between"
                  >

                    <div className="flex items-center gap-4">

                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={checked || false}
                        onChange={() => toggleCheck(item.name)}
                        className="w-5 h-5 accent-green-600"
                      />

                      <div>
                        <p
                          className={`font-medium ${
                            checked
                              ? "line-through text-gray-400"
                              : "text-black"
                          }`}
                        >
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                    </div>

                    {/* Remove single item */}
                    <button
                      onClick={() => removeItem(item.name)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>

                  </div>
                );
              })}

            </div>

            {/* CLEAR CART BUTTON */}
            <div className="mt-8 flex justify-end">

              <button
                onClick={clearCart}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Clear Cart
              </button>

            </div>
          </>
        )}

      </div>

    </div>
  );
}