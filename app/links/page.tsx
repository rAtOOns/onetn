"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Search, GraduationCap, Users, Building, FileText, Briefcase } from "lucide-react";
import { useState } from "react";

interface PortalLink {
  id: string;
  name: string;
  nameTamil: string;
  url: string;
  description: string;
  category: string;
}

const educationLinks: PortalLink[] = [
  // School Education
  {
    id: "dge",
    name: "Directorate of Govt Examinations",
    nameTamil: "அரசுத் தேர்வுகள் இயக்ககம்",
    url: "https://dge.tn.gov.in",
    description: "SSLC & HSC exams, results, hall tickets, certificates",
    category: "School Education",
  },
  {
    id: "emis",
    name: "EMIS Portal",
    nameTamil: "EMIS தளம்",
    url: "https://emis.tnschools.gov.in",
    description: "Teacher data, transfers, school information, student data",
    category: "School Education",
  },
  {
    id: "scert",
    name: "SCERT Tamil Nadu",
    nameTamil: "SCERT தமிழ்நாடு",
    url: "https://scert.tn.gov.in",
    description: "Curriculum, textbooks, teacher training materials",
    category: "School Education",
  },
  {
    id: "kalvitv",
    name: "Kalvi TV",
    nameTamil: "கல்வி தொலைக்காட்சி",
    url: "https://kalvitv.tn.gov.in",
    description: "Educational videos, e-learning content for students",
    category: "School Education",
  },
  {
    id: "tnschools",
    name: "TN Schools",
    nameTamil: "தமிழ்நாடு பள்ளிகள்",
    url: "https://tnschools.gov.in",
    description: "School education department official portal",
    category: "School Education",
  },
  // Teacher Recruitment & Exams
  {
    id: "trb",
    name: "Teachers Recruitment Board",
    nameTamil: "ஆசிரியர் தேர்வு வாரியம்",
    url: "https://trb.tn.gov.in",
    description: "TET, PG TRB, recruitment notifications, results",
    category: "Teacher Recruitment",
  },
  {
    id: "tndge",
    name: "TN DGE Results",
    nameTamil: "தேர்வு முடிவுகள்",
    url: "https://tndge.gov.in",
    description: "Board exam results portal",
    category: "Teacher Recruitment",
  },
  {
    id: "tnpsc",
    name: "TNPSC",
    nameTamil: "தமிழ்நாடு அரசுப் பணியாளர் தேர்வாணையம்",
    url: "https://tnpsc.gov.in",
    description: "Government job exams, notifications, results",
    category: "Teacher Recruitment",
  },
  // Higher Education
  {
    id: "tansche",
    name: "TANSCHE",
    nameTamil: "தமிழ்நாடு அரசு உயர்கல்வி கவுன்சில்",
    url: "https://tansche.ac.in",
    description: "State Council for Higher Education, university coordination",
    category: "Higher Education",
  },
  {
    id: "tnea",
    name: "TNEA Admissions",
    nameTamil: "பொறியியல் சேர்க்கை",
    url: "https://tneaonline.org",
    description: "Engineering college admissions, counselling",
    category: "Higher Education",
  },
  {
    id: "annauniv",
    name: "Anna University",
    nameTamil: "அண்ணா பல்கலைக்கழகம்",
    url: "https://annauniv.edu",
    description: "Affiliated colleges, results, notifications",
    category: "Higher Education",
  },
  {
    id: "tnou",
    name: "Tamil Nadu Open University",
    nameTamil: "தமிழ்நாடு திறந்தநிலை பல்கலைக்கழகம்",
    url: "https://tnou.ac.in",
    description: "Distance education, degree programs",
    category: "Higher Education",
  },
  // Employee Services
  {
    id: "ifhrms",
    name: "IFHRMS",
    nameTamil: "IFHRMS சம்பள தளம்",
    url: "https://ifhrms.tn.gov.in",
    description: "Pay slips, GPF statements, service book, leave",
    category: "Employee Services",
  },
  {
    id: "pensionportal",
    name: "Pension Portal",
    nameTamil: "ஓய்வூதிய தளம்",
    url: "https://pensioncmc.tn.gov.in",
    description: "Pension status, PPO tracking, pensioner services",
    category: "Employee Services",
  },
  {
    id: "tntreasury",
    name: "TN Treasury",
    nameTamil: "தமிழ்நாடு கருவூலம்",
    url: "https://tntreasury.gov.in",
    description: "Treasury services, GPF, loans, pension",
    category: "Employee Services",
  },
  {
    id: "sparrow",
    name: "SPARROW",
    nameTamil: "SPARROW",
    url: "https://sparrow.tn.gov.in",
    description: "Annual Performance Appraisal Report (APAR) online",
    category: "Employee Services",
  },
  // Official Orders & Gazette
  {
    id: "tngovschool",
    name: "School Education Orders",
    nameTamil: "பள்ளிக்கல்வி அரசாணைகள்",
    url: "https://tn.gov.in/schooleducation",
    description: "Government Orders, circulars, policy documents",
    category: "Official Orders",
  },
  {
    id: "egazette",
    name: "e-Gazette",
    nameTamil: "மின்-அரசிதழ்",
    url: "https://stationeryprinting.tn.gov.in/gazette.html",
    description: "Official Tamil Nadu Government Gazette",
    category: "Official Orders",
  },
  {
    id: "tnbudget",
    name: "TN Budget Documents",
    nameTamil: "பட்ஜெட் ஆவணங்கள்",
    url: "https://tnbudget.tn.gov.in",
    description: "Annual budget, policy notes, finance documents",
    category: "Official Orders",
  },
];

