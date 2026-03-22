import Link from "next/link";
import {
  ShoppingBag,
  Package,
  FolderTree,
  Mail,
  TrendingUp,
  Clock3,
  AlertCircle,
  CircleDollarSign,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            {value}
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500">{hint}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

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
  const value = (status || "").toLowerCase();

  if (value === "confirmed") return "bg-blue-50 text-blue-600";
  if (value === "shipped") return "bg-amber-50 text-amber-700";
  if (value === "delivered") return "bg-emerald-50 text-emerald-700";
  if (value === "cancelled") return "bg-neutral-100 text-neutral-600";
  return "bg-red-50 text-red-600";
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    ordersRes,
    productsRes,
    categoriesRes,
    subscribersRes,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id, order_number, customer_name, total_amount, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("id, is_active, is_in_stock, stock_qty"),
    supabase
      .from("categories")
      .select("id"),
    supabase
      .from("newsletter_subscribers")
      .select("id, is_active"),
  ]);

  const orders = ordersRes.data ?? [];
  const products = productsRes.data ?? [];
  const categories = categoriesRes.data ?? [];
  const subscribers = subscribersRes.data ?? [];

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order: any) => sum + Number(order.total_amount ?? 0),
    0
  );
  const pendingOrders = orders.filter(
    (order: any) => (order.status || "").toLowerCase() === "pending"
  ).length;
  const confirmedOrders = orders.filter(
    (order: any) => (order.status || "").toLowerCase() === "confirmed"
  ).length;
  const activeProducts = products.filter((product: any) => product.is_active).length;
  const lowStockProducts = products.filter(
    (product: any) => Number(product.stock_qty ?? 0) > 0 && Number(product.stock_qty ?? 0) <= 5
  ).length;
  const categoriesCount = categories.length;
  const activeSubscribers = subscribers.filter(
    (subscriber: any) => subscriber.is_active
  ).length;

  const recentOrders = orders.slice(0, 6);

  const hasAnyData =
    totalOrders > 0 ||
    activeProducts > 0 ||
    categoriesCount > 0 ||
    activeSubscribers > 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-600">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Dashboard
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-500">
          Monitor real store performance, recent orders, catalog activity, and newsletter growth.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={String(totalOrders)}
          hint="Across all recorded sales"
          icon={ShoppingBag}
        />
        <StatCard
          title="Products"
          value={String(activeProducts)}
          hint="Active catalog items"
          icon={Package}
        />
        <StatCard
          title="Categories"
          value={String(categoriesCount)}
          hint="Organized collections"
          icon={FolderTree}
        />
        <StatCard
          title="Subscribers"
          value={String(activeSubscribers)}
          hint="Active newsletter audience"
          icon={Mail}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          hint="Total order value recorded"
          icon={CircleDollarSign}
        />
        <StatCard
          title="Pending Orders"
          value={String(pendingOrders)}
          hint="Need review or follow-up"
          icon={Clock3}
        />
        <StatCard
          title="Low Stock Products"
          value={String(lowStockProducts)}
          hint="Products with stock 5 or below"
          icon={AlertCircle}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-neutral-950">Recent Orders</h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
              <Clock3 className="h-3.5 w-3.5" />
              Latest activity
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-neutral-500">
                <tr>
                  <th className="px-3 py-3 font-medium">Order No</th>
                  <th className="px-3 py-3 font-medium">Customer</th>
                  <th className="px-3 py-3 font-medium">Amount</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-10 text-center text-neutral-500">
                      No orders found yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-neutral-100">
                      <td className="px-3 py-4 font-medium text-neutral-950">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="transition hover:text-red-600"
                        >
                          {order.order_number || order.id.slice(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-3 py-4 text-neutral-600">
                        {order.customer_name || "-"}
                      </td>
                      <td className="px-3 py-4 text-neutral-600">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-neutral-600">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-950">Business Summary</h2>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-7 text-neutral-600">
              <p>
                <span className="font-medium text-neutral-950">Confirmed Orders:</span>{" "}
                {confirmedOrders}
              </p>
              <p>
                <span className="font-medium text-neutral-950">Active Subscribers:</span>{" "}
                {activeSubscribers}
              </p>
              <p>
                <span className="font-medium text-neutral-950">Low Stock Alerts:</span>{" "}
                {lowStockProducts}
              </p>
              <p>
                <span className="font-medium text-neutral-950">Catalog Size:</span>{" "}
                {activeProducts} active products in {categoriesCount} categories
              </p>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">Quick Actions</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/admin/orders"
                className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                View all orders
              </Link>
              <Link
                href="/admin/products/new"
                className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Add new product
              </Link>
              <Link
                href="/admin/newsletter"
                className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Open newsletter audience
              </Link>
              <Link
                href="/admin/settings"
                className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Manage store settings
              </Link>
            </div>
          </div>

          {!hasAnyData ? (
            <div className="rounded-[1.8rem] border border-dashed border-neutral-300 bg-white p-6 text-sm leading-7 text-neutral-500 shadow-[0_12px_35px_rgba(0,0,0,0.03)]">
              Your dashboard is ready, but no live records were found yet. Add products,
              collect newsletter subscribers, or place a test order to start seeing real data.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}