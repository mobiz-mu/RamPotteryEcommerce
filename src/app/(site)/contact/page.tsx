import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";

const siteUrl = "https://rampottery.mu";

const WHATSAPP_URL =
  "https://wa.me/23057788884?text=Hello%20Ram%20Pottery%2C%20I%20would%20like%20to%20get%20more%20information.";

export const metadata: Metadata = {
  title: "Contact Ram Pottery Mauritius | Handmade Pottery & Ceramic Store",
  description:
    "Contact Ram Pottery Mauritius for handmade pottery, clay décor, ceramic pieces, pooja items, tableware, garden pots, custom orders and product enquiries.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact Ram Pottery Mauritius",
    description:
      "Get in touch with Ram Pottery Mauritius for handmade pottery, ceramics, clay décor and custom pottery enquiries.",
    url: `${siteUrl}/contact`,
    siteName: "Ram Pottery",
    type: "website",
    locale: "en_MU",
    images: [
      {
        url: `${siteUrl}/images/header/headerbackground.webp`,
        width: 2400,
        height: 320,
        alt: "Ram Pottery Mauritius contact page",
      },
    ],
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Ram Pottery Mauritius",
  url: `${siteUrl}/contact`,
  description:
    "Contact Ram Pottery Mauritius for handmade pottery, clay décor, ceramics, pooja items, tableware and garden pottery.",
  mainEntity: {
    "@type": "LocalBusiness",
    name: "Ram Pottery",
    url: siteUrl,
    telephone: "+23057788884",
    image: `${siteUrl}/images/header/headerbackground.webp`,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:30",
        closes: "17:00",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "MU",
    },
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative isolate overflow-hidden bg-neutral-950">
        <div className="relative h-[210px] w-full sm:h-[250px] lg:h-[320px]">
          <Image
            src="/images/header/headerbackground.webp"
            alt="Ram Pottery Mauritius handmade pottery contact banner"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/42 to-black/18" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-100 sm:text-xs">
                Contact Ram Pottery
              </p>

              <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Visit, Call or Message Us
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
                Get in touch for handmade pottery, clay décor, ceramic pieces,
                pooja items, tableware, garden pots, custom orders and product
                enquiries across Mauritius.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="grid gap-5 lg:sticky lg:top-[118px] lg:self-start">
            <div className="rounded-[34px] border border-neutral-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-7">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
                  Contact Details
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-neutral-950">
                  We are here to help.
                </h2>

                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  Speak with Ram Pottery for product enquiries, bulk orders,
                  hotel showcases, school demonstrations and custom pottery
                  requests.
                </p>
              </div>

              <div className="grid gap-3">
                <ContactCard
                  icon={<Phone className="h-5 w-5" />}
                  title="Phone / WhatsApp"
                  value="+230 5778 8884"
                  href={WHATSAPP_URL}
                />

                <ContactCard
                  icon={<MessageCircle className="h-5 w-5" />}
                  title="WhatsApp Enquiry"
                  value="Message Ram Pottery directly"
                  href={WHATSAPP_URL}
                />

                <ContactCard
                  icon={<Mail className="h-5 w-5" />}
                  title="Email"
                  value="Send us your enquiry"
                  href="mailto:info@rampottery.mu"
                />

                <ContactCard
                  icon={<MapPin className="h-5 w-5" />}
                  title="Location"
                  value="Mauritius"
                  href="https://www.google.com/maps/search/?api=1&query=Ram%20Pottery%20Mauritius"
                />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-900 px-6 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_42px_rgba(127,29,29,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800"
                >
                  WhatsApp Us
                  <Send className="h-4 w-4" />
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-red-900 transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50"
                >
                  Shop Collection
                </Link>
              </div>
            </div>

            <div className="rounded-[34px] border border-neutral-200 bg-[#faf8f4] p-5 shadow-[0_18px_70px_rgba(15,10,5,0.06)] sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-900 text-white">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-900">
                    Operating Time
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-neutral-950">
                    Opening Hours
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                <TimeRow days="Monday to Saturday" time="8.30 - 17.00" />
                <TimeRow days="Sunday & PH" time="Close" closed />
              </div>
            </div>

            <div className="rounded-[34px] border border-red-900/10 bg-red-950 p-5 text-white shadow-[0_18px_70px_rgba(127,29,29,0.14)] sm:p-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-100">
                Ram Pottery Promise
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">
                Personal service for every customer.
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/70">
                Whether you are buying one handcrafted piece or planning a full
                décor selection, our team will guide you with care.
              </p>
            </div>
          </aside>

          <div className="grid gap-6">
            <section className="rounded-[34px] border border-neutral-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:p-7">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
                  Send Enquiry
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-neutral-950">
                  Tell us what you are looking for.
                </h2>

                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  Fill this quick form and send your enquiry directly by
                  WhatsApp. It is fast, simple and mobile-friendly.
                </p>
              </div>

              <form className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputBlock label="Full Name" placeholder="Your name" />
                  <InputBlock label="Phone / WhatsApp" placeholder="+230 5xxxxxxx" />
                </div>

                <InputBlock label="Email Address" placeholder="you@email.com" />

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
                    Enquiry Type
                  </span>

                  <select className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-950 outline-none transition focus:border-red-900/35 focus:ring-4 focus:ring-red-900/10">
                    <option>Product enquiry</option>
                    <option>Bulk order</option>
                    <option>Hotel / business showcase</option>
                    <option>School demonstration</option>
                    <option>Custom pottery request</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
                    Message
                  </span>

                  <textarea
                    rows={5}
                    placeholder="Write your message..."
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-900/35 focus:ring-4 focus:ring-red-900/10"
                  />
                </label>

                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-900 px-7 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_42px_rgba(127,29,29,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800 sm:w-fit"
                >
                  Send on WhatsApp
                  <MessageCircle className="h-4 w-4" />
                </Link>
              </form>
            </section>

            <section className="overflow-hidden rounded-[34px] border border-neutral-200 bg-white shadow-[0_18px_70px_rgba(15,10,5,0.07)]">
              <div className="border-b border-neutral-200 px-5 py-5 sm:px-7">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
                  Find Us
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
                  Ram Pottery on Google Map
                </h2>
              </div>

              <div className="relative h-[360px] bg-[#faf8f4] sm:h-[430px] lg:h-[500px]">
                <iframe
                  title="Ram Pottery Mauritius Google Map"
                  src="https://www.google.com/maps?q=Ram%20Pottery%20Mauritius&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-red-900/20 hover:bg-red-50/60"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-900 transition group-hover:bg-red-900 group-hover:text-white">
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
          {title}
        </span>
        <span className="mt-1 block truncate text-sm font-black text-neutral-950">
          {value}
        </span>
      </span>
    </Link>
  );
}

function TimeRow({
  days,
  time,
  closed = false,
}: {
  days: string;
  time: string;
  closed?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-4 py-4">
      <p className="text-sm font-black text-neutral-950">{days}</p>
      <p
        className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
          closed
            ? "bg-neutral-100 text-neutral-500"
            : "bg-red-50 text-red-900"
        }`}
      >
        {time}
      </p>
    </div>
  );
}

function InputBlock({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </span>

      <input
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-900/35 focus:ring-4 focus:ring-red-900/10"
      />
    </label>
  );
}