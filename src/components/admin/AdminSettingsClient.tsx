"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Store,
  Truck,
  UserPlus,
  Users,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type StoreSettings = {
  id?: string;
  store_name?: string | null;
  support_email?: string | null;
  support_phone?: string | null;
  whatsapp_number?: string | null;
  address?: string | null;
  free_delivery_minimum?: number | null;
  standard_delivery_fee?: number | null;
};

type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastSignInAt: string;
  emailConfirmedAt: string;
};

type Props = {
  initialSettings: StoreSettings | null;
  initialUsers: AdminUser[];
};

export default function AdminSettingsClient({
  initialSettings,
  initialUsers,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [settingsForm, setSettingsForm] = useState({
    id: initialSettings?.id || "",
    store_name: initialSettings?.store_name || "Ram Pottery Ltd",
    support_email: initialSettings?.support_email || "info@rampottery.mu",
    support_phone: initialSettings?.support_phone || "",
    whatsapp_number: initialSettings?.whatsapp_number || "",
    address:
      initialSettings?.address || "XJHP+VV Petit Raffray, Mauritius",
    free_delivery_minimum: String(
      initialSettings?.free_delivery_minimum ?? 3000,
    ),
    standard_delivery_fee: String(initialSettings?.standard_delivery_fee ?? 150),
  });

  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "admin",
  });

  function updateSettingsField(key: keyof typeof settingsForm, value: string) {
    setSettingsForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateUserField(key: keyof typeof userForm, value: string) {
    setUserForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveSettings() {
    startTransition(async () => {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsForm),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error || "Could not save settings.");
        return;
      }

      toast.success("Store settings saved.");
      router.refresh();
    });
  }

  async function createUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userForm.email.trim() || !userForm.password.trim()) {
      toast.error("Email and password are required.");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userForm),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error || "Could not create admin user.");
        return;
      }

      toast.success("Admin user created successfully.");

      setUserForm({
        fullName: "",
        email: "",
        password: "",
        role: "admin",
      });

      router.refresh();
    });
  }

  return (
    <div className="space-y-6 pb-8">
      <section className="overflow-hidden rounded-[32px] border border-red-950/10 bg-[linear-gradient(135deg,#2b0909_0%,#4a0f0f_45%,#120505_100%)] p-5 text-white shadow-[0_24px_90px_rgba(70,20,10,0.18)] sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-red-100">
              Ram Pottery Ltd
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.06em] sm:text-4xl">
              Store Settings
            </h1>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/70">
              Manage store details, delivery fees and admin access from one
              secure control center.
            </p>
          </div>

          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] text-center backdrop-blur">
            <MiniStat value="Secure" label="Access" />
            <MiniStat value="Active" label="Store" />
            <MiniStat value={String(initialUsers.length)} label="Admins" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_18px_65px_rgba(15,10,5,0.06)] sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-900">
                <Settings className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-900">
                  Store Configuration
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-neutral-950">
                  Business Details
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={saveSettings}
              disabled={isPending}
              className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full bg-red-900 px-5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_14px_34px_rgba(127,29,29,0.22)] transition hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Settings
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InputBlock
              icon={Store}
              label="Store Name"
              value={settingsForm.store_name}
              onChange={(value) => updateSettingsField("store_name", value)}
            />

            <InputBlock
              icon={Mail}
              label="Support Email"
              type="email"
              value={settingsForm.support_email}
              onChange={(value) => updateSettingsField("support_email", value)}
            />

            <InputBlock
              icon={Phone}
              label="Support Phone"
              value={settingsForm.support_phone}
              onChange={(value) => updateSettingsField("support_phone", value)}
            />

            <InputBlock
              icon={Phone}
              label="WhatsApp Number"
              value={settingsForm.whatsapp_number}
              onChange={(value) => updateSettingsField("whatsapp_number", value)}
            />

            <div className="md:col-span-2">
              <InputBlock
                icon={MapPin}
                label="Business Address"
                value={settingsForm.address}
                onChange={(value) => updateSettingsField("address", value)}
              />
            </div>

            <InputBlock
              icon={Truck}
              label="Free Delivery From"
              type="number"
              value={settingsForm.free_delivery_minimum}
              onChange={(value) =>
                updateSettingsField("free_delivery_minimum", value)
              }
            />

            <InputBlock
              icon={Truck}
              label="Standard Delivery Fee"
              type="number"
              value={settingsForm.standard_delivery_fee}
              onChange={(value) =>
                updateSettingsField("standard_delivery_fee", value)
              }
            />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_18px_65px_rgba(15,10,5,0.06)] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-900">
                <UserPlus className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-900">
                  Admin Access
                </p>
                <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-neutral-950">
                  Create Admin User
                </h2>
              </div>
            </div>

            <form onSubmit={createUser} className="space-y-3">
              <InputBlock
                icon={Building2}
                label="Full Name"
                value={userForm.fullName}
                onChange={(value) => updateUserField("fullName", value)}
              />

              <InputBlock
                icon={Mail}
                label="Email Address"
                type="email"
                value={userForm.email}
                onChange={(value) => updateUserField("email", value)}
              />

              <InputBlock
                icon={ShieldCheck}
                label="Password"
                type="password"
                value={userForm.password}
                onChange={(value) => updateUserField("password", value)}
              />

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-900 px-5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_42px_rgba(127,29,29,0.24)] transition hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Create Admin
              </button>
            </form>
          </div>
        </aside>
      </section>

      <section className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_18px_65px_rgba(15,10,5,0.06)] sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-900">
            <Users className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-900">
              Admin Users
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-neutral-950">
              Store Access List
            </h2>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200">
          <div className="overflow-x-auto">
            <table className="min-w-[820px] w-full text-left text-sm">
              <thead className="bg-[#faf8f4] text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Confirmed</th>
                  <th className="px-4 py-3">Last Login</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {initialUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-sm font-semibold text-neutral-500"
                    >
                      No admin users found.
                    </td>
                  </tr>
                ) : (
                  initialUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="bg-white transition hover:bg-red-50/35"
                    >
                      <td className="px-4 py-4">
                        <p className="font-black text-neutral-950">
                          {user.fullName}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-neutral-500">
                          {user.email}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-red-900">
                          {user.role || "admin"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={
                            user.isActive
                              ? "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700"
                              : "inline-flex rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-neutral-600"
                          }
                        >
                          {user.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {user.emailConfirmedAt ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <span className="text-xs font-bold text-neutral-400">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-xs font-semibold text-neutral-500">
                        {user.lastSignInAt
                          ? new Date(user.lastSignInAt).toLocaleDateString(
                              "en-GB",
                            )
                          : "Never"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function InputBlock({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </span>

      <div className="flex h-12 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-red-900/35 focus-within:ring-4 focus-within:ring-red-900/10">
        <Icon className="h-4 w-4 shrink-0 text-red-900" />

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-full w-full bg-transparent text-sm font-bold text-neutral-950 outline-none placeholder:text-neutral-400"
        />
      </div>
    </label>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-white/10 px-3 py-4 last:border-r-0 sm:px-5">
      <p className="truncate text-sm font-black text-white sm:text-lg">
        {value}
      </p>
      <p className="mt-1 text-[8px] font-black uppercase tracking-[0.16em] text-white/50 sm:text-[9px]">
        {label}
      </p>
    </div>
  );
}