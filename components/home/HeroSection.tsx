"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative bg-tn-gradient py-8 md:py-12 overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-48 h-48 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          {/* Welcome text - Education Focus */}
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            TN Education GOs <span className="tamil font-normal text-xl md:text-2xl">கல்வித்துறை அரசாணைகள்</span>
          </h1>
          <p className="text-sm md:text-base text-gray-200 mb-1 max-w-xl mx-auto">
            GOs, Forms & Schemes for Teachers & Schools
          </p>
          <p className="text-xs text-yellow-300 mb-4">
            Unofficial Community Portal - Not a Government Website
          </p>

          {/* Search bar - Compact */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search: teacher salary, leave rules, transfer..."
                className="w-full py-3 px-5 pr-12 rounded-full text-tn-text bg-white shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-tn-highlight/50"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-tn-highlight
                         text-white rounded-full hover:bg-tn-primary transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Quick search suggestions - Education focused */}
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="text-gray-300">Popular:</span>
            {["Teacher Salary", "DA Order", "Leave Rules", "Transfer", "Promotion", "TET"].map((term) => (
              <button
                key={term}
                onClick={() => router.push(`/go?q=${encodeURIComponent(term)}`)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
