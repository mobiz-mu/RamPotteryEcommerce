import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const siteUrl = "https://rampottery.mu";

export const metadata: Metadata = {
  title: "Our Story | Ram Pottery Mauritius",
  description:
    "Discover the story of Ram Pottery Mauritius — premium handmade pottery, clay décor, ceramic pieces, pooja products, tableware and artisan craftsmanship.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "Our Story | Ram Pottery Mauritius",
    description:
      "Explore the heritage, craftsmanship and passion behind Ram Pottery Mauritius.",
    url: `${siteUrl}/about`,
    siteName: "Ram Pottery",
    type: "website",
    locale: "en_MU",
    images: [
      {
        url: `${siteUrl}/images/ourstoryimage.jpeg`,
        width: 1200,
        height: 630,
        alt: "Ram Pottery Mauritius handcrafted pottery story",
      },
    ],
  },
};

const trustItems = [
  {
    title: "Authentic Craftsmanship",
    desc: "Every piece reflects careful handwork, natural clay character and the soul of traditional pottery.",
  },
  {
    title: "Trusted in Mauritius",
    desc: "Ram Pottery serves homes, families, decorators, hotels, businesses and gifting customers across Mauritius.",
  },
  {
    title: "Premium Quality Finish",
    desc: "From décor pieces to tableware and pooja items, our collections are selected for beauty, strength and lasting value.",
  },
  {
    title: "Personal Service",
    desc: "Customers trust us because we guide them with care, respond quickly and help them choose the right pieces.",
  },
];

