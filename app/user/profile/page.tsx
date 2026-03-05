"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiFetch, resolveImageUrl } from "@/lib/api";

interface UserProfile {
  id: string;
  name: string;
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
    const userId = Cookies.get("userId");
    if (!userId) throw new Error("No userId found");

    const data = await apiFetch<any>(`/api/auth/${userId}`, { auth: true });

    setProfile(data.user ?? data);
    setFormData({
      name: (data.user?.fullName ?? data.fullName ?? ""),
      email: (data.user?.email ?? data.email ?? ""),
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    if (data.user?.image || data.image) {
      setImagePreview(resolveImageUrl(data.user?.image || data.image));
    }
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
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
      const userId = Cookies.get("userId");
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      
      if (formData.newPassword) {
        formDataToSend.append("currentPassword", formData.currentPassword);
        formDataToSend.append("password", formData.newPassword);
      }
      
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const token = Cookies.get("token");

      await apiFetch(`/api/auth/${userId}`, {
        method: "PUT",
        auth: true,
        body: formDataToSend, // FormData is fine
      });

      alert("Profile updated successfully!");
      fetchProfile();
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
        <div className="text-slate-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
              <p className="mt-1 text-sm text-slate-600">Manage your account information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-green-700 font-bold text-3xl shadow-lg">
                {profile?.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold">{profile?.name}</h2>
                <p className="text-green-100 mt-1">{profile?.email}</p>
                <p className="text-green-100 text-sm mt-2">
                  Member since {profile && new Date(profile.createdAt).toLocaleDateString()}
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
                <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-slate-400">
                      {formData.name.charAt(0).toUpperCase()}
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

            {/* Name */}
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
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Change Password</h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg 
                             focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg 
                             focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg 
                             focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
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