import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  return (
    <main className="bg-[#faf7f1]">
      <section className="container-padded section-space">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.3em] text-red-700">
            Checkout
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950">
            Complete Your Order
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
            Add your details and send your order directly to Ram Pottery on WhatsApp.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_420px]">
          <CheckoutForm />
          <OrderSummary />
        </div>
      </section>
    </main>
  );
}