"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // <-- import js-cookie

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
      // Call your backend login API
      const res = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }

      // Save JWT and username in cookies
      Cookies.set("token", result.token, { expires: 1, path: "/" }); // expires in 1 day
      Cookies.set("username", result.user.fullName, { expires: 1, path: "/" });

      // Redirect to dashboard
      router.push("/auth/dashboard");
    } catch (error: any) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Left Image */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/img1.jpg')" }}
      />

      {/* Right Form */}
      <div className="w-full md:w-1/2 p-10">
        <h2 className="text-3xl font-bold mb-2 text-black">Welcome Back,</h2>
        <p className="text-black mb-8">Sign in to continue to NepaBite</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-lg text-black placeholder-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* Password */}
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg text-black placeholder-black"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>

          <p className="text-center text-sm text-black">
            Don’t have an account?{" "}
            <span
              className="text-green-600 cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
