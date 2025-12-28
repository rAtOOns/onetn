import Link from "next/link";

export default function Footer() {
  const links = [
    { name: "Education GOs", href: "/go" },
    { name: "News", href: "/news" },
    { name: "Tools", href: "/tools" },
    { name: "GO Alerts", href: "/subscribe" },
  ];

  return (
    <footer className="bg-tn-government text-white">
      {/* Main footer - compact */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-tn-primary rounded flex items-center justify-center" aria-hidden="true">
              <span className="text-white font-bold text-xs">TN</span>
            </div>
            <div>
              <span className="font-semibold">One TN</span>
              <span className="text-gray-400 mx-2" aria-hidden="true">|</span>
              <span className="text-sm text-gray-300">Tamil Nadu Document Portal</span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" aria-label="Footer navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-1"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar - minimal */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
            <span>© {new Date().getFullYear()} One TN Portal. Not an official government website.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded px-1">Privacy</Link>
              <Link href="/terms" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded px-1">Terms</Link>
              <span className="tamil">தமிழ்நாடு ஆவண தளம்</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
