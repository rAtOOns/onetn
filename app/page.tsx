import HeroSection from "@/components/home/HeroSection";
import ThirukkuralWidget from "@/components/home/ThirukkuralWidget";
import QuickStats from "@/components/home/QuickStats";
import LatestNews from "@/components/home/LatestNews";
import TopicCards from "@/components/home/TopicCards";
import LatestDocuments from "@/components/home/LatestDocuments";
import { Bell } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      {/* Hero Section with Search */}
      <HeroSection />

      {/* Daily Thirukkural Widget - Cultural Element */}
      <ThirukkuralWidget />

      {/* Quick Stats */}
      <QuickStats />

      {/* Latest News - Prominent Banner */}
      <LatestNews />

      {/* Topic Quick Access - For Government Employees */}
      <TopicCards />

      {/* Latest Documents Section */}
      <LatestDocuments />

      {/* Get Alerts CTA */}
      <section className="py-8 bg-gradient-to-r from-tn-primary to-tn-government text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <Bell className="mt-1 flex-shrink-0" size={28} />
              <div>
                <h2 className="text-xl font-bold mb-1">Stay Updated</h2>
                <p className="text-sm text-gray-200">Get notifications for new Education GOs, Pay Orders & important circulars</p>
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/subscribe" className="bg-tn-accent hover:bg-tn-accent/90 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">
                Enable Alerts
              </Link>
              <Link href="/go" className="border border-white text-white hover:bg-white/10 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">
                Browse GOs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-6 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-start gap-3">
              <div className="text-tn-primary font-bold text-2xl leading-none mt-1">ℹ️</div>
              <div>
                <p className="text-sm text-gray-700 font-medium mb-1">
                  About This Portal
                </p>
                <p className="text-sm text-gray-600">
                  This is an unofficial, community-run portal providing access to Tamil Nadu Education Department GOs, forms & schemes for teachers and school staff. All documents are sourced from publicly available government resources.
                </p>
                <p className="text-sm text-gray-600 tamil mt-2">
                  இது ஆசிரியர்கள் மற்றும் பள்ளி ஊழியர்களுக்கான தமிழ்நாடு கல்வித்துறை அரசாணைகள், படிவங்கள் மற்றும் திட்டங்களை வழங்கும் ஒரு சமூக இணையதளம்.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
