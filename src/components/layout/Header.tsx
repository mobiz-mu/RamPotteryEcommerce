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
import { useEffect, useState } from "react";
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
  return (
    category.image ||
    category.imageUrl ||
    category.thumbnail ||
    "/brand/logo.png"
  );
}

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
const [cartCount, setCartCount] = useState(0);

useEffect(() => {
  function updateCartCount() {
    try {
      const rawCart = window.localStorage.getItem("ram-pottery-cart");
      const cartItems = rawCart ? JSON.parse(rawCart) : [];

      const total = Array.isArray(cartItems)
        ? cartItems.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0,
          )
        : 0;

      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  }

  updateCartCount();

  window.addEventListener("ram-pottery-cart-updated", updateCartCount);
  window.addEventListener("storage", updateCartCount);

  return () => {
    window.removeEventListener("ram-pottery-cart-updated", updateCartCount);
    window.removeEventListener("storage", updateCartCount);
  };
}, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-red-950/10 bg-white shadow-[0_12px_34px_rgba(80,0,0,0.06)]">
        <div
          className="relative mx-auto flex h-[92px] max-w-[1800px] items-center justify-between overflow-hidden bg-cover bg-center bg-no-repeat px-4 sm:h-[98px] sm:px-6 lg:h-[104px] lg:px-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.92),rgba(255,255,255,0.92)), url('/images/header/menu-bg.webp')",
          }}
        >
          <div className="flex h-full flex-1 items-center justify-start gap-7">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="group flex h-11 w-11 items-center justify-center rounded-full transition duration-300 hover:bg-red-950/5"
            >
              <Menu className="h-7 w-7 text-red-900 transition duration-300 group-hover:scale-110 group-hover:text-red-700" />
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
            aria-label="Ram Pottery homepage"
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition duration-500 hover:scale-[1.035]"
          >
            <Image
              src="/brand/logo.png"
              alt="Ram Pottery Mauritius"
              width={155}
              height={100}
              priority
              className="block h-auto w-[112px] object-contain drop-shadow-sm sm:w-[118px] lg:w-[122px]"
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
              <UserPlus className="h-5 w-5 stroke-[1.8]" />
            </IconLink>

            <IconLink href="/login" label="Login">
              <LogIn className="h-5 w-5 stroke-[1.8]" />
            </IconLink>

            <IconLink href="/wishlist" label="Wishlist">
              <Heart className="h-5 w-5 stroke-[1.8]" />
            </IconLink>

            <CartIconLink count={cartCount} />
          </div>
        </div>
      </header>

      {drawerOpen ? (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-[80] animate-[fadeIn_.24s_ease-out] bg-red-950/35 backdrop-blur-[3px]"
            onClick={() => setDrawerOpen(false)}
          />

          <aside className="fixed inset-y-0 left-0 z-[90] flex w-[365px] max-w-[92vw] animate-[drawerFadeIn_.32s_ease-out] flex-col overflow-y-auto bg-white shadow-[22px_0_80px_rgba(80,0,0,0.18)]">
            <div className="relative flex h-[86px] shrink-0 items-center justify-center border-b border-red-950/10 bg-white">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="absolute left-5 rounded-full p-2 text-red-900 transition duration-300 hover:rotate-90 hover:bg-red-950/5 hover:text-red-700"
              >
                <X className="h-6 w-6 stroke-[1.6]" />
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
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-950/10 bg-white px-4 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.1em] text-red-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-red-900 hover:text-white hover:shadow-lg"
                >
                  Categories
                  <ChevronDown
                    className={`h-4 w-4 transition duration-300 ${
                      mobileCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileCategoriesOpen ? (
                  <div className="animate-[fadeDown_.24s_ease-out]">
                    <CategoryList onClose={() => setDrawerOpen(false)} />
                  </div>
                ) : null}

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center rounded-xl bg-red-900 px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-xl"
                >
                  Order Now
                </a>
              </div>

              <div className="hidden xl:block">
                <div className="mb-3 mt-2 text-center text-[11px] font-extrabold uppercase tracking-[0.24em] text-red-900">
                  Categories
                </div>

                <CategoryList onClose={() => setDrawerOpen(false)} />

                <div className="mt-5 rounded-2xl border border-red-950/10 bg-red-50/40 px-4 py-4">
                  <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.22em] text-red-900">
                    Follow Ram Pottery
                  </p>

                  <div className="flex items-center justify-center gap-5 text-red-900">
                    <SocialIcon href="#" label="Facebook">
                      <Facebook className="h-4 w-4" />
                    </SocialIcon>

                    <SocialIcon href="#" label="Instagram">
                      <Instagram className="h-4 w-4" />
                    </SocialIcon>

                    <SocialIcon href="#" label="YouTube">
                      <Youtube className="h-4 w-4" />
                    </SocialIcon>

                    <SocialIcon href="#" label="TikTok">
                      <Music2 className="h-4 w-4" />
                    </SocialIcon>

                    <SocialIcon href="#" label="LinkedIn">
                      <Linkedin className="h-4 w-4" />
                    </SocialIcon>

                    <SocialIcon href={WHATSAPP_URL} label="WhatsApp">
                      <MessageCircle className="h-4 w-4" />
                    </SocialIcon>
                  </div>
                </div>
              </div>
            </nav>
          </aside>
        </>
      ) : null}
    </>
  );
}

function CategoryList({ onClose }: { onClose: () => void }) {
  return (
    <div className="mb-3 grid max-h-[360px] gap-1.5 overflow-y-auto rounded-xl border border-red-950/10 bg-white p-2 shadow-sm">
      {categories.map((category: any) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          onClick={onClose}
          className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] font-semibold text-red-950 transition duration-300 hover:bg-red-50 hover:text-red-800"
        >
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md bg-red-50">
            <Image
              src={getCategoryImage(category)}
              alt={category.name}
              fill
              sizes="28px"
              className="object-cover transition duration-500 group-hover:scale-110"
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
      className="mb-2 flex items-center justify-center rounded-xl border border-red-950/10 bg-white px-4 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.1em] text-red-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-red-900 hover:text-white hover:shadow-lg"
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
      className={`group relative text-red-900 transition duration-300 hover:-translate-y-0.5 hover:text-red-700 ${
        desktopOnly ? "hidden xl:inline-flex" : "inline-flex"
      }`}
    >
      {children}

      <span className="pointer-events-none absolute left-1/2 top-8 z-50 -translate-x-1/2 rounded-md bg-red-950 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:top-9 group-hover:opacity-100">
        {label}
      </span>
    </Link>
  );
}

function CartIconLink({ count }: { count: number }) {
  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="group relative inline-flex text-red-900 transition duration-300 hover:-translate-y-0.5 hover:text-red-700"
    >
      <ShoppingBag className="h-5 w-5 stroke-[1.8]" />

      {count > 0 ? (
        <span className="absolute -right-2.5 -top-2.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-900 px-1.5 text-[10px] font-black leading-none text-white shadow-[0_8px_20px_rgba(127,29,29,0.35)] ring-2 ring-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}

      <span className="pointer-events-none absolute left-1/2 top-8 z-50 -translate-x-1/2 rounded-md bg-red-950 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:top-9 group-hover:opacity-100">
        Cart
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
      className="transition duration-300 hover:scale-125 hover:text-red-700"
    >
      {children}
    </a>
  );
}