import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  return (
    <div className="bg-[#fafafa]">
      <section className="container-padded section-space">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-600">
            Checkout
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
            Complete Your Order
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-600">
            Fill in your details, create your order, and confirm instantly on WhatsApp.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_420px]">
          <CheckoutForm />
          <OrderSummary />
        </div>
      </section>
    </div>
  );
}