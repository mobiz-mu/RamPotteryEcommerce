import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/mock";
import SectionHeading from "@/components/common/SectionHeading";

export default function BlogRow() {
  return (
    <section className="section-space bg-white">
      <div className="container-padded">
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Our Blogs"
            title="Stories, Inspiration & Pottery Living"
            description="Discover elegant ideas, care tips, artisan traditions, and timeless inspiration for living beautifully with handcrafted pottery."
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post, index) => {
            const fallbackImages = [
              "/images/blogs/pottery-care-guide.jpg",
              "/images/blogs/styling-with-pottery.jpg",
              "/images/blogs/handcrafted-pottery-tradition.jpg",
            ];

            const imageValue =
              "image" in post && typeof post.image === "string" ? post.image : "";

            const imageSrc =
              imageValue.trim() !== ""
              ? imageValue
              : fallbackImages[index % fallbackImages.length];

            return (
              <Link
                key={post.id}
                href={`/blogs/${post.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
              >
                <div className="relative h-[240px] w-full overflow-hidden bg-neutral-100 sm:h-[260px]">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-sm font-medium text-neutral-400">
                      Blog Image
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md">
                    Ram Pottery Journal
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold leading-snug text-neutral-950 transition-colors duration-300 group-hover:text-red-600">
                    {post.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-neutral-600">
                    {post.excerpt}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
                    Read Journal
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}