const categories = [
  { id: "all", name: "All", icon: GraduationCap },
  { id: "School Education", name: "Schools", icon: GraduationCap },
  { id: "Teacher Recruitment", name: "Recruitment", icon: Users },
  { id: "Higher Education", name: "Higher Ed", icon: Building },
  { id: "Employee Services", name: "Employee", icon: Briefcase },
  { id: "Official Orders", name: "Orders", icon: FileText },
];

export default function LinksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredLinks = educationLinks.filter((link) => {
    const matchesSearch =
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.nameTamil.includes(searchQuery) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || link.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedLinks = filteredLinks.reduce((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, PortalLink[]>);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <ExternalLink className="text-emerald-600" size={28} />
            Important Links
          </h1>
          <p className="text-sm text-gray-500 tamil">முக்கிய இணைப்புகள்</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search portals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-tn-primary focus:border-transparent"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-tn-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon size={16} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-emerald-800">
          <strong>Official Portals:</strong> All links below are official Tamil Nadu Government
          and Education Department websites. Links open in a new tab.
        </p>
      </div>

      {/* Links Grid */}
      {Object.keys(groupedLinks).length === 0 ? (
        <div className="text-center py-12">
          <ExternalLink size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No portals found matching your search.</p>
        </div>
      ) : (
        Object.entries(groupedLinks).map(([category, links]) => (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-semibold text-tn-text mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
              {category}
              <span className="text-sm font-normal text-gray-500">({links.length})</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md hover:border-emerald-300 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-tn-text group-hover:text-emerald-700 transition-colors">
                        {link.name}
                      </h3>
                      <p className="text-xs text-gray-500 tamil mb-2">{link.nameTamil}</p>
                      <p className="text-sm text-gray-600 mb-2">{link.description}</p>
                      <p className="text-xs text-emerald-600 font-mono">{link.url.replace('https://', '')}</p>
                    </div>
                    <ExternalLink
                      size={18}
                      className="text-gray-400 group-hover:text-emerald-600 transition-colors flex-shrink-0 mt-1"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Footer Note */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-tn-text mb-2">Note</h3>
        <p className="text-sm text-gray-600">
          These are official government portals. If any link is not working, the website may be
          temporarily unavailable. For issues with specific portals, contact the respective
          department helpdesk.
        </p>
      </div>
    </div>
  );
}
