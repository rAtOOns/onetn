import Link from "next/link";
import {
  FileText,
  FileCheck,
  Scroll,
  Building2,
  GraduationCap,
  Heart,
  Tractor,
  Bus,
} from "lucide-react";

const categories = [
  {
    name: "Government Orders",
    nameTamil: "அரசாணைகள்",
    icon: Scroll,
    href: "/documents?category=government-orders",
    color: "bg-blue-500",
  },
  {
    name: "Forms & Applications",
    nameTamil: "படிவங்கள்",
    icon: FileCheck,
    href: "/documents?category=forms",
    color: "bg-green-500",
  },
  {
    name: "Circulars",
    nameTamil: "சுற்றறிக்கைகள்",
    icon: FileText,
    href: "/documents?category=circulars",
    color: "bg-purple-500",
  },
  {
    name: "Schemes",
    nameTamil: "திட்டங்கள்",
    icon: Building2,
    href: "/documents?category=schemes",
    color: "bg-orange-500",
  },
];

const departments = [
  {
    name: "Education",
    nameTamil: "கல்வி",
    icon: GraduationCap,
    href: "/documents?dept=school-education",
    color: "bg-indigo-500",
  },
  {
    name: "Health",
    nameTamil: "சுகாதாரம்",
    icon: Heart,
    href: "/documents?dept=health",
    color: "bg-red-500",
  },
  {
    name: "Agriculture",
    nameTamil: "வேளாண்மை",
    icon: Tractor,
    href: "/documents?dept=agriculture",
    color: "bg-emerald-500",
  },
  {
    name: "Transport",
    nameTamil: "போக்குவரத்து",
    icon: Bus,
    href: "/documents?dept=transport",
    color: "bg-cyan-500",
  },
];

export default function QuickLinks() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-tn-text mb-2">
            Browse by Category
          </h2>
          <p className="text-gray-600 mb-6 tamil">வகை வாரியாக பார்க்கவும்</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="card hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className={`${cat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-tn-text mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500 tamil">{cat.nameTamil}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-tn-text mb-2">
                Popular Departments
              </h2>
              <p className="text-gray-600 tamil">முக்கிய துறைகள்</p>
            </div>
            <Link
              href="/documents"
              className="btn-outline text-sm hidden md:inline-flex"
            >
              View All Departments
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <Link
                key={dept.href}
                href={dept.href}
                className="card hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className={`${dept.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <dept.icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-tn-text mb-1">{dept.name}</h3>
                <p className="text-sm text-gray-500 tamil">{dept.nameTamil}</p>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link href="/documents" className="btn-outline">
              View All Departments
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
