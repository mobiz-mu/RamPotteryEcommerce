import { getAnnouncementBar } from "@/lib/server-data";

function PotteryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill="none">
      <path d="M8 4h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9 4c0 2.1-3 2.5-3 6.7C6 15.4 8.7 20 12 20s6-4.6 6-9.3C18 6.5 15 6.1 15 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 11.2c2.8 1.2 6.2 1.2 9 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill="none">
      <path d="M4 9h16v11H4V9Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 6h18v3H3V6Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 6v14" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 6c-2.8 0-4.2-3.2-1.7-3.2C11.7 2.8 12 6 12 6Zm0 0c2.8 0 4.2-3.2 1.7-3.2C12.3 2.8 12 6 12 6Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill="currentColor">
      <path d="m12 3 2.5 5.1 5.6.8-4 3.9.9 5.5-5-2.7-5 2.7.9-5.5-4-3.9 5.6-.8L12 3Z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" fill="none">
      <path d="M3 6h11v10H3V6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 10h4l3 3v3h-7v-6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default async function AnnouncementBar() {
  const bar = await getAnnouncementBar();

  const phrases = [
    bar?.text || "Handcrafted Pottery Made with Passion in Mauritius",
    "Premium Clay Creations for Homes, Hotels, Rituals & Gifting",
    "Authentic Craftsmanship • Timeless Design • Luxury Pottery Finish",
    "Shop Best Sellers, New Arrivals & Unique Handmade Pieces",
  ];

  const icons = [PotteryIcon, GiftIcon, StarIcon, TruckIcon];
  const items = [...phrases, ...phrases, ...phrases];

  return (
    <div className="relative overflow-hidden border-b border-red-900/30 bg-gradient-to-r from-[#8f1111] via-[#c51616] to-[#8f1111] text-white shadow-[0_1px_0_rgba(255,255,255,0.18)_inset]">
      <style>{`
        @keyframes ramPotteryPremiumMarquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-33.333%, 0, 0); }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.16),transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#8f1111] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#8f1111] to-transparent" />

      <div className="flex h-8 items-center sm:h-9">
        <div
          className="flex min-w-max items-center will-change-transform"
          style={{ animation: "ramPotteryPremiumMarquee 36s linear infinite" }}
        >
          {items.map((phrase, index) => {
            const Icon = icons[index % icons.length];

            return (
              <div
                key={`${phrase}-${index}`}
                className="flex items-center gap-2 whitespace-nowrap px-5 text-[10px] font-bold uppercase tracking-[0.18em] sm:px-7 sm:text-[11px]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/25 bg-white/10">
                  <Icon />
                </span>
                <span>{phrase}</span>
                <span className="h-1 w-1 rounded-full bg-white/70" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}