import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { blogPosts } from "@/data/mock";

const siteUrl = "https://rampottery.mu";

export const metadata: Metadata = {
  title: "Ram Pottery Blog | Pottery Ideas, Décor Tips & Clay Craft Mauritius",
  description:
    "Read Ram Pottery Mauritius blog articles about handcrafted pottery, clay décor, tableware, garden pots, pooja items, styling ideas and pottery care tips.",
  alternates: {
    canonical: `${siteUrl}/blogs`,
  },
  openGraph: {
    title: "Ram Pottery Blog | Pottery Ideas & Décor Tips Mauritius",
    description:
      "Explore pottery inspiration, clay décor styling, terracotta care tips, tableware ideas and artisan stories from Ram Pottery Mauritius.",
    url: `${siteUrl}/blogs`,
    siteName: "Ram Pottery",
    type: "website",
    locale: "en_MU",
    images: [
      {
        url: `${siteUrl}/images/blogs/pottery-care-guide.jpg`,
        width: 1200,
        height: 630,
        alt: "Ram Pottery Mauritius blog and pottery inspiration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ram Pottery Blog | Pottery Ideas & Décor Tips Mauritius",
    description:
      "Pottery inspiration, clay décor styling, terracotta care tips and artisan stories from Ram Pottery Mauritius.",
    images: [`${siteUrl}/images/blogs/pottery-care-guide.jpg`],
  },
};

const fallbackImages = [
  "/images/blogs/pottery-care-guide.jpg",
  "/images/blogs/styling-with-pottery.jpg",
  "/images/blogs/handcrafted-pottery-tradition.jpg",
];

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Ram Pottery Blog",
  url: `${siteUrl}/blogs`,
  description:
    "Ram Pottery Mauritius blog articles about handcrafted pottery, clay décor, tableware, garden pots, pooja items, styling ideas and pottery care tips.",
  publisher: {
    "@type": "Organization",
    name: "Ram Pottery",
    url: siteUrl,
  },
};

function getPostImage(post: any, index: number) {
  return post.image || fallbackImages[index % fallbackImages.length];
}

function getFeaturedPost() {
  return blogPosts[0];
}

function getOtherPosts() {
  return blogPosts.slice(1);
}

export default function BlogsPage() {
  const featuredPost = getFeaturedPost();
  const otherPosts = getOtherPosts();

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-12">
        <div className="overflow-hidden rounded-[34px] border border-neutral-200 bg-white px-5 py-8 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:px-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
                <BookOpen className="h-3.5 w-3.5" />
                Ram Pottery Journal
              </div>

              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-neutral-950 sm:text-5xl lg:text-6xl">
                Stories, Inspiration & Pottery Living
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base lg:text-lg lg:leading-8">
                Discover handcrafted pottery inspiration, clay décor styling,
                terracotta care tips, tableware ideas and timeless artisan
                stories from Ram Pottery Mauritius.
              </p>
            </div>

            <div className="grid grid-cols-3 overflow-hidden rounded-[24px] border border-neutral-200 bg-[#faf8f4] shadow-sm">
              <div className="border-r border-neutral-200 px-4 py-4 text-center">
                <p className="text-lg font-black text-red-900">
                  {blogPosts.length}
                </p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  Articles
                </p>
              </div>

              <div className="border-r border-neutral-200 px-4 py-4 text-center">
                <p className="text-lg font-black text-red-900">100%</p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  Craft
                </p>
              </div>

              <div className="px-4 py-4 text-center">
                <p className="text-lg font-black text-red-900">MU</p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  Local
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredPost ? (
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 lg:pb-12">
          <Link
            href={`/blogs/${featuredPost.slug}`}
            className="group grid overflow-hidden rounded-[36px] border border-neutral-200 bg-white shadow-[0_22px_80px_rgba(15,10,5,0.08)] transition duration-500 hover:-translate-y-1 hover:border-red-900/20 hover:shadow-[0_30px_100px_rgba(80,0,0,0.13)] lg:grid-cols-[1.02fr_0.98fr]"
          >
            <div className="relative min-h-[310px] overflow-hidden bg-[#faf6ef] sm:min-h-[420px] lg:min-h-[520px]">
              <Image
                src={getPostImage(featuredPost, 0)}
                alt={featuredPost.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-70" />

              <div className="absolute left-5 top-5 rounded-full bg-white/92 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-red-900 shadow-sm backdrop-blur">
                Featured
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-red-900/10 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-900">
                <Sparkles className="h-3.5 w-3.5" />
                Pottery Inspiration
              </div>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.05em] text-neutral-950 sm:text-4xl lg:text-5xl">
                {featuredPost.title}
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-600">
                {featuredPost.excerpt}
              </p>

              <div className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-red-900 px-7 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_16px_42px_rgba(127,29,29,0.24)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-red-800">
                Read Featured Article
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
              Latest Articles
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-neutral-950 sm:text-4xl">
              Pottery Ideas & Care Guides
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex w-fit items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
          >
            Shop Collection
          </Link>
        </div>

        {otherPosts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {otherPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blogs/${post.slug}`}
                className="group overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-[0_16px_55px_rgba(15,10,5,0.065)] transition duration-500 hover:-translate-y-1 hover:border-red-900/20 hover:shadow-[0_26px_85px_rgba(80,0,0,0.12)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#faf6ef]">
                  <Image
                    src={getPostImage(post, index + 1)}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                </div>

                <div className="p-6 sm:p-7">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-900">
                    Ram Pottery Blog
                  </p>

                  <h3 className="mt-3 line-clamp-2 min-h-[64px] text-2xl font-black leading-tight tracking-[-0.04em] text-neutral-950">
                    {post.title}
                  </h3>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-neutral-600">
                    {post.excerpt}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-red-900">
                    Read Article
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-neutral-200 bg-white p-10 text-center shadow-[0_16px_55px_rgba(15,10,5,0.065)]">
            <h2 className="text-2xl font-black text-neutral-950">
              More articles coming soon
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-600">
              We are preparing more pottery inspiration, décor tips and care
              guides for Ram Pottery customers.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}