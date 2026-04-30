import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/mock";

type Props = {
  params: Promise<{ slug: string }>;
};

const fallbackImages = [
  "/images/blogs/pottery-care-guide.jpg",
  "/images/blogs/styling-with-pottery.jpg",
  "/images/blogs/handcrafted-pottery-tradition.jpg",
];

function getPost(slug: string) {
  return blogPosts.find((item) => item.slug === slug);
}

function getImage(post: any, index = 0) {
  return post.image || fallbackImages[index % fallbackImages.length];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return {
      title: "Blog Article Not Found | Ram Pottery Mauritius",
    };
  }

  return {
    title: `${post.title} | Ram Pottery Mauritius Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Ram Pottery Mauritius`,
      description: post.excerpt,
      type: "article",
      images: [getImage(post)],
    },
  };
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return notFound();

  const postIndex = blogPosts.findIndex((item) => item.slug === slug);
  const imageSrc = getImage(post, postIndex);

  return (
    <main className="bg-[#f7f3ec]">
      <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[38px] border border-neutral-200 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.1)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[360px] bg-neutral-100 lg:min-h-[620px]">
            <Image
              src={imageSrc}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-red-700">
              Ram Pottery Journal
            </p>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              {post.title}
            </h1>

            <p className="mt-6 text-lg leading-8 text-neutral-600">
              {post.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-red-700 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-red-800"
              >
                Shop Collection
              </Link>

              <Link
                href="/blogs"
                className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-neutral-800 transition hover:border-red-700 hover:text-red-700"
              >
                Back to Journal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-10">
        <article className="mx-auto max-w-4xl rounded-[34px] bg-white p-7 shadow-[0_18px_60px_rgba(0,0,0,0.07)] sm:p-10 lg:p-14">
          <p className="text-lg leading-9 text-neutral-700">
            At Ram Pottery Mauritius, pottery is more than decoration. It is a
            connection to natural materials, traditional craft, meaningful
            design and everyday living. Each piece brings texture, warmth and
            character into the spaces where families gather, pray, cook, gift
            and celebrate.
          </p>

          <h2 className="mt-10 text-3xl font-extrabold text-neutral-950">
            Why handcrafted pottery feels different
          </h2>

          <p className="mt-5 leading-8 text-neutral-700">
            Handmade pottery carries small details that make every piece unique.
            The finish, shape, clay tone and artisan touch create a more soulful
            experience than mass-produced décor. This is why terracotta,
            ceramic and clay pieces continue to be loved in Mauritian homes,
            hotels, gardens and spiritual spaces.
          </p>

          <h2 className="mt-10 text-3xl font-extrabold text-neutral-950">
            How to style pottery in your home
          </h2>

          <p className="mt-5 leading-8 text-neutral-700">
            A single statement vase, planter, lamp or tableware piece can
            transform a room. Use pottery to add warmth to modern interiors,
            elegance to dining spaces, calmness to prayer corners, and natural
            charm to patios and gardens. Neutral clay tones blend beautifully
            with wood, stone, linen, greenery and warm lighting.
          </p>

          <h2 className="mt-10 text-3xl font-extrabold text-neutral-950">
            Made for the Mauritius lifestyle
          </h2>

          <p className="mt-5 leading-8 text-neutral-700">
            Ram Pottery collections are selected for homes, gifting,
            hospitality spaces and daily use across Mauritius. Whether you are
            choosing a décor piece, clay cookingware, pooja item, garden pot or
            handmade gift, our goal is to offer pottery that feels authentic,
            elegant and long-lasting.
          </p>

          <div className="mt-12 rounded-[28px] bg-neutral-950 p-8 text-white">
            <h3 className="text-2xl font-extrabold">
              Explore premium handcrafted pottery
            </h3>
            <p className="mt-4 leading-8 text-white/70">
              Browse Ram Pottery Mauritius for artisan pieces, new arrivals,
              best sellers and timeless clay collections made for beautiful
              living.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-full bg-red-700 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-red-800"
            >
              Shop Now
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}