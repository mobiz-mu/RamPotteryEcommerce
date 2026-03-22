import Link from "next/link";
import PageHero from "@/components/common/PageHero";
import { blogPosts } from "@/data/mock";

export default function BlogsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Blogs"
        title="Stories, Inspiration, and Pottery Living"
        description="Explore articles on handcrafted pottery, décor styling, clay cookingware, care tips, and artisan inspiration from Ram Pottery."
      />

      <section className="section-space bg-white">
        <div className="container-padded grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="rounded-3xl border border-neutral-200 bg-white overflow-hidden transition hover:-translate-y-1"
            >
              <div className="aspect-[16/10] bg-neutral-100" />
              <div className="p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
                  Blog Article
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-neutral-950">
                  {post.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-neutral-600">{post.excerpt}</p>
                <div className="mt-5 text-sm font-medium text-red-600">Read More</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}