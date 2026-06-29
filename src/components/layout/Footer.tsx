import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site";
import { categories } from "@/data/mock";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/",
    icon: "/icons/facebook.png",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/",
    icon: "/icons/instagram.png",
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

const quickLinks = [
  { name: "Search", href: "/shop" },
  { name: "Shipping & Returns", href: "/shipping-returns" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Blogs", href: "/blogs" },
  { name: "Workshop", href: "/workshop" },
  { name: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#2b0909_0%,#4a0f0f_45%,#120505_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.08),transparent_26%),radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.06),transparent_24%)]" />

      <div className="relative container-padded py-9 sm:py-10 lg:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.85fr_0.85fr_1.15fr] lg:gap-10">
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
              Ram Pottery
            </h3>

            <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
              Premium handcrafted pottery, clay décor, pooja items, tableware,
              vases, cookingware and terracotta creations in Mauritius.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white p-2 shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-red-50"
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={32}
                    height={32}
                    className="h-7 w-7 object-contain transition duration-300 group-hover:scale-110"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-red-100">
              Collections
            </h4>

            <div className="mt-4 space-y-2.5 text-sm text-white/70">
              {categories.slice(0, 7).map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="block transition duration-200 hover:translate-x-1 hover:text-red-100"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-red-100">
              Quick Links
            </h4>

            <div className="mt-4 space-y-2.5 text-sm text-white/70">
              {quickLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block transition duration-200 hover:translate-x-1 hover:text-red-100"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <h4 className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-red-100">
              Company
            </h4>

            <div className="mt-4 space-y-2.5 text-sm text-white/70">
              {companyLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block transition duration-200 hover:translate-x-1 hover:text-red-100"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-red-100">
              Contact
            </h4>

            <div className="mt-4 space-y-4 text-sm leading-7 text-white/70">
              <p className="flex gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-red-100" />
                <span>{SITE_CONFIG.address}</span>
              </p>

              <div className="flex items-center gap-3 transition hover:text-red-100">
                 <Phone className="h-4 w-4 shrink-0 text-red-100" />

              <span>
                <Link href={`tel:${SITE_CONFIG.phone}`} className="transition hover:text-red-100">
                 {SITE_CONFIG.phone}
              </Link>
               {" / "}
              <Link href="tel:+23058060268" className="transition hover:text-red-100">
               +230 58060268
              </Link>
             </span>
            </div>

              <Link
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-3 transition hover:text-red-100"
              >
                <Mail className="h-4 w-4 shrink-0 text-red-100" />
                <span>{SITE_CONFIG.email}</span>
              </Link>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.12)]">
              <p className="text-sm font-semibold text-white">
                Handmade with care.
              </p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Every Ram Pottery piece is crafted with tradition, elegance and
                timeless artisanal beauty.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/15">
        <div className="container-padded flex flex-col items-center justify-between gap-3 py-4 text-center text-xs text-white/65 sm:text-sm md:flex-row">
          <p>© {new Date().getFullYear()} Ram Pottery. All rights reserved.</p>

          <p className="flex flex-wrap items-center justify-center gap-1">
            <span>Designed and developed by</span>
            <Link
              href="https://mobiz.mu"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-white underline underline-offset-4 transition hover:text-red-100"
            >
              Mobiz.mu
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}