"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e:any) => {
    e.preventDefault();

    try {

      const res = await fetch("http://localhost:5050/api/auth/forgot-password",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      setMessage(data.message || "Reset email sent");

    } catch (error) {
      setMessage("Something went wrong");
    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-white">

      <form onSubmit={submit} className="bg-white p-8 shadow-md rounded-xl w-96">

        <h1 className="text-2xl font-bold mb-4">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="border p-3 w-full rounded-lg mb-4"
        />

        <button
          type="submit"
          className="bg-red-500 text-white w-full p-3 rounded-lg"
        >
          Send Reset Link
        </button>

        {message && (
          <p className="mt-4 text-sm text-green-600">
            {message}
          </p>
        )}

      </form>

    </div>

  );

}