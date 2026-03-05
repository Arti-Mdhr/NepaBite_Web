"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

type Role = "admin" | "user";
interface User {
  _id: string;
  fullName: string;
  email: string;
  role: Role;
  createdAt?: string;
  image?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
const resolveImageUrl = (src?: string) =>
  src ? (src.startsWith("http") ? src : `${API_BASE}${src}`) : "";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = Cookies.get("token");
      if (!token) { setError("Not authenticated."); return; }

      const res = await fetch(`${API_BASE}/api/admin/users?page=1&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Failed to load users");
      setUsers(data.users || []);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter((u) =>
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Delete failed");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (e: any) {
      alert(e.message || "Delete failed");
    }
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1">People</p>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Users</h1>
        </div>
        <Link
          href="/admin/users/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-700 transition-colors"
        >
          <span className="text-base leading-none">+</span> New User
        </Link>
      </div>

      {/* Search + refresh */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-400"
        />
        <button
          onClick={fetchUsers}
          className="px-4 py-2.5 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[40px_1fr_200px_80px_120px_120px] gap-4 px-6 py-3 border-b border-zinc-100 bg-zinc-50">
          <div />
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Name</div>
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Email</div>
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Role</div>
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Joined</div>
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</div>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-sm text-zinc-400">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-zinc-400">No users found.</div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {filtered.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-[40px_1fr_200px_80px_120px_120px] gap-4 px-6 py-4 items-center hover:bg-zinc-50/60 transition-colors"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-zinc-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {user.image ? (
                    <img src={resolveImageUrl(user.image)} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-semibold text-zinc-500">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{user.fullName}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 font-mono truncate">{user._id}</p>
                </div>

                {/* Email */}
                <div className="text-sm text-zinc-500 truncate">{user.email}</div>

                {/* Role */}
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-600"
                  }`}>
                    {user.role}
                  </span>
                </div>

                {/* Joined */}
                <div className="text-xs text-zinc-400">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/users/${user._id}`}
                    className="text-xs font-medium text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/users/${user._id}/edit`}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50">
            <p className="text-xs text-zinc-400">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>
    </div>
  );
}