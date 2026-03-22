import CartItems from "@/components/cart/CartItems";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  return (
    <div className="bg-[#fafafa]">
      <section className="container-padded section-space">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-600">
            Cart
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
            Your Shopping Cart
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-600">
            Review your handcrafted selections before proceeding to checkout.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_420px]">
          <CartItems />
          <CartSummary />
        </div>
      </section>
    </div>
  );
}