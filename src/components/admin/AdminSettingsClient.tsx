"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Plus, Save, Settings2, Shield, Trash2, UserCog } from "lucide-react";

type StoreSettings = {
  id?: string;
  store_name?: string | null;
  store_email?: string | null;
  store_phone?: string | null;
  whatsapp_number?: string | null;
  address?: string | null;
  announcement_text?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  tiktok_url?: string | null;
  linkedin_url?: string | null;
};

type AdminUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  email_confirmed_at: string;
  banned_until: string | null;
  is_disabled: boolean;
};

type Props = {
  initialSettings: StoreSettings | null;
  initialUsers: AdminUser[];
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

export default function AdminSettingsClient({
  initialSettings,
  initialUsers,
}: Props) {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: initialSettings?.store_name ?? "Ram Pottery",
    store_email: initialSettings?.store_email ?? "",
    store_phone: initialSettings?.store_phone ?? "",
    whatsapp_number: initialSettings?.whatsapp_number ?? "",
    address: initialSettings?.address ?? "",
    announcement_text: initialSettings?.announcement_text ?? "",
    facebook_url: initialSettings?.facebook_url ?? "",
    instagram_url: initialSettings?.instagram_url ?? "",
    tiktok_url: initialSettings?.tiktok_url ?? "",
    linkedin_url: initialSettings?.linkedin_url ?? "",
  });

  const [users, setUsers] = useState<AdminUser[]>(initialUsers);

  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [settingsError, setSettingsError] = useState("");

  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [userActionLoading, setUserActionLoading] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState("");
  const [userError, setUserError] = useState("");

  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) => user.email.toLowerCase().includes(q));
  }, [users, search]);

  async function refreshUsers() {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) {
      setUsers(json.data ?? []);
    }
  }

  async function saveSettings() {
    setSettingsLoading(true);
    setSettingsMessage("");
    setSettingsError("");

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    const json = await res.json();
    setSettingsLoading(false);

    if (!res.ok) {
      setSettingsError(json.error || "Unable to save settings.");
      return;
    }

    setSettingsMessage("Settings saved successfully.");
  }

  async function createUser() {
    setUserActionLoading("create");
    setUserMessage("");
    setUserError("");

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
    setUserActionLoading(null);

    if (!res.ok) {
      setUserError(json.error || "Unable to create user.");
      return;
    }

    setUserMessage("New user created successfully.");
    setNewUserEmail("");
    setNewUserPassword("");
    await refreshUsers();
  }

  async function updateUserEmail(userId: string, email: string) {
    setUserActionLoading(userId);
    setUserMessage("");
    setUserError("");

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const json = await res.json();
    setUserActionLoading(null);

    if (!res.ok) {
      setUserError(json.error || "Unable to update email.");
      return;
    }

    setUserMessage("User email updated.");
    await refreshUsers();
  }

  async function updateUserPassword(userId: string) {
    const password = window.prompt("Enter new password");
    if (!password) return;

    setUserActionLoading(userId);
    setUserMessage("");
    setUserError("");

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const json = await res.json();
    setUserActionLoading(null);

    if (!res.ok) {
      setUserError(json.error || "Unable to update password.");
      return;
    }

    setUserMessage("User password updated.");
  }

  async function toggleUserDisabled(user: AdminUser) {
    setUserActionLoading(user.id);
    setUserMessage("");
    setUserError("");

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_disabled: !user.is_disabled }),
    });

    const json = await res.json();
    setUserActionLoading(null);

    if (!res.ok) {
      setUserError(json.error || "Unable to update user status.");
      return;
    }

    setUserMessage(user.is_disabled ? "User enabled." : "User disabled.");
    await refreshUsers();
  }

  async function deleteUser(userId: string) {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;

    setUserActionLoading(userId);
    setUserMessage("");
    setUserError("");

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });

    const json = await res.json();
    setUserActionLoading(null);

    if (!res.ok) {
      setUserError(json.error || "Unable to delete user.");
      return;
    }

    setUserMessage("User deleted.");
    await refreshUsers();
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-600">
          System
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Settings
        </h1>
        <p className="mt-3 text-sm leading-7 text-neutral-500">
          Manage store details, social links, announcements, and admin users in one premium control panel.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Settings2 className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-950">Store Details</h2>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Store Name
                </label>
                <Input
                  value={settings.store_name ?? ""}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, store_name: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Store Email
                </label>
                <Input
                  value={settings.store_email ?? ""}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, store_email: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Store Phone
                </label>
                <Input
                  value={settings.store_phone ?? ""}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, store_phone: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  WhatsApp Number
                </label>
                <Input
                  value={settings.whatsapp_number ?? ""}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, whatsapp_number: e.target.value }))
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Address
                </label>
                <Textarea
                  className="min-h-24"
                  value={settings.address ?? ""}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, address: e.target.value }))
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Announcement Text
                </label>
                <Textarea
                  className="min-h-24"
                  value={settings.announcement_text ?? ""}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      announcement_text: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">Social Media</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Facebook URL
                </label>
                <Input
                  value={settings.facebook_url ?? ""}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, facebook_url: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Instagram URL
                </label>
                <Input
                  value={settings.instagram_url ?? ""}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, instagram_url: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  TikTok URL
                </label>
                <Input
                  value={settings.tiktok_url ?? ""}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, tiktok_url: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  LinkedIn URL
                </label>
                <Input
                  value={settings.linkedin_url ?? ""}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, linkedin_url: e.target.value }))
                  }
                />
              </div>
            </div>

            {settingsMessage ? (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {settingsMessage}
              </div>
            ) : null}

            {settingsError ? (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {settingsError}
              </div>
            ) : null}

            <div className="mt-6">
              <Button
                type="button"
                onClick={saveSettings}
                disabled={settingsLoading}
                className="h-12 rounded-xl bg-red-600 px-6 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {settingsLoading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <UserCog className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-950">Create Admin User</h2>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Email
                </label>
                <Input
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="admin@rampottery.mu"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Password
                </label>
                <Input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Enter strong password"
                />
              </div>

              <Button
                type="button"
                onClick={createUser}
                disabled={userActionLoading === "create"}
                className="h-12 w-full rounded-xl bg-red-600 px-6 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                {userActionLoading === "create" ? "Creating..." : "Create User"}
              </Button>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-neutral-950">Admin Users</h2>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email"
                className="max-w-[200px]"
              />
            </div>

            {userMessage ? (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {userMessage}
              </div>
            ) : null}

            {userError ? (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {userError}
              </div>
            ) : null}

            <div className="mt-5 space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
                  No users found.
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <AdminUserCard
                    key={user.id}
                    user={user}
                    loading={userActionLoading === user.id}
                    onUpdateEmail={updateUserEmail}
                    onUpdatePassword={updateUserPassword}
                    onToggleDisabled={toggleUserDisabled}
                    onDelete={deleteUser}
                  />
                ))
              )}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">Security Notes</h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-neutral-600">
              <p>• Only authorized admin users should access this panel.</p>
              <p>• Use strong passwords for every admin account.</p>
              <p>• Disable users instead of deleting when temporary access changes are needed.</p>
              <p>• Email and password changes are applied directly through Supabase Auth.</p>
            </div>
          </div>
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
  onToggleDisabled,
  onDelete,
}: {
  user: AdminUser;
  loading: boolean;
  onUpdateEmail: (userId: string, email: string) => Promise<void>;
  onUpdatePassword: (userId: string) => Promise<void>;
  onToggleDisabled: (user: AdminUser) => Promise<void>;
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
              Created: {formatDate(user.created_at)} • Last Sign In: {formatDate(user.last_sign_in_at)}
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
            onClick={() => onToggleDisabled(user)}
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