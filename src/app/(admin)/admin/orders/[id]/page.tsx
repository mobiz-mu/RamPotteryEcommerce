import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

function formatCurrency(amount: number | null | undefined) {
  const value = Number(amount ?? 0);
  return `Rs ${value.toLocaleString("en-MU")}`;
}

function formatDateTime(date: string | null | undefined) {
  if (!date) return "-";

  const d = new Date(date);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

type OrderItem = {
  id: string;
  product_id: string | null;
  product_name: string | null;
  quantity: number | null;
  unit_price: number | null;
  line_total: number | null;
};

type Order = {
  id: string;
  order_number: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  area: string | null;
  address: string | null;
  subtotal: number | null;
  delivery_fee: number | null;
  total_amount: number | null;
  status: string | null;
  whatsapp_sent: boolean | null;
  created_at: string | null;
};

export default async function AdminOrderDetailsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        customer_name,
        customer_phone,
        customer_email,
        area,
        address,
        subtotal,
        delivery_fee,
        total_amount,
        status,
        whatsapp_sent,
        created_at
      `
    )
    .eq("id", id)
    .single<Order>();

  if (orderError || !order) {
    notFound();
  }

  const { data: items } = await supabase
    .from("order_items")
    .select(
      `
        id,
        product_id,
        product_name,
        quantity,
        unit_price,
        line_total
      `
    )
    .eq("order_id", id)
    .returns<OrderItem[]>();

  const safeItems = items ?? [];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Sales"
        title={`Order #${order.order_number || order.id.slice(0, 8).toUpperCase()}`}
        description="View customer details, ordered products, delivery information, and WhatsApp confirmation state."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-neutral-950">Customer Details</h2>
          <div className="mt-6 space-y-3 text-sm text-neutral-600">
            <p>
              <span className="font-medium text-neutral-950">Name:</span>{" "}
              {order.customer_name || "-"}
            </p>
            <p>
              <span className="font-medium text-neutral-950">Phone:</span>{" "}
              {order.customer_phone || "-"}
            </p>
            <p>
              <span className="font-medium text-neutral-950">Email:</span>{" "}
              {order.customer_email || "-"}
            </p>
            <p>
              <span className="font-medium text-neutral-950">Area:</span>{" "}
              {order.area || "-"}
            </p>
            <p>
              <span className="font-medium text-neutral-950">Address:</span>{" "}
              {order.address || "-"}
            </p>
            <p>
              <span className="font-medium text-neutral-950">Created At:</span>{" "}
              {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-neutral-950">Order Summary</h2>
          <div className="mt-6 space-y-3 text-sm text-neutral-600">
            <p>
              <span className="font-medium text-neutral-950">Subtotal:</span>{" "}
              {formatCurrency(order.subtotal)}
            </p>
            <p>
              <span className="font-medium text-neutral-950">Delivery Fee:</span>{" "}
              {formatCurrency(order.delivery_fee)}
            </p>
            <p>
              <span className="font-medium text-neutral-950">Total:</span>{" "}
              {formatCurrency(order.total_amount)}
            </p>
            <p>
              <span className="font-medium text-neutral-950">Status:</span>{" "}
              <span
                className={`ml-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                  order.status
                )}`}
              >
                {order.status || "Pending"}
              </span>
            </p>
            <p>
              <span className="font-medium text-neutral-950">WhatsApp Sent:</span>{" "}
              {order.whatsapp_sent ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-neutral-950">Ordered Products</h2>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-500">
              <tr>
                <th className="px-3 py-3 font-medium">Product</th>
                <th className="px-3 py-3 font-medium">Qty</th>
                <th className="px-3 py-3 font-medium">Unit Price</th>
                <th className="px-3 py-3 font-medium">Line Total</th>
              </tr>
            </thead>

            <tbody>
              {safeItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-10 text-center text-neutral-500">
                    No order items found.
                  </td>
                </tr>
              ) : (
                safeItems.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="px-3 py-4 font-medium text-neutral-950">
                      {item.product_name || item.product_id || "-"}
                    </td>
                    <td className="px-3 py-4 text-neutral-600">
                      {item.quantity ?? 0}
                    </td>
                    <td className="px-3 py-4 text-neutral-600">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="px-3 py-4 text-neutral-600">
                      {formatCurrency(item.line_total)}
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