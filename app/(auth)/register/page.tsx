"use client"

import Header from "@/app/(public)/_components/Header";
import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
      <Header />
      
      <main className="flex items-center justify-center px-4 py-16 sm:py-20">
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-green-100 p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join NepaBite today</p>
            </div>
            
            <RegisterForm />
            
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-green-600 hover:text-green-700 transition-colors">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}