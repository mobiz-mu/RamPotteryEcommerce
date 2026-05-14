import Link from "next/link";
import { CheckCircle, MessageCircle, PackageCheck, ShoppingBag, User } from "lucide-react";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  const orderNo = params?.order || "Your order";

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-neutral-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-100px)] max-w-4xl items-center justify-center">
        <div className="w-full rounded-[38px] border border-neutral-200 bg-white p-6 text-center shadow-[0_28px_100px_rgba(15,10,5,0.1)] sm:p-10">
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-red-50 text-red-900">
            <CheckCircle className="h-10 w-10" />
          </div>

          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
            Order Success
          </p>

          <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-black tracking-[-0.06em] text-neutral-950 sm:text-5xl">
            Your order has been created.
          </h1>

          <div className="mx-auto mt-6 max-w-md rounded-[26px] border border-neutral-200 bg-[#faf8f4] px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-400">
              Order Number
            </p>
            <p className="mt-2 text-2xl font-black text-red-900">{orderNo}</p>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            Thank you for ordering from Ram Pottery. Your order has been saved,
            and our team will contact you shortly for confirmation, delivery and
            payment details.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <MiniInfo icon={<PackageCheck className="h-5 w-5" />} label="Order Saved" />
            <MiniInfo icon={<MessageCircle className="h-5 w-5" />} label="WhatsApp Sent" />
            <MiniInfo icon={<ShoppingBag className="h-5 w-5" />} label="Preparing" />
          </div>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/account"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-900 px-7 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_42px_rgba(127,29,29,0.24)] transition hover:-translate-y-0.5 hover:bg-red-800"
            >
              <User className="h-4 w-4" />
              My Dashboard
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-7 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-red-900 transition hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function MiniInfo({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-center shadow-sm">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-900">
        {icon}
      </div>
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </p>
    </div>
  );
}