// "use client";

// import { apiFetch } from "@/lib/api";
// import { useParams, useRouter } from "next/navigation";
// import { useState } from "react";


// export default function ResetPasswordPage() {
//   const { token } = useParams();
//   const router = useRouter();

//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async (e: any) => {
//     e.preventDefault();
//     if (password !== confirm) return setError("Passwords do not match");

//     setLoading(true);
//     setError(""); setMessage("");

//     try {
//       const data: any = await apiFetch("/api/auth/reset-password", {
//         method: "POST",
//         body: JSON.stringify({ token, password }),
//       });
//       setMessage(data.message || "Password reset successful!");
//       setTimeout(() => router.push("/login"), 2000);
//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <form onSubmit={submit} className="bg-white shadow-md p-8 rounded-xl w-96">
//         <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

//         <input
//           type="password"
//           placeholder="New password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="border p-3 w-full rounded-lg mb-3"
//         />
//         <input
//           type="password"
//           placeholder="Confirm new password"
//           value={confirm}
//           onChange={(e) => setConfirm(e.target.value)}
//           required
//           className="border p-3 w-full rounded-lg mb-4"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-green-600 text-white w-full p-3 rounded-lg disabled:opacity-50"
//         >
//           {loading ? "Resetting..." : "Reset Password"}
//         </button>

//         {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
//         {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
//       </form>
//     </div>
//   );
// }