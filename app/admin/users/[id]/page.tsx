"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

type Role = "admin" | "user";

interface ApiUser {
  _id: string;
  fullName: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;

  // optional fields if you later add them
  phoneNumber?: string;
  address?: string;
  image?: string;
}

export default function AdminUserViewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = (params?.id as string) || "";

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<ApiUser | null>(null);
  const isMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);
  const API_BASE = "http://localhost:5050";
  const resolveImageUrl = (src?: string) => {
    if (!src) return "";
    return src.startsWith("http") ? src : `${API_BASE}${src}`;
  };


  const token = Cookies.get("token");

  useEffect(() => {

    if (!isMongoId(userId)) {
  setError("Invalid user id in URL.");
  setUser(null);
  setLoading(false);
  return;
}


    

    const fetchUser = async () => {
      try {
        setError("");
        setLoading(true);

        if (!token) {
          setError("No token found. Please login again.");
          return;
        }

        const res = await fetch(`http://localhost:5050/api/admin/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const msg = data?.message || "Failed to fetch user";
          throw new Error(msg);
        }

        // Your backend might return {success:true, user:{...}} OR directly user
        const fetchedUser: ApiUser = data?.user ?? data;

        setUser(fetchedUser);
      } catch (e: any) {
        setError(e?.message || "Something went wrong");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId, token]);

  const initials = useMemo(() => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
  }, [user?.fullName]);

  const imageUrl = user?.image ? resolveImageUrl(user.image) : "";

  const handleDelete = async () => {
    if (!user?._id) return;

    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setDeleting(true);
      setError("");

      if (!token) {
        setError("No token found. Please login again.");
        return;
      }

      const res = await fetch(`http://localhost:5050/api/admin/users/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.message || "Delete failed";
        throw new Error(msg);
      }

      alert("User deleted successfully!");
      router.push("/admin/users");
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-500">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-slate-800 font-semibold">User not found</p>
          <p className="text-slate-500 text-sm mt-1">ID: {userId}</p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Link
            href="/admin/users"
            className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
          >
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/users"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Back
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">User Details</h1>
                <p className="mt-1 text-sm text-slate-600">
                  View user ID: <span className="font-semibold">{user._id}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/admin/users/${user._id}/edit`}
                className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={user.fullName}
                    className="h-full w-full object-cover object-center rounded-full"
                  />
                ) : (
                  <span className="text-3xl font-bold text-green-700">{initials}</span>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900">{user.fullName}</h2>
                <p className="text-slate-600 mt-1">{user.email}</p>

                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>

                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                    User ID: {user._id}
                  </span>

                  {user.createdAt && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border border-slate-200 p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Account Role
                </p>
                <p className="mt-2 text-slate-900 font-semibold">{user.role}</p>
              </div>

              <div className="rounded-lg border border-slate-200 p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Contact Email
                </p>
                <p className="mt-2 text-slate-900 font-semibold">{user.email}</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between flex-wrap gap-3">
              <Link href="/admin/users" className="text-green-600 hover:text-green-700 font-medium">
                ← Back to Users
              </Link>

              <Link
                href={`/admin/users/${user._id}/edit`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit this user →
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Uses real backend: GET <code>/api/admin/users/:id</code> and DELETE{" "}
          <code>/api/admin/users/:id</code>
        </p>
      </div>
    </div>
  );
}
