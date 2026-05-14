import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import WorkshopGallerySlider from "@/components/workshop/WorkshopGallerySlider";

const siteUrl = "https://rampottery.mu";

export const metadata: Metadata = {
  title: "Our Workshop | Ram Pottery Mauritius",
  description:
    "Step inside the Ram Pottery workshop in Mauritius and discover how handcrafted clay, ceramic and terracotta pieces are shaped, refined and finished with care.",
  alternates: {
    canonical: `${siteUrl}/workshop`,
  },
  openGraph: {
    title: "Our Workshop | Ram Pottery Mauritius",
    description:
      "Discover the craftsmanship, process and passion behind Ram Pottery handmade clay and ceramic pieces.",
    url: `${siteUrl}/workshop`,
    siteName: "Ram Pottery",
    type: "website",
    locale: "en_MU",
    images: [
      {
        url: `${siteUrl}/images/Our%20Workshop/12.png`,
        width: 1200,
        height: 630,
        alt: "Ram Pottery workshop Mauritius",
      },
    ],
  },
};

const processItems = [
  {
    title: "Shaping",
    desc: "Every piece begins with intention, balance and respect for the clay.",
  },
  {
    title: "Refining",
    desc: "Textures, edges, curves and details are carefully improved before the final finish.",
  },
  {
    title: "Finishing",
    desc: "Each item is selected for strength, beauty, character and lasting value.",
  },
];

const workshopJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Our Workshop | Ram Pottery Mauritius",
  url: `${siteUrl}/workshop`,
  description:
    "A premium look inside the Ram Pottery workshop in Mauritius, showing the process of shaping and finishing handmade pottery.",
  publisher: {
    "@type": "Organization",
    name: "Ram Pottery",
    url: siteUrl,
  },
};

export default function WorkshopPage() {
  return (
    <main className="overflow-hidden bg-white text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(workshopJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="bg-white px-4 pb-14 pt-8 sm:px-6 lg:px-10 lg:pb-20 lg:pt-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-red-900">
              Our Workshop
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-neutral-950 sm:text-5xl lg:text-7xl">
              Where Clay Becomes Art
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
              Step into the world of Ram Pottery and discover the craftsmanship,
              process and passion behind each handcrafted creation. From raw
              earth to refined elegance, every piece is shaped with care and
              selected with pride.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex rounded-full bg-red-900 px-7 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_45px_rgba(127,29,29,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800"
              >
                Shop Collection
              </Link>

              <Link
                href="/contact"
                className="inline-flex rounded-full border border-neutral-200 bg-white px-7 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-red-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
              >
                Visit / Enquire
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_18px_55px_rgba(15,10,5,0.06)]">
              <div className="border-r border-neutral-100 px-4 py-5 text-center">
                <p className="text-sm font-black text-red-900 sm:text-base">
                  Handmade
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Process
                </p>
              </div>

              <div className="border-r border-neutral-100 px-4 py-5 text-center">
                <p className="text-sm font-black text-red-900 sm:text-base">
                  Natural
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Clay
                </p>
              </div>

              <div className="px-4 py-5 text-center">
                <p className="text-sm font-black text-red-900 sm:text-base">
                  Premium
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Finish
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="relative mx-auto max-w-[430px] overflow-hidden rounded-[38px] border border-neutral-200 bg-neutral-950 p-3 shadow-[0_28px_95px_rgba(15,10,5,0.18)]">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[30px] bg-neutral-950">
                <video
                  className="h-full w-full object-cover"
                  src="/images/videos/ourworkshop/ram-pottery-workshop.mp4"
                  poster="/images/Our%20Workshop/12.png"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  controls={false}
                  aria-label="Ram Pottery workshop process video"
                />
              </div>

              <div className="absolute bottom-6 left-1/2 w-[82%] -translate-x-1/2 rounded-3xl border border-white/20 bg-white/90 px-5 py-4 text-center shadow-[0_18px_45px_rgba(15,10,5,0.18)] backdrop-blur">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-900">
                  Real workshop moments
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#faf8f4] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[36px] border border-neutral-200 bg-white p-3 shadow-[0_22px_80px_rgba(15,10,5,0.1)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[30px]">
              <Image
                src="/images/Our%20Workshop/13.png"
                alt="Ram Pottery artisan workshop Mauritius"
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-red-900">
              Craftsmanship
            </p>

            <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-[-0.05em] text-neutral-950 sm:text-4xl lg:text-6xl">
              From Raw Earth to Refined Elegance
            </h2>

            <div className="mt-7 space-y-5 text-base leading-8 text-neutral-600">
              <p>
                Our workshop is where tradition meets modern refinement. Every
                product begins as raw material and is carefully transformed into
                a premium handcrafted piece.
              </p>

              <p>
                We focus on form, finish, quality and timeless beauty so that
                every piece reflects the Ram Pottery standard.
              </p>

              <p>
                The workshop is more than a production space — it is where
                material, patience, skill and creativity come together to create
                pottery with character and purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      <WorkshopGallerySlider />

      <section className="bg-[#faf8f4] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-red-900">
              Our Process
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-neutral-950 sm:text-4xl lg:text-5xl">
              Every Detail Matters Before It Reaches You
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {processItems.map((item, index) => (
              <div
                key={item.title}
                className="group rounded-[32px] border border-neutral-200 bg-white p-7 shadow-[0_14px_45px_rgba(15,10,5,0.055)] transition duration-300 hover:-translate-y-1 hover:border-red-900/20 hover:shadow-[0_24px_75px_rgba(80,0,0,0.11)]"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-900 text-sm font-black text-white transition duration-300 group-hover:scale-110">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="text-2xl font-black tracking-[-0.04em] text-neutral-950">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
        <div className="mx-auto overflow-hidden rounded-[38px] bg-neutral-950 px-6 py-14 text-center text-white shadow-[0_28px_100px_rgba(15,10,5,0.18)] sm:px-10 lg:max-w-7xl lg:py-20">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-red-100">
            Ram Pottery Workshop
          </p>

          <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black tracking-[-0.05em] sm:text-5xl">
            Handmade Craft, Premium Detail and Mauritian Character
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/70">
            Discover pieces made with presence, purpose and care — crafted for
            homes, gifts, rituals, hotels, gardens and meaningful spaces.
          </p>

          <div className="mt-9">
            <Link
              href="/shop"
              className="inline-flex rounded-full bg-red-900 px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-red-800"
            >
              Shop Ram Pottery
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}