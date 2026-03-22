import PageHero from "@/components/common/PageHero";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Ram Pottery"
        title="A Story of Craftsmanship, Tradition, and Timeless Quality"
        description="Ram Pottery brings handcrafted clay and ceramic artistry into modern Mauritian homes through premium décor, spiritual pieces, tableware, and elegant lifestyle pottery."
      />

      <section className="section-space bg-white">
        <div className="container-padded grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8">
            <div className="flex min-h-[420px] items-center justify-center text-neutral-400">
              About Image / Founder / Workshop Visual
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-neutral-950">
              Quality matters in every piece
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-neutral-600">
              <p>
                At Ram Pottery, every piece is shaped with purpose, care, and an
                appreciation for timeless handcrafted beauty.
              </p>
              <p>
                Our collections are designed to bring warmth, elegance, and cultural
                richness into homes, sacred spaces, and daily living across Mauritius.
              </p>
              <p>
                From terracotta home décor to clay pooja items, vases, lamps, and
                cookingware, our work reflects artisanal pride and a premium finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-[#fafafa]">
        <div className="container-padded grid gap-6 md:grid-cols-3">
          {[
            ["Handcrafted Excellence", "Each piece celebrates artisanal detail and premium craftsmanship."],
            ["Mauritian Identity", "Designed for homes and customers who value authenticity and beauty."],
            ["Timeless Luxury", "Elegant clay and ceramic creations made to last and inspire."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-3xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-neutral-950">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}