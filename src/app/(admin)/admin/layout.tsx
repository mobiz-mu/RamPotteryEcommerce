import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Mail,
  Settings,
  Globe,
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

  return (
    <div className="min-h-screen bg-[#f7f5f2]">
      <div className="grid min-h-screen lg:grid-cols-[290px_1fr]">
        <aside className="border-r border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-6 py-7">
            <div className="text-xs font-semibold uppercase tracking-[0.32em] text-red-600">
              Ram Pottery
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              Admin Panel
            </div>
            <div className="mt-2 break-all text-sm text-neutral-500">
              {user.email}
            </div>
          </div>

          <nav className="p-4">
            <div className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Icon className="h-4 w-4 transition group-hover:scale-105" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="mt-6 border-t border-neutral-200 p-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 transition hover:text-red-600"
            >
              <Globe className="h-4 w-4" />
              View Website
            </Link>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="border-b border-neutral-200 bg-white px-6 py-5 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-medium text-neutral-950">
                  Ram Pottery Admin
                </div>
                <div className="mt-1 text-sm text-neutral-500">
                  Premium store management dashboard
                </div>
              </div>

              <AdminLogoutButton />
            </div>
          </div>

          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}