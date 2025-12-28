"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calculator,
  TrendingUp,
  Calendar,
  Clock,
  FileText,
  IndianRupee,
  Receipt,
  PiggyBank,
  Wallet,
  Gift,
  Home,
  Table,
  MapPin,
  Type,
  User,
  Building2,
  BookOpen,
  Building,
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Plane,
  ArrowRightLeft,
  Award,
  Landmark,
  ClipboardCheck,
  Heart,
  FileCheck,
  Monitor,
  Scale,
  GraduationCap,
  Users,
  Baby,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  nameTamil: string;
  href: string;
  icon: LucideIcon;
}

interface ToolCategory {
  name: string;
  nameTamil: string;
  tools: Tool[];
}

const toolCategories: ToolCategory[] = [
  {
    name: "Salary & Pay",
    nameTamil: "சம்பளம்",
    tools: [
      { id: "salary-calculator", name: "Salary Calculator", nameTamil: "சம்பள கால்குலேட்டர்", href: "/tools/salary-calculator", icon: IndianRupee },
      { id: "pay-matrix", name: "Pay Matrix Lookup", nameTamil: "சம்பள அட்டவணை", href: "/tools/pay-matrix", icon: Table },
      { id: "increment-calculator", name: "Increment Calculator", nameTamil: "ஊதிய உயர்வு", href: "/tools/increment-calculator", icon: Calendar },
      { id: "da-rates", name: "DA Rate Table", nameTamil: "அகவிலைப்படி விகிதம்", href: "/tools/da-rates", icon: TrendingUp },
      { id: "arrears-calculator", name: "DA Arrears Calculator", nameTamil: "நிலுவை கால்குலேட்டர்", href: "/tools/arrears-calculator", icon: TrendingUp },
      { id: "pay-fixation", name: "Pay Fixation Calculator", nameTamil: "ஊதிய நிர்ணயம்", href: "/tools/pay-fixation", icon: TrendingUp },
      { id: "pay-slip-decoder", name: "Pay Slip Decoder", nameTamil: "சம்பள சீட்டு விளக்கி", href: "/tools/pay-slip-decoder", icon: FileText },
    ],
  },
  {
    name: "Tax & Deductions",
    nameTamil: "வரி",
    tools: [
      { id: "income-tax-calculator", name: "Income Tax Calculator", nameTamil: "வருமான வரி", href: "/tools/income-tax-calculator", icon: Receipt },
      { id: "hra-calculator", name: "HRA Exemption", nameTamil: "HRA விலக்கு", href: "/tools/hra-calculator", icon: Home },
    ],
  },
  {
    name: "Provident Fund",
    nameTamil: "வருங்கால வைப்பு",
    tools: [
      { id: "tpf-calculator", name: "TPF Calculator", nameTamil: "TPF கால்குலேட்டர்", href: "/tools/tpf-calculator", icon: PiggyBank },
      { id: "loan-calculator", name: "GPF/Loan Calculator", nameTamil: "GPF கடன்", href: "/tools/loan-calculator", icon: Calculator },
      { id: "gpf-interest-calculator", name: "GPF Interest Calculator", nameTamil: "GPF வட்டி", href: "/tools/gpf-interest-calculator", icon: PiggyBank },
      { id: "nps-calculator", name: "NPS Calculator", nameTamil: "NPS கால்குலேட்டர்", href: "/tools/nps-calculator", icon: PiggyBank },
    ],
  },
  {
    name: "Retirement Planning",
    nameTamil: "ஓய்வூதிய பலன்கள்",
    tools: [
      { id: "retirement-summary", name: "Retirement Summary", nameTamil: "ஓய்வு சுருக்கம்", href: "/tools/retirement-summary", icon: Wallet },
      { id: "pension-calculator", name: "Pension Calculator", nameTamil: "ஓய்வூதியம்", href: "/tools/pension-calculator", icon: Wallet },
      { id: "gratuity-calculator", name: "Gratuity Calculator", nameTamil: "நன்கொடை", href: "/tools/gratuity-calculator", icon: Gift },
      { id: "leave-encashment-calculator", name: "Leave Encashment", nameTamil: "விடுப்பு பணமாக்கல்", href: "/tools/leave-encashment-calculator", icon: Calendar },
      { id: "die-in-harness", name: "Die-in-Harness Benefits", nameTamil: "பணியில் இறப்பு சலுகை", href: "/tools/die-in-harness", icon: Heart },
    ],
  },
  {
    name: "Service & Leave",
    nameTamil: "பணி & விடுப்பு",
    tools: [
      { id: "service-calculator", name: "Service Calculator", nameTamil: "பணிக்காலம்", href: "/tools/service-calculator", icon: Clock },
      { id: "leave-calculator", name: "Leave Balance", nameTamil: "விடுப்பு நிலுவை", href: "/tools/leave-calculator", icon: FileText },
      { id: "leave-rules", name: "Leave Rules", nameTamil: "விடுப்பு விதிகள்", href: "/tools/leave-rules", icon: FileText },
      { id: "surrender-leave-calculator", name: "Surrender Leave Calculator", nameTamil: "விடுப்பு சரண்", href: "/tools/surrender-leave-calculator", icon: Calendar },
      { id: "ltc-calculator", name: "LTC Calculator", nameTamil: "LTC கால்குலேட்டர்", href: "/tools/ltc-calculator", icon: Plane },
      { id: "eol-impact", name: "EOL Impact Calculator", nameTamil: "EOL தாக்கம்", href: "/tools/eol-impact", icon: Calendar },
      { id: "special-leave-calculator", name: "Special Leave Calculator", nameTamil: "சிறப்பு விடுப்பு", href: "/tools/special-leave-calculator", icon: Baby },
    ],
  },
  {
    name: "Service Matters",
    nameTamil: "பணி விவகாரங்கள்",
    tools: [
      { id: "transfer-rules", name: "Transfer Rules & Process", nameTamil: "இடமாற்ற விதிகள்", href: "/tools/transfer-rules", icon: ArrowRightLeft },
      { id: "promotion-info", name: "Promotion Information", nameTamil: "பதவி உயர்வு", href: "/tools/promotion-info", icon: Award },
      { id: "loans-advances", name: "Loans & Advances Guide", nameTamil: "கடன்கள் வழிகாட்டி", href: "/tools/loans-advances", icon: Landmark },
      { id: "exam-duty-calculator", name: "Exam Duty Calculator", nameTamil: "தேர்வுப் பணி", href: "/tools/exam-duty-calculator", icon: ClipboardCheck },
      { id: "medical-reimbursement", name: "Medical Reimbursement", nameTamil: "மருத்துவ திருப்பி", href: "/tools/medical-reimbursement", icon: Heart },
      { id: "ta-bill-calculator", name: "TA Bill Calculator", nameTamil: "பயணப்படி", href: "/tools/ta-bill-calculator", icon: MapPin },
      { id: "service-book-checklist", name: "Service Book Checklist", nameTamil: "சேவை புத்தகம்", href: "/tools/service-book-checklist", icon: BookOpen },
      { id: "document-checklists", name: "Document Checklists", nameTamil: "ஆவண பட்டியல்", href: "/tools/document-checklists", icon: FileCheck },
      { id: "seniority-calculator", name: "Seniority Calculator", nameTamil: "மூப்பு கால்குலேட்டர்", href: "/tools/seniority-calculator", icon: Scale },
      { id: "tntet-score-calculator", name: "TNTET/TRB Score Calculator", nameTamil: "TNTET/TRB மதிப்பெண்", href: "/tools/tntet-score-calculator", icon: GraduationCap },
      { id: "student-strength-calculator", name: "Student Strength Calculator", nameTamil: "மாணவர் எண்ணிக்கை", href: "/tools/student-strength-calculator", icon: Users },
      { id: "loan-emi-calculator", name: "Loan EMI Calculator", nameTamil: "கடன் EMI", href: "/tools/loan-emi-calculator", icon: Landmark },
      { id: "rte-compliance", name: "RTE Compliance Checklist", nameTamil: "RTE இணக்கம்", href: "/tools/rte-compliance", icon: Scale },
      { id: "deputation-guide", name: "Deputation Rules Guide", nameTamil: "பணி நிலை மாற்றம்", href: "/tools/deputation-guide", icon: ArrowRightLeft },
    ],
  },
  {
    name: "Date & Time",
    nameTamil: "தேதி & நேரம்",
    tools: [
      { id: "age-calculator", name: "Age Calculator", nameTamil: "வயது கால்குலேட்டர்", href: "/tools/age-calculator", icon: User },
      { id: "date-difference", name: "Date Difference", nameTamil: "தேதி வேறுபாடு", href: "/tools/date-difference", icon: Calendar },
      { id: "working-days", name: "Working Days Counter", nameTamil: "பணி நாட்கள்", href: "/tools/working-days", icon: Building2 },
    ],
  },
  {
    name: "Reference",
    nameTamil: "குறிப்பு",
    tools: [
      { id: "holiday-calendar", name: "Holiday Calendar 2025", nameTamil: "விடுமுறை நாட்கள்", href: "/tools/holiday-calendar", icon: Calendar },
      { id: "important-dates", name: "Important Dates", nameTamil: "முக்கிய தேதிகள்", href: "/tools/important-dates", icon: Calendar },
      { id: "ta-da-rates", name: "TA/DA Rates", nameTamil: "பயணப்படி விகிதம்", href: "/tools/ta-da-rates", icon: MapPin },
      { id: "contact-directory", name: "Contact Directory", nameTamil: "தொடர்பு விவரங்கள்", href: "/tools/contact-directory", icon: Building },
      { id: "abbreviations", name: "Abbreviations", nameTamil: "சுருக்கங்கள்", href: "/tools/abbreviations", icon: BookOpen },
      { id: "emis-guide", name: "EMIS / Paymanager Guide", nameTamil: "EMIS வழிகாட்டி", href: "/tools/emis-guide", icon: Monitor },
      { id: "academic-calendar", name: "Academic Calendar", nameTamil: "கல்வி நாட்காட்டி", href: "/tools/academic-calendar", icon: Calendar },
    ],
  },
  {
    name: "Utilities",
    nameTamil: "பயன்பாடுகள்",
    tools: [
      { id: "number-to-words", name: "Number to Words", nameTamil: "எண்ணை சொல்லாக", href: "/tools/number-to-words", icon: Type },
    ],
  },
];

