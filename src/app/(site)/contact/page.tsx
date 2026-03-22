"use client";

import { useState } from "react";
import PageHero from "@/components/common/PageHero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(data?.error || "Failed to send message.");
      return;
    }

    toast.success("Your message has been sent successfully.");
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  }

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="We’d Love to Hear From You"
        description="For product inquiries, orders, custom requests, workshop interest, or wholesale questions, get in touch with Ram Pottery."
      />

      <section className="section-space bg-white">
        <div className="container-padded grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
            <h2 className="text-2xl font-semibold text-neutral-950">Contact Details</h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-neutral-600">
              <p>
                <span className="font-medium text-neutral-950">Address:</span><br />
                Robert Kennedy Street, Reunion Maurel,<br />
                Petit Raffray - Mauritius
              </p>

              <p>
                <span className="font-medium text-neutral-950">Phone / WhatsApp:</span><br />
                +230 5778 8884
              </p>

              <p>
                <span className="font-medium text-neutral-950">Email:</span><br />
                Info@rampottery.mu
              </p>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8"
          >
            <h2 className="text-2xl font-semibold text-neutral-950">Send a Message</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Full Name
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Email Address
                </label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Phone Number
                </label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="230 5778 8884"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Subject
                </label>
                <Input
                  value={form.subject}
                  onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))}
                  placeholder="Subject"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-neutral-900">
                Message
              </label>
              <Textarea
                className="min-h-36"
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                placeholder="Tell us how we can help you"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-6 rounded-full px-8"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}