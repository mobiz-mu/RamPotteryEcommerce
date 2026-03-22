"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Plus, Shield, Trash2 } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  created_at?: string;
  last_sign_in_at?: string | null;
  is_disabled?: boolean;
};

type Props = {
  initialUsers?: AdminUser[];
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "-";
  }
}

export default function AdminUsersManager({ initialUsers = [] }: Props) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function refreshUsers() {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    const json = await res.json();

    if (res.ok) {
      setUsers(json.data ?? []);
    }
  }

  async function createUser() {
    setLoading("create");
    setMessage("");
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: newUserEmail,
        password: newUserPassword,
      }),
    });

    const json = await res.json();
    setLoading(null);

    if (!res.ok) {
      setError(json.error || "Unable to create user.");
      return;
    }

    setMessage("User created successfully.");
    setNewUserEmail("");
    setNewUserPassword("");
    await refreshUsers();
  }

  async function updateUserEmail(userId: string, email: string) {
    setLoading(userId);
    setMessage("");
    setError("");

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const json = await res.json();
    setLoading(null);

    if (!res.ok) {
      setError(json.error || "Unable to update email.");
      return;
    }

    setMessage("User email updated.");
    await refreshUsers();
  }

  async function updateUserPassword(userId: string) {
    const password = window.prompt("Enter new password");
    if (!password) return;

    setLoading(userId);
    setMessage("");
    setError("");

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const json = await res.json();
    setLoading(null);

    if (!res.ok) {
      setError(json.error || "Unable to update password.");
      return;
    }

    setMessage("Password updated.");
  }

  async function toggleUser(user: AdminUser) {
    setLoading(user.id);
    setMessage("");
    setError("");

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_disabled: !user.is_disabled }),
    });

    const json = await res.json();
    setLoading(null);

    if (!res.ok) {
      setError(json.error || "Unable to update user.");
      return;
    }

    setMessage(user.is_disabled ? "User enabled." : "User disabled.");
    await refreshUsers();
  }

  async function deleteUser(userId: string) {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;

    setLoading(userId);
    setMessage("");
    setError("");

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });

    const json = await res.json();
    setLoading(null);

    if (!res.ok) {
      setError(json.error || "Unable to delete user.");
      return;
    }

    setMessage("User deleted.");
    await refreshUsers();
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-semibold text-neutral-950">Admin Users</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">
              New User Email
            </label>
            <Input
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="admin@rampottery.mu"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">
              New User Password
            </label>
            <Input
              type="password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              placeholder="Enter strong password"
            />
          </div>
        </div>

        <div className="mt-4">
          <Button
            type="button"
            onClick={createUser}
            disabled={loading === "create"}
            className="h-11 rounded-xl bg-red-600 px-6 text-white hover:bg-red-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            {loading === "create" ? "Creating..." : "Create User"}
          </Button>
        </div>

        {message ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {users.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
              No users found.
            </div>
          ) : (
            users.map((user) => (
              <AdminUserCard
                key={user.id}
                user={user}
                loading={loading === user.id}
                onUpdateEmail={updateUserEmail}
                onUpdatePassword={updateUserPassword}
                onToggleUser={toggleUser}
                onDelete={deleteUser}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function AdminUserCard({
  user,
  loading,
  onUpdateEmail,
  onUpdatePassword,
  onToggleUser,
  onDelete,
}: {
  user: AdminUser;
  loading: boolean;
  onUpdateEmail: (userId: string, email: string) => Promise<void>;
  onUpdatePassword: (userId: string) => Promise<void>;
  onToggleUser: (user: AdminUser) => Promise<void>;
  onDelete: (userId: string) => Promise<void>;
}) {
  const [email, setEmail] = useState(user.email);

  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="font-medium text-neutral-950">{user.email}</div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  user.is_disabled
                    ? "bg-neutral-100 text-neutral-600"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {user.is_disabled ? "Disabled" : "Active"}
              </span>
            </div>

            <div className="mt-1 text-xs text-neutral-500">
              Created: {formatDate(user.created_at)} • Last Sign In:{" "}
              {formatDate(user.last_sign_in_at)}
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Shield className="h-4 w-4" />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />

          <Button
            type="button"
            variant="outline"
            onClick={() => onUpdateEmail(user.id, email)}
            disabled={loading}
            className="h-10 rounded-xl"
          >
            <Mail className="mr-2 h-4 w-4" />
            Update Email
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onUpdatePassword(user.id)}
            disabled={loading}
            className="h-10 rounded-xl"
          >
            <Lock className="mr-2 h-4 w-4" />
            Password
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onToggleUser(user)}
            disabled={loading}
            className="h-10 rounded-xl"
          >
            {user.is_disabled ? "Enable" : "Disable"}
          </Button>
        </div>

        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => onDelete(user.id)}
            disabled={loading}
            className="h-10 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </Button>
        </div>
      </div>
    </div>
  );
}