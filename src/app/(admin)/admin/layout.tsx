import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ChevronRight,
  FolderTree,
  Globe,
  LayoutDashboard,
  Mail,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("email, full_name, role, is_active")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminProfile) redirect("/admin/login");

  const adminName =
    String(adminProfile.full_name || "").trim() ||
    user.email ||
    "Ram Pottery Admin";

  const adminRole = String(adminProfile.role || "admin").trim();

  return (
    <div className="min-h-screen bg-[#f6f3ef] text-neutral-950">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[280px] border-r border-neutral-200/80 bg-white/95 shadow-[10px_0_40px_rgba(15,10,5,0.035)] lg:flex lg:flex-col">
        <div className="border-b border-neutral-200 px-6 py-6">
          <Link href="/admin" className="group flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2b0909_0%,#4a0f0f_55%,#120505_100%)] text-white shadow-[0_16px_34px_rgba(70,20,10,0.2)]">
              <Store className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-900">
                Ram Pottery Ltd
              </p>
              <h1 className="mt-1 truncate text-xl font-black tracking-[-0.04em] text-neutral-950">
                Admin Panel
              </h1>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
            Store Management
          </div>

          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-neutral-600 transition duration-300 hover:bg-red-50 hover:text-red-900"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition group-hover:bg-white group-hover:text-red-900">
                      <Icon className="h-4 w-4" />
                    </span>
                    {item.label}
                  </span>

                  <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              );
            })}

            <div className="mt-2 rounded-2xl border border-red-950/10 bg-[#faf8f4] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-900">
                  <ShieldCheck className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
                    Admin Role
                  </p>
                  <p className="mt-0.5 truncate text-sm font-black capitalize text-neutral-950">
                    {adminRole}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="border-t border-neutral-200 p-4">
          <div className="mb-4 rounded-[24px] border border-red-950/10 bg-[#faf8f4] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-900">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-neutral-950">
                  {adminName}
                </p>
                <p className="mt-1 truncate text-xs font-semibold text-neutral-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold text-neutral-700 transition hover:border-red-900/20 hover:bg-red-50 hover:text-red-900"
          >
            <span className="flex items-center gap-3">
              <Globe className="h-4 w-4" />
              View Website
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      <main className="min-w-0 lg:pl-[280px]">
        <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2b0909_0%,#4a0f0f_55%,#120505_100%)] text-white shadow-[0_14px_34px_rgba(70,20,10,0.18)] lg:hidden">
                  <Store className="h-5 w-5" />
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-900">
                    <Sparkles className="h-3 w-3" />
                    Ram Pottery Ltd
                  </span>

                  <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-neutral-950 sm:text-2xl">
                    Dashboard
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-xs font-black uppercase tracking-[0.14em] text-neutral-700 shadow-sm transition hover:border-red-900/20 hover:bg-red-50 hover:text-red-900"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </Link>

                <AdminLogoutButton />
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-xs font-black text-neutral-700 shadow-sm transition hover:border-red-900/20 hover:bg-red-50 hover:text-red-900"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}

              <span className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-red-950/10 bg-[#faf8f4] px-4 text-xs font-black capitalize text-red-900 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                {adminRole}
              </span>
            </div>
          </div>
        </header>

        <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </div>
      </main>
    </div>
  );
}