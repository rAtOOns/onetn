import { Metadata } from "next";
import Link from "next/link";
import { Heart, Target, Users, Shield, BookOpen, Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | One TN - Tamil Nadu Education Portal",
  description: "Learn about One TN Portal - an unofficial resource portal for Tamil Nadu Education Department employees with 50+ tools and calculators.",
};

const features = [
  {
    icon: Calculator,
    title: "50+ Tools & Calculators",
    description: "Salary calculator, pension estimator, leave tracker, and many more tools designed specifically for TN government employees.",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Guides",
    description: "Detailed guides on transfer rules, promotion pathways, deputation process, and service matters.",
  },
  {
    icon: Users,
    title: "For Teachers & Staff",
    description: "Built specifically for Tamil Nadu Education Department employees - teachers, headmasters, and administrative staff.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "All calculations happen in your browser. We don't store any personal or financial data.",
  },
];

const stats = [
  { number: "55+", label: "Tools & Calculators" },
  { number: "10+", label: "Categories" },
  { number: "100%", label: "Free to Use" },
  { number: "0", label: "Data Stored" },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-tn-text mb-4">
          About One TN Portal
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          An unofficial resource portal dedicated to helping Tamil Nadu Education Department
          employees with tools, calculators, and information they need.
        </p>
        <p className="text-sm text-gray-500 tamil mt-2">
          தமிழ்நாடு கல்வித்துறை ஊழியர்களுக்கான அதிகாரபூர்வமற்ற வள தளம்
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
        <h2 className="font-semibold text-amber-800 mb-2">Important Disclaimer</h2>
        <p className="text-sm text-amber-700">
          This is <strong>NOT</strong> an official government website. One TN Portal is an independent,
          community-driven project. All tools and information are for reference purposes only.
          Always verify calculations and rules with official sources, your DDO, or the concerned
          department before making any decisions.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-r from-tn-primary to-emerald-600 rounded-xl p-8 text-white mb-12">
        <div className="flex items-start gap-4">
          <Target className="flex-shrink-0" size={32} />
          <div>
            <h2 className="text-xl font-bold mb-2">Our Mission</h2>
            <p className="text-emerald-50">
              To simplify government service rules and calculations for Tamil Nadu Education Department
              employees. We believe every teacher and staff member should have easy access to tools
              that help them understand their salary, benefits, and service matters - without having
              to navigate complex rule books or wait for office clarifications.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <p className="text-3xl font-bold text-tn-primary">{stat.number}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-tn-text mb-6 text-center">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-tn-primary/10 p-3 rounded-lg">
                    <Icon className="text-tn-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-tn-text">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why We Built This */}
      <div className="bg-blue-50 rounded-xl p-8 mb-12">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Why We Built This</h2>
        <div className="space-y-4 text-blue-700">
          <p>
            Government service rules are complex. Calculating salary, understanding leave rules,
            planning for retirement - these should be simple tasks, but often require consulting
            multiple rule books or waiting for office clarifications.
          </p>
          <p>
            We created One TN Portal to bridge this gap. Our tools are based on official government
            rules (FR/SR, Pay Commission reports, Government Orders) and designed to give you
            quick, accurate calculations right at your fingertips.
          </p>
          <p>
            Whether you&apos;re a newly joined teacher trying to understand your first salary slip,
            or a senior employee planning for retirement, we hope these tools make your life easier.
          </p>
        </div>
      </div>

      {/* Made with Love */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-gray-600">
          <span>Made with</span>
          <Heart className="text-red-500 fill-red-500" size={18} />
          <span>for Tamil Nadu Teachers</span>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-tn-text mb-4">Start Using Our Tools</h2>
        <p className="text-gray-600 mb-6">
          Explore our collection of 55+ tools designed for your needs.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/tools"
            className="px-6 py-3 bg-tn-primary text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Browse All Tools
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
