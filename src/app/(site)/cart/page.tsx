import Link from "next/link";
import CartItems from "@/components/cart/CartItems";

export default function CartPage() {
  return (
    <main className="bg-[#faf7f1]">
      <section className="container-padded section-space">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.3em] text-red-700">
            Cart
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950">
            Your Order Details
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
            Review your selected Ram Pottery pieces before proceeding to checkout.
          </p>
        </div>

        <div className="mx-auto max-w-5xl rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_22px_70px_rgba(0,0,0,0.08)]">
          <CartItems />

          <div className="mt-8 flex justify-center border-t border-neutral-200 pt-6">
            <Link
              href="/checkout"
              className="rounded-full bg-red-700 px-7 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_14px_35px_rgba(185,28,28,0.25)] transition hover:-translate-y-0.5 hover:bg-red-800"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}