import { notFound } from "next/navigation";
import PageHero from "@/components/common/PageHero";
import { blogPosts } from "@/data/mock";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) return notFound();

  return (
    <>
      <PageHero
        eyebrow="Blog Article"
        title={post.title}
        description={post.excerpt}
      />

      <section className="section-space bg-white">
        <div className="container-padded max-w-4xl">
          <div className="aspect-[16/8] rounded-3xl border border-neutral-200 bg-neutral-100" />

          <article className="prose prose-neutral mt-10 max-w-none">
            <p>
              This premium blog article page is now ready for dynamic content from the backend.
              Later, the full article body from Supabase can be rendered here.
            </p>
            <p>
              You can also expand this with rich text, gallery images, internal links, FAQ blocks,
              and structured SEO article metadata.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}