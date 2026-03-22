"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
};

type Props = {
  users: AdminUser[];
};

export default function AdminUsersManager({ users }: Props) {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function createUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingCreate(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/settings/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ full_name: fullName, email, password, role }),
    });

    const json = await res.json();
    setLoadingCreate(false);

    if (!res.ok) {
      setError(json.error || "Unable to create user.");
      return;
    }

    setSuccess("Admin user created successfully.");
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("admin");
    router.refresh();
  }

  async function updatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingPassword(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/settings/users/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: selectedUserId, password: newPassword }),
    });

    const json = await res.json();
    setLoadingPassword(false);

    if (!res.ok) {
      setError(json.error || "Unable to update password.");
      return;
    }

    setSuccess("Password updated successfully.");
    setSelectedUserId("");
    setNewPassword("");
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-semibold text-neutral-950">Admin Users</h2>

        <div className="mt-5 space-y-3">
          {users.length === 0 ? (
            <p className="text-sm text-neutral-500">No admin users found.</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border border-neutral-200 p-4"
              >
                <div className="font-medium text-neutral-950">
                  {user.full_name || "Admin User"}
                </div>
                <div className="mt-1 text-sm text-neutral-500">{user.email}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                    {user.role}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <form
        onSubmit={createUser}
        className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
      >
        <h2 className="text-xl font-semibold text-neutral-950">Create New User</h2>

        <div className="mt-6 grid gap-5">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email address"
            className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            required
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loadingCreate}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
        >
          {loadingCreate ? "Creating..." : "Create User"}
        </button>
      </form>

      <form
        onSubmit={updatePassword}
        className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
      >
        <h2 className="text-xl font-semibold text-neutral-950">Update User Password</h2>

        <div className="mt-6 grid gap-5">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring