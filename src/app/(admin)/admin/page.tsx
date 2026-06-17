import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FolderTree,
  Mail,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type OrderRow = {
  id: string;
  order_number: string | null;
  customer_name: string | null;
  total_amount: number | null;
  status: string | null;
  created_at: string | null;
};

type ProductRow = {
  id: string;
  is_active: boolean | null;
  is_in_stock: boolean | null;
  stock_qty: number | null;
};

type CategoryRow = {
  id: string;
};

type SubscriberRow = {
  id: string;
  is_active: boolean | null;
};

function formatCurrency(amount: number | null | undefined) {
  const value = Number(amount ?? 0);
  return `Rs ${value.toLocaleString("en-MU")}`;
}

function formatDate(date: string | null | undefined) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusClasses(status: string | null | undefined) {
  const value = String(status || "pending").toLowerCase();

  if (value === "confirmed") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (value === "shipped") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (value === "delivered") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (value === "cancelled") {
    return "border-neutral-200 bg-neutral-100 text-neutral-600";
  }

  return "border-red-200 bg-red-50 text-red-700";
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "default",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "dark";
}) {
  const toneClasses = {
    default: "bg-red-50 text-red-900",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    dark: "bg-neutral-950 text-white",
  };

  return (
    <div className="group rounded-[28px] border border-neutral-200 bg-white p-5 shadow-[0_16px_55px_rgba(15,10,5,0.055)] transition duration-300 hover:-translate-y-0.5 hover:border-red-900/15 hover:shadow-[0_24px_75px_rgba(15,10,5,0.09)] sm:p-6">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-400">
            {title}
          </p>

          <h3 className="mt-3 truncate text-2xl font-black tracking-[-0.05em] text-neutral-950 sm:text-3xl">
            {value}
          </h3>

          <p className="mt-2 text-sm font-medium leading-6 text-neutral-500">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  title,
  subtitle,
  icon: Icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50/60"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-900">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-black text-neutral-950">
            {title}
          </p>
          <p className="mt-1 truncate text-xs font-semibold text-neutral-500">
            {subtitle}
          </p>
        </div>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-red-900" />
    </Link>
  );
}

