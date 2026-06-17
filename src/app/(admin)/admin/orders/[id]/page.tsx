import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  ShoppingBag,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

type Props = {
  params: Promise<{ id: string }>;
};

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

function formatCurrency(amount: number | null | undefined) {
  const value = Number(amount ?? 0);
  return `Rs ${value.toLocaleString("en-MU")}`;
}

function formatDateTime(date: string | null | undefined) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-900">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-neutral-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-bold text-neutral-800">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

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
      `,
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
      `,
    )
    .eq("order_id", id)
    .returns<OrderItem[]>();

  const safeItems = items ?? [];

  return (
    <div className="space-y-6 pb-8">
      <section className="overflow-hidden rounded-[32px] border border-red-950/10 bg-[linear-gradient(135deg,#2b0909_0%,#4a0f0f_45%,#120505_100%)] p-5 text-white shadow-[0_24px_90px_rgba(70,20,10,0.18)] sm:p-7">
        <Link
          href="/admin/orders"
          className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/80 transition hover:bg-white hover:text-red-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Orders
        </Link>

        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-red-100">
              Ram Pottery Ltd Order
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.06em] sm:text-4xl">
              #{order.order_number || order.id.slice(0, 8).toUpperCase()}
            </h1>

            <p className="mt-3 text-sm font-medium leading-7 text-white/70">
              Created on {formatDateTime(order.created_at)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/50">
              Current Status
            </p>

            <span
              className={`mt-3 inline-flex rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] ${getStatusClasses(
                order.status,
              )}`}
            >
              {formatStatus(order.status)}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_18px_65px_rgba(15,10,5,0.06)] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-900">
                <User className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-900">
                  Customer
                </p>
                <h2 className="text-xl font-black tracking-[-0.04em] text-neutral-950">
                  Customer Details
                </h2>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={User}
                label="Name"
                value={order.customer_name || "-"}
              />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={order.customer_phone || "-"}
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={order.customer_email || "-"}
              />
              <InfoRow icon={MapPin} label="Area" value={order.area || "-"} />
              <div className="sm:col-span-2">
                <InfoRow
                  icon={MapPin}
                  label="Address"
                  value={order.address || "-"}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_18px_65px_rgba(15,10,5,0.06)] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-900">
                <Package className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-900">
                  Products
                </p>
                <h2 className="text-xl font-black tracking-[-0.04em] text-neutral-950">
                  Ordered Products
                </h2>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-200">
              <div className="overflow-x-auto">
                <table className="min-w-[620px] w-full text-left text-sm">
                  <thead className="bg-[#faf8f4] text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Qty</th>
                      <th className="px-4 py-3">Unit Price</th>
                      <th className="px-4 py-3">Line Total</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-100">
                    {safeItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-12 text-center text-sm font-semibold text-neutral-500"
                        >
                          No order items found.
                        </td>
                      </tr>
                    ) : (
                      safeItems.map((item) => (
                        <tr key={item.id} className="bg-white">
                          <td className="px-4 py-4 font-black text-neutral-950">
                            {item.product_name || item.product_id || "-"}
                          </td>
                          <td className="px-4 py-4 font-semibold text-neutral-600">
                            {item.quantity ?? 0}
                          </td>
                          <td className="px-4 py-4 font-semibold text-neutral-600">
                            {formatCurrency(item.unit_price)}
                          </td>
                          <td className="px-4 py-4 font-black text-neutral-950">
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
        </div>

        <aside className="space-y-6">
          <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_18px_65px_rgba(15,10,5,0.06)] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-900">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-900">
                  Status
                </p>
                <h2 className="text-xl font-black tracking-[-0.04em] text-neutral-950">
                  Update Order
                </h2>
              </div>
            </div>

            <OrderStatusUpdater
              orderId={order.id}
              currentStatus={order.status} 
              full
            />
          </div>

          <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_18px_65px_rgba(15,10,5,0.06)] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-900">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-900">
                  Summary
                </p>
                <h2 className="text-xl font-black tracking-[-0.04em] text-neutral-950">
                  Payment Summary
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <SummaryRow label="Subtotal" value={formatCurrency(order.subtotal)} />
              <SummaryRow
                label="Delivery Fee"
                value={formatCurrency(order.delivery_fee)}
              />
              <div className="my-4 h-px bg-neutral-200" />
              <SummaryRow
                label="Total"
                value={formatCurrency(order.total_amount)}
                strong
              />
              <SummaryRow
                label="WhatsApp Sent"
                value={order.whatsapp_sent ? "Yes" : "No"}
              />
              <SummaryRow
                label="Created"
                value={formatDateTime(order.created_at)}
              />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-[#faf8f4] px-4 py-3">
      <span className="text-sm font-bold text-neutral-500">{label}</span>
      <span
        className={
          strong
            ? "text-lg font-black text-neutral-950"
            : "text-sm font-black text-neutral-950"
        }
      >
        {value}
      </span>
    </div>
  );
}