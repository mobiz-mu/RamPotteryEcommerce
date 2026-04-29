import Link from "next/link";
import { categories } from "@/data/mock";

export default function CategoriesPage() {
  return (
    <main className="bg-[#f7f5f0] px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center text-4xl font-extrabold text-neutral-950">
          Ram Pottery Categories
        </h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="rounded-2xl bg-white p-6 text-lg font-bold text-neutral-800 shadow-sm transition hover:-translate-y-1 hover:text-red-700 hover:shadow-xl"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}