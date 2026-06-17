import Link from "next/link";
import {
  BadgeCheck,
  Brush,
  MapPin,
  PackageCheck,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site";

const mapQuery = "Ram Pottery Ltd XJHP+VV Petit Raffray, Mauritius";

const googleMapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  mapQuery,
)}&output=embed`;

const googleMapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  mapQuery,
)}`;

const features = [
  {
    icon: Brush,
    title: "Handcrafted",
    description: "Authentic pottery made with tradition and care.",
  },
  {
    icon: Sparkles,
    title: "Premium Designs",
    description: "Clay décor, tableware, pooja items and terracotta pieces.",
  },
  {
    icon: PackageCheck,
    title: "Careful Packing",
    description: "Orders are prepared and packed with attention.",
  },
  {
    icon: Truck,
    title: "Local Delivery",
    description: "Delivery across Mauritius, free from Rs 3,000.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-8 sm:py-10 lg:py-12">
      <style>{`
        @keyframes ram-phone-ring {
          0%, 100% { transform: rotate(0deg) scale(1); }
          10% { transform: rotate(-12deg) scale(1.04); }
          20% { transform: rotate(12deg) scale(1.04); }
          30% { transform: rotate(-8deg) scale(1.03); }
          40% { transform: rotate(8deg) scale(1.03); }
          50% { transform: rotate(0deg) scale(1); }
        }
      `}</style>

      <div className="container-padded">
        <div className="grid items-stretch gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[260px] overflow-hidden rounded-[26px] border border-red-950/10 bg-white p-2.5 shadow-[0_16px_50px_rgba(70,20,10,0.07)] sm:min-h-[285px] lg:min-h-[300px]">
            <Link
              href={`tel:${SITE_CONFIG.phone}`}
              className="absolute right-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-red-900 shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-red-50 sm:text-xs"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-900 text-white">
                <PhoneCall
                  className="h-3.5 w-3.5"
                  style={{ animation: "ram-phone-ring 1.15s infinite" }}
                />
              </span>
              {SITE_CONFIG.phone}
            </Link>

            <iframe
              title="Ram Pottery Ltd Google Map"
              src={googleMapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[240px] w-full rounded-[21px] border-0 sm:min-h-[265px] lg:min-h-[280px]"
              allowFullScreen
            />

            <Link
              href={googleMapOpenUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-red-900 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(127,29,29,0.28)] transition hover:-translate-y-0.5 hover:bg-red-800"
            >
              <MapPin className="h-3.5 w-3.5" />
              Open Map
            </Link>
          </div>

          <div className="flex min-h-[260px] flex-col justify-between rounded-[26px] border border-red-950/10 bg-white p-5 shadow-[0_16px_50px_rgba(70,20,10,0.07)] sm:min-h-[285px] sm:p-6 lg:min-h-[300px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-red-50 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-900">
                <ShieldCheck className="h-3.5 w-3.5" />
                Why Choose Us?
              </div>

              <h2 className="mt-3 max-w-xl text-2xl font-black leading-tight tracking-[-0.05em] text-neutral-950 sm:text-3xl">
                Crafted with tradition, chosen for beauty.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                Ram Pottery brings premium handcrafted pottery, clay décor,
                tableware, pooja products and terracotta pieces to Mauritian
                homes with care and trust.
              </p>
            </div>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-[18px] border border-red-950/10 bg-[#fffaf4] p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
                  >
                    <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-red-900 shadow-sm">
                      <Icon className="h-4 w-4" />
                    </div>

                    <h3 className="text-sm font-black tracking-[-0.02em] text-neutral-950">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-xs font-medium leading-5 text-neutral-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-[18px] border border-red-950/10 bg-[linear-gradient(135deg,#2b0909_0%,#4a0f0f_45%,#120505_100%)] text-center text-white">
              <MiniStat value="100%" label="Handmade" />
              <MiniStat value="Rs 3000+" label="Free Delivery" />
              <MiniStat value="MU" label="Local Brand" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-white/10 px-2.5 py-2.5 last:border-r-0">
      <p className="text-sm font-black text-white">{value}</p>
      <p className="mt-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-white/55">
        {label}
      </p>
    </div>
  );
}