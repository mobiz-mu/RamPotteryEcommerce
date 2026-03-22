"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useMemo, useState } from "react";
import MegaMenu from "@/components/layout/MegaMenu";
import { categories } from "@/data/mock";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Workshop", href: "/workshop" },
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const socialIcons = [
  { name: "Facebook", href: "#", src: "/icons/facebook.png" },
  { name: "TikTok", href: "#", src: "/icons/tiktok.png" },
  { name: "Instagram", href: "#", src: "/icons/instagram.png" },
  { name: "LinkedIn", href: "#", src: "/icons/linkedin.png" },
];

function UtilityIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      prefetch={false}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 transition duration-200 hover:-translate-y-0.5 hover:text-red-600"
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const featuredCategories = useMemo(() => categories.slice(0, 8), []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-white/92 backdrop-blur-md">
        <div className="border-b border-neutral-200/60">
          <div className="container-padded grid min-h-[74px] grid-cols-[1fr_auto_1fr] items-center gap-3 lg:min-h-[82px]">
            <div className="hidden items-center gap-1.5 lg:flex">
              {socialIcons.map((icon) => (
                <Link
                  key={icon.name}
                  href={icon.href}
                  aria-label={icon.name}
                  prefetch={false}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full opacity-70 transition duration-200 hover:-translate-y-0.5 hover:opacity-100 hover:scale-[1.06]"
                >
                  <Image
                    src={icon.src}
                    alt={icon.name}
                    width={22}
                    height={22}
                    className="h-[22px] w-[22px] object-contain"
                  />
                </Link>
              ))}
            </div>

            <div className="flex items-center lg:hidden">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 transition hover:bg-neutral-50"
              >
                <Menu className="h-5 w-5 stroke-[1.8]" />
              </button>
            </div>

            <div className="flex justify-center">
              <Link href="/" className="inline-flex items-center justify-center">
                <Image
                  src="/brand/logo.png"
                  alt="Ram Pottery"
                  width={205}
                  height={76}
                  priority
                  className="h-auto w-[108px] sm:w-[116px] lg:w-[122px]"
                />
              </Link>
            </div>

            <div className="flex items-center justify-end gap-0.5 sm:gap-1">
              <UtilityIconLink href="/search" label="Search">
                <Search className="h-[21px] w-[21px] stroke-[1.75]" />
              </UtilityIconLink>

              <UtilityIconLink href="/login" label="Login or Sign up">
                <User className="h-[21px] w-[21px] stroke-[1.75]" />
              </UtilityIconLink>

              <UtilityIconLink href="/wishlist" label="Wishlist">
                <Heart className="h-[21px] w-[21px] stroke-[1.75]" />
              </UtilityIconLink>

              <UtilityIconLink href="/cart" label="Cart">
                <ShoppingBag className="h-[21px] w-[21px] stroke-[1.75]" />
              </UtilityIconLink>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="container-padded">
            <nav className="flex min-h-[50px] items-center justify-center gap-9 xl:gap-10">
              <Link
                href="/"
                prefetch={false}
                className="text-[14.5px] font-medium tracking-[0.01em] text-neutral-900 transition hover:text-red-600"
              >
                Home
              </Link>

              <MegaMenu />

              {navItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className="text-[14.5px] font-medium tracking-[0.01em] text-neutral-900 transition hover:text-red-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <>
          <div
            className="fixed inset-0 z-[70] bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 z-[80] w-[92vw] max-w-[390px] overflow-y-auto border-r border-neutral-200 bg-white lg:hidden">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-5">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Image
                  src="/brand/logo.png"
                  alt="Ram Pottery"
                  width={160}
                  height={60}
                  className="h-auto w-[110px]"
                />
              </Link>

              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-6">
              <div className="mb-6 flex items-center gap-1.5">
                {socialIcons.map((icon) => (
                  <Link
                    key={icon.name}
                    href={icon.href}
                    aria-label={icon.name}
                    prefetch={false}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full opacity-75 transition duration-200 hover:opacity-100 hover:scale-[1.06]"
                  >
                    <Image
                      src={icon.src}
                      alt={icon.name}
                      width={22}
                      height={22}
                      className="h-[22px] w-[22px] object-contain"
                    />
                  </Link>
                ))}
              </div>

              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base font-medium text-neutral-950 transition hover:bg-neutral-50"
                >
                  Home
                </Link>

                <div className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-3">
                  <div className="px-2 pb-3 pt-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-600">
                    Shop Categories
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {featuredCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        onClick={() => setMobileOpen(false)}
                        prefetch={false}
                        className="rounded-2xl border border-neutral-200 bg-white p-3 transition hover:border-red-300"
                      >
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
                          <span className="text-[10px] text-neutral-400">Img</span>
                        </div>
                        <div className="text-sm font-medium leading-5 text-neutral-900">
                          {category.name}
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/shop"
                    onClick={() => setMobileOpen(false)}
                    prefetch={false}
                    className="mt-4 inline-flex rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:border-red-300 hover:text-red-600"
                  >
                    View All Products
                  </Link>
                </div>

                {navItems.slice(1).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    prefetch={false}
                    className="block rounded-2xl px-4 py-3 text-base font-medium text-neutral-950 transition hover:bg-neutral-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}