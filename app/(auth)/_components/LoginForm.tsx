"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }

      Cookies.set("token", result.token, { expires: 1, path: "/" });
      Cookies.set("username", result.user.fullName, { path: "/" });
      Cookies.set("role", result.user.role, { path: "/" });
      Cookies.set("userId", result.user._id, { path: "/" });

      // ✅ Redirect based on role
      if (result.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="relative flex w-full max-w-5xl min-h-[600px] rounded-3xl overflow-hidden shadow-2xl">

      {/* ── Left panel: image + overlay copy ── */}
      <div
        className="hidden md:flex flex-col justify-end w-[55%] bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/img1.jpg')" }}
      >
        {/* dark gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 p-10 pb-12">
          {/* brand pill */}
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
            Find your next favorite<br />Nepali cuisine.
          </h1>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div
        className="w-full md:w-[45%] flex flex-col justify-center px-10 py-12"
        style={{ background: "#fafaf7" }}
      >
        {/* Mobile logo */}
        <p
          className="md:hidden text-xs font-bold tracking-widest uppercase mb-8"
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
          Namaste
        </h2>
        <p className="text-sm mb-10" style={{ color: "#6b7280" }}>
          Sign in to your account to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label
              className="block text-xs font-semibold tracking-wide uppercase mb-1.5"
              style={{ color: "#374151" }}
            >
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "#fff",
                border: "1.5px solid #e5e7eb",
                color: "#111",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "#374151" }}
              >
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-xs font-medium transition-colors"
                style={{ color: "#22c55e" }}
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "#fff",
                border: "1.5px solid #e5e7eb",
                color: "#111",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(34,197,94,0.35)",
            }}
          >
            Sign in →
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
            <span className="text-xs" style={{ color: "#9ca3af" }}>
              or
            </span>
            <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
          </div>

          {/* Sign up */}
          <p className="text-center text-sm" style={{ color: "#6b7280" }}>
            Don't have an account?{" "}
            <span
              className="font-semibold cursor-pointer transition-colors"
              style={{ color: "#16a34a" }}
              onClick={() => router.push("/register")}
            >
              Create one
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}