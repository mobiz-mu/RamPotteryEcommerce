"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
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
    <main className="min-h-screen bg-white px-5 py-16 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-700 text-white shadow-[0_14px_35px_rgba(185,28,28,0.25)]">
            <LogIn className="h-6 w-6" />
          </div>

          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.34em] text-red-700">
            Ram Pottery Account
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-950">
            Welcome Back
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-neutral-600">
            Login to your Ram Pottery Mauritius account to manage your wishlist
            and enjoy a smoother shopping experience.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="relative overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-7 shadow-[0_22px_70px_rgba(0,0,0,0.08)] sm:p-8"
        >
          <div className="absolute inset-x-8 bottom-0 h-[3px] rounded-full bg-red-700 shadow-[0_0_18px_rgba(185,28,28,0.85)]" />

          <div className="space-y-5">
            <Field label="Email Address">
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
                placeholder="your@email.com"
                className="h-12 rounded-2xl border-neutral-200 bg-[#fafafa]"
              />
            </Field>

            <Field label="Password">
              <Input
                required
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((s) => ({ ...s, password: e.target.value }))
                }
                placeholder="Enter password"
                className="h-12 rounded-2xl border-neutral-200 bg-[#fafafa]"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mx-auto mt-7 flex w-fit items-center justify-center rounded-full bg-red-700 px-8 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_14px_35px_rgba(185,28,28,0.25)] transition hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-center text-sm text-neutral-600">
            New to Ram Pottery?{" "}
            <Link
              href="/signup"
              className="font-bold text-red-700 hover:text-red-800"
            >
              Create account
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-neutral-900">
        {label}
      </label>
      {children}
    </div>
  );
}