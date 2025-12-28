"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Download, Search, Filter } from "lucide-react";
import { useState } from "react";

interface Form {
  id: string;
  name: string;
  nameTamil: string;
  category: string;
  description: string;
  fileUrl: string;
  fileSize: string;
}

const forms: Form[] = [
  // Leave Forms
  {
    id: "cl-application",
    name: "Casual Leave Application",
    nameTamil: "தற்காலிக விடுப்பு விண்ணப்பம்",
    category: "Leave",
    description: "Application form for casual leave (CL)",
    fileUrl: "/forms/cl-application.pdf",
    fileSize: "45 KB",
  },
  {
    id: "el-application",
    name: "Earned Leave Application",
    nameTamil: "ஈட்டிய விடுப்பு விண்ணப்பம்",
    category: "Leave",
    description: "Application form for earned leave (EL)",
    fileUrl: "/forms/el-application.pdf",
    fileSize: "52 KB",
  },
  {
    id: "ml-application",
    name: "Medical Leave Application",
    nameTamil: "மருத்துவ விடுப்பு விண்ணப்பம்",
    category: "Leave",
    description: "Application form for medical leave with certificate",
    fileUrl: "/forms/ml-application.pdf",
    fileSize: "68 KB",
  },
  {
    id: "maternity-leave",
    name: "Maternity Leave Application",
    nameTamil: "மகப்பேறு விடுப்பு விண்ணப்பம்",
    category: "Leave",
    description: "Application for maternity leave (180 days)",
    fileUrl: "/forms/maternity-leave.pdf",
    fileSize: "55 KB",
  },
  // GPF Forms
  {
    id: "gpf-advance",
    name: "GPF Advance Application",
    nameTamil: "GPF முன்பணம் விண்ணப்பம்",
    category: "GPF",
    description: "Application for temporary advance from GPF",
    fileUrl: "/forms/gpf-advance.pdf",
    fileSize: "72 KB",
  },
  {
    id: "gpf-withdrawal",
    name: "GPF Final Withdrawal",
    nameTamil: "GPF இறுதி திரும்பப்பெறுதல்",
    category: "GPF",
    description: "Application for final withdrawal from GPF",
    fileUrl: "/forms/gpf-withdrawal.pdf",
    fileSize: "85 KB",
  },
  {
    id: "gpf-nomination",
    name: "GPF Nomination Form",
    nameTamil: "GPF வேட்பாளர் படிவம்",
    category: "GPF",
    description: "Nomination form for GPF account",
    fileUrl: "/forms/gpf-nomination.pdf",
    fileSize: "48 KB",
  },
  // Transfer Forms
  {
    id: "transfer-request",
    name: "Transfer Request Form",
    nameTamil: "இடமாற்றம் கோரிக்கை படிவம்",
    category: "Transfer",
    description: "Application for transfer request",
    fileUrl: "/forms/transfer-request.pdf",
    fileSize: "62 KB",
  },
  {
    id: "joining-report",
    name: "Joining Report",
    nameTamil: "பணியில் சேர்ந்த அறிக்கை",
    category: "Transfer",
    description: "Report to be submitted after joining new post",
    fileUrl: "/forms/joining-report.pdf",
    fileSize: "38 KB",
  },
  {
    id: "relieving-order",
    name: "Relieving Order Request",
    nameTamil: "விடுவிப்பு ஆணை கோரிக்கை",
    category: "Transfer",
    description: "Request for relieving order",
    fileUrl: "/forms/relieving-order.pdf",
    fileSize: "42 KB",
  },
  // Pension Forms
  {
    id: "pension-application",
    name: "Pension Application",
    nameTamil: "ஓய்வூதிய விண்ணப்பம்",
    category: "Pension",
    description: "Main application form for pension",
    fileUrl: "/forms/pension-application.pdf",
    fileSize: "125 KB",
  },
  {
    id: "family-pension",
    name: "Family Pension Application",
    nameTamil: "குடும்ப ஓய்வூதிய விண்ணப்பம்",
    category: "Pension",
    description: "Application for family pension",
    fileUrl: "/forms/family-pension.pdf",
    fileSize: "98 KB",
  },
  {
    id: "commutation-form",
    name: "Commutation Form",
    nameTamil: "ஓய்வூதிய மாற்று படிவம்",
    category: "Pension",
    description: "Form for pension commutation",
    fileUrl: "/forms/commutation-form.pdf",
    fileSize: "65 KB",
  },
  // Service Forms
  {
    id: "service-certificate",
    name: "Service Certificate Request",
    nameTamil: "பணிச்சான்றிதழ் கோரிக்கை",
    category: "Service",
    description: "Request for service certificate",
    fileUrl: "/forms/service-certificate.pdf",
    fileSize: "35 KB",
  },
  {
    id: "no-objection",
    name: "No Objection Certificate",
    nameTamil: "தடையின்மை சான்றிதழ்",
    category: "Service",
    description: "NOC application form",
    fileUrl: "/forms/noc-application.pdf",
    fileSize: "40 KB",
  },
  {
    id: "increment-form",
    name: "Increment Declaration",
    nameTamil: "ஊதிய உயர்வு அறிவிப்பு",
    category: "Service",
    description: "Annual increment declaration form",
    fileUrl: "/forms/increment-form.pdf",
    fileSize: "32 KB",
  },
  // Loan Forms
  {
    id: "hba-application",
    name: "House Building Advance",
    nameTamil: "வீட்டுக்கடன் விண்ணப்பம்",
    category: "Loan",
    description: "Application for house building advance",
    fileUrl: "/forms/hba-application.pdf",
    fileSize: "145 KB",
  },
  {
    id: "vehicle-loan",
    name: "Vehicle Loan Application",
    nameTamil: "வாகன கடன் விண்ணப்பம்",
    category: "Loan",
    description: "Application for vehicle loan (two-wheeler/car)",
    fileUrl: "/forms/vehicle-loan.pdf",
    fileSize: "88 KB",
  },
  {
    id: "festival-advance",
    name: "Festival Advance",
    nameTamil: "பண்டிகை முன்பணம்",
    category: "Loan",
    description: "Application for festival advance",
    fileUrl: "/forms/festival-advance.pdf",
    fileSize: "42 KB",
  },
];

const categories = ["All", "Leave", "GPF", "Transfer", "Pension", "Service", "Loan"];

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
            Forms Library
          </h1>
          <p className="text-sm text-gray-500 tamil">படிவங்கள் நூலகம்</p>
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

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> These are sample form templates. Download and verify with your
          department for the latest version. Some forms may require department-specific modifications.
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
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {categoryForms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-tn-text">{form.name}</h3>
                      <p className="text-xs text-gray-500 tamil mb-1">{form.nameTamil}</p>
                      <p className="text-sm text-gray-600">{form.description}</p>
                      <p className="text-xs text-gray-400 mt-2">Size: {form.fileSize}</p>
                    </div>
                    <a
                      href={form.fileUrl}
                      download
                      className="flex-shrink-0 p-2 bg-tn-primary text-white rounded-lg hover:bg-tn-highlight transition-colors"
                      title="Download"
                    >
                      <Download size={20} />
                    </a>
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
          Need a form that&apos;s not listed? Check the{" "}
          <Link href="/go" className="text-tn-primary hover:underline">
            Government Orders
          </Link>{" "}
          section for official forms attached to GOs.
        </p>
      </div>
    </div>
  );
}
