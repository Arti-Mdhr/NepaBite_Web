"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schema";
import { z } from "zod";
import { useRouter } from "next/navigation";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch("http://localhost:5050/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Registration failed");

      router.push("/login");
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";
  const inputStyle = {
    background: "#fff",
    border: "1.5px solid #e5e7eb",
    color: "#111",
  };
  const focusGreen = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "#22c55e");
  const blurGray = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "#e5e7eb");

  return (
    <div className="relative flex w-full max-w-5xl min-h-[680px] rounded-3xl overflow-hidden shadow-2xl">

      {/* ── Left panel ── */}
      <div
        className="hidden md:flex flex-col justify-end w-[45%] bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/img1.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 p-10 pb-12">
          <span
            className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: "#d4f55c", color: "#1a1a1a" }}
          >
            NepaBite
          </span>

          <h1
            className="text-4xl font-black leading-tight text-white mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Your kitchen,<br />inspired daily.
          </h1>

          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Save recipes, track ingredients, and cook smarter every day.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {["🥘 Discover thousands of recipes", "📋 Save your favourites", "🛒 Auto-generate shopping lists"].map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2"
              >
                <span className="text-sm text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div
        className="w-full md:w-[55%] flex flex-col justify-center px-10 py-10"
        style={{ background: "#fafaf7" }}
      >
        {/* Mobile logo */}
        <p
          className="md:hidden text-xs font-bold tracking-widest uppercase mb-6"
          style={{ color: "#22c55e" }}
        >
          NepaBite
        </p>

        <h2
          className="text-3xl font-black mb-1"
          style={{
            fontFamily: "'Inter', Arial, Helvetica, sans-serif",
            color: "#1a1a1a",
          }}
        >
          Create account
        </h2>
        <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
          Join NepaBite and start cooking smarter
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Row: Full Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "#374151" }}>
                Full Name
              </label>
              <input
                {...register("fullName")}
                placeholder="Jane Doe"
                className={inputClass}
                style={{ ...inputStyle }}
                onFocus={focusGreen}
                onBlur={blurGray}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "#374151" }}>
                Phone
              </label>
              <input
                {...register("phoneNumber")}
                placeholder="+977 98XXXXXXXX"
                className={inputClass}
                style={{ ...inputStyle }}
                onFocus={focusGreen}
                onBlur={blurGray}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "#374151" }}>
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              style={{ ...inputStyle }}
              onFocus={focusGreen}
              onBlur={blurGray}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "#374151" }}>
              Address
            </label>
            <input
              {...register("address")}
              placeholder="Kathmandu, Nepal"
              className={inputClass}
              style={{ ...inputStyle }}
              onFocus={focusGreen}
              onBlur={blurGray}
            />
          </div>

          {/* Row: Password + Confirm */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "#374151" }}>
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={inputClass}
                style={{ ...inputStyle }}
                onFocus={focusGreen}
                onBlur={blurGray}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "#374151" }}>
                Confirm
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className={inputClass}
                style={{ ...inputStyle }}
                onFocus={focusGreen}
                onBlur={blurGray}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-95 mt-2"
            style={{
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(34,197,94,0.35)",
            }}
          >
            Create Account →
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
            <span className="text-xs" style={{ color: "#9ca3af" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
          </div>

          <p className="text-center text-sm" style={{ color: "#6b7280" }}>
            Already have an account?{" "}
            <span
              className="font-semibold cursor-pointer"
              style={{ color: "#16a34a" }}
              onClick={() => router.push("/login")}
            >
              Sign in
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}