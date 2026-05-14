import Link from "next/link";
import {
  ArrowRight,
  Heart,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import CartItems from "@/components/cart/CartItems";
import CartPageActions from "@/components/cart/CartPageActions";

const recentSearches = [
  "Clay pots",
  "Pooja items",
  "Terracotta décor",
  "Ceramic vase",
];

export default function CartPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <div className="mb-6 overflow-hidden rounded-[34px] border border-neutral-200 bg-white px-5 py-7 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
                <ShoppingBag className="h-3.5 w-3.5" />
                Cart
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-[-0.06em] text-neutral-950 sm:text-4xl lg:text-5xl">
                Your Order Details
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                Review your selected Ram Pottery pieces before proceeding to
                checkout. You can still adjust quantities or continue shopping.
              </p>
            </div>

            <div className="grid grid-cols-3 overflow-hidden rounded-[24px] border border-neutral-200 bg-[#faf8f4] shadow-sm">
              <MiniStat icon={<ShieldCheck className="h-4 w-4" />} label="Secure" />
              <MiniStat icon={<PackageCheck className="h-4 w-4" />} label="Packed" />
              <MiniStat icon={<Heart className="h-4 w-4" />} label="Handmade" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[34px] border border-neutral-200 bg-white p-4 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-6">
            <CartItems />

           <CartPageActions />
          </section>

          <aside className="grid gap-5 lg:sticky lg:top-[118px] lg:self-start">
            <section className="rounded-[34px] border border-neutral-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
                Continue Shopping
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
                Add More Pieces
              </h2>

              <p className="mt-3 text-sm leading-7 text-neutral-600">
                Discover more handcrafted pottery, décor, tableware and pooja
                essentials before checkout.
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-900 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_14px_34px_rgba(127,29,29,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800"
                >
                  Shop All Products
                  <ShoppingBag className="h-4 w-4" />
                </Link>

                <Link
                  href="/wishlist"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-900 transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
                >
                  View Wishlist
                  <Heart className="h-4 w-4" />
                </Link>
              </div>
            </section>

            <section className="rounded-[34px] border border-neutral-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
                    Recent Searches
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
                    Quick Explore
                  </h2>
                </div>

                <Search className="h-5 w-5 text-red-900" />
              </div>

              <div className="grid gap-2">
                {recentSearches.map((item) => (
                  <Link
                    key={item}
                    href={`/shop?q=${encodeURIComponent(item)}`}
                    className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold text-neutral-700 transition duration-300 hover:border-red-900/20 hover:bg-red-50 hover:text-red-900"
                  >
                    {item}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[34px] border border-red-900/10 bg-red-950 p-5 text-white shadow-[0_18px_70px_rgba(127,29,29,0.14)] sm:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-100">
                Ram Pottery Promise
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">
                Handmade with care.
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/70">
                Each selected piece is prepared with attention, packed carefully
                and handled with the Ram Pottery standard.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function MiniStat({
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