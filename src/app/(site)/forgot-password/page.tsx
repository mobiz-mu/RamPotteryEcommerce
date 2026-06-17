"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    startTransition(async () => {
      const redirectTo = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo,
      });

      if (error) {
        toast.error(error.message || "Could not send reset link.");
        return;
      }

      toast.success("Password reset link sent. Please check your email.");
      setEmail("");
    });
  }

  return (
    <main className="min-h-screen bg-[#faf8f4] px-4 py-12">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
        <div className="w-full rounded-[32px] border border-red-950/10 bg-white p-6 shadow-[0_24px_80px_rgba(70,20,10,0.08)] sm:p-8">
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-neutral-500 transition hover:text-red-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          <div className="mb-7">
            <div className="mb-4 flex h-13 w-13 items-center justify-center rounded-2xl bg-red-50 text-red-900">
              <Mail className="h-6 w-6" />
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
              Ram Pottery Account
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-neutral-950">
              Forgot Password
            </h1>

            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Enter your email address and we will send you a secure link to
              reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
                Email Address
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@email.com"
                className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-900/35 focus:ring-4 focus:ring-red-900/10"
              />
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-900 px-5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_42px_rgba(127,29,29,0.24)] transition hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}