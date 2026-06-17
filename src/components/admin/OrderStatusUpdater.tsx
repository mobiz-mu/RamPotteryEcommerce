"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Delivered", value: "delivered" },
];

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  full = false,
}: {
  orderId: string;
  currentStatus: string | null;
  full?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [status, setStatus] = useState(
    String(currentStatus || "pending").toLowerCase(),
  );

  async function saveStatus() {
    startTransition(async () => {
      const response = await fetch("/api/admin/orders/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error || "Could not update order status.");
        return;
      }

      toast.success("Order status updated.");
      router.refresh();
    });
  }

  return (
    <div className={full ? "grid gap-3" : "flex items-center gap-2"}>
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className={
          full
            ? "h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-black text-neutral-700 outline-none transition focus:border-red-900/30 focus:ring-4 focus:ring-red-900/10"
            : "h-10 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-black text-neutral-700 outline-none transition focus:border-red-900/30 focus:ring-4 focus:ring-red-900/10"
        }
      >
        {statusOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={saveStatus}
        disabled={isPending}
        className={
          full
            ? "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-900 px-5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_42px_rgba(127,29,29,0.24)] transition hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
            : "inline-flex h-10 items-center justify-center rounded-xl bg-red-900 px-4 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
        }
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : full ? (
          <>
            <Save className="h-4 w-4" />
            Save Status
          </>
        ) : (
          "Save"
        )}
      </button>
    </div>
  );
}