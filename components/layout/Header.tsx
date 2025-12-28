"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Bookmark } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/" },
    { name: "Education GOs", href: "/go" },
    { name: "News", href: "/news" },
    { name: "Tools", href: "/tools" },
    { name: "Alerts", href: "/subscribe" },
  ];

  return (
    <header className="bg-white shadow-sm">
      {/* Slim top bar */}
      <div className="bg-tn-government text-white py-1">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-xs">
            <span>TN Education GOs & Resources <span className="text-yellow-300">(Unofficial)</span></span>
            <div className="flex items-center gap-3">
              <button className="hover:underline">English</button>
              <span>|</span>
              <button className="hover:underline tamil">தமிழ்</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation bar with logo */}
      <nav className="bg-tn-primary">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            {/* Logo in tab bar */}
            <Link
              href="/"
              className="flex items-center gap-2 pr-6 py-2 border-r border-white/20 focus:outline-none focus:ring-2 focus:ring-white rounded"
              aria-label="One TN - Home"
            >
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center" aria-hidden="true">
                <span className="text-tn-primary font-bold text-xs">TN</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-semibold text-sm">One TN</span>
              </div>
            </Link>

            {/* Desktop tabs */}
            <div className="hidden lg:flex items-center">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                      isActive
                        ? "text-white bg-white/10 border-white"
                        : "text-white/90 hover:bg-white/10 border-transparent"
                    }`}
                  >
                    {tab.name}
                  </Link>
                );
              })}
            </div>

            {/* Tablet tabs - scrollable */}
            <div className="hidden md:flex lg:hidden items-center overflow-x-auto">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 border-b-2 ${
                      isActive
                        ? "text-white bg-white/10 border-white"
                        : "text-white/90 hover:bg-white/10 border-transparent"
                    }`}
                  >
                    {tab.name}
                  </Link>
                );
              })}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right icons */}
            <div className="flex items-center">
              <Link
                href="/search"
                className="p-2.5 text-white hover:bg-white/10 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </Link>
              <Link
                href="/bookmarks"
                className="p-2.5 text-white hover:bg-white/10 transition-colors"
                aria-label="Saved"
                title="Saved Documents"
              >
                <Bookmark size={18} />
              </Link>
              <button
                className="md:hidden p-2.5 text-white hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`block px-3 py-2 text-sm rounded-lg ${
                      isActive
                        ? "bg-tn-primary text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tab.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
