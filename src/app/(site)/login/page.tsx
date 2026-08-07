"use client";

import Link from "next/link";
import { Suspense, useState, type FormEvent, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const accountCreated = searchParams.get("created") === "1";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error || "Login failed.");
        setLoading(false);
        return;
      }

      toast.success("Logged in successfully.");
      router.replace("/account");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="bg-[#faf8f4]">
      <section className="container-padded grid min-h-[calc(100vh-120px)] items-center gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_460px] lg:py-16">
        <div>
          <p className="inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-red-900">
            Customer Account
          </p>

          <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.06em] text-neutral-950">
            Welcome back to your account.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-neutral-600">
            Login to continue shopping, manage your customer account and enjoy a
            smoother checkout journey.
          </p>

          <div className="mt-8 grid max-w-md gap-3">
            {[
              "Secure customer login",
              "Access your account instantly",
              "Continue shopping easily",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm font-bold text-neutral-700 shadow-[0_12px_35px_rgba(15,10,5,0.045)]"
              >
                <ShieldCheck className="h-4 w-4 text-red-900" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[430px]">
          <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_24px_90px_rgba(15,10,5,0.1)] sm:p-7">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-900">
                <LogIn className="h-5 w-5" />
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-neutral-950">
                Login
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Access your customer account.
              </p>
            </div>

            {accountCreated ? (
              <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold leading-6 text-green-800">
                Account created successfully. You can now login.
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="space-y-3">
              <Field label="Email Address">
                <div className="flex h-12 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-red-900/35 focus-within:ring-4 focus-within:ring-red-900/10">
                  <Mail className="h-4 w-4 text-red-900" />

                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, email: e.target.value }))
                    }
                    placeholder="Enter Email Address"
                    autoComplete="email"
                    className="h-full border-0 bg-transparent px-0 text-sm font-semibold shadow-none outline-none focus-visible:ring-0"
                  />
                </div>
              </Field>

              <Field label="Password">
                <div className="flex h-12 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-red-900/35 focus-within:ring-4 focus-within:ring-red-900/10">
                  <Lock className="h-4 w-4 text-red-900" />

                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, password: e.target.value }))
                    }
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    className="h-full border-0 bg-transparent px-0 text-sm font-semibold shadow-none outline-none focus-visible:ring-0"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="text-neutral-400 transition hover:text-red-900"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Field>

              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-neutral-500">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-300 accent-red-900"
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-black text-red-900 transition hover:text-red-700"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-red-900 px-5 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_16px_42px_rgba(127,29,29,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-neutral-500">
              New customer?{" "}
              <Link
                href="/signup"
                className="font-black text-red-900 transition hover:text-red-700"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function LoginPageLoading() {
  return (
    <main className="bg-[#faf8f4]">
      <section className="container-padded flex min-h-[calc(100vh-120px)] items-center justify-center py-12">
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm font-bold text-neutral-600 shadow-[0_12px_35px_rgba(15,10,5,0.045)]">
          <Loader2 className="h-4 w-4 animate-spin text-red-900" />
          Loading login page...
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </label>

      {children}
    </div>
  );
}