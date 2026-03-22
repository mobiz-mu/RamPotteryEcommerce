"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Unable to sign in.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] bg-red-600 p-2 shadow-[0_30px_80px_rgba(220,38,38,0.20)]">
        <div className="rounded-[1.7rem] bg-white p-7 sm:p-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-600">
              Ram Pottery
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
              Admin Login
            </h1>
            <p className="mt-3 text-sm leading-7 text-neutral-500">
              Sign in to manage orders, products, categories, newsletter, and settings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-800">
                Username / Email
              </label>
              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-800">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                required
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in..." : "Login to Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}