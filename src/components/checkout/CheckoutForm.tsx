"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/lib/utils/validation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { buildWhatsAppOrderMessage, getWhatsAppCheckoutLink } from "@/lib/utils/whatsapp";
import { z } from "zod";
import { toast } from "sonner";
import WhatsAppOrderButton from "@/components/checkout/WhatsAppOrderButton";

type FormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [waLink, setWaLink] = useState("");
  const [orderNo, setOrderNo] = useState("");

  const deliveryFee = useMemo(() => (items.length ? 200 : 0), [items]);
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

    setOrderNo(data.orderNo);
    setWaLink(getWhatsAppCheckoutLink(message));
    toast.success("Order created. Continue on WhatsApp to confirm.");
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-neutral-950">Customer Details</h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">
              Full Name
            </label>
            <Input {...form.register("customerName")} placeholder="Enter your full name" />
            {form.formState.errors.customerName ? (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.customerName.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">
              Phone Number
            </label>
            <Input {...form.register("phone")} placeholder="230 5778 8884" />
            {form.formState.errors.phone ? (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.phone.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">
              Email Address
            </label>
            <Input {...form.register("email")} placeholder="your@email.com" />
            {form.formState.errors.email ? (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">
              Area / Region
            </label>
            <Input {...form.register("area")} placeholder="Petit Raffray" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">
            Delivery Address
          </label>
          <Textarea
            {...form.register("address")}
            placeholder="Enter your full delivery address"
            className="min-h-28"
          />
          {form.formState.errors.address ? (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.address.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">
            Additional Note
          </label>
          <Textarea
            {...form.register("note")}
            placeholder="Add any delivery notes or order instructions"
            className="min-h-28"
          />
        </div>

        {!waLink ? (
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating Order..." : "Create Order"}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              Your order <span className="font-semibold">{orderNo}</span> has been created.
              Please click below to confirm directly on WhatsApp.
            </div>

            <WhatsAppOrderButton href={waLink} />

            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full"
              onClick={() => {
                clearCart();
                toast.success("Cart cleared after order preparation.");
              }}
            >
              Clear Cart After WhatsApp Confirmation
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}