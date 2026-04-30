import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/mock";

export const metadata: Metadata = {
  title: "Ram Pottery Blog | Pottery Ideas, Décor Tips & Clay Craft Mauritius",
  description:
    "Read Ram Pottery Mauritius blog articles about handcrafted pottery, clay décor, tableware, garden pots, pooja items, styling ideas and pottery care tips.",
};

const fallbackImages = [
  "/images/blogs/pottery-care-guide.jpg",
  "/images/blogs/styling-with-pottery.jpg",
  "/images/blogs/handcrafted-pottery-tradition.jpg",
];

function getPostImage(post: any, index: number) {
  return post.image || fallbackImages[index % fallbackImages.length];
}

export default function BlogsPage() {
  return (
    <main className="bg-[#f7f3ec]">
      <section className="px-5 py-16 text-center sm:px-8 lg:px-10 lg:py-20">
        <p className="text-xs font-extrabold uppercase tracking-[0.34em] text-red-700">
          Ram Pottery Journal
        </p>

        <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
          Stories, Inspiration & Pottery Living
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-neutral-600">
          Discover handcrafted pottery inspiration, clay décor styling,
          terracotta care tips, tableware ideas and timeless artisan stories
          from Ram Pottery Mauritius.
        </p>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-7">
          {blogPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="group grid overflow-hidden rounded-[34px] border border-neutral-200 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.07)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(0,0,0,0.12)] lg:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="relative min-h-[280px] overflow-hidden bg-neutral-100 lg:min-h-[360px]">
                <Image
                  src={getPostImage(post, index)}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-12">
                <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-red-700">
                  Pottery Inspiration
                </p>

                <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-neutral-950 sm:text-4xl">
                  {post.title}
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-600">
                  {post.excerpt}
                </p>

                <div className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-red-700 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition group-hover:bg-red-800">
                  Read Article
                  <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}