const storyStats = [
  { value: "100%", label: "Handcrafted Character" },
  { value: "Mauritius", label: "Local Heritage" },
  { value: "Premium", label: "Selected Finishes" },
];

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Our Story | Ram Pottery Mauritius",
  url: `${siteUrl}/about`,
  description:
    "The story of Ram Pottery Mauritius, a handmade pottery and ceramic business focused on craftsmanship, heritage and premium artisan pieces.",
  mainEntity: {
    "@type": "LocalBusiness",
    name: "Ram Pottery",
    url: siteUrl,
    image: `${siteUrl}/images/ourstoryimage.jpeg`,
    telephone: "+23057788884",
    address: {
      "@type": "PostalAddress",
      addressCountry: "MU",
    },
  },
};

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-white text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative isolate bg-white px-4 pb-12 pt-8 sm:px-6 lg:px-10 lg:pb-20 lg:pt-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-red-900">
              Our Story
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-neutral-950 sm:text-5xl lg:text-7xl">
              Crafted with Passion, Rooted in Mauritius
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
              Ram Pottery is built on a simple belief: quality matters. Every
              handcrafted clay and ceramic piece carries warmth, tradition and
              timeless beauty for Mauritian homes, rituals, gifting, gardens and
              elegant interiors.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex rounded-full bg-red-900 px-7 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_45px_rgba(127,29,29,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800"
              >
                Explore Collection
              </Link>

              <Link
                href="/contact"
                className="inline-flex rounded-full border border-neutral-200 bg-white px-7 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-red-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_18px_55px_rgba(15,10,5,0.06)]">
              {storyStats.map((item) => (
                <div
                  key={item.label}
                  className="border-r border-neutral-100 px-4 py-5 text-center last:border-r-0"
                >
                  <p className="text-sm font-black text-red-900 sm:text-base">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-[520px] rounded-[34px] border border-neutral-200 bg-white p-3 shadow-[0_24px_90px_rgba(15,10,5,0.12)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
                <Image
                  src="/images/ourstoryimage.jpeg"
                  alt="Ram Pottery Mauritius handcrafted pottery story"
                  fill
                  priority
                  className="object-cover object-center transition duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 92vw, 520px"
                />
              </div>

              <div className="absolute -bottom-5 left-1/2 w-[86%] -translate-x-1/2 rounded-3xl border border-white/70 bg-white/92 px-5 py-4 text-center shadow-[0_18px_45px_rgba(15,10,5,0.14)] backdrop-blur">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
                  Handmade with soul
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="mx-auto w-full max-w-[430px]">
            <div className="relative overflow-hidden rounded-[38px] border border-neutral-200 bg-neutral-950 p-3 shadow-[0_28px_95px_rgba(15,10,5,0.18)]">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[30px] bg-neutral-950">
                <video
                  className="h-full w-full object-cover"
                  src="/images/videos/ourstory/ram-pottery-our-story.mp4"
                  poster="/images/ourstoryimage.jpeg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  controls={false}
                  aria-label="Ram Pottery our story video"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-red-900">
              About Ram Pottery
            </p>

            <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-[-0.05em] text-neutral-950 sm:text-4xl lg:text-6xl">
              A Heritage of Clay, Detail and Everyday Elegance
            </h2>

            <div className="mt-7 space-y-5 text-base leading-8 text-neutral-600">
              <p>
                At Ram Pottery, every piece begins with respect for the
                material. Clay is shaped, finished and selected with care so it
                can become more than a product — it becomes part of a home, a
                ritual, a gift or a memory.
              </p>

              <p>
                Our collections bring together traditional terracotta character,
                refined ceramic finishes, spiritual essentials, garden pieces,
                décor accents and practical pottery for modern living in
                Mauritius.
              </p>

              <p>
                We serve customers who value authenticity, beauty and durable
                craftsmanship — from families decorating their homes to
                businesses and hospitality clients looking for distinctive
                handmade pieces.
              </p>
            </div>

            <div className="mt-8 rounded-[30px] border border-neutral-200 bg-[#faf7f2] p-6 shadow-sm">
              <p className="text-sm font-bold leading-7 text-neutral-700">
                “Every Ram Pottery piece is selected to bring warmth, character
                and meaning into the spaces where people live, pray, gather and
                celebrate.”
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#faf8f4] px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          <div className="rounded-[34px] border border-neutral-200 bg-white p-7 shadow-[0_18px_60px_rgba(15,10,5,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,10,5,0.1)] sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-900">
              Our Mission
            </p>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.04em] text-neutral-950">
              To bring handcrafted beauty into every Mauritian space.
            </h3>
            <p className="mt-5 text-base leading-8 text-neutral-600">
              Our mission is to make premium pottery accessible, meaningful and
              beautifully presented — whether for homes, gardens, pooja spaces,
              gifts, hotels or lifestyle interiors.
            </p>
          </div>

          <div className="rounded-[34px] border border-red-900/10 bg-red-950 p-7 text-white shadow-[0_18px_60px_rgba(127,29,29,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(127,29,29,0.2)] sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-100">
              Our Vision
            </p>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.04em]">
              To become Mauritius’ most trusted pottery destination.
            </h3>
            <p className="mt-5 text-base leading-8 text-white/75">
              We aim to grow Ram Pottery as a leading name for clay, ceramic and
              terracotta craftsmanship — recognised for quality, service,
              authenticity and timeless design.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-red-900">
              Why Customers Trust Us
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-neutral-950 sm:text-4xl lg:text-5xl">
              Quality, Care and Craftsmanship in Every Detail
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item, index) => (
              <div
                key={item.title}
                className="group rounded-[30px] border border-neutral-200 bg-white p-6 shadow-[0_14px_45px_rgba(15,10,5,0.055)] transition duration-300 hover:-translate-y-1 hover:border-red-900/20 hover:shadow-[0_24px_75px_rgba(80,0,0,0.11)]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-red-900 text-sm font-black text-white transition duration-300 group-hover:scale-110">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="text-xl font-black tracking-[-0.03em] text-neutral-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-neutral-600">
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
            Ram Pottery Mauritius
          </p>

          <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black tracking-[-0.05em] sm:text-5xl">
            Handmade Pieces with Soul, Purpose and Presence
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/70">
            From simple everyday pieces to statement décor, Ram Pottery is here
            to help customers choose pottery that feels personal, meaningful and
            beautifully made.
          </p>

          <div className="mt-9">
            <Link
              href="/shop"
              className="inline-flex rounded-full bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-neutral-950 transition duration-300 hover:-translate-y-0.5 hover:bg-red-50"
            >
              Shop Ram Pottery
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}