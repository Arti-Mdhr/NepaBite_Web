import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); setError("");

    const res = await fetch("http://localhost:5000/api/users/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) setMessage(data.message);
    else setError(data.message);
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
      <h2>Forgot Password</h2>
      <p>Enter your email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email" placeholder="your@email.com" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      {message && <p style={{ color: "green", marginTop: 12 }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
    </div>
  );
}