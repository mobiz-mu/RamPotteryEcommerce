import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/common/SectionHeading";

const categoryItems = [
  { name: "Ceramic Tulsi Pot", slug: "ceramic-tulsi-pot", image: "/images/categories/ceramic-tulsi-pot.jpg" },
  { name: "Ceramic Vase", slug: "ceramic-vase", image: "/images/categories/ceramic-vase.jpg" },
  { name: "Clay Cookingware", slug: "clay-cookingware", image: "/images/categories/clay-cookingware.jpg" },
  { name: "Clay Flower Pot", slug: "clay-flower-pot", image: "/images/categories/clay-flower-pot.jpg" },
  { name: "Clay Matka", slug: "clay-matka", image: "/images/categories/clay-matka.jpg" },
  { name: "Clay Murti", slug: "clay-murti", image: "/images/categories/clay-murti.jpg" },
  { name: "Clay Pooja Products", slug: "clay-pooja-products", image: "/images/categories/clay-pooja-products.jpg" },
  { name: "Clay Souvenir", slug: "clay-souvenir", image: "/images/categories/clay-souvenir.jpg" },
  { name: "Clay Wind Chime", slug: "clay-wind-chime", image: "/images/categories/clay-wind-chime.jpg" },
  { name: "Earthen Clay Lamp", slug: "earthen-clay-lamp", image: "/images/categories/earthen-clay-lamp.jpg" },
  { name: "Other Category", slug: "other-category", image: "/images/categories/other-category.jpg" },
  { name: "Painting & Wax Lamp", slug: "painting-wax-lamp", image: "/images/categories/painting-wax-lamp.jpg" },
  { name: "Tableware", slug: "tableware", image: "/images/categories/tableware.jpg" },
  { name: "Terracotta Home Decor", slug: "terracotta-home-decor", image: "/images/categories/terracotta-home-decor.jpg" },
];

const marqueeItems = [...categoryItems, ...categoryItems];

export default function CategoryExplorer() {
  return (
    <section className="overflow-hidden bg-white py-14 md:py-16">
      <style>{`
        @keyframes ram-pottery-category-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      <div className="container-padded">
        <SectionHeading
          title="Explore Categories"
          description="Discover our handcrafted pottery collections."
          center
        />
      </div>

      <div className="relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent md:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent md:w-20" />

        <div
          className="group flex min-w-max items-start gap-6 md:gap-8 hover:[animation-play-state:paused]"
          style={{ animation: "ram-pottery-category-marquee 55s linear infinite" }}
        >
          {marqueeItems.map((item, index) => (
            <Link
              key={`${item.slug}-${index}`}
              href={`/categories/${item.slug}`}
              prefetch={false}
              className="w-[240px] shrink-0 text-center sm:w-[260px] md:w-[280px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 639px) 240px, (max-width: 767px) 260px, 280px"
                  className="object-cover object-center transition duration-700 ease-out hover:scale-[1.035]"
                />
              </div>

              <h3
                className="mx-auto mt-6 max-w-[92%] text-balance text-[1.7rem] leading-[1.15] tracking-[-0.03em] text-neutral-950 md:text-[1.95rem]"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {item.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}