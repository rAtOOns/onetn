"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
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
  UserMinus,
  UserCheck,
  ClipboardList,
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  nameTamil: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  category: string;
  isNew?: boolean;
}

const tools: Tool[] = [
  // Salary & Pay
  {
    id: "salary-calculator",
    name: "Salary Calculator",
    nameTamil: "சம்பள கால்குலேட்டர்",
    description: "Calculate gross salary based on 7th Pay Commission",
    icon: IndianRupee,
    href: "/tools/salary-calculator",
    color: "bg-green-500",
    category: "Salary & Pay",
  },
  {
    id: "pay-matrix",
    name: "Pay Matrix Lookup",
    nameTamil: "சம்பள அட்டவணை",
    description: "7th Pay Commission pay scale table lookup",
    icon: Table,
    href: "/tools/pay-matrix",
    color: "bg-blue-500",
    category: "Salary & Pay",
  },
  {
    id: "increment-calculator",
    name: "Increment Calculator",
    nameTamil: "ஊதிய உயர்வு கால்குலேட்டர்",
    description: "Calculate next increment date and amount",
    icon: Calendar,
    href: "/tools/increment-calculator",
    color: "bg-orange-500",
    category: "Salary & Pay",
  },
  {
    id: "da-rates",
    name: "DA Rate Table",
    nameTamil: "அகவிலைப்படி விகிதம்",
    description: "Current and historical DA rates from 2001",
    icon: TrendingUp,
    href: "/tools/da-rates",
    color: "bg-blue-500",
    category: "Salary & Pay",
  },
  {
    id: "arrears-calculator",
    name: "DA Arrears Calculator",
    nameTamil: "நிலுவை கால்குலேட்டர்",
    description: "Calculate DA arrears when rate increases",
    icon: TrendingUp,
    href: "/tools/arrears-calculator",
    color: "bg-green-600",
    category: "Salary & Pay",
      },
  {
    id: "pay-fixation",
    name: "Pay Fixation Calculator",
    nameTamil: "ஊதிய நிர்ணய கால்குலேட்டர்",
    description: "Calculate pay on promotion or MACP",
    icon: TrendingUp,
    href: "/tools/pay-fixation",
    color: "bg-purple-500",
    category: "Salary & Pay",
      },
  {
    id: "pay-slip-decoder",
    name: "Pay Slip Decoder",
    nameTamil: "சம்பள சீட்டு விளக்கி",
    description: "Understand each component of your pay slip",
    icon: FileText,
    href: "/tools/pay-slip-decoder",
    color: "bg-blue-600",
    category: "Salary & Pay",
      },
  // Tax & Deductions
  {
    id: "income-tax-calculator",
    name: "Income Tax Calculator",
    nameTamil: "வருமான வரி கால்குலேட்டர்",
    description: "Calculate tax under Old vs New regime",
    icon: Receipt,
    href: "/tools/income-tax-calculator",
    color: "bg-indigo-500",
    category: "Tax & Deductions",
  },
  {
    id: "hra-calculator",
    name: "HRA Exemption",
    nameTamil: "HRA விலக்கு",
    description: "Calculate HRA tax exemption under Section 10(13A)",
    icon: Home,
    href: "/tools/hra-calculator",
    color: "bg-cyan-500",
    category: "Tax & Deductions",
  },
  // Provident Fund
  {
    id: "tpf-calculator",
    name: "TPF Calculator",
    nameTamil: "TPF கால்குலேட்டர்",
    description: "Calculate TPF interest and generate statement",
    icon: PiggyBank,
    href: "/tools/tpf-calculator",
    color: "bg-emerald-500",
    category: "Provident Fund",
  },
  {
    id: "loan-calculator",
    name: "GPF/Loan Calculator",
    nameTamil: "GPF கடன் கால்குலேட்டர்",
    description: "Calculate GPF balance and loan eligibility",
    icon: Calculator,
    href: "/tools/loan-calculator",
    color: "bg-red-500",
    category: "Provident Fund",
  },
  {
    id: "gpf-interest-calculator",
    name: "GPF Interest Calculator",
    nameTamil: "GPF வட்டி கால்குலேட்டர்",
    description: "Calculate yearly GPF interest with monthly breakdown",
    icon: PiggyBank,
    href: "/tools/gpf-interest-calculator",
    color: "bg-emerald-600",
    category: "Provident Fund",
      },
  {
    id: "nps-calculator",
    name: "NPS Calculator",
    nameTamil: "NPS கால்குலேட்டர்",
    description: "Calculate NPS corpus for employees joined after 2003",
    icon: PiggyBank,
    href: "/tools/nps-calculator",
    color: "bg-orange-500",
    category: "Provident Fund",
      },
  // Retirement Planning
  {
    id: "retirement-summary",
    name: "Retirement Summary",
    nameTamil: "ஓய்வு சுருக்கம்",
    description: "One-page view of all retirement benefits",
    icon: Wallet,
    href: "/tools/retirement-summary",
    color: "bg-purple-600",
    category: "Retirement Planning",
      },
  {
    id: "pension-calculator",
    name: "Pension Calculator",
    nameTamil: "ஓய்வூதிய கால்குலேட்டர்",
    description: "Calculate pension, commutation and family pension",
    icon: Wallet,
    href: "/tools/pension-calculator",
    color: "bg-purple-500",
    category: "Retirement Planning",
  },
  {
    id: "gratuity-calculator",
    name: "Gratuity Calculator",
    nameTamil: "நன்கொடை கால்குலேட்டர்",
    description: "Calculate gratuity based on service and last pay",
    icon: Gift,
    href: "/tools/gratuity-calculator",
    color: "bg-pink-500",
    category: "Retirement Planning",
  },
  {
    id: "leave-encashment-calculator",
    name: "Leave Encashment",
    nameTamil: "விடுப்பு பணமாக்கல்",
    description: "Calculate EL and HPL encashment at retirement",
    icon: Calendar,
    href: "/tools/leave-encashment-calculator",
    color: "bg-teal-600",
    category: "Retirement Planning",
  },
  {
    id: "die-in-harness",
    name: "Die-in-Harness Benefits",
    nameTamil: "பணியில் இறப்பு சலுகைகள்",
    description: "Benefits for family if employee dies while in service",
    icon: Heart,
    href: "/tools/die-in-harness",
    color: "bg-rose-600",
    category: "Retirement Planning",
      },
  {
    id: "voluntary-retirement",
    name: "Voluntary Retirement Calculator",
    nameTamil: "தன்னார்வ ஓய்வு கால்குலேட்டர்",
    description: "Calculate VRS benefits and eligibility",
    icon: UserMinus,
    href: "/tools/voluntary-retirement",
    color: "bg-orange-600",
    category: "Retirement Planning",
      },
  // Service & Leave
  {
    id: "service-calculator",
    name: "Service Calculator",
    nameTamil: "பணிக்கால கால்குலேட்டர்",
    description: "Calculate total service period and retirement date",
    icon: Clock,
    href: "/tools/service-calculator",
    color: "bg-purple-500",
    category: "Service & Leave",
  },
  {
    id: "leave-calculator",
    name: "Leave Balance",
    nameTamil: "விடுப்பு நிலுவை",
    description: "Track your CL, EL, ML and other leave balances",
    icon: FileText,
    href: "/tools/leave-calculator",
    color: "bg-teal-500",
    category: "Service & Leave",
  },
  {
    id: "leave-rules",
    name: "Leave Rules",
    nameTamil: "விடுப்பு விதிகள்",
    description: "Quick reference for leave entitlements and rules",
    icon: FileText,
    href: "/tools/leave-rules",
    color: "bg-teal-600",
    category: "Service & Leave",
  },
  {
    id: "surrender-leave-calculator",
    name: "Surrender Leave Calculator",
    nameTamil: "விடுப்பு சரண் கால்குலேட்டர்",
    description: "Calculate surrender leave encashment amount",
    icon: Calendar,
    href: "/tools/surrender-leave-calculator",
    color: "bg-teal-700",
    category: "Service & Leave",
      },
  {
    id: "ltc-calculator",
    name: "LTC Calculator",
    nameTamil: "LTC கால்குலேட்டர்",
    description: "Calculate Leave Travel Concession benefits",
    icon: Plane,
    href: "/tools/ltc-calculator",
    color: "bg-sky-500",
    category: "Service & Leave",
      },
  {
    id: "eol-impact",
    name: "EOL Impact Calculator",
    nameTamil: "EOL தாக்க கால்குலேட்டர்",
    description: "Calculate impact of Extra Ordinary Leave on service",
    icon: Calendar,
    href: "/tools/eol-impact",
    color: "bg-violet-500",
    category: "Service & Leave",
      },
  {
    id: "special-leave-calculator",
    name: "Special Leave Calculator",
    nameTamil: "சிறப்பு விடுப்பு கால்குலேட்டர்",
    description: "Maternity, Paternity, Child Care Leave calculator",
    icon: Baby,
    href: "/tools/special-leave-calculator",
    color: "bg-pink-500",
    category: "Service & Leave",
      },
  {
    id: "probation-tracker",
    name: "Probation Period Tracker",
    nameTamil: "தகுதிகாண் பருவ கண்காணிப்பான்",
    description: "Track probation completion and confirmation date",
    icon: UserCheck,
    href: "/tools/probation-tracker",
    color: "bg-blue-600",
    category: "Service & Leave",
      },
  {
    id: "study-leave",
    name: "Study Leave Guide",
    nameTamil: "படிப்பு விடுப்பு வழிகாட்டி",
    description: "Rules for study leave for higher education",
    icon: GraduationCap,
    href: "/tools/study-leave",
    color: "bg-purple-600",
    category: "Service & Leave",
      },
  // Service Matters (New Category)
  {
    id: "transfer-rules",
    name: "Transfer Rules & Process",
    nameTamil: "இடமாற்ற விதிகள்",
    description: "Transfer counseling process and rules guide",
    icon: ArrowRightLeft,
    href: "/tools/transfer-rules",
    color: "bg-indigo-600",
    category: "Service Matters",
      },
  {
    id: "promotion-info",
    name: "Promotion Information",
    nameTamil: "பதவி உயர்வு தகவல்",
    description: "Promotion hierarchy, eligibility and requirements",
    icon: Award,
    href: "/tools/promotion-info",
    color: "bg-orange-600",
    category: "Service Matters",
      },
  {
    id: "loans-advances",
    name: "Loans & Advances Guide",
    nameTamil: "கடன்கள் வழிகாட்டி",
    description: "HBA, vehicle loan, festival advance details",
    icon: Landmark,
    href: "/tools/loans-advances",
    color: "bg-amber-600",
    category: "Service Matters",
      },
  {
    id: "exam-duty-calculator",
    name: "Exam Duty Calculator",
    nameTamil: "தேர்வுப் பணி கால்குலேட்டர்",
    description: "Calculate exam duty remuneration",
    icon: ClipboardCheck,
    href: "/tools/exam-duty-calculator",
    color: "bg-indigo-500",
    category: "Service Matters",
      },
  {
    id: "medical-reimbursement",
    name: "Medical Reimbursement Guide",
    nameTamil: "மருத்துவ திருப்பி வழிகாட்டி",
    description: "Medical claim process and coverage details",
    icon: Heart,
    href: "/tools/medical-reimbursement",
    color: "bg-red-500",
    category: "Service Matters",
      },
  {
    id: "ta-bill-calculator",
    name: "TA Bill Calculator",
    nameTamil: "பயணப்படி கால்குலேட்டர்",
    description: "Calculate travel allowance claims",
    icon: MapPin,
    href: "/tools/ta-bill-calculator",
    color: "bg-cyan-600",
    category: "Service Matters",
      },
  {
    id: "service-book-checklist",
    name: "Service Book Checklist",
    nameTamil: "சேவை புத்தக சரிபார்ப்பு",
    description: "Verify all entries in your service book",
    icon: BookOpen,
    href: "/tools/service-book-checklist",
    color: "bg-amber-500",
    category: "Service Matters",
      },
  {
    id: "document-checklists",
    name: "Document Checklists",
    nameTamil: "ஆவண சரிபார்ப்பு பட்டியல்",
    description: "Checklists for joining, transfer, retirement, etc.",
    icon: FileCheck,
    href: "/tools/document-checklists",
    color: "bg-teal-500",
    category: "Service Matters",
      },
  {
    id: "seniority-calculator",
    name: "Seniority Calculator",
    nameTamil: "மூப்பு கால்குலேட்டர்",
    description: "Calculate seniority points and roster position",
    icon: Scale,
    href: "/tools/seniority-calculator",
    color: "bg-purple-600",
    category: "Service Matters",
      },
  {
    id: "tntet-score-calculator",
    name: "TNTET/TRB Score Calculator",
    nameTamil: "TNTET/TRB மதிப்பெண் கால்குலேட்டர்",
    description: "Calculate weighted score for teacher recruitment",
    icon: GraduationCap,
    href: "/tools/tntet-score-calculator",
    color: "bg-blue-600",
    category: "Service Matters",
      },
  {
    id: "student-strength-calculator",
    name: "Student Strength Calculator",
    nameTamil: "மாணவர் எண்ணிக்கை கால்குலேட்டர்",
    description: "Calculate teacher-student ratio and sanctioned posts",
    icon: Users,
    href: "/tools/student-strength-calculator",
    color: "bg-teal-600",
    category: "Service Matters",
      },
  {
    id: "loan-emi-calculator",
    name: "Loan EMI Calculator",
    nameTamil: "கடன் EMI கால்குலேட்டர்",
    description: "Calculate EMI for HBA, Car, Two-wheeler advances",
    icon: Landmark,
    href: "/tools/loan-emi-calculator",
    color: "bg-amber-600",
    category: "Service Matters",
      },
  {
    id: "rte-compliance",
    name: "RTE Compliance Checklist",
    nameTamil: "RTE இணக்க சரிபார்ப்பு",
    description: "Check school compliance with RTE Act norms",
    icon: Scale,
    href: "/tools/rte-compliance",
    color: "bg-indigo-600",
    category: "Service Matters",
      },
  {
    id: "deputation-guide",
    name: "Deputation Rules Guide",
    nameTamil: "பணி நிலை மாற்ற வழிகாட்டி",
    description: "Guide for deputation within state, central, foreign service",
    icon: ArrowRightLeft,
    href: "/tools/deputation-guide",
    color: "bg-cyan-600",
    category: "Service Matters",
      },
  {
    id: "compassionate-appointment",
    name: "Compassionate Appointment Guide",
    nameTamil: "இரக்கப்படி நியமன வழிகாட்டி",
    description: "Guide for family appointment if employee dies in service",
    icon: Heart,
    href: "/tools/compassionate-appointment",
    color: "bg-rose-500",
    category: "Service Matters",
      },
  {
    id: "apar-guide",
    name: "APAR Self-Assessment Guide",
    nameTamil: "APAR சுய மதிப்பீட்டு வழிகாட்டி",
    description: "Tips for writing effective performance appraisal",
    icon: ClipboardList,
    href: "/tools/apar-guide",
    color: "bg-indigo-500",
    category: "Service Matters",
      },
  // Date & Time
  {
    id: "age-calculator",
    name: "Age Calculator",
    nameTamil: "வயது கால்குலேட்டர்",
    description: "Calculate exact age for admissions and records",
    icon: User,
    href: "/tools/age-calculator",
    color: "bg-pink-500",
    category: "Date & Time",
  },
  {
    id: "date-difference",
    name: "Date Difference",
    nameTamil: "தேதி வேறுபாடு",
    description: "Calculate days/months/years between dates",
    icon: Calendar,
    href: "/tools/date-difference",
    color: "bg-indigo-500",
    category: "Date & Time",
  },
  {
    id: "working-days",
    name: "Working Days Counter",
    nameTamil: "பணி நாட்கள் கணக்கு",
    description: "Count working days excluding weekends and holidays",
    icon: Building2,
    href: "/tools/working-days",
    color: "bg-emerald-600",
    category: "Date & Time",
  },
  // Reference
  {
    id: "holiday-calendar",
    name: "Holiday Calendar 2025",
    nameTamil: "விடுமுறை நாட்கள்",
    description: "TN Government holidays list",
    icon: Calendar,
    href: "/tools/holiday-calendar",
    color: "bg-red-500",
    category: "Reference",
  },
  {
    id: "important-dates",
    name: "Important Dates",
    nameTamil: "முக்கிய தேதிகள்",
    description: "Exam dates, admission schedules, academic events",
    icon: Calendar,
    href: "/tools/important-dates",
    color: "bg-blue-600",
    category: "Reference",
  },
  {
    id: "ta-da-rates",
    name: "TA/DA Rates",
    nameTamil: "பயணப்படி விகிதம்",
    description: "Travel allowance and daily allowance rates",
    icon: MapPin,
    href: "/tools/ta-da-rates",
    color: "bg-orange-500",
    category: "Reference",
  },
  {
    id: "contact-directory",
    name: "Contact Directory",
    nameTamil: "தொடர்பு விவரங்கள்",
    description: "CEO/DEO office contacts by district",
    icon: Building,
    href: "/tools/contact-directory",
    color: "bg-amber-600",
    category: "Reference",
  },
  {
    id: "abbreviations",
    name: "Abbreviations",
    nameTamil: "சுருக்கங்கள்",
    description: "Common education department abbreviations",
    icon: BookOpen,
    href: "/tools/abbreviations",
    color: "bg-cyan-600",
    category: "Reference",
  },
  {
    id: "emis-guide",
    name: "EMIS / Paymanager Guide",
    nameTamil: "EMIS / சம்பள மேலாளர் வழிகாட்டி",
    description: "How to use EMIS and IFHRMS portals",
    icon: Monitor,
    href: "/tools/emis-guide",
    color: "bg-sky-600",
    category: "Reference",
      },
  {
    id: "academic-calendar",
    name: "Academic Calendar 2024-25",
    nameTamil: "கல்வி நாட்காட்டி",
    description: "Academic year calendar with exams, holidays, events",
    icon: Calendar,
    href: "/tools/academic-calendar",
    color: "bg-emerald-500",
    category: "Reference",
      },
  // Utilities
  {
    id: "number-to-words",
    name: "Number to Words",
    nameTamil: "எண்ணை சொல்லாக",
    description: "Convert amount to words for cheques/vouchers",
    icon: Type,
    href: "/tools/number-to-words",
    color: "bg-violet-500",
    category: "Utilities",
  },
];

