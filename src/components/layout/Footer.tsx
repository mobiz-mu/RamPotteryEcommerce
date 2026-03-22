import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants/site";
import { categories } from "@/data/mock";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/",
    icon: "/icons/instagram.png",
  },
  {
    name: "Facebook",
    href: "https://facebook.com/",
    icon: "/icons/facebook.png",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/",
    icon: "/icons/tiktok.png",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/",
    icon: "/icons/linkedin.png",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="container-padded py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 xl:grid-cols-[1.15fr_0.9fr_0.9fr_0.95fr]">
          <div>
            <div className="max-w-md">
              <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                Ram Pottery
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-[15px]">
                Premium handcrafted pottery, clay décor, pooja items, tableware,
                vases, cookingware, and terracotta creations in Mauritius —
                made with tradition, elegance, and timeless artisanal beauty.
              </p>
            </div>

            <div className="mt-6 space-y-2 text-sm leading-7 text-neutral-600">
              <p>{SITE_CONFIG.address}</p>
              <p>
                <Link
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="transition hover:text-red-600"
                >
                  {SITE_CONFIG.phone}
                </Link>
              </p>
              <p>
                <Link
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="transition hover:text-red-600"
                >
                  {SITE_CONFIG.email}
                </Link>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-neutral-950">Categories</h4>
            <div className="mt-5 space-y-3 text-sm text-neutral-600">
              {categories.slice(0, 7).map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="block transition duration-200 hover:translate-x-1 hover:text-red-600"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-neutral-950">Company</h4>

            <div className="mt-5 space-y-3 text-sm text-neutral-600">
              <Link
                href="/about"
                className="block transition duration-200 hover:translate-x-1 hover:text-red-600"
              >
                About Us
              </Link>
              <Link
                href="/blogs"
                className="block transition duration-200 hover:translate-x-1 hover:text-red-600"
              >
                Blogs
              </Link>
              <Link
                href="/workshop"
                className="block transition duration-200 hover:translate-x-1 hover:text-red-600"
              >
                Workshop
              </Link>
              <Link
                href="/contact"
                className="block transition duration-200 hover:translate-x-1 hover:text-red-600"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Follow Us
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="group flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-transparent transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:bg-red-50"
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain transition duration-300 group-hover:scale-110"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-neutral-950">Customer Help</h4>
            <div className="mt-5 space-y-3 text-sm text-neutral-600">
              <Link
                href="/shipping-returns"
                className="block transition duration-200 hover:translate-x-1 hover:text-red-600"
              >
                Shipping & Returns
              </Link>
              <Link
                href="/privacy-policy"
                className="block transition duration-200 hover:translate-x-1 hover:text-red-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="block transition duration-200 hover:translate-x-1 hover:text-red-600"
              >
                Terms & Conditions
              </Link>
            </div>

            <div className="mt-8">
              <Link
                href="https://g.page/"
                target="_blank"
                rel="noreferrer"
                className="inline-block transition duration-300 hover:-translate-y-1"
              >
                <Image
                  src="/icons/googlereviews-badge.png"
                  alt="Google Reviews"
                  width={170}
                  height={70}
                  className="h-[100px] w-auto object-contain sm:h-[120px]"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-600">
        <div className="container-padded flex flex-col items-center justify-between gap-3 py-4 text-center text-sm text-white md:flex-row">
          <p>© {new Date().getFullYear()} Ram Pottery. All rights reserved.</p>

          <p className="flex flex-wrap items-center justify-center gap-1">
            <span>Built by</span>
            <Link
              href="https://mobiz.mu"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-white underline underline-offset-4 transition hover:text-white/80"
            >
              Mobiz.mu
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}