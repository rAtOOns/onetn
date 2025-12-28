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
} from "lucide-react";

// Education-focused topics with search queries
const educationTopics = [
  {
    name: "Teacher Salary",
    nameTamil: "ஆசிரியர் சம்பளம்",
    icon: Banknote,
    query: "salary pay",
    color: "text-green-600 bg-green-50",
  },
  {
    name: "DA / Allowances",
    nameTamil: "அகவிலைப்படி",
    icon: TrendingUp,
    query: "da allowance",
    color: "text-blue-600 bg-blue-50",
  },
  {
    name: "Leave Rules",
    nameTamil: "விடுப்பு விதிகள்",
    icon: Calendar,
    query: "leave cl el ml",
    color: "text-purple-600 bg-purple-50",
  },
  {
    name: "Transfer",
    nameTamil: "இடமாற்றம்",
    icon: ArrowLeftRight,
    query: "transfer posting",
    color: "text-orange-600 bg-orange-50",
  },
  {
    name: "Promotion",
    nameTamil: "பதவி உயர்வு",
    icon: TrendingUp,
    query: "promotion",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    name: "Exams",
    nameTamil: "தேர்வுகள்",
    icon: ClipboardList,
    query: "exam sslc",
    color: "text-red-600 bg-red-50",
  },
  {
    name: "TET / TRB",
    nameTamil: "ஆசிரியர் தேர்வு",
    icon: Award,
    query: "tet trb",
    color: "text-amber-600 bg-amber-50",
  },
  {
    name: "Pension / GPF",
    nameTamil: "ஓய்வூதியம்",
    icon: Users,
    query: "pension gpf retirement",
    color: "text-teal-600 bg-teal-50",
  },
  {
    name: "All GOs",
    nameTamil: "அனைத்து அரசாணைகள்",
    icon: FileText,
    query: "",
    color: "text-gray-600 bg-gray-100",
  },
];

export default function TopicCards() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-tn-text">Browse by Topic</h2>
            <p className="text-sm text-gray-500 tamil">தலைப்பு வாரியாக உலாவுக</p>
          </div>
          <Link
            href="/go"
            className="text-sm text-tn-primary hover:text-tn-highlight font-medium"
          >
            View All GOs →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {educationTopics.map((topic) => {
            const IconComponent = topic.icon;
            const [textColor, bgColor] = topic.color.split(" ");

            return (
              <Link
                key={topic.name}
                href={topic.query ? `/go?q=${encodeURIComponent(topic.query)}` : "/go"}
                className="group p-4 rounded-xl border border-gray-100 hover:border-tn-primary/30 hover:shadow-md transition-all bg-white"
              >
                <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center mb-3`}>
                  <IconComponent className={textColor} size={20} />
                </div>
                <h3 className="font-medium text-sm text-tn-text group-hover:text-tn-primary transition-colors line-clamp-1">
                  {topic.name}
                </h3>
                <p className="text-xs text-gray-400 tamil line-clamp-1">{topic.nameTamil}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
