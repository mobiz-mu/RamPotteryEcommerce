import { getAnnouncementBar } from "@/lib/server-data";

function ClayPotIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 4h10" />
      <path d="M9 4c0 2-1.5 2.5-2.5 3.2C5.6 7.9 5 9.2 5 11c0 4 3.1 8 7 8s7-4 7-8c0-1.8-.6-3.1-1.5-3.8C16.5 6.5 15 6 15 4" />
      <path d="M8 11c1.2.7 2.6 1 4 1s2.8-.3 4-1" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="currentColor"
    >
      <path d="M13.2 2 5.8 13h4.8L10.8 22 18.2 11h-4.8L13.2 2Z" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 5c-6.5 0-11 3.6-11 9 0 2.6 1.7 5 4.7 5C18 19 21 13.8 21 8V5h-2Z" />
      <path d="M8 16c2-2.2 4.7-4 8-5.2" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="currentColor"
    >
      <path d="m12 2.8 2.5 5.1 5.6.8-4 3.9.9 5.5L12 15.5 7 18.1l.9-5.5-4-3.9 5.6-.8L12 2.8Z" />
    </svg>
  );
}

export default async function AnnouncementBar() {
  const bar = await getAnnouncementBar();

  const phrases = [
    bar?.text || "Quality Matters — Handcrafted Pottery Made with Passion in Mauritius",
    "Premium Clay Creations for Elegant Homes, Rituals & Gifting",
    "Authentic Craftsmanship • Timeless Design • Luxury Pottery Finish",
    "Shop Ram Pottery for Best Sellers, New Arrivals & Unique Handmade Pieces",
  ];

  const items = [...phrases, ...phrases];

  return (
    <div className="relative overflow-hidden border-b border-red-800 bg-red-600 text-white">
      <style>{`
        @keyframes ram-pottery-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-red-600 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-red-600 to-transparent" />

      <div className="flex min-h-11 items-center">
        <div
          className="flex min-w-max items-center"
          style={{ animation: "ram-pottery-marquee 42s linear infinite" }}
        >
          {items.map((phrase, index) => (
            <div
              key={`${phrase}-${index}`}
              className="flex items-center gap-3 whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-[0.18em] sm:px-8 sm:text-sm"
            >
              {index % 4 === 0 ? <ClayPotIcon /> : null}
              {index % 4 === 1 ? <SparkIcon /> : null}
              {index % 4 === 2 ? <LeafIcon /> : null}
              {index % 4 === 3 ? <StarIcon /> : null}
              <span>{phrase}</span>
              <span className="opacity-80">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}