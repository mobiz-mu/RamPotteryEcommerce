import Image from "next/image";
import Link from "next/link";

const trustItems = [
  {
    title: "Authentic Craftsmanship",
    desc: "Every piece reflects careful handwork, natural clay character, and the soul of traditional pottery.",
  },
  {
    title: "Trusted in Mauritius",
    desc: "Ram Pottery serves Mauritian homes, families, decorators, businesses, hotels and gifting customers.",
  },
  {
    title: "Premium Quality Finish",
    desc: "From décor pieces to tableware and pooja items, our collections are selected for beauty, strength and lasting value.",
  },
  {
    title: "Personal Service",
    desc: "Customers trust us because we guide them with care, respond quickly, and help them choose the right pieces.",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#f7f3ec]">
      <section className="relative isolate min-h-[72vh] overflow-hidden bg-black">
        <Image
          src="/images/ourstoryimage.jpeg"
          alt="Ram Pottery Mauritius handcrafted pottery story"
          fill
          priority
          className="object-cover object-center opacity-70"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72),rgba(0,0,0,0.35),rgba(0,0,0,0.12))]" />

        <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl items-center px-5 py-20 sm:px-8 lg:px-10">
          <div className="max-w-3xl animate-[fadeUp_.8s_ease-out]">
            <p className="text-xs font-extrabold uppercase tracking-[0.36em] text-red-200">
              Our Story
            </p>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Crafted with Passion, Rooted in Mauritius
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/86 sm:text-lg">
              Ram Pottery is built on a simple belief: quality matters. Every
              handcrafted clay and ceramic piece carries warmth, tradition and
              timeless beauty for Mauritian homes, rituals, gifting, gardens and
              elegant interiors.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:-translate-y-0.5 hover:bg-red-50"
              >
                Explore Collection
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-white/60 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative animate-[fadeUp_.9s_ease-out] overflow-hidden rounded-[34px] bg-white p-3 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
              <Image
                src="/images/ourstoryimage.jpeg"
                alt="Ram Pottery workshop and handcrafted products"
                fill
                className="object-cover object-center transition duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
            </div>
          </div>

          <div className="animate-[fadeUp_1s_ease-out]">
            <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-red-700">
              About Ram Pottery
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              A Heritage of Clay, Detail and Everyday Elegance
            </h2>

            <div className="mt-6 space-y-5 text-base leading-8 text-neutral-700">
              <p>
                At Ram Pottery, every piece begins with respect for the material.
                Clay is shaped, finished and selected with care so it can become
                more than a product — it becomes part of a home, a ritual, a gift
                or a memory.
              </p>

              <p>
                Our collections bring together traditional terracotta character,
                refined ceramic finishes, spiritual essentials, garden pieces,
                décor accents and practical pottery for modern living in Mauritius.
              </p>

              <p>
                We serve customers who value authenticity, beauty and durable
                craftsmanship — from families decorating their homes to businesses
                and hospitality clients looking for distinctive handmade pieces.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          <div className="rounded-[32px] border border-neutral-200 bg-[#faf7f1] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-red-700">
              Our Mission
            </p>
            <h3 className="mt-4 text-3xl font-extrabold text-neutral-950">
              To bring handcrafted beauty into every Mauritian space.
            </h3>
            <p className="mt-5 text-base leading-8 text-neutral-700">
              Our mission is to make premium pottery accessible, meaningful and
              beautifully presented — whether for homes, gardens, pooja spaces,
              gifts, hotels or lifestyle interiors.
            </p>
          </div>

          <div className="rounded-[32px] border border-neutral-200 bg-neutral-950 p-8 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-red-200">
              Our Vision
            </p>
            <h3 className="mt-4 text-3xl font-extrabold">
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

      <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-red-700">
              Why Customers Trust Us
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl">
              Quality, Care and Craftsmanship in Every Detail
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item, index) => (
              <div
                key={item.title}
                className="group rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_22px_60px_rgba(0,0,0,0.1)]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-red-700 text-sm font-extrabold text-white transition group-hover:scale-110">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="text-xl font-extrabold text-neutral-950">
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

      <section className="bg-neutral-950 px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.34em] text-red-200">
            Ram Pottery Mauritius
          </p>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl">
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
              className="inline-flex rounded-full bg-red-700 px-8 py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-red-800"
            >
              Shop Ram Pottery
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}