function HealthItem({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning";
}) {
  const toneClasses = {
    default: "bg-red-50 text-red-900",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneClasses[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </span>

        <p className="text-sm font-bold text-neutral-600">{label}</p>
      </div>

      <p className="text-sm font-black text-neutral-950">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [ordersRes, productsRes, categoriesRes, subscribersRes] =
    await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, order_number, customer_name, total_amount, status, created_at",
        )
        .order("created_at", { ascending: false }),
      supabase.from("products").select("id, is_active, is_in_stock, stock_qty"),
      supabase.from("categories").select("id"),
      supabase.from("newsletter_subscribers").select("id, is_active"),
    ]);

  const orders = (ordersRes.data ?? []) as OrderRow[];
  const products = (productsRes.data ?? []) as ProductRow[];
  const categories = (categoriesRes.data ?? []) as CategoryRow[];
  const subscribers = (subscribersRes.data ?? []) as SubscriberRow[];

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total_amount ?? 0),
    0,
  );

  const pendingOrders = orders.filter(
    (order) => String(order.status || "pending").toLowerCase() === "pending",
  ).length;

  const confirmedOrders = orders.filter(
    (order) => String(order.status || "").toLowerCase() === "confirmed",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => String(order.status || "").toLowerCase() === "delivered",
  ).length;

  const activeProducts = products.filter((product) => product.is_active).length;

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock_qty ?? 0) > 0 && Number(product.stock_qty ?? 0) <= 5,
  ).length;

  const outOfStockProducts = products.filter(
    (product) => !product.is_in_stock || Number(product.stock_qty ?? 0) <= 0,
  ).length;

  const categoriesCount = categories.length;

  const activeSubscribers = subscribers.filter(
    (subscriber) => subscriber.is_active,
  ).length;

  const recentOrders = orders.slice(0, 7);

  return (
    <div className="space-y-6 pb-8">
      <section className="overflow-hidden rounded-[32px] border border-red-950/10 bg-[linear-gradient(135deg,#2b0909_0%,#4a0f0f_45%,#120505_100%)] p-5 text-white shadow-[0_24px_90px_rgba(70,20,10,0.18)] sm:p-7 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-red-100">
              <Sparkles className="h-3.5 w-3.5" />
              Ram Pottery Ltd
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.06em] sm:text-4xl lg:text-5xl">
              Store Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/70">
              Manage orders, products, stock alerts, customers and store growth
              from one clean business control center.
            </p>
          </div>

          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] text-center backdrop-blur">
            <HeroStat value={String(totalOrders)} label="Orders" />
            <HeroStat value={formatCurrency(totalRevenue)} label="Revenue" />
            <HeroStat value={String(activeProducts)} label="Products" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="Total order value"
          icon={CircleDollarSign}
          tone="dark"
        />

        <StatCard
          title="Orders"
          value={String(totalOrders)}
          subtitle={`${pendingOrders} pending review`}
          icon={ShoppingBag}
          tone="default"
        />

        <StatCard
          title="Products"
          value={String(activeProducts)}
          subtitle={`${lowStockProducts} low stock alerts`}
          icon={Package}
          tone={lowStockProducts > 0 ? "warning" : "success"}
        />

        <StatCard
          title="Subscribers"
          value={String(activeSubscribers)}
          subtitle="Newsletter audience"
          icon={Mail}
          tone="success"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <div className="rounded-[30px] border border-neutral-200 bg-white p-4 shadow-[0_18px_65px_rgba(15,10,5,0.06)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
                Latest Activity
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-neutral-950">
                Recent Orders
              </h2>
            </div>

            <Link
              href="/admin/orders"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-red-900"
            >
              View Orders
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-left text-sm">
                <thead className="bg-[#faf8f4] text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-sm font-semibold text-neutral-500"
                      >
                        No orders found yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="bg-white transition hover:bg-red-50/35"
                      >
                        <td className="px-4 py-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-black text-neutral-950 transition hover:text-red-900"
                          >
                            {order.order_number ||
                              order.id.slice(0, 8).toUpperCase()}
                          </Link>
                        </td>

                        <td className="px-4 py-4 font-semibold text-neutral-600">
                          {order.customer_name || "-"}
                        </td>

                        <td className="px-4 py-4 font-black text-neutral-950">
                          {formatCurrency(order.total_amount)}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${getStatusClasses(
                              order.status,
                            )}`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </td>

                        <td className="px-4 py-4 font-semibold text-neutral-500">
                          {formatDate(order.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_18px_65px_rgba(15,10,5,0.06)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-900">
                <TrendingUp className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-900">
                  Store Health
                </p>
                <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-neutral-950">
                  Business Summary
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <HealthItem
                label="Confirmed"
                value={String(confirmedOrders)}
                icon={CheckCircle2}
                tone="success"
              />

              <HealthItem
                label="Delivered"
                value={String(deliveredOrders)}
                icon={Boxes}
                tone="success"
              />

              <HealthItem
                label="Low Stock"
                value={String(lowStockProducts)}
                icon={AlertTriangle}
                tone={lowStockProducts > 0 ? "warning" : "success"}
              />

              <HealthItem
                label="Out of Stock"
                value={String(outOfStockProducts)}
                icon={Bell}
                tone={outOfStockProducts > 0 ? "warning" : "success"}
              />

              <HealthItem
                label="Categories"
                value={String(categoriesCount)}
                icon={FolderTree}
              />
            </div>
          </div>

          <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_18px_65px_rgba(15,10,5,0.06)] sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-900">
              Shortcuts
            </p>

            <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-neutral-950">
              Quick Actions
            </h2>

            <div className="mt-5 grid gap-3">
              <QuickAction
                href="/admin/orders"
                title="Orders"
                subtitle="Review and manage orders"
                icon={ShoppingBag}
              />

              <QuickAction
                href="/admin/products/new"
                title="Add Product"
                subtitle="Create a new catalog item"
                icon={Package}
              />

              <QuickAction
                href="/admin/products"
                title="Products"
                subtitle="Manage catalog and stock"
                icon={Boxes}
              />

              <QuickAction
                href="/admin/newsletter"
                title="Newsletter"
                subtitle="View subscriber audience"
                icon={Users}
              />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
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