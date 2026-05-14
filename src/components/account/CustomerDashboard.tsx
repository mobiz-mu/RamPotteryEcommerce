"use client";

import Link from "next/link";
import {
  Clock3,
  Home,
  Loader2,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  Save,
  Search,
  ShieldCheck,
  ShoppingBag,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type CustomerProfile = {
  full_name?: string;
  email?: string;
  phone?: string;
  shipping_full_name?: string;
  shipping_phone?: string;
  shipping_address_line_1?: string;
  shipping_address_line_2?: string;
  shipping_city?: string;
  shipping_postcode?: string;
  shipping_country?: string;
};

type DashboardUser = {
  id: string;
  email: string;
  fullName: string;
};

type RecentSearch = {
  query: string;
  date: string;
};

type OrderPreview = {
  id: string;
  title: string;
  date: string;
  total: string;
  status: string;
};

const recentSearchFallback: RecentSearch[] = [
  { query: "Clay pots", date: "Recently" },
  { query: "Pooja items", date: "Recently" },
  { query: "Terracotta décor", date: "Recently" },
];

export default function CustomerDashboard({ user }: { user: DashboardUser }) {
  const [profile, setProfile] = useState<CustomerProfile>({
    full_name: user.fullName,
    email: user.email,
    shipping_country: "Mauritius",
  });

  const [editing, setEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [orders, setOrders] = useState<OrderPreview[]>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/account/profile", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data?.error || "Could not load profile.");
          return;
        }

        setProfile({
          full_name: data.profile?.full_name || user.fullName,
          email: data.profile?.email || user.email,
          phone: data.profile?.phone || "",
          shipping_full_name: data.profile?.shipping_full_name || "",
          shipping_phone: data.profile?.shipping_phone || "",
          shipping_address_line_1:
            data.profile?.shipping_address_line_1 || "",
          shipping_address_line_2:
            data.profile?.shipping_address_line_2 || "",
          shipping_city: data.profile?.shipping_city || "",
          shipping_postcode: data.profile?.shipping_postcode || "",
          shipping_country: data.profile?.shipping_country || "Mauritius",
        });
      } catch {
        toast.error("Could not load customer profile.");
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [user.email, user.fullName]);


 useEffect(() => {
  async function loadOrders() {
    try {
      const response = await fetch("/api/account/orders", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) return;

      const mappedOrders: OrderPreview[] = Array.isArray(data.orders)
        ? data.orders.map((order: any) => ({
            id: String(order.id),
            title: order.order_number || "Ram Pottery Order",
            date: order.created_at
              ? new Date(order.created_at).toLocaleDateString("en-MU", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Recently",
            total: `Rs ${Number(order.total_amount || 0).toLocaleString(
              "en-MU",
            )}`,
            status: order.status || "Pending",
          }))
        : [];

      setOrders(mappedOrders);
    } catch {
      setOrders([]);
    }
  }

  loadOrders();
}, []);

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem("ram-pottery-recent-searches") ||
        window.localStorage.getItem("recent-searches") ||
        "";

      const parsed = raw ? JSON.parse(raw) : [];

      if (Array.isArray(parsed) && parsed.length > 0) {
        setRecentSearches(
          parsed
            .slice(0, 5)
            .map((item: any) =>
              typeof item === "string"
                ? { query: item, date: "Recently" }
                : {
                    query: String(item.query || item.q || ""),
                    date: String(item.date || "Recently"),
                  },
            )
            .filter((item: RecentSearch) => item.query),
        );
      } else {
        setRecentSearches(recentSearchFallback);
      }
    } catch {
      setRecentSearches(recentSearchFallback);
    }
  }, []);

  const shippingComplete = useMemo(() => {
    return Boolean(
      profile.shipping_full_name &&
        profile.shipping_phone &&
        profile.shipping_address_line_1 &&
        profile.shipping_city,
    );
  }, [profile]);

  function updateField(key: keyof CustomerProfile, value: string) {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveProfile() {
    setSaving(true);

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error || "Could not save profile.");
        setSaving(false);
        return;
      }

      setProfile(data.profile);
      setEditing(false);
      toast.success("Customer details updated.");
    } catch {
      toast.error("Could not save customer details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <div className="mb-6 overflow-hidden rounded-[34px] border border-neutral-200 bg-white px-5 py-7 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-900">
                My Account
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-[-0.06em] text-neutral-950 sm:text-4xl lg:text-5xl">
                Customer Dashboard
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                Welcome,{" "}
                <span className="font-black text-neutral-950">
                  {profile.full_name || user.fullName || user.email}
                </span>
                . Manage your customer details, shipping address, searches and
                order activity.
              </p>
            </div>

            <div className="grid grid-cols-3 overflow-hidden rounded-[24px] border border-neutral-200 bg-[#faf8f4] shadow-sm">
              <MiniStat value="Secure" label="Account" />
              <MiniStat value={shippingComplete ? "Saved" : "Add"} label="Shipping" />
              <MiniStat value={String(orders.length)} label="Orders" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[34px] border border-neutral-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-7">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
                  Customer Details
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
                  Profile & Shipping Address
                </h2>
              </div>

              <button
                type="button"
                onClick={() => (editing ? saveProfile() : setEditing(true))}
                disabled={saving || loadingProfile}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-900 px-5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_14px_34px_rgba(127,29,29,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : editing ? (
                  <>
                    <Save className="h-4 w-4" />
                    Save
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </>
                )}
              </button>
            </div>

            {loadingProfile ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-[28px] border border-neutral-200 bg-neutral-50">
                <Loader2 className="h-6 w-6 animate-spin text-red-900" />
              </div>
            ) : (
              <div className="grid gap-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputBlock
                    icon={<User className="h-4 w-4" />}
                    label="Full Name"
                    value={profile.full_name || ""}
                    editable={editing}
                    onChange={(value) => updateField("full_name", value)}
                  />

                  <InputBlock
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={profile.email || user.email}
                    editable={false}
                    onChange={() => {}}
                  />

                  <InputBlock
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone / WhatsApp"
                    value={profile.phone || ""}
                    editable={editing}
                    placeholder="+230 5xxxxxxx"
                    onChange={(value) => updateField("phone", value)}
                  />

                  <InputBlock
                    icon={<ShieldCheck className="h-4 w-4" />}
                    label="Account Type"
                    value="Customer"
                    editable={false}
                    onChange={() => {}}
                  />
                </div>

                <div className="rounded-[28px] border border-neutral-200 bg-[#faf8f4] p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-900 text-white">
                      <Home className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-black tracking-[-0.03em] text-neutral-950">
                        Shipping Address
                      </h3>
                      <p className="text-xs font-semibold text-neutral-500">
                        Add or edit your delivery details.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <InputBlock
                      label="Recipient Name"
                      value={profile.shipping_full_name || ""}
                      editable={editing}
                      placeholder="Full name"
                      onChange={(value) =>
                        updateField("shipping_full_name", value)
                      }
                    />

                    <InputBlock
                      label="Shipping Phone"
                      value={profile.shipping_phone || ""}
                      editable={editing}
                      placeholder="+230 5xxxxxxx"
                      onChange={(value) =>
                        updateField("shipping_phone", value)
                      }
                    />

                    <InputBlock
                      label="Address Line 1"
                      value={profile.shipping_address_line_1 || ""}
                      editable={editing}
                      placeholder="Street / building / area"
                      onChange={(value) =>
                        updateField("shipping_address_line_1", value)
                      }
                    />

                    <InputBlock
                      label="Address Line 2"
                      value={profile.shipping_address_line_2 || ""}
                      editable={editing}
                      placeholder="Apartment / landmark"
                      onChange={(value) =>
                        updateField("shipping_address_line_2", value)
                      }
                    />

                    <InputBlock
                      label="City / Village"
                      value={profile.shipping_city || ""}
                      editable={editing}
                      placeholder="Port Louis, Curepipe..."
                      onChange={(value) =>
                        updateField("shipping_city", value)
                      }
                    />

                    <InputBlock
                      label="Postcode"
                      value={profile.shipping_postcode || ""}
                      editable={editing}
                      placeholder="Optional"
                      onChange={(value) =>
                        updateField("shipping_postcode", value)
                      }
                    />

                    <InputBlock
                      label="Country"
                      value={profile.shipping_country || "Mauritius"}
                      editable={editing}
                      onChange={(value) =>
                        updateField("shipping_country", value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside className="grid gap-6">
            <section className="rounded-[34px] border border-neutral-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
                    My Orders
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
                    Recent Orders
                  </h2>
                </div>

                <Package className="h-6 w-6 text-red-900" />
              </div>

              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-neutral-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-neutral-950">
                            {order.title}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-neutral-500">
                            {order.date}
                          </p>
                        </div>

                        <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-red-900">
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-black text-neutral-950">
                        {order.total}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<ShoppingBag className="h-5 w-5" />}
                  title="No orders yet"
                  desc="Your Ram Pottery orders will appear here after checkout."
                  href="/shop"
                  cta="Start Shopping"
                />
              )}
            </section>

            <section className="rounded-[34px] border border-neutral-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
                    Recent Searches
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
                    Your Activity
                  </h2>
                </div>

                <Search className="h-6 w-6 text-red-900" />
              </div>

              <div className="space-y-3">
                {recentSearches.map((item) => (
                  <Link
                    key={`${item.query}-${item.date}`}
                    href={`/shop?q=${encodeURIComponent(item.query)}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 transition hover:border-red-900/20 hover:bg-red-50/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-neutral-950">
                        {item.query}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-neutral-500">
                        <Clock3 className="h-3 w-3" />
                        {item.date}
                      </p>
                    </div>

                    <MapPin className="h-4 w-4 shrink-0 text-red-900" />
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-neutral-200 px-4 py-4 text-center last:border-r-0">
      <p className="text-sm font-black text-red-900 sm:text-lg">{value}</p>
      <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-neutral-400">
        {label}
      </p>
    </div>
  );
}

function InputBlock({
  icon,
  label,
  value,
  editable,
  placeholder,
  onChange,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  editable: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </span>

      <div
        className={`flex h-12 items-center gap-3 rounded-2xl border px-4 transition ${
          editable
            ? "border-neutral-200 bg-white focus-within:border-red-900/35 focus-within:ring-4 focus-within:ring-red-900/10"
            : "border-neutral-200 bg-neutral-50"
        }`}
      >
        {icon ? <span className="text-red-900">{icon}</span> : null}

        <input
          value={value}
          disabled={!editable}
          placeholder={placeholder || label}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-neutral-950 outline-none placeholder:text-neutral-400 disabled:text-neutral-500"
        />
      </div>
    </label>
  );
}

function EmptyState({
  icon,
  title,
  desc,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-[28px] border border-neutral-200 bg-[#faf8f4] p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-900 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-4 text-xl font-black tracking-[-0.03em] text-neutral-950">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-600">
        {desc}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex rounded-full bg-red-900 px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-red-800"
      >
        {cta}
      </Link>
    </div>
  );
}