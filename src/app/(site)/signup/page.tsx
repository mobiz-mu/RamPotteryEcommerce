"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHero from "@/components/common/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(data?.error || "Signup failed.");
      return;
    }

    toast.success("Account created successfully.");
    router.push("/login");
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Create an Account"
        description="Create your Ram Pottery customer account for wishlist and future order tracking."
      />

      <section className="section-space bg-white">
        <div className="container-padded max-w-xl">
          <form onSubmit={onSubmit} className="rounded-3xl border border-neutral-200 bg-white p-8">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Full Name
                </label>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Email
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Password
                </label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                  placeholder="Create password"
                />
              </div>
            </div>

            <Button type="submit" className="mt-6 w-full rounded-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}