// Flatten all tools for search
const allTools = toolCategories.flatMap((cat) => cat.tools);

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(toolCategories.map((c) => c.name))
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isToolsHome = pathname === "/tools";

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return toolCategories;

    const query = searchQuery.toLowerCase();
    return toolCategories
      .map((category) => ({
        ...category,
        tools: category.tools.filter(
          (tool) =>
            tool.name.toLowerCase().includes(query) ||
            tool.nameTamil.includes(searchQuery)
        ),
      }))
      .filter((category) => category.tools.length > 0);
  }, [searchQuery]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  const currentTool = allTools.find((t) => pathname === t.href);

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-tn-primary text-white p-3 rounded-full shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen lg:h-[calc(100vh-64px)]
          w-72 bg-gradient-to-b from-emerald-50 to-teal-50 border-r border-emerald-100 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-4">
          {/* Sidebar Header */}
          <Link href="/tools" className="block mb-4">
            <h2 className="text-lg font-bold text-tn-text">Tools & Calculators</h2>
            <p className="text-xs text-gray-500 tamil">கருவிகள் மற்றும் கால்குலேட்டர்கள்</p>
          </Link>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-tn-primary focus:outline-none"
            />
          </div>

          {/* Tool Count */}
          <div className="mb-4 px-2 py-1 bg-emerald-100/50 rounded text-xs text-emerald-700">
            {allTools.length} tools available
          </div>

          {/* Categories */}
          <nav className="space-y-1">
            {filteredCategories.map((category) => (
              <div key={category.name}>
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-100/50 rounded-lg transition-colors"
                >
                  <span>{category.name}</span>
                  {expandedCategories.has(category.name) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {expandedCategories.has(category.name) && (
                  <div className="ml-2 mt-1 space-y-0.5">
                    {category.tools.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = pathname === tool.href;
                      return (
                        <Link
                          key={tool.id}
                          href={tool.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
                            ${
                              isActive
                                ? "bg-tn-primary text-white shadow-sm"
                                : "text-gray-600 hover:bg-emerald-100/70"
                            }
                          `}
                        >
                          <Icon size={16} />
                          <span className="truncate">{tool.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {!isToolsHome && currentTool && (
          <div className="lg:hidden bg-gray-50 border-b px-4 py-2 flex items-center gap-2 text-sm">
            <Link href="/tools" className="text-tn-primary hover:underline">
              Tools
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 truncate">{currentTool.name}</span>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
