import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function formatCurrency(amount: number | null | undefined) {
  const value = Number(amount ?? 0);
  return `Rs ${value.toLocaleString("en-MU")}`;
}

function formatDate(date: string | null | undefined) {
  if (!date) return "-";

  const d = new Date(date);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function getStatusClasses(status: string | null | undefined) {
  const value = (status || "").toLowerCase();

  if (value === "confirmed") {
    return "bg-blue-50 text-blue-600";
  }

  if (value === "shipped") {
    return "bg-amber-50 text-amber-700";
  }

  if (value === "delivered") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (value === "cancelled") {
    return "bg-neutral-100 text-neutral-600";
  }

  return "bg-red-50 text-red-600";
}

type OrderRow = {
  id: string;
  order_number: string | null;
  customer_name: string | null;
  total_amount: number | null;
  status: string | null;
  created_at: string | null;
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, total_amount, status, created_at")
    .order("created_at", { ascending: false });

  const safeOrders: OrderRow[] = orders ?? [];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-600">
          Commerce
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Orders
        </h1>
        <p className="mt-3 text-sm leading-7 text-neutral-500">
          Review, track, and manage customer orders from one place.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.6rem] border border-neutral-200 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
          <p className="text-sm text-neutral-500">Total Orders</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {safeOrders.length}
          </h2>
        </div>

        <div className="rounded-[1.6rem] border border-neutral-200 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
          <p className="text-sm text-neutral-500">Pending</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {
              safeOrders.filter(
                (order) => (order.status || "").toLowerCase() === "pending"
              ).length
            }
          </h2>
        </div>

        <div className="rounded-[1.6rem] border border-neutral-200 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
          <p className="text-sm text-neutral-500">Confirmed</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {
              safeOrders.filter(
                (order) => (order.status || "").toLowerCase() === "confirmed"
              ).length
            }
          </h2>
        </div>

        <div className="rounded-[1.6rem] border border-neutral-200 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
          <p className="text-sm text-neutral-500">Revenue</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {formatCurrency(
              safeOrders.reduce(
                (sum, order) => sum + Number(order.total_amount ?? 0),
                0
              )
            )}
          </h2>
        </div>
      </div>

      <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            Unable to load orders. Check your Supabase table names and columns.
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-500">
              <tr>
                <th className="px-3 py-3 font-medium">Order No</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {safeOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-neutral-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                safeOrders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-100">
                    <td className="px-3 py-4 font-medium text-neutral-950">
                      {order.order_number || order.id.slice(0, 8).toUpperCase()}
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

                    <td className="px-3 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-medium text-red-600 transition hover:text-red-700"
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
    </div>
  );
}