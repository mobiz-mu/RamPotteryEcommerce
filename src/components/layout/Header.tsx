"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Facebook,
  Heart,
  Instagram,
  Linkedin,
  LogIn,
  Menu,
  MessageCircle,
  Music2,
  ShoppingBag,
  UserPlus,
  X,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { categories } from "@/data/mock";

const WHATSAPP_URL =
  "https://wa.me/23057788884?text=Hello%20Ram%20Pottery%2C%20I%20want%20to%20place%20an%20order.";

const desktopLeftLinks = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Our Story", href: "/about" },
  { label: "Workshop", href: "/workshop" },
];

const desktopRightLinks = [
  { label: "Blog", href: "/blogs" },
  { label: "Our Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

const mobileLinks = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Our Story", href: "/about" },
  { label: "Workshop", href: "/workshop" },
  { label: "Blog", href: "/blogs" },
  { label: "Our Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

function getCategoryImage(category: any) {
  return category.image || category.imageUrl || category.thumbnail || "/brand/logo.png";
}

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white">
        <div
          className="relative mx-auto flex h-[92px] max-w-[1800px] items-center justify-between overflow-hidden bg-cover bg-center bg-no-repeat px-4 sm:h-[98px] sm:px-6 lg:h-[104px] lg:px-10"
          style={{
            backgroundImage: "url('/images/header/menu-bg.webp')",
          }}
        >
          <div className="flex h-full flex-1 items-center justify-start gap-7">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="group flex h-11 w-11 items-center justify-center"
            >
              <span className="relative block h-5 w-7">
                <span className="absolute left-0 top-0 h-[2px] w-7 bg-neutral-800 transition group-hover:bg-red-700" />
                <span className="absolute left-0 top-1/2 h-[2px] w-7 -translate-y-1/2 bg-neutral-800 transition group-hover:bg-red-700" />
                <span className="absolute bottom-0 left-0 h-[2px] w-7 bg-neutral-800 transition group-hover:bg-red-700" />
              </span>
            </button>

            <nav className="hidden h-full items-center gap-7 xl:flex">
              {desktopLeftLinks.map((item) => (
                <Link key={item.href} className="header-link" href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href="/"
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          >
            <Image
              src="/brand/logo.png"
              alt="Ram Pottery Mauritius"
              width={155}
              height={100}
              priority
              className="block h-auto w-[112px] object-contain sm:w-[118px] lg:w-[122px]"
            />
          </Link>

          <div className="flex h-full flex-1 items-center justify-end gap-4 lg:gap-5">
            <nav className="hidden h-full items-center gap-7 xl:flex">
              {desktopRightLinks.map((item) => (
                <Link key={item.href} className="header-link" href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <IconLink href="/signup" label="Signup" desktopOnly>
              <UserPlus className="h-5 w-5 stroke-[1.7]" />
            </IconLink>

            <IconLink href="/login" label="Login">
              <LogIn className="h-5 w-5 stroke-[1.7]" />
            </IconLink>

            <IconLink href="/wishlist" label="Wishlist">
              <Heart className="h-5 w-5 stroke-[1.7]" />
            </IconLink>

            <IconLink href="/cart" label="Cart">
              <ShoppingBag className="h-5 w-5 stroke-[1.7]" />
            </IconLink>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <>
          <button
            aria-label="Close menu overlay"
            className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
          />

          <aside className="fixed inset-y-0 left-0 z-[90] flex w-[365px] max-w-[92vw] animate-[slideMenuIn_.28s_ease-out] flex-col overflow-y-auto bg-[#f7f7f7] shadow-2xl">
            <div className="relative flex h-[86px] shrink-0 items-center justify-center border-b border-neutral-300 bg-white">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="absolute left-5 text-neutral-500 transition hover:rotate-90 hover:text-red-700"
              >
                <X className="h-6 w-6 stroke-[1.4]" />
              </button>

              <Image
                src="/brand/logo.png"
                alt="Ram Pottery"
                width={135}
                height={80}
                className="h-auto w-[96px] object-contain"
              />
            </div>

            <nav className="px-4 py-4">
              <div className="xl:hidden">
                {mobileLinks.map((item) => (
                  <DrawerButton
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {item.label}
                  </DrawerButton>
                ))}

                <button
                  type="button"
                  onClick={() => setMobileCategoriesOpen((value) => !value)}
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-neutral-700 shadow-sm transition hover:bg-red-700 hover:text-white"
                >
                  Categories
                  <ChevronDown
                    className={`h-4 w-4 transition ${
                      mobileCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileCategoriesOpen && (
                  <CategoryList onClose={() => setDrawerOpen(false)} />
                )}

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center rounded-lg bg-red-700 px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-white shadow-lg transition hover:bg-red-800"
                >
                  Order Now
                </a>
              </div>

              <div className="hidden xl:block">
                <DrawerButton href="/shop" onClick={() => setDrawerOpen(false)}>
                  Shop All
                </DrawerButton>

                <div className="mb-2 mt-3 text-center text-[11px] font-extrabold uppercase tracking-[0.24em] text-red-700">
                  Categories
                </div>

                <CategoryList onClose={() => setDrawerOpen(false)} />

                <DrawerButton href="/contact" onClick={() => setDrawerOpen(false)}>
                  Contact Us
                </DrawerButton>
              </div>
            </nav>

            <div className="mt-auto border-t border-neutral-300 px-6 py-4">
              <div className="flex items-center justify-center gap-5 text-neutral-600">
                <SocialIcon href="#" label="Facebook"><Facebook className="h-4 w-4" /></SocialIcon>
                <SocialIcon href="#" label="Instagram"><Instagram className="h-4 w-4" /></SocialIcon>
                <SocialIcon href="#" label="YouTube"><Youtube className="h-4 w-4" /></SocialIcon>
                <SocialIcon href="#" label="TikTok"><Music2 className="h-4 w-4" /></SocialIcon>
                <SocialIcon href="#" label="LinkedIn"><Linkedin className="h-4 w-4" /></SocialIcon>
                <SocialIcon href={WHATSAPP_URL} label="WhatsApp"><MessageCircle className="h-4 w-4" /></SocialIcon>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

function CategoryList({ onClose }: { onClose: () => void }) {
  return (
    <div className="mb-3 grid max-h-[360px] gap-1.5 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2">
      {categories.map((category: any) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] font-semibold text-neutral-700 transition hover:bg-red-50 hover:text-red-700"
        >
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md bg-neutral-100">
            <Image
              src={getCategoryImage(category)}
              alt={category.name}
              fill
              sizes="28px"
              className="object-cover"
            />
          </span>
          <span className="line-clamp-1">{category.name}</span>
        </Link>
      ))}
    </div>
  );
}

function DrawerButton({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="mb-2 flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-700 hover:text-white"
    >
      {children}
    </Link>
  );
}

function IconLink({
  href,
  label,
  children,
  desktopOnly = false,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  desktopOnly?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`group relative text-neutral-800 transition hover:text-red-700 ${
        desktopOnly ? "hidden xl:inline-flex" : "inline-flex"
      }`}
    >
      {children}
      <span className="pointer-events-none absolute left-1/2 top-8 z-50 -translate-x-1/2 rounded bg-neutral-950 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition group-hover:top-9 group-hover:opacity-100">
        {label}
      </span>
    </Link>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href === "#" ? undefined : "_blank"}
      rel={href === "#" ? undefined : "noopener noreferrer"}
      aria-label={label}
      className="transition hover:scale-125 hover:text-red-700"
    >
      {children}
    </a>
  );
}
