"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Search, Filter, MapPin, Building2, Globe } from "lucide-react";
import { useState } from "react";

interface Form {
  id: string;
  name: string;
  nameTamil: string;
  category: string;
  description: string;
  whereToGet: string;
  whereToGetType: "office" | "portal" | "department";
}

const forms: Form[] = [
  // Leave Forms
  {
    id: "cl-application",
    name: "Casual Leave Application",
    nameTamil: "தற்காலிக விடுப்பு விண்ணப்பம்",
    category: "Leave",
    description: "Application form for casual leave (CL) - up to 12 days per year",
    whereToGet: "From your Drawing & Disbursing Officer (DDO)",
    whereToGetType: "office",
  },
  {
    id: "el-application",
    name: "Earned Leave Application",
    nameTamil: "ஈட்டிய விடுப்பு விண்ணப்பம்",
    category: "Leave",
    description: "Application form for earned leave (EL) - accumulates 15 days per half year",
    whereToGet: "From your Drawing & Disbursing Officer (DDO)",
    whereToGetType: "office",
  },
  {
    id: "ml-application",
    name: "Medical Leave Application",
    nameTamil: "மருத்துவ விடுப்பு விண்ணப்பம்",
    category: "Leave",
    description: "Application for medical leave with medical certificate attachment",
    whereToGet: "From your Drawing & Disbursing Officer (DDO)",
    whereToGetType: "office",
  },
  {
    id: "maternity-leave",
    name: "Maternity Leave Application",
    nameTamil: "மகப்பேறு விடுப்பு விண்ணப்பம்",
    category: "Leave",
    description: "Application for 180 days maternity leave (up to 2 surviving children)",
    whereToGet: "From your Drawing & Disbursing Officer (DDO)",
    whereToGetType: "office",
  },
  // GPF Forms
  {
    id: "gpf-advance",
    name: "GPF Advance Application",
    nameTamil: "GPF முன்பணம் விண்ணப்பம்",
    category: "GPF",
    description: "Application for temporary/refundable advance from GPF account",
    whereToGet: "District Treasury Office / AG Office",
    whereToGetType: "office",
  },
  {
    id: "gpf-withdrawal",
    name: "GPF Final Withdrawal",
    nameTamil: "GPF இறுதி திரும்பப்பெறுதல்",
    category: "GPF",
    description: "Application for final/non-refundable withdrawal from GPF",
    whereToGet: "District Treasury Office / AG Office",
    whereToGetType: "office",
  },
  {
    id: "gpf-nomination",
    name: "GPF Nomination Form",
    nameTamil: "GPF வேட்பாளர் படிவம்",
    category: "GPF",
    description: "Form to nominate family members for GPF account",
    whereToGet: "District Treasury Office / AG Office",
    whereToGetType: "office",
  },
  {
    id: "gpf-statement",
    name: "GPF Statement Request",
    nameTamil: "GPF அறிக்கை கோரிக்கை",
    category: "GPF",
    description: "Request for annual GPF account statement",
    whereToGet: "IFHRMS Portal (login required)",
    whereToGetType: "portal",
  },
  // Transfer Forms
  {
    id: "transfer-request",
    name: "Transfer Request Form",
    nameTamil: "இடமாற்றம் கோரிக்கை படிவம்",
    category: "Transfer",
    description: "Application for transfer request during annual counseling",
    whereToGet: "EMIS Portal (for teachers) / Department Portal",
    whereToGetType: "portal",
  },
  {
    id: "joining-report",
    name: "Joining Report",
    nameTamil: "பணியில் சேர்ந்த அறிக்கை",
    category: "Transfer",
    description: "Report to be submitted after joining new post/station",
    whereToGet: "From your new office establishment section",
    whereToGetType: "office",
  },
  {
    id: "relieving-order",
    name: "Relieving Order Request",
    nameTamil: "விடுவிப்பு ஆணை கோரிக்கை",
    category: "Transfer",
    description: "Request for relieving order from current post",
    whereToGet: "From your current office establishment section",
    whereToGetType: "office",
  },
  {
    id: "spouse-posting",
    name: "Spouse Station Request",
    nameTamil: "துணை நிலைய கோரிக்கை",
    category: "Transfer",
    description: "Application for posting at spouse's station",
    whereToGet: "Your Department Head Office",
    whereToGetType: "department",
  },
  // Pension Forms
  {
    id: "pension-application",
    name: "Pension Application",
    nameTamil: "ஓய்வூதிய விண்ணப்பம்",
    category: "Pension",
    description: "Main application form for pension (submit 6 months before retirement)",
    whereToGet: "AG Office / Treasury Office",
    whereToGetType: "office",
  },
  {
    id: "family-pension",
    name: "Family Pension Application",
    nameTamil: "குடும்ப ஓய்வூதிய விண்ணப்பம்",
    category: "Pension",
    description: "Application for family pension (30% of last pay)",
    whereToGet: "AG Office / Treasury Office",
    whereToGetType: "office",
  },
  {
    id: "commutation-form",
    name: "Commutation Form",
    nameTamil: "ஓய்வூதிய மாற்று படிவம்",
    category: "Pension",
    description: "Form to commute up to 40% of pension for lump sum",
    whereToGet: "AG Office / Treasury Office",
    whereToGetType: "office",
  },
  {
    id: "pension-revision",
    name: "Pension Revision Request",
    nameTamil: "ஓய்வூதிய திருத்த கோரிக்கை",
    category: "Pension",
    description: "Application for pension revision after Pay Commission implementation",
    whereToGet: "AG Office / Treasury Office",
    whereToGetType: "office",
  },
  // Service Forms
  {
    id: "service-certificate",
    name: "Service Certificate Request",
    nameTamil: "பணிச்சான்றிதழ் கோரிக்கை",
    category: "Service",
    description: "Request for service/experience certificate",
    whereToGet: "From your office establishment section",
    whereToGetType: "office",
  },
  {
    id: "no-objection",
    name: "No Objection Certificate",
    nameTamil: "தடையின்மை சான்றிதழ்",
    category: "Service",
    description: "NOC for higher studies, passport, etc.",
    whereToGet: "From your Department Head",
    whereToGetType: "department",
  },
  {
    id: "increment-form",
    name: "Increment Declaration",
    nameTamil: "ஊதிய உயர்வு அறிவிப்பு",
    category: "Service",
    description: "Annual increment declaration form (due every July)",
    whereToGet: "From your Drawing & Disbursing Officer (DDO)",
    whereToGetType: "office",
  },
  {
    id: "probation-declaration",
    name: "Probation Declaration",
    nameTamil: "தகுதிகாண் அறிவிப்பு",
    category: "Service",
    description: "Declaration form after completing probation period",
    whereToGet: "From your Department Head Office",
    whereToGetType: "department",
  },
  // Loan Forms
  {
    id: "hba-application",
    name: "House Building Advance",
    nameTamil: "வீட்டுக்கடன் விண்ணப்பம்",
    category: "Loan",
    description: "Application for house building advance from government",
    whereToGet: "District Treasury Office",
    whereToGetType: "office",
  },
  {
    id: "vehicle-loan",
    name: "Vehicle Loan Application",
    nameTamil: "வாகன கடன் விண்ணப்பம்",
    category: "Loan",
    description: "Application for two-wheeler/car advance",
    whereToGet: "District Treasury Office",
    whereToGetType: "office",
  },
  {
    id: "festival-advance",
    name: "Festival Advance",
    nameTamil: "பண்டிகை முன்பணம்",
    category: "Loan",
    description: "Application for festival advance (Diwali/Pongal)",
    whereToGet: "From your Drawing & Disbursing Officer (DDO)",
    whereToGetType: "office",
  },
  {
    id: "computer-advance",
    name: "Computer Advance",
    nameTamil: "கணினி முன்பணம்",
    category: "Loan",
    description: "Application for computer/laptop purchase advance",
    whereToGet: "District Treasury Office",
    whereToGetType: "office",
  },
];

