"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { categories } from "@/data/mock";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent bg-transparent text-neutral-900 transition hover:bg-neutral-100"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 z-50 w-[90vw] max-w-sm overflow-y-auto border-r border-neutral-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-lg font-semibold text-neutral-950">Menu</div>

              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-900 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-4">
              <Link href="/" className="block text-base font-medium" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link href="/workshop" className="block text-base font-medium" onClick={() => setOpen(false)}>
                Workshop
              </Link>
              <Link href="/blogs" className="block text-base font-medium" onClick={() => setOpen(false)}>
                Blogs
              </Link>
              <Link href="/about" className="block text-base font-medium" onClick={() => setOpen(false)}>
                About Us
              </Link>
              <Link href="/contact" className="block text-base font-medium" onClick={() => setOpen(false)}>
                Contact Us
              </Link>
            </nav>

            <div className="mt-8">
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Our Categories
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="block rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                    onClick={() => setOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}