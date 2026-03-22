import PageHero from "@/components/common/PageHero";

export default function WorkshopPage() {
  return (
    <>
      <PageHero
        eyebrow="Workshop"
        title="Where Clay Becomes Art"
        description="Step into the world of Ram Pottery and discover the craftsmanship, process, and passion behind each handcrafted creation."
      />

      <section className="section-space bg-white">
        <div className="container-padded grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold text-neutral-950">
              From raw earth to refined elegance
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-neutral-600">
              <p>
                Our workshop is where tradition meets modern refinement. Every product
                begins as a raw material and is carefully transformed into a premium
                handcrafted piece.
              </p>
              <p>
                We focus on form, finish, quality, and timeless beauty so that every
                piece reflects the Ram Pottery standard.
              </p>
              <p>
                This page can later be expanded with workshop images, process videos,
                artisan stories, and custom order information from the backend.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8">
            <div className="flex min-h-[420px] items-center justify-center text-neutral-400">
              Workshop Gallery / Video Placeholder
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-[#fafafa]">
        <div className="container-padded grid gap-6 md:grid-cols-3">
          {[
            ["Shaping", "Carefully forming each piece with balance and intention."],
            ["Finishing", "Refining texture, detail, and elegance before final presentation."],
            ["Firing", "Ensuring durability, strength, and premium quality."],
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