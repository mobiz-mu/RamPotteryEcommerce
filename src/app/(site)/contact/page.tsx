import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Ram Pottery Mauritius | Handmade Pottery & Custom Orders",
  description:
    "Contact Ram Pottery Mauritius for handmade pottery, terracotta décor, clay products, custom orders, gifting, hotel and bulk pottery enquiries.",
};

const WHATSAPP_URL =
  "https://wa.me/23057788884?text=Hello%20Ram%20Pottery%2C%20I%20would%20like%20to%20make%20an%20enquiry.";

export default function ContactPage() {
  return (
    <main className="overflow-hidden bg-[#f7f3ec]">
      <section className="relative isolate bg-neutral-950 px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.35),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.36em] text-red-200">
            Contact Ram Pottery
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Let’s Help You Find the Perfect Pottery Piece
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/72">
            For product enquiries, custom orders, gifting, hospitality projects,
            bulk orders or collection advice — our team is ready to assist you.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[34px] bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-9">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-red-700">
              Get in Touch
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-neutral-950">
              Speak with Ram Pottery Mauritius
            </h2>

            <p className="mt-4 leading-8 text-neutral-600">
              Whether you are shopping for your home, garden, prayer space,
              hotel, restaurant, wedding gift or corporate order, we will guide
              you with care and professionalism.
            </p>

            <div className="mt-8 grid gap-4">
              <ContactCard
                icon={<MessageCircle className="h-5 w-5" />}
                title="WhatsApp"
                text="+230 57788884"
                href={WHATSAPP_URL}
              />

              <ContactCard
                icon={<Phone className="h-5 w-5" />}
                title="Phone"
                text="+230 57788884"
                href="tel:+23057788884"
              />

              <ContactCard
                icon={<Mail className="h-5 w-5" />}
                title="Email"
                text="Info@rampottery.mu"
                href="mailto:Info@rampottery.mu"
              />

              <ContactCard
                icon={<MapPin className="h-5 w-5" />}
                title="Location"
                text="Mauritius"
                href="#"
              />

              <ContactCard
                icon={<Clock className="h-5 w-5" />}
                title="Response Time"
                text="Fast reply during business hours"
                href="#"
              />
            </div>
          </div>

          <div className="rounded-[34px] border border-neutral-200 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-9">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-700 text-white">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-red-700">
                  Enquiry Form
                </p>
                <h2 className="text-2xl font-extrabold text-neutral-950">
                  Send Your Request
                </h2>
              </div>
            </div>

            <form className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full Name" placeholder="Your name" />
                <Input label="Phone / WhatsApp" placeholder="+230..." />
              </div>

              <Input label="Email Address" placeholder="you@example.com" />

              <div>
                <label className="mb-2 block text-sm font-bold text-neutral-800">
                  Enquiry Type
                </label>
                <select className="w-full rounded-2xl border border-neutral-200 bg-[#fafafa] px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white">
                  <option>Product Enquiry</option>
                  <option>Custom Order</option>
                  <option>Bulk / Hotel Order</option>
                  <option>Gift Collection</option>
                  <option>Workshop / Visit</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-neutral-800">
                  Message
                </label>
                <textarea
                  rows={6}
                  placeholder="Tell us what you are looking for..."
                  className="w-full resize-none rounded-2xl border border-neutral-200 bg-[#fafafa] px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white"
                />
              </div>

              <Link
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-700 px-6 py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-800"
              >
                Send on WhatsApp
                <Send className="h-4 w-4" />
              </Link>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            [
              "Custom Orders",
              "Bespoke pottery pieces for homes, gifting, décor and special occasions.",
            ],
            [
              "Hospitality & Bulk",
              "Premium clay and ceramic pieces for hotels, resorts, restaurants and businesses.",
            ],
            [
              "Expert Guidance",
              "Friendly support to help you choose the right pottery for your space.",
            ],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="rounded-[30px] border border-neutral-200 bg-[#faf7f1] p-7 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-2xl font-extrabold text-neutral-950">
                {title}
              </h3>
              <p className="mt-4 leading-8 text-neutral-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Input({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-neutral-800">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="w-full rounded-2xl border border-neutral-200 bg-[#fafafa] px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white"
      />
    </div>
  );
}

function ContactCard({
  icon,
  title,
  text,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  href: string;
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-[#fafafa] p-4 transition hover:border-red-200 hover:bg-white hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-700 text-white">
        {icon}
      </div>
      <div>
        <p className="text-sm font-extrabold text-neutral-950">{title}</p>
        <p className="mt-1 text-sm text-neutral-600">{text}</p>
      </div>
    </div>
  );

  if (href === "#") return content;

  return (
    <Link href={href} target={href.startsWith("http") ? "_blank" : undefined}>
      {content}
    </Link>
  );
}