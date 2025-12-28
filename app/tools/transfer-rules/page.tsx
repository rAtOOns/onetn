"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRightLeft, Info, CheckCircle, AlertCircle, Calendar } from "lucide-react";

const transferRules = [
  {
    category: "General Transfer Guidelines",
    rules: [
      "Transfers are conducted annually through online counseling",
      "Employees must complete minimum 2-3 years at current station (varies by category)",
      "Transfer requests submitted through EMIS portal for teachers",
      "Priority given to employees with longer service at current station",
      "Mutual transfers allowed between consenting employees in same cadre",
    ],
  },
  {
    category: "Spouse Station Posting",
    rules: [
      "Both husband and wife should be government employees",
      "Request to be submitted with marriage certificate and spouse's posting order",
      "Subject to availability of vacancy at spouse's station",
      "Priority given during annual counseling",
    ],
  },
  {
    category: "Medical Grounds Transfer",
    rules: [
      "Valid medical certificate from government doctor required",
      "For chronic illness requiring specialized treatment",
      "Request considered on priority basis",
      "Medical board certificate may be required for serious cases",
    ],
  },
  {
    category: "Request Transfer (Own Request)",
    rules: [
      "Can be submitted during counseling window",
      "Subject to vacancy at requested location",
      "Lower priority than administrative transfers",
      "May require reason/justification",
    ],
  },
];

const counselingSteps = [
  { step: 1, title: "Notification", desc: "Department issues transfer counseling schedule" },
  { step: 2, title: "Online Application", desc: "Submit preferences through EMIS/Department portal" },
  { step: 3, title: "Verification", desc: "Documents verified by current office" },
  { step: 4, title: "Counseling", desc: "Attend counseling as per schedule (online/offline)" },
  { step: 5, title: "Allotment", desc: "Posting order issued based on vacancy and priority" },
  { step: 6, title: "Relieving", desc: "Get relieving order from current office" },
  { step: 7, title: "Joining", desc: "Join new office and submit joining report" },
];

export default function TransferRulesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <ArrowRightLeft className="text-indigo-600" size={28} />
            Transfer Rules & Process
          </h1>
          <p className="text-sm text-gray-500 tamil">இடமாற்ற விதிகள் மற்றும் நடைமுறை</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This is general information for reference only.
          Transfer rules may vary by department and are subject to change. Always refer to
          the latest Government Orders and department circulars.
        </p>
      </div>

      {/* Counseling Process */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-indigo-600" />
          Transfer Counseling Process
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
          <div className="space-y-4">
            {counselingSteps.map((item) => (
              <div key={item.step} className="flex items-start gap-4 relative">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                  {item.step}
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-tn-text">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transfer Rules by Category */}
      {transferRules.map((section, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            {section.category}
          </h2>
          <ul className="space-y-2">
            {section.rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-indigo-500 mt-1">•</span>
                <span className="text-gray-700">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Important Points */}
      <div className="bg-red-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} />
          Important Points to Remember
        </h3>
        <ul className="space-y-2 text-sm text-red-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Keep all documents (appointment order, joining reports, promotion orders) ready</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Service book should be up-to-date before applying</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>No pending disciplinary action should be there</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Check department-specific rules for minimum service requirement</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Administrative transfers are mandatory and cannot be refused</span>
          </li>
        </ul>
      </div>

      {/* Documents Needed */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Documents Required for Transfer
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">For All Transfers:</p>
            <ul className="space-y-1">
              <li>• Service certificate</li>
              <li>• Last 3 years APARs</li>
              <li>• No dues certificate</li>
              <li>• ID proof</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Additional (if applicable):</p>
            <ul className="space-y-1">
              <li>• Marriage certificate (spouse posting)</li>
              <li>• Medical certificate (medical grounds)</li>
              <li>• Spouse posting order (spouse posting)</li>
              <li>• Disability certificate (if applicable)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/links"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          EMIS Portal Link
        </Link>
        <Link
          href="/forms"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Transfer Forms
        </Link>
        <Link
          href="/go"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Related GOs
        </Link>
      </div>
    </div>
  );
}
