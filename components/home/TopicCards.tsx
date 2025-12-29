import Link from "next/link";
import {
  Banknote,
  Calendar,
  ArrowLeftRight,
  TrendingUp,
  FileText,
  ClipboardList,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Topic {
  name: string;
  nameTamil: string;
  icon: LucideIcon;
  query: string;
  description: string;
}

// Education-focused topics with search queries
const educationTopics: Topic[] = [
  {
    name: "Teacher Salary",
    nameTamil: "ஆசிரியர் சம்பளம்",
    icon: Banknote,
    query: "salary pay",
    description: "Pay orders & salary revisions",
  },
  {
    name: "DA / Allowances",
    nameTamil: "அகவிலைப்படி",
    icon: TrendingUp,
    query: "da allowance",
    description: "DA rates & allowance orders",
  },
  {
    name: "Leave Rules",
    nameTamil: "விடுப்பு விதிகள்",
    icon: Calendar,
    query: "leave cl el ml",
    description: "CL, EL, ML & other leave rules",
  },
  {
    name: "Transfer",
    nameTamil: "இடமாற்றம்",
    icon: ArrowLeftRight,
    query: "transfer posting",
    description: "Transfer counseling & postings",
  },
  {
    name: "Promotion",
    nameTamil: "பதவி உயர்வு",
    icon: TrendingUp,
    query: "promotion",
    description: "Promotion orders & guidelines",
  },
  {
    name: "Exams",
    nameTamil: "தேர்வுகள்",
    icon: ClipboardList,
    query: "exam sslc",
    description: "SSLC, HSC exam circulars",
  },
  {
    name: "TET / TRB",
    nameTamil: "ஆசிரியர் தேர்வு",
    icon: Award,
    query: "tet trb",
    description: "Teacher recruitment orders",
  },
  {
    name: "Pension / GPF",
    nameTamil: "ஓய்வூதியம்",
    icon: Users,
    query: "pension gpf retirement",
    description: "Pension & GPF related GOs",
  },
];

export default function TopicCards() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-tn-text">Browse by Topic</h2>
            <p className="text-sm text-gray-500 tamil">தலைப்பு வாரியாக அரசாணைகளை காண்க</p>
          </div>
          <Link
            href="/go"
            className="text-sm text-tn-primary hover:text-tn-highlight font-medium inline-flex items-center gap-1"
          >
            View All GOs
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Professional grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {educationTopics.map((topic) => {
            const IconComponent = topic.icon;

            return (
              <Link
                key={topic.name}
                href={topic.query ? `/go?q=${encodeURIComponent(topic.query)}` : "/go"}
                className="group flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-tn-primary hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-tn-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-tn-primary/20 transition-colors">
                  <IconComponent className="text-tn-primary" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-tn-text group-hover:text-tn-primary transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{topic.description}</p>
                  <p className="text-xs text-gray-400 tamil mt-1">{topic.nameTamil}</p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-tn-primary transition-colors flex-shrink-0 mt-1"
                />
              </Link>
            );
          })}
        </div>

        {/* View All link for mobile */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/go"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-tn-primary text-white rounded-lg text-sm font-medium hover:bg-tn-primary/90 transition-colors"
          >
            <FileText size={16} />
            Browse All Government Orders
          </Link>
        </div>
      </div>
    </section>
  );
}
