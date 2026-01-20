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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Registration failed");
    }

    router.push("/login");
  } catch (error: any) {
    console.error(error.message);
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
        <h2 className="text-3xl font-bold mb-2 text-black">Namaste,</h2>
        <p className="text-black mb-6">Create your NepaBite account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("fullName")}
            placeholder="Full Name"
            className="w-full px-4 py-3 border rounded-lg text-black placeholder-black"
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}

          <input
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-lg text-black placeholder-black"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input
            {...register("phoneNumber")}
            placeholder="Phone Number"
            className="w-full px-4 py-3 border rounded-lg text-black placeholder-black"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}

          <input
            {...register("address")}
            placeholder="Address"
            className="w-full px-4 py-3 border rounded-lg text-black placeholder-black"
          />

          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg text-black placeholder-black"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className="w-full px-4 py-3 border rounded-lg text-black placeholder-black"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            Sign up
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-green-600 cursor-pointer"
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
