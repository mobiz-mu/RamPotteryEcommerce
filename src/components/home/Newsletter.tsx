"use client";

import { useState } from "react";
import Image from "next/image";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (!res.ok) {
        const errorText = String(json.error || "").toLowerCase();

        if (
          errorText.includes("duplicate") ||
          errorText.includes("already") ||
          errorText.includes("unique")
        ) {
          setMessage("You’re already subscribed to Ram Pottery.");
          setEmail("");
          setLoading(false);
          return;
        }

        setError(json.error || "Unable to subscribe.");
        setLoading(false);
        return;
      }

      setMessage("Thank you for subscribing to Ram Pottery.");
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <section className="relative w-full overflow-hidden py-10 sm:py-12 lg:py-14">
      <div className="absolute inset-0">
        <Image
          src="/images/newsletter-pottery-bg.jpg"
          alt="Ram Pottery newsletter background"
          fill
          priority
          loading="eager"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,14,10,0.82)_0%,rgba(32,22,15,0.72)_45%,rgba(18,12,9,0.84)_100%)]" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container-padded relative">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/8 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-md">
            <div className="grid items-center gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
              <div className="text-center lg:text-left">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f0c89a]">
                  Newsletter
                </p>

                <h2 className="text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-[2.2rem]">
                  Join the Ram Pottery Community
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base lg:mx-0">
                  Receive updates on new arrivals, handcrafted collections,
                  workshop stories, artisan inspiration, and exclusive offers.
                </p>
              </div>

              <div>
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto flex w-full max-w-xl flex-col gap-3 lg:ml-auto"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="newsletter-email"
                      type="email"
                      placeholder="Enter your email address"
                      className="h-12 w-full rounded-xl border border-white/15 bg-white/95 px-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-500 focus:border-[#d6a36d] focus:ring-2 focus:ring-[#d6a36d]/30"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="h-12 shrink-0 rounded-xl bg-[#c79058] px-6 text-sm font-semibold text-white transition hover:bg-[#b77f46] disabled:cursor-not-allowed disabled:opacity-70 sm:px-8"
                    >
                      {loading ? "Subscribing..." : "Subscribe"}
                    </button>
                  </div>

                  {message ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/95 px-4 py-3 text-sm text-emerald-700">
                      {message}
                    </div>
                  ) : null}

                  {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50/95 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  ) : null}

                  <p className="text-center text-xs leading-6 text-white/60 lg:text-left">
                    No spam, only beautiful updates, pottery stories, and exclusive releases.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}