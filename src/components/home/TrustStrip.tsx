
import {
  HandHelping,
  LockKeyhole,
  Plane,
  Truck,
  type LucideIcon,
} from "lucide-react";

type TrustItem = {
  icon: LucideIcon;
  lines: string[];
};

const items: TrustItem[] = [
  {
    icon: Truck,
    lines: ["Free Delivery As", "From Rs3,000"],
  },
  {
    icon: Plane,
    lines: ["We Ship To", "Rodrigues Island"],
  },
  {
    icon: HandHelping,
    lines: ["Best of Handmade", "Pottery"],
  },
  {
    icon: LockKeyhole,
    lines: ["Shop Securely", "Online With Us"],
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-white py-8 sm:py-10 lg:py-12">
      <div className="container-padded">
        <div className="mx-auto grid w-full max-w-[900px] grid-cols-2 place-items-center gap-4 sm:gap-5 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.lines.join("-")}
                className="group relative flex h-[145px] w-full max-w-[155px] flex-col items-center justify-center overflow-hidden rounded-[1.65rem] bg-[linear-gradient(135deg,#ec1b23_0%,#8f060b_50%,#080000_100%)] px-4 py-5 text-center shadow-[0_14px_35px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.18)] sm:h-[170px] sm:max-w-[180px] sm:rounded-[1.9rem] lg:h-[168px] lg:max-w-[180px]"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.18),transparent_34%),linear-gradient(120deg,rgba(255,255,255,0.09),transparent_42%)]" />

                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/90 text-white sm:h-20 sm:w-20">
                  <Icon className="h-7 w-7 stroke-[2.3] sm:h-9 sm:w-9" />
                </div>

                <h3 className="relative text-[14px] font-semibold leading-snug tracking-[-0.02em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.32)] sm:text-[16px] lg:text-[16px]">
                  {item.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}