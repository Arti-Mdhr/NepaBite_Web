"use client"

import Header from "@/app/(public)/_components/Header";
import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
      <Header />
      
      <main className="flex items-center justify-center px-4 py-16 sm:py-20">
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-green-100 p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to continue to NepaBite</p>
            </div>
            
            <LoginForm />
            
            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="font-semibold text-green-600 hover:text-green-700 transition-colors">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}