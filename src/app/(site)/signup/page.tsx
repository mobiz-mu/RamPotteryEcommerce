"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!fullName || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error || "Signup failed.");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully. Please login.");
      window.location.href = "/login?created=1";
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
            Create your account in seconds.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-neutral-600">
            Create your customer account, login instantly, and enjoy a smoother
            checkout experience.
          </p>

          <div className="mt-8 grid max-w-md gap-3">
            {[
              "No email verification required",
              "Secure customer account",
              "Fast login after signup",
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
                <UserPlus className="h-5 w-5" />
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-neutral-950">
                Sign up
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Create your customer account.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <Field label="Full Name">
                <div className="flex h-12 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-red-900/35 focus-within:ring-4 focus-within:ring-red-900/10">
                  <User className="h-4 w-4 text-red-900" />

                  <Input
                    required
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, fullName: e.target.value }))
                    }
                    placeholder="Enter Full Name"
                    autoComplete="name"
                    className="h-full border-0 bg-transparent px-0 text-sm font-semibold shadow-none outline-none focus-visible:ring-0"
                  />
                </div>
              </Field>

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
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, password: e.target.value }))
                    }
                    placeholder="Enter Password"
                    autoComplete="new-password"
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

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-red-900 px-5 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_16px_42px_rgba(127,29,29,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-neutral-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-black text-red-900 transition hover:text-red-700"
              >
                Login
              </Link>
            </p>
          </div>
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