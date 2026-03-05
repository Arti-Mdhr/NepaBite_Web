"use client";

import Header from "@/app/(public)/_components/Header";
import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
      `}</style>

      <div
        className="min-h-screen flex flex-col"
        style={{
          background: "radial-gradient(ellipse at 60% 0%, #dcfce7 0%, #f0fdf4 40%, #fafaf7 100%)",
        }}
      >
        <Header />

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <RegisterForm />
        </main>

        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(90deg, transparent, #22c55e 40%, #16a34a 60%, transparent)",
            opacity: 0.4,
          }}
        />
      </div>
    </>
  );
}