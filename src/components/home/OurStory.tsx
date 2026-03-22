import Image from "next/image";
import SectionHeading from "@/components/common/SectionHeading";

export default function OurStory() {
  return (
    <section className="section-space bg-white">
      <div className="container-padded grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#e7d7c4] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8b5e3c] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#b8834a]" />
            Handmade Heritage
          </div>

          <div className="max-w-2xl">
            <SectionHeading
              eyebrow="Our Story"
              title="Crafted by Hand, Rooted in Heritage"
              description="At Ram Pottery, each creation carries the warmth of tradition, the beauty of raw earth, and the quiet luxury of true craftsmanship. Inspired by timeless pottery methods and shaped with care, our pieces are made to bring authenticity, elegance, and soul into Mauritian homes."
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#eee2d3] bg-white p-5 shadow-[0_10px_30px_rgba(120,84,48,0.06)]">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b45]">
                Timeless Process
              </h3>
              <p className="text-sm leading-7 text-neutral-600">
                From shaping raw clay to the final finish, every step reflects patience,
                precision, and reverence for the art of pottery.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#eee2d3] bg-white p-5 shadow-[0_10px_30px_rgba(120,84,48,0.06)]">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b45]">
                Made with Soul
              </h3>
              <p className="text-sm leading-7 text-neutral-600">
                Our collections are more than products — they are living expressions of
                culture, craftsmanship, and everyday beauty.
              </p>
            </div>
          </div>

          <div className="mt-8 border-l-2 border-[#c79058] pl-5">
            <p className="max-w-xl text-[15px] italic leading-8 text-neutral-700 sm:text-base">
              “Where earth, hands, and tradition come together to create pieces that feel
              both meaningful and enduring.”
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-[560px]">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#eadcc9] bg-[#f8f3ed] shadow-[0_20px_60px_rgba(90,58,30,0.12)]">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/images/our-story-pottery-lady.jpg"
                  alt="Traditional pottery craftsmanship at Ram Pottery"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 560px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a1a12]/35 via-transparent to-white/10" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <div className="max-w-[280px] rounded-2xl border border-white/20 bg-[#2f2118]/70 p-4 text-white backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f0d2b1]">
                    Since Tradition
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/90">
                    Preserving the beauty of pottery through handcrafted pieces inspired by
                    old-world artistry and local authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}