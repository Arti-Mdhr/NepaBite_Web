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

export default function AdminUserEditPage() {
  const params = useParams();
  const router = useRouter();
  const userId = (params?.id as string) || "";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const [user, setUser] = useState<ApiUser | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "user" as Role,
    password: "", // optional
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const isMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);
  const API_BASE = "http://localhost:5050";
  const resolveImageUrl = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("blob:")) return src;
    return `${API_BASE}${src}`;
  };

  // ✅ Fetch user
  useEffect(() => {
    if (!userId) return;

    if (!isMongoId(userId)) {
      setError("Invalid user id in URL.");
      setUser(null);
      setLoading(false);
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      setError("No token found. Please login again.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setError("");
        setLoading(true);

        const res = await fetch(`http://localhost:5050/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch user");
        }

        const fetched: ApiUser = data?.user ?? data;

        setUser(fetched);
        setFormData({
          fullName: fetched.fullName || "",
          email: fetched.email || "",
          role: fetched.role || "user",
          password: "",
        });

        if (fetched.image) setImagePreview(resolveImageUrl(fetched.image));
      } catch (e: any) {
        setError(e?.message || "Something went wrong");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  // ✅ Submit PUT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    const token = Cookies.get("token");
    if (!token) {
      setError("No token found. Please login again.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // ✅ This is correct
      const formDataPayload = new FormData();

      formDataPayload.append("fullName", formData.fullName);
      formDataPayload.append("email", formData.email);
      formDataPayload.append("role", formData.role);

      if (formData.password.trim()) {
        formDataPayload.append("password", formData.password.trim());
      }

      if (imageFile) {
        formDataPayload.append("image", imageFile); // ✅ Perfect - matches backend
      }

      const res = await fetch(
        `http://localhost:5050/api/admin/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Correct - NO Content-Type
          },
          body: formDataPayload, // ✅ Correct
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Update failed");
      }

      alert("User updated successfully!");
      router.push(`/admin/users/${user._id}`);
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-500">Loading user data...</div>
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

          <Link href="/admin/users" className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              href={`/admin/users/${user._id}`}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit User</h1>
              <p className="mt-1 text-sm text-slate-600">
                Update user ID: <span className="font-semibold">{user._id}</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload (UI only for now) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Image</label>
              <div className="flex items-center space-x-6">
                <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover object-center rounded-full"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-slate-400">
                      {(formData.fullName || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100
                      file:cursor-pointer cursor-pointer"
                  />
                  <p className="mt-1 text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  {imageFile && (
                    <p className="mt-1 text-xs text-slate-600">
                      Selected: <span className="font-medium">{imageFile.name}</span>
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    (Later we’ll upload this to backend with FormData)
                  </p>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg
                         focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg
                         focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg
                         focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">
                If backend doesn’t allow role update yet, it will show an error (that’s okay for now).
              </p>
            </div>

            {/* Password (optional) */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                New Password (optional)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Leave blank to keep current"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg
                         focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                Your backend currently doesn’t support password update in EditUserDTO. We can add it later safely.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <Link
                href={`/admin/users/${user._id}`}
                className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Updating..." : "Update User"}
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Uses real backend: PUT <code>/api/admin/users/:id</code>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
