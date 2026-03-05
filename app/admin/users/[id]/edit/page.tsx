"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

export default function AdminUserEditPage() {
  const params = useParams();
  const router = useRouter();
  const userId = (params?.id as string) || "";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState<ApiUser | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "user" as Role,
    password: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const token = Cookies.get("token");

  const resolveImageUrl = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("blob:"))
      return src;
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
        const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) throw new Error(data?.message || "Failed to load user");

        const fetched: ApiUser = data?.user ?? data;

        setUser(fetched);

        setFormData({
          fullName: fetched.fullName || "",
          email: fetched.email || "",
          role: fetched.role || "user",
          password: "",
        });

        if (fetched.image) setImagePreview(resolveImageUrl(fetched.image));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) fetchUser();
  }, [userId, token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const previewUrl = resolveImageUrl(imagePreview);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      setError("");

      const formPayload = new FormData();

      formPayload.append("fullName", formData.fullName);
      formPayload.append("email", formData.email);
      formPayload.append("role", formData.role);

      if (formData.password.trim()) {
        formPayload.append("password", formData.password.trim());
      }

      if (imageFile) {
        formPayload.append("image", imageFile);
      }

      const res = await fetch(`${API_BASE}/api/admin/users/${user._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload,
      });

      const data = await res.json();

      if (!res.ok || !data?.success)
        throw new Error(data?.message || "Update failed");

      router.push(`/admin/users/${user._id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        <p className="text-sm text-black">Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10">
        <p className="text-red-500 text-sm">{error || "User not found"}</p>
        <Link href="/admin/users" className="text-sm text-zinc-500">
          ← Back to users
        </Link>
      </div>
    );
  }

  return (
    <div className="p-10 text-black" >

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1">
            People
          </p>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Edit User
          </h1>
        </div>

        <Link
          href={`/admin/users/${user._id}`}
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Cancel
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-8 max-w-3xl">

        {error && (
          <div className="mb-6 text-sm text-red-500">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">
              Profile Image
            </label>

            <div className="flex items-center gap-6">

              <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-zinc-500">
                    {formData.fullName?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />

            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">
              Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">
              New Password
            </label>

            <input
              name="password"
              type="password"
              placeholder="Leave blank to keep current password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">

            <Link
              href={`/admin/users/${user._id}`}
              className="px-5 py-2 text-sm border border-zinc-200 rounded-xl hover:bg-zinc-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update User"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}