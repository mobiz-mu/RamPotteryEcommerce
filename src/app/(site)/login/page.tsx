"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHero from "@/components/common/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(data?.error || "Login failed.");
      return;
    }

    toast.success("Logged in successfully.");
    router.push("/account");
    router.refresh();
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Login"
        description="Access your Ram Pottery customer account."
      />

      <section className="section-space bg-white">
        <div className="container-padded max-w-xl">
          <form onSubmit={onSubmit} className="rounded-3xl border border-neutral-200 bg-white p-8">
            <div className="space-y-5">
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
                  placeholder="Enter password"
                />
              </div>
            </div>

            <Button type="submit" className="mt-6 w-full rounded-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}