const categories = ["All", "Leave", "GPF", "Transfer", "Pension", "Service", "Loan"];

function getWhereToGetIcon(type: Form["whereToGetType"]) {
  switch (type) {
    case "office":
      return <Building2 size={14} className="text-blue-500" />;
    case "portal":
      return <Globe size={14} className="text-green-500" />;
    case "department":
      return <MapPin size={14} className="text-purple-500" />;
  }
}

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.nameTamil.includes(searchQuery) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedForms = filteredForms.reduce((acc, form) => {
    if (!acc[form.category]) acc[form.category] = [];
    acc[form.category].push(form);
    return acc;
  }, {} as Record<string, Form[]>);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <FileText className="text-blue-600" size={28} />
            Forms Guide
          </h1>
          <p className="text-sm text-gray-500 tamil">படிவங்கள் வழிகாட்டி</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-tn-primary focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-tn-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="flex items-center gap-1.5">
          <Building2 size={14} className="text-blue-500" />
          <span className="text-gray-600">Office/Treasury</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe size={14} className="text-green-500" />
          <span className="text-gray-600">Online Portal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-purple-500" />
          <span className="text-gray-600">Department HQ</span>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>How to use:</strong> This guide lists common government forms and where to obtain them.
          Contact the specified office or portal to get the official form. Always verify you have the
          latest version before submission.
        </p>
      </div>

      {/* Forms List */}
      {Object.keys(groupedForms).length === 0 ? (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No forms found matching your search.</p>
        </div>
      ) : (
        Object.entries(groupedForms).map(([category, categoryForms]) => (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-semibold text-tn-text mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-tn-primary rounded-full"></span>
              {category} Forms
              <span className="text-sm font-normal text-gray-500">({categoryForms.length})</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {categoryForms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="font-medium text-tn-text">{form.name}</h3>
                    <p className="text-xs text-gray-500 tamil mb-2">{form.nameTamil}</p>
                    <p className="text-sm text-gray-600 mb-3">{form.description}</p>
                    <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2">
                      {getWhereToGetIcon(form.whereToGetType)}
                      <span className="text-gray-700">{form.whereToGet}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Footer Note */}
      <div className="mt-8 text-center border-t pt-6">
        <p className="text-sm text-gray-500">
          Need information about specific rules?{" "}
          <Link href="/go" className="text-tn-primary hover:underline">
            Browse Government Orders
          </Link>{" "}
          or check the{" "}
          <Link href="/faq" className="text-tn-primary hover:underline">
            FAQ section
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
