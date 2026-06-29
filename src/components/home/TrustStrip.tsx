import {
  HandHelping,
  LockKeyhole,
  Plane,
  Truck,
  type LucideIcon,
} from "lucide-react";

type TrustItem = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
};

const items: TrustItem[] = [
  {
    icon: Truck,
    title: "Free Delivery",
    subtitle: "As from Rs 3,000",
  },
  {
    icon: Plane,
    title: "Rodrigues Delivery",
    subtitle: "We ship to Rodrigues Island",
  },
  {
    icon: HandHelping,
    title: "Handmade Pottery",
    subtitle: "Crafted with care",
  },
  {
    icon: LockKeyhole,
    title: "Secure Shopping",
    subtitle: "Shop safely online",
  },
];

export default function TrustStrip() {
  return (
    <section className="relative overflow-hidden bg-white py-9 sm:py-11 lg:py-12">
      <div className="container-padded">
        <div className="mx-auto grid w-full max-w-[1050px] grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[1.6rem] border border-red-100 bg-[linear-gradient(135deg,#ffffff_0%,#fff5f5_42%,#ffffff_100%)] p-4 text-center shadow-[0_14px_35px_rgba(120,0,0,0.10)] transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_22px_55px_rgba(120,0,0,0.16)] sm:p-5"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-100/70" />
                <div className="pointer-events-none absolute -left-12 bottom-0 h-24 w-24 rounded-full bg-red-50" />

                <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ec1b23,#8f060b)] text-white shadow-[0_12px_28px_rgba(201,15,24,0.32)] sm:h-16 sm:w-16">
                  <Icon className="h-7 w-7 stroke-[2.2] sm:h-8 sm:w-8" />
                </div>

                <h3 className="relative text-[15px] font-bold tracking-[-0.03em] text-[#231111] sm:text-[17px]">
                  {item.title}
                </h3>

                <p className="relative mt-1 text-[12px] font-medium leading-snug text-[#7d3b3b] sm:text-[13px]">
                  {item.subtitle}
                </p>

                <div className="relative mx-auto mt-4 h-[3px] w-9 rounded-full bg-[linear-gradient(90deg,#ec1b23,#8f060b)] transition duration-300 group-hover:w-14" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}