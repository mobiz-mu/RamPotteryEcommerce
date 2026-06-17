import Link from "next/link";
import { revalidatePath } from "next/cache";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  PackageCheck,
  ShoppingCart,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Delivered", value: "delivered" },
];

function formatStatus(status: string | null | undefined) {
  const value = String(status || "pending").toLowerCase();

  if (value === "confirmed") return "Confirmed";
  if (value === "delivered") return "Delivered";

  return "Pending";
}

type OrderRow = {
  id: string;
  order_number: string | null;
  customer_name: string | null;
  total_amount: number | null;
  status: string | null;
  created_at: string | null;
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

  if (value === "delivered") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-red-200 bg-red-50 text-red-700";
}

async function updateOrderStatus(formData: FormData) {
  "use server";

  const id = String(formData.get("order_id") || "").trim();
  const status = String(formData.get("status") || "").trim().toLowerCase();

  const allowedStatuses = ["pending", "confirmed", "delivered"];

  if (!id || !allowedStatuses.includes(status)) return;

  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Order status update failed:", error.message);
    return;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  tone?: "default" | "success" | "warning" | "dark";
}) {
  const toneClasses = {
    default: "bg-red-50 text-red-900",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    dark: "bg-neutral-950 text-white",
  };

  return (
    <div className="rounded-[26px] border border-neutral-200 bg-white p-5 shadow-[0_16px_55px_rgba(15,10,5,0.055)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
            {label}
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.05em] text-neutral-950 sm:text-3xl">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, total_amount, status, created_at")
    .order("created_at", { ascending: false });

  const safeOrders = (orders ?? []) as OrderRow[];

  const pendingOrders = safeOrders.filter(
    (order) => String(order.status || "Pending").toLowerCase() === "pending",
  ).length;

  const confirmedOrders = safeOrders.filter(
    (order) => String(order.status || "").toLowerCase() === "confirmed",
  ).length;

  const deliveredOrders = safeOrders.filter(
    (order) => String(order.status || "").toLowerCase() === "delivered",
  ).length;

  const totalRevenue = safeOrders.reduce(
    (sum, order) => sum + Number(order.total_amount ?? 0),
    0,
  );

  return (
    <div className="space-y-6 pb-8">
      <section className="overflow-hidden rounded-[32px] border border-red-950/10 bg-[linear-gradient(135deg,#2b0909_0%,#4a0f0f_45%,#120505_100%)] p-5 text-white shadow-[0_24px_90px_rgba(70,20,10,0.18)] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-red-100">
              Ram Pottery Ltd
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.06em] sm:text-4xl">
              Orders
            </h1>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/70">
              Manage customer orders, update statuses and track store sales in
              one clean order control center.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-red-900 transition hover:-translate-y-0.5 hover:bg-red-50"
          >
            Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={String(safeOrders.length)}
          icon={ShoppingCart}
        />
        <StatCard
          label="Pending"
          value={String(pendingOrders)}
          icon={Clock3}
          tone="warning"
        />
        <StatCard
          label="Confirmed"
          value={String(confirmedOrders)}
          icon={CheckCircle2}
          tone="default"
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(totalRevenue)}
          icon={CircleDollarSign}
          tone="dark"
        />
      </section>

      <section className="rounded-[30px] border border-neutral-200 bg-white p-4 shadow-[0_18px_65px_rgba(15,10,5,0.06)] sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
              Order Management
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-neutral-950">
              All Orders
            </h2>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
            <PackageCheck className="h-3.5 w-3.5" />
            {deliveredOrders} Delivered
          </div>
        </div>

        {error ? (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            Unable to load orders. Please check your Supabase orders table.
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-neutral-200">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="bg-[#faf8f4] text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Current Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Change Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {safeOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm font-semibold text-neutral-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  safeOrders.map((order) => (
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
                         <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex rounded-full border border-neutral-200 px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-neutral-700 transition hover:border-red-900/20 hover:bg-red-50 hover:text-red-900"
                        >
                          View
                        </Link>
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