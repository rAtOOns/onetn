import { TrendingUp, BookOpen, FileText, Zap } from "lucide-react";

export default function QuickStats() {
  const stats = [
    {
      icon: Zap,
      value: "66",
      label: "Tools & Calculators",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      icon: FileText,
      value: "1.2K+",
      label: "Government Orders",
      color: "from-violet-500 to-violet-600",
    },
    {
      icon: BookOpen,
      value: "800+",
      label: "Forms & Documents",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: TrendingUp,
      value: "Latest",
      label: "DA & Salary Updates",
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-tn-background to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-full h-full text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-tn-government mb-1">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
