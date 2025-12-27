"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Building2,
  LogOut,
  User,
  Menu,
  X,
  Newspaper,
  MapPin,
  Tag,
  MessageSquare,
  Mail,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Documents", href: "/admin/documents", icon: FileText },
  { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
  { name: "Departments", href: "/admin/departments", icon: Building2 },
  { name: "Topics", href: "/admin/topics", icon: Tag },
  { name: "Districts", href: "/admin/districts", icon: MapPin },
  { name: "Requests", href: "/admin/requests", icon: MessageSquare },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: Bell },
  { name: "Digest", href: "/admin/digest", icon: Mail },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Skip auth check for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-tn-primary border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-tn-government text-white p-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-tn-accent rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">TN</span>
          </div>
          <span className="font-semibold">Admin</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex min-h-screen lg:min-h-0">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-64 bg-tn-government text-white transform transition-transform lg:transform-none lg:h-screen overflow-y-auto ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-6 hidden lg:block">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-tn-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold">TN</span>
              </div>
              <div>
                <h1 className="font-bold">One TN Admin</h1>
                <p className="text-xs text-gray-400">Administration Portal</p>
              </div>
            </Link>
          </div>

          <nav className="mt-6 lg:mt-0 pb-24">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive
                      ? "bg-tn-primary text-white"
                      : "text-gray-300 hover:bg-tn-primary/50"
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-tn-government">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-tn-highlight rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{session?.user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-h-screen overflow-x-hidden max-w-full">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}
