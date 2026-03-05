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
      Cookies.set("username", formData.name);
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(`Update failed: ${error?.message ?? "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getInitial = (name?: string) =>
    name && name.length > 0 ? name.charAt(0).toUpperCase() : "?";

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white text-black";
  const inputStyle = { border: "1.5px solid #e5e7eb" };
  const focusGreen = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "#22c55e");
  const blurGray  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "#e5e7eb");

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "radial-gradient(ellipse at 60% 0%, #dcfce7 0%, #f0fdf4 40%, #fafaf7 100%)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.fullName ?? profile?.email ?? "User";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
      `}</style>

      <div
        className="min-h-screen"
        style={{ background: "radial-gradient(ellipse at 60% 0%, #dcfce7 0%, #f0fdf4 40%, #fafaf7 100%)" }}
      >
        {/* ── Top bar ── */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>

            <span
              className="text-lg font-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a1a" }}
            >
              Nepa<span className="text-green-600">Bite</span>
            </span>

            <div className="w-24" /> {/* spacer */}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* ── Profile hero card ── */}
          <div className="rounded-3xl overflow-hidden shadow-lg mb-8" style={{ background: "#fff" }}>
            {/* green banner */}
            <div
              className="px-8 py-10 relative"
              style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
            >
              {/* decorative circles */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                style={{ background: "#fff", transform: "translate(30%, -30%)" }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
                style={{ background: "#fff", transform: "translate(-30%, 30%)" }} />

              <div className="relative flex items-center gap-6">
                {/* avatar */}
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-green-700 font-black text-3xl overflow-hidden flex-shrink-0"
                  style={{ background: "#d4f55c", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    getInitial(displayName)
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-white/70 mb-1">Your Profile</p>
                  <h1
                    className="text-3xl font-black text-white leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {displayName}
                  </h1>
                  <p className="text-white/80 text-sm mt-1">{profile?.email}</p>
                </div>

                {/* member since badge */}
                <div className="ml-auto hidden sm:flex flex-col items-end">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                  >
                    Member since {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Edit form card ── */}
          <div className="rounded-3xl overflow-hidden shadow-lg bg-white">
            <div className="px-8 pt-8 pb-2 border-b border-gray-100">
              <h2
                className="text-xl font-black text-black"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Edit Profile
              </h2>
              <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">

              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase mb-3 text-black">
                  Profile Photo
                </label>
                <div className="flex items-center gap-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-green-700 font-black text-xl overflow-hidden flex-shrink-0"
                    style={{ background: "#d4f55c" }}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      getInitial(formData.name)
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-3 file:py-2 file:px-4
                        file:rounded-xl file:border-0
                        file:text-xs file:font-semibold
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100
                        file:cursor-pointer cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5 text-black">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Jane Doe"
                    className={inputClass}
                    style={{ ...inputStyle }}
                    onFocus={focusGreen}
                    onBlur={blurGray}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5 text-black">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="you@example.com"
                    className={inputClass}
                    style={{ ...inputStyle }}
                    onFocus={focusGreen}
                    onBlur={blurGray}
                  />
                </div>
              </div>

              {/* Password section */}
              <div
                className="rounded-2xl p-6"
                style={{ background: "#fafaf7", border: "1.5px solid #e5e7eb" }}
              >
                <h3
                  className="text-sm font-black tracking-wide uppercase mb-1 text-black"
                >
                  Change Password
                </h3>
                <p className="text-xs text-gray-400 mb-5">Leave blank to keep your current password</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "currentPassword", label: "Current", placeholder: "Current password" },
                    { id: "newPassword",     label: "New",     placeholder: "New password"     },
                    { id: "confirmPassword", label: "Confirm", placeholder: "Confirm password"  },
                  ].map(({ id, label, placeholder }) => (
                    <div key={id}>
                      <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5 text-black">
                        {label}
                      </label>
                      <input
                        type="password"
                        id={id}
                        name={id}
                        value={formData[id as keyof typeof formData]}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className={inputClass}
                        style={{ ...inputStyle, background: "#fff" }}
                        onFocus={focusGreen}
                        onBlur={blurGray}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                  style={{ border: "1.5px solid #e5e7eb" }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #16a34a, #22c55e)",
                    color: "#fff",
                    boxShadow: "0 4px 20px rgba(34,197,94,0.35)",
                  }}
                >
                  {submitting ? "Saving..." : "Save Changes →"}
                </button>
              </div>

            </form>
          </div>

          {/* bottom accent */}
          <div
            className="h-1 w-full mt-8 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #22c55e 40%, #16a34a 60%, transparent)",
              opacity: 0.4,
            }}
          />
        </div>
      </div>
    </>
  );
}