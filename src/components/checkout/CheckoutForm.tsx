"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle, MessageCircle, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { checkoutSchema } from "@/lib/utils/validation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import {
  buildWhatsAppOrderMessage,
  getWhatsAppCheckoutLink,
} from "@/lib/utils/whatsapp";

type FormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [success, setSuccess] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [waLink, setWaLink] = useState("");

  const deliveryFee = useMemo(() => (items.length ? 200 : 0), [items.length]);
  const total = subtotal + deliveryFee;

  const form = useForm<FormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      email: "",
      address: "",
      area: "",
      note: "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        deliveryMethod: "Standard Delivery",
        items,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.error || "Failed to create order.");
      return;
    }

    const message = buildWhatsAppOrderMessage({
      orderNo: data.orderNo,
      customerName: values.customerName,
      phone: values.phone,
      email: values.email,
      address: values.address,
      area: values.area,
      note: values.note,
      items: items.map((item) => ({
        name: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      deliveryFee,
      total,
    });

    const link = getWhatsAppCheckoutLink(message);

    setOrderNo(data.orderNo);
    setWaLink(link);
    setSuccess(true);
    clearCart();

    window.open(link, "_blank", "noopener,noreferrer");
    toast.success("Order sent to WhatsApp.");
  }

  if (success) {
    return (
      <div className="rounded-[32px] border border-neutral-200 bg-white p-8 text-center shadow-[0_22px_70px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-700 text-white shadow-[0_14px_35px_rgba(185,28,28,0.25)]">
          <CheckCircle className="h-8 w-8" />
        </div>

        <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.28em] text-red-700">
          Order Success
        </p>

        <h2 className="mt-3 text-3xl font-extrabold text-neutral-950">
          Your Order Has Been Sent
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-neutral-600">
          Your order <span className="font-bold text-neutral-950">{orderNo}</span>{" "}
          has been prepared and sent to Ram Pottery on WhatsApp. Our team will
          confirm availability and delivery shortly.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-red-700 px-7 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_14px_35px_rgba(185,28,28,0.25)] transition hover:-translate-y-0.5 hover:bg-red-800"
          >
            Continue Shopping
          </Link>

          {waLink ? (
            <Link
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-neutral-300 px-7 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-neutral-800 transition hover:border-red-700 hover:text-red-700"
            >
              Open WhatsApp Again
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-neutral-200 bg-white p-7 shadow-[0_22px_70px_rgba(0,0,0,0.08)] sm:p-8">
      <div className="mb-7">
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-red-700">
          Checkout Details
        </p>

        <h2 className="mt-3 text-2xl font-extrabold text-neutral-950">
          Customer Information
        </h2>

        <p className="mt-2 text-sm leading-7 text-neutral-600">
          Add your details below and send your order directly to Ram Pottery on
          WhatsApp.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name" error={form.formState.errors.customerName?.message}>
            <Input
              {...form.register("customerName")}
              placeholder="Enter your full name"
              className="h-12 rounded-2xl border-neutral-200 bg-[#fafafa]"
            />
          </Field>

          <Field label="Phone Number" error={form.formState.errors.phone?.message}>
            <Input
              {...form.register("phone")}
              placeholder="230 5778 8884"
              className="h-12 rounded-2xl border-neutral-200 bg-[#fafafa]"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email Address" error={form.formState.errors.email?.message}>
            <Input
              {...form.register("email")}
              placeholder="your@email.com"
              className="h-12 rounded-2xl border-neutral-200 bg-[#fafafa]"
            />
          </Field>

          <Field label="Area / Region">
            <Input
              {...form.register("area")}
              placeholder="Petit Raffray"
              className="h-12 rounded-2xl border-neutral-200 bg-[#fafafa]"
            />
          </Field>
        </div>

        <Field label="Delivery Address" error={form.formState.errors.address?.message}>
          <Textarea
            {...form.register("address")}
            placeholder="Enter your full delivery address"
            className="min-h-28 rounded-2xl border-neutral-200 bg-[#fafafa]"
          />
        </Field>

        <Field label="Additional Note">
          <Textarea
            {...form.register("note")}
            placeholder="Add any delivery notes or order instructions"
            className="min-h-24 rounded-2xl border-neutral-200 bg-[#fafafa]"
          />
        </Field>

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mx-auto flex w-fit items-center gap-2 rounded-full bg-red-700 px-7 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_14px_35px_rgba(185,28,28,0.25)] transition hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {form.formState.isSubmitting ? "Creating Order..." : "Order on WhatsApp"}
          {form.formState.isSubmitting ? null : <MessageCircle className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-neutral-900">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}