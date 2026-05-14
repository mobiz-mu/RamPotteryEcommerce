import Link from "next/link";
import { ArrowLeft, Lock, MessageCircle, PackageCheck, ShieldCheck } from "lucide-react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="mb-6 overflow-hidden rounded-[34px] border border-neutral-200 bg-white px-5 py-6 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Link
                href="/cart"
                className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-red-900 transition hover:text-red-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Cart
              </Link>

              <div className="inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
                <Lock className="h-3.5 w-3.5" />
                Secure Checkout
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-[-0.06em] text-neutral-950 sm:text-4xl lg:text-5xl">
                Complete Your Order
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                Add your delivery details and confirm your Ram Pottery order.
                Your order will be saved and sent directly to Ram Pottery for fast follow-up.
              </p>
            </div>

            <div className="grid grid-cols-3 overflow-hidden rounded-[24px] border border-neutral-200 bg-[#faf8f4] shadow-sm">
              <MiniTrust icon={<ShieldCheck className="h-4 w-4" />} label="Secure" />
              <MiniTrust icon={<PackageCheck className="h-4 w-4" />} label="Packed" />
              <MiniTrust icon={<MessageCircle className="h-4 w-4" />} label="WhatsApp" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_420px]">
          <section className="rounded-[34px] border border-neutral-200 bg-white p-4 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-6">
            <CheckoutForm />
          </section>

          <aside className="lg:sticky lg:top-[118px] lg:self-start">
            <div className="rounded-[34px] border border-neutral-200 bg-white p-4 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-6">
              <OrderSummary />
            </div>

            <div className="mt-5 rounded-[30px] border border-red-900/10 bg-red-950 p-5 text-white shadow-[0_18px_70px_rgba(127,29,29,0.14)]">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-red-100">
                Ram Pottery Promise
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">
                Handmade pieces, handled with care.
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/70">
                Once your order is submitted, Ram Pottery will review it and contact you for confirmation, delivery and payment details.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function MiniTrust({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-w-[86px] flex-col items-center justify-center border-r border-neutral-200 px-4 py-4 text-center last:border-r-0">
      <div className="text-red-900">{icon}</div>
      <p className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-neutral-400">
        {label}
      </p>
    </div>
  );
}