// Group tools by category
const groupedTools = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, Tool[]>);

const categoryOrder = [
  "Salary & Pay",
  "Tax & Deductions",
  "Provident Fund",
  "Retirement Planning",
  "Service & Leave",
  "Service Matters",
  "Date & Time",
  "Reference",
  "Utilities",
];

export default function ToolsPage() {
  const newToolsCount = tools.filter(t => t.isNew).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-tn-text mb-2">
          All Tools & Calculators
        </h1>
        <p className="text-gray-600">
          {tools.length} tools for Tamil Nadu Education Department employees
          {newToolsCount > 0 && (
            <span className="ml-2 text-green-600">({newToolsCount} new)</span>
          )}
        </p>
        <p className="text-sm text-gray-500 tamil">
          தமிழ்நாடு கல்வித்துறை ஊழியர்களுக்கான {tools.length} கருவிகள்
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> These tools are for informational purposes only.
          This is not an official government website. Always verify calculations with official sources or your DDO.
        </p>
      </div>

      {/* Tools by Category */}
      {categoryOrder.map((category) => {
        const categoryTools = groupedTools[category];
        if (!categoryTools) return null;

        return (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-semibold text-tn-text mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-tn-primary rounded-full"></span>
              {category}
              <span className="text-sm font-normal text-gray-500">({categoryTools.length})</span>
            </h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {categoryTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-tn-primary/20 transition-all group relative"
                  >
                    {tool.isNew && (
                      <span className="absolute top-2 right-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                    <div className="flex items-start gap-3">
                      <div
                        className={`${tool.color} p-2.5 rounded-lg text-white group-hover:scale-110 transition-transform`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-tn-text group-hover:text-tn-primary transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-gray-500 tamil mb-1">
                          {tool.nameTamil}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Footer Note */}
      <div className="mt-8 text-center border-t pt-6">
        <p className="text-sm text-gray-500">
          More tools coming soon. Suggestions? We&apos;re always improving!
        </p>
      </div>
    </div>
  );
}
