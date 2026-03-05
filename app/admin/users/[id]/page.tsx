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
  phoneNumber?: string;
  address?: string;
  image?: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

export default function AdminUserViewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = (params?.id as string) || "";

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<ApiUser | null>(null);

  const token = Cookies.get("token");

  const resolveImageUrl = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http")) return src;
    return `${API_BASE}${src}`;
  };

  const isMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);

  useEffect(() => {
    if (!isMongoId(userId)) {
      setError("Invalid user id.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) throw new Error(data?.message || "Failed to load user");

        setUser(data?.user ?? data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) fetchUser();
  }, [userId, token]);

  const initials = useMemo(() => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const handleDelete = async () => {
    if (!user) return;

    if (!confirm("Delete this user? This cannot be undone.")) return;

    try {
      setDeleting(true);

      const res = await fetch(`${API_BASE}/api/admin/users/${user._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) throw new Error(data?.message || "Delete failed");

      router.push("/admin/users");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        <p className="text-sm text-zinc-500">Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10">
        <p className="text-sm text-red-500">{error || "User not found"}</p>
        <Link href="/admin/users" className="text-sm text-zinc-500">
          ← Back to users
        </Link>
      </div>
    );
  }

  const imageUrl = user.image ? resolveImageUrl(user.image) : "";

  return (
    <div className="p-10">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1">
            People
          </p>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            User Details
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/admin/users/${user._id}/edit`}
            className="px-4 py-2 text-sm bg-zinc-900 text-white rounded-xl hover:bg-zinc-700"
          >
            Edit
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* User Card */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-8 max-w-3xl">

        <div className="flex items-center gap-6 mb-8">

          <div className="w-20 h-20 rounded-full bg-zinc-100 overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-semibold text-zinc-500">
                {initials}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              {user.fullName}
            </h2>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="border border-zinc-100 rounded-xl p-4">
            <p className="text-xs text-zinc-400 uppercase mb-1">Role</p>
            <p className="text-sm font-medium text-zinc-900">{user.role}</p>
          </div>

          <div className="border border-zinc-100 rounded-xl p-4">
            <p className="text-xs text-zinc-400 uppercase mb-1">User ID</p>
            <p className="text-sm text-zinc-600 font-mono">{user._id}</p>
          </div>

          <div className="border border-zinc-100 rounded-xl p-4">
            <p className="text-xs text-zinc-400 uppercase mb-1">Joined</p>
            <p className="text-sm text-zinc-600">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>

          <div className="border border-zinc-100 rounded-xl p-4">
            <p className="text-xs text-zinc-400 uppercase mb-1">Email</p>
            <p className="text-sm text-zinc-600">{user.email}</p>
          </div>

        </div>

        <div className="mt-8">
          <Link
            href="/admin/users"
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            ← Back to Users
          </Link>
        </div>

      </div>

    </div>
  );
}