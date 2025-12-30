import { Metadata } from "next";
import Link from "next/link";
import { Heart, Target, Users, Shield, BookOpen, Calculator, ArrowRight } from "lucide-react";
import PageContainer from "@/components/ui/page-container";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <PageContainer padding="lg">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-tn-text mb-4">
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
      <Card category="reference" className="mb-12">
        <CardHeader title="Important Disclaimer" category="reference" />
        <CardContent>
          <p className="text-sm text-gray-700">
            This is <strong className="text-tn-primary">NOT</strong> an official government website. One TN Portal is an independent,
            community-driven project. All tools and information are for reference purposes only.
            Always verify calculations and rules with official sources, your DDO, or the concerned
            department before making any decisions.
          </p>
        </CardContent>
      </Card>

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
          <Card key={stat.label} category="default" variant="elevated">
            <div className="text-center">
              <p className="text-3xl font-bold text-tn-primary mb-1">{stat.number}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-tn-text mb-8 text-center">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} category="reference" variant="elevated">
                <CardHeader
                  title={feature.title}
                  icon={<Icon size={24} />}
                  category="reference"
                />
                <CardContent>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Why We Built This */}
      <Card category="reference" className="mb-12">
        <CardHeader title="Why We Built This" category="reference" />
        <CardContent>
          <div className="space-y-4 text-gray-700">
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
        </CardContent>
      </Card>

      {/* Made with Love */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-gray-600">
          <span>Made with</span>
          <Heart className="text-red-500 fill-red-500" size={18} />
          <span>for Tamil Nadu Teachers</span>
        </div>
      </div>

      {/* CTA */}
      <Card category="default" variant="elevated" className="text-center">
        <CardHeader
          title="Start Using Our Tools"
          subtitle="Explore our collection of 55+ tools designed for your needs"
          category="default"
        />
        <CardContent>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tools">
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                Browse All Tools
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" icon={<ArrowRight size={18} />}>
                Contact Us
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
