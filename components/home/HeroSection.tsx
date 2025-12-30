"use client";

import { Search, ArrowRight } from "lucide-react";
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
    <section className="relative bg-tn-gradient py-16 md:py-24 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Headline Section */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Tamil Nadu Education Portal
            </h1>

            <p className="text-xl md:text-2xl text-cyan-50 max-w-3xl mx-auto mb-4">
              Government Orders, Tools & Administrative Resources
            </p>

            <p className="text-base text-cyan-100 max-w-2xl mx-auto">
              Comprehensive resource portal for Tamil Nadu Education Department employees
            </p>

            <p className="text-sm text-cyan-100 mt-2 tamil">
              தமிழ்நாடு கல்வித்துறை ஊழியர்களுக்கான விரிவான வள தளம்
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-xl shadow-2xl p-1 flex items-center gap-2">
                <Search className="ml-4 text-tn-primary flex-shrink-0" size={22} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search: Salary, Leave Rules, Transfer, GOs, Forms..."
                  className="flex-1 py-4 px-2 text-tn-text bg-transparent outline-none placeholder:text-gray-400 text-base"
                />
                <button
                  type="submit"
                  className="mr-2 p-2.5 bg-gradient-to-r from-tn-primary to-tn-secondary text-white rounded-lg hover:shadow-lg transition-all duration-200 flex-shrink-0"
                  aria-label="Search"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </form>

          {/* Quick Links */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-2">
              {["Salary Calculator", "Leave Rules", "DA Hike", "Transfer", "Promotion", "TET", "Forms"].map((term) => (
                <button
                  key={term}
                  onClick={() => router.push(`/go?q=${encodeURIComponent(term)}`)}
                  className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
