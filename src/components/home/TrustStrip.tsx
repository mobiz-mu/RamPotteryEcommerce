import { Box, Truck, HandHelping, Users } from "lucide-react";

const items = [
  {
    icon: HandHelping,
    title: "Best of Handmade Pottery",
    text: "Locally handmade, food-safe.",
  },
  {
    icon: Box,
    title: "Eco-Friendly Packaging",
    text: "All kraft paper based to reduce waste.",
  },
  {
    icon: Truck,
    title: "Fast Delivery in Mauritius",
    text: "Secure delivery with careful handling.",
  },
  {
    icon: Users,
    title: "Trusted by 800+ Customers",
    text: "Loved for quality, care, and craftsmanship.",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-neutral-200/80 bg-white">
      <div className="container-padded grid gap-6 py-7 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-[1.5rem] bg-white py-1"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center text-neutral-950">
                <Icon className="h-9 w-9 stroke-[1.7]" />
              </div>

              <div>
                <h3 className="text-[17px] font-medium tracking-[-0.02em] text-neutral-950">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[14px] leading-6 text-neutral-500">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}