"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiFetch, resolveImageUrl } from "@/lib/api";

interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiFetch<any>("/api/auth/profile", { auth: true });
      const user = data?.user ?? data;

      setProfile(user);
      setFormData({
        name: user?.fullName ?? user?.name ?? "",
        email: user?.email ?? "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      if (user?.image) {
        setImagePreview(resolveImageUrl(user.image));
      }
    } catch (e) {
      console.error("Failed to fetch profile:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setSubmitting(true);

    try {
      // Single FormData request to PUT /api/auth/profile
      const payload = new FormData();
      payload.append("fullName", formData.name);
      payload.append("email", formData.email);

      if (formData.newPassword) {
        payload.append("currentPassword", formData.currentPassword);
        payload.append("password", formData.newPassword);
      }

      if (imageFile) {
        payload.append("image", imageFile);
      }

      await apiFetch("/api/auth/profile", {
        method: "PUT",
        auth: true,
        body: payload,
      });

      alert("Profile updated successfully!");
      setImageFile(null);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      fetchProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(`Update failed: ${error?.message ?? "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getInitial = (name?: string) =>
    name && name.length > 0 ? name.charAt(0).toUpperCase() : "?";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
        <div className="text-slate-500">Loading profile...</div>
      </div>
    );
  }

  const displayName = profile?.fullName ?? profile?.email ?? "User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your account information</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Profile Banner */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-green-700 font-bold text-3xl shadow-lg overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  getInitial(displayName)
                )}
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold">{displayName}</h2>
                <p className="text-green-100 mt-1">{profile?.email}</p>
                <p className="text-green-100 text-sm mt-2">
                  Member since{" "}
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Edit Profile</h3>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Profile Image
              </label>
              <div className="flex items-center space-x-6">
                <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-slate-400">
                      {getInitial(formData.name)}
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
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
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
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg
                           focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Password Section */}
            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-1">Change Password</h4>
              <p className="text-xs text-slate-500 mb-4">Leave blank if you don't want to change your password</p>
              <div className="space-y-4">
                {[
                  { id: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
                  { id: "newPassword", label: "New Password", placeholder: "Enter new password" },
                  { id: "confirmPassword", label: "Confirm New Password", placeholder: "Confirm new password" },
                ].map(({ id, label, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">
                      {label}
                    </label>
                    <input
                      type="password"
                      id={id}
                      name={id}
                      value={formData[id as keyof typeof formData]}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg
                                 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}