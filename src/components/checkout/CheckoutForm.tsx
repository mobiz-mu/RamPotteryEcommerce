"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  User,
} from "lucide-react";
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

const FREE_DELIVERY_MINIMUM = 3000;
const STANDARD_DELIVERY_FEE = 150;

export default function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart, loaded } = useCart();

  const deliveryFee = useMemo(() => {
    if (!items.length || subtotal <= 0) return 0;
    return subtotal >= FREE_DELIVERY_MINIMUM ? 0 : STANDARD_DELIVERY_FEE;
  }, [items.length, subtotal]);

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

    const waLink = getWhatsAppCheckoutLink(message);

    clearCart();

    try {
      window.open(waLink, "_blank", "noopener,noreferrer");
    } catch {}

    toast.success("Order created successfully.");
    router.push(`/checkout/success?order=${encodeURIComponent(data.orderNo)}`);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
          Checkout Details
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
          Delivery Information
        </h2>

        <p className="mt-2 text-sm leading-7 text-neutral-600">
          Add your details below. Delivery is Rs 150 for orders below Rs 3,000
          and free for orders from Rs 3,000.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            icon={<User className="h-4 w-4" />}
            label="Full Name"
            error={form.formState.errors.customerName?.message}
          >
            <Input
              {...form.register("customerName")}
              placeholder="Enter your full name"
              autoComplete="name"
              className="h-full border-0 bg-transparent px-0 text-sm font-semibold shadow-none outline-none focus-visible:ring-0"
            />
          </Field>

          <Field
            icon={<Phone className="h-4 w-4" />}
            label="Phone Number"
            error={form.formState.errors.phone?.message}
          >
            <Input
              {...form.register("phone")}
              placeholder="230 5778 8884"
              autoComplete="tel"
              className="h-full border-0 bg-transparent px-0 text-sm font-semibold shadow-none outline-none focus-visible:ring-0"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            icon={<Mail className="h-4 w-4" />}
            label="Email Address"
            error={form.formState.errors.email?.message}
          >
            <Input
              {...form.register("email")}
              placeholder="your@email.com"
              autoComplete="email"
              className="h-full border-0 bg-transparent px-0 text-sm font-semibold shadow-none outline-none focus-visible:ring-0"
            />
          </Field>

          <Field icon={<MapPin className="h-4 w-4" />} label="Area / Region">
            <Input
              {...form.register("area")}
              placeholder="Petit Raffray"
              className="h-full border-0 bg-transparent px-0 text-sm font-semibold shadow-none outline-none focus-visible:ring-0"
            />
          </Field>
        </div>

        <TextField
          label="Delivery Address"
          error={form.formState.errors.address?.message}
        >
          <Textarea
            {...form.register("address")}
            placeholder="Enter your full delivery address"
            className="min-h-24 rounded-2xl border-neutral-200 bg-white text-sm font-semibold focus-visible:ring-red-900/10"
          />
        </TextField>

        <TextField label="Additional Note">
          <Textarea
            {...form.register("note")}
            placeholder="Add any delivery notes or order instructions"
            className="min-h-20 rounded-2xl border-neutral-200 bg-white text-sm font-semibold focus-visible:ring-red-900/10"
          />
        </TextField>

        <button
          type="submit"
          disabled={!loaded || form.formState.isSubmitting}
          className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-900 px-7 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_42px_rgba(127,29,29,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Order
            </>
          ) : (
            <>
              Order on WhatsApp
              <MessageCircle className="h-4 w-4" />
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function Field({
  icon,
  label,
  error,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </label>

      <div className="flex h-12 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-red-900/35 focus-within:ring-4 focus-within:ring-red-900/10">
        <span className="text-red-900">{icon}</span>
        {children}
      </div>

      {error ? (
        <p className="mt-1 text-sm font-semibold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

function TextField({
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
      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </label>

      {children}

      {error ? (
        <p className="mt-1 text-sm font-semibold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}