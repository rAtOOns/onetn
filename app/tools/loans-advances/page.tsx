"use client";

import Link from "next/link";
import { ArrowLeft, Landmark, Home, Car, Laptop, Gift, GraduationCap, Heart, Info, AlertCircle } from "lucide-react";

const loans = [
  {
    name: "House Building Advance (HBA)",
    nameTamil: "வீட்டு கட்டுமான முன்பணம்",
    icon: Home,
    color: "bg-blue-500",
    eligibility: "Permanent employees with 5+ years service",
    amount: "Based on pay level (usually 34 months basic pay or ₹25 lakhs, whichever is less)",
    interest: "Concessional rate (around 7.9%)",
    repayment: "Maximum 25 years or till retirement, whichever is earlier",
    purpose: "Construction, purchase, or repair of house",
    documents: ["Service certificate", "Salary certificate", "Property documents", "NOC from society (if applicable)", "Building plan approval"],
  },
  {
    name: "Motor Car Advance",
    nameTamil: "கார் முன்பணம்",
    icon: Car,
    color: "bg-green-500",
    eligibility: "Employees in pay level 6 and above with 3+ years service",
    amount: "Up to ₹3-5 lakhs (varies by state rules)",
    interest: "Around 11-12%",
    repayment: "60-80 months",
    purpose: "Purchase of new car",
    documents: ["Application form", "Salary certificate", "Quotation from dealer", "LIC policy assignment"],
  },
  {
    name: "Motor Cycle/Scooter Advance",
    nameTamil: "இரு சக்கர வாகன முன்பணம்",
    icon: Car,
    color: "bg-teal-500",
    eligibility: "All permanent employees with 1+ year service",
    amount: "Up to ₹80,000 - ₹1,00,000",
    interest: "Around 11-12%",
    repayment: "48-60 months",
    purpose: "Purchase of new two-wheeler",
    documents: ["Application form", "Salary certificate", "Quotation from dealer"],
  },
  {
    name: "Computer Advance",
    nameTamil: "கணினி முன்பணம்",
    icon: Laptop,
    color: "bg-purple-500",
    eligibility: "All permanent employees",
    amount: "Up to ₹50,000 - ₹80,000",
    interest: "Around 10-12%",
    repayment: "24-36 months",
    purpose: "Purchase of computer/laptop for official use",
    documents: ["Application form", "Quotation", "Declaration of official use"],
  },
  {
    name: "Festival Advance",
    nameTamil: "பண்டிகை முன்பணம்",
    icon: Gift,
    color: "bg-orange-500",
    eligibility: "All government employees",
    amount: "₹3,000 - ₹10,000",
    interest: "Interest-free",
    repayment: "10 monthly installments",
    purpose: "Diwali, Pongal festivals",
    documents: ["Simple application to DDO"],
  },
  {
    name: "Education Advance",
    nameTamil: "கல்வி முன்பணம்",
    icon: GraduationCap,
    color: "bg-indigo-500",
    eligibility: "For children's higher education",
    amount: "Varies based on course",
    interest: "Concessional rate",
    repayment: "After completion of course",
    purpose: "Professional courses, higher education",
    documents: ["Admission letter", "Fee structure", "Application form"],
  },
  {
    name: "Medical Advance",
    nameTamil: "மருத்துவ முன்பணம்",
    icon: Heart,
    color: "bg-red-500",
    eligibility: "For self/family member's treatment",
    amount: "Based on treatment cost",
    interest: "Interest-free",
    repayment: "After reimbursement or in installments",
    purpose: "Hospitalization, major treatment",
    documents: ["Medical estimate", "Doctor's recommendation", "Hospital details"],
  },
];

export default function LoansAdvancesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Landmark className="text-amber-600" size={28} />
            Loans & Advances Guide
          </h1>
          <p className="text-sm text-gray-500 tamil">கடன்கள் மற்றும் முன்பணங்கள் வழிகாட்டி</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This is general information for reference only.
          Loan amounts, interest rates, and eligibility criteria are subject to change.
          Always refer to the latest Government Orders and consult your DDO/Treasury.
        </p>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "HBA", value: "Up to ₹25L", color: "bg-blue-100 text-blue-700" },
          { label: "Car Advance", value: "Up to ₹5L", color: "bg-green-100 text-green-700" },
          { label: "Two-Wheeler", value: "Up to ₹1L", color: "bg-teal-100 text-teal-700" },
          { label: "Festival", value: "₹10,000", color: "bg-orange-100 text-orange-700" },
        ].map((item) => (
          <div key={item.label} className={`${item.color} rounded-lg p-3 text-center`}>
            <p className="text-xs font-medium">{item.label}</p>
            <p className="text-lg font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Loans List */}
      <div className="space-y-4">
        {loans.map((loan) => (
          <div key={loan.name} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 flex items-start gap-4">
              <div className={`${loan.color} p-3 rounded-lg text-white`}>
                <loan.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-tn-text">{loan.name}</h3>
                <p className="text-xs text-gray-500 tamil">{loan.nameTamil}</p>

                <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Eligibility:</span>
                    <p className="text-gray-700">{loan.eligibility}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <p className="text-gray-700">{loan.amount}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Interest:</span>
                    <p className="text-gray-700">{loan.interest}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Repayment:</span>
                    <p className="text-gray-700">{loan.repayment}</p>
                  </div>
                </div>

                <details className="mt-3">
                  <summary className="text-sm text-blue-600 cursor-pointer hover:underline">
                    View required documents
                  </summary>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1 pl-4">
                    {loan.documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GPF Advance Section */}
      <div className="mt-8 bg-emerald-50 rounded-xl p-6">
        <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
          <Landmark size={18} />
          GPF Advances (Non-Refundable & Refundable)
        </h3>
        <div className="text-sm text-emerald-700 space-y-2">
          <p>
            <strong>Refundable Advance:</strong> Up to 75% of balance at credit.
            Can be taken for specified purposes. Refundable in maximum 24 installments.
          </p>
          <p>
            <strong>Non-Refundable Withdrawal:</strong> After 15 years of service or within 10 years of retirement.
            For specified purposes like house construction, children&apos;s education/marriage, medical treatment.
          </p>
          <p>
            <strong>Interest:</strong> No interest charged on GPF advances (interest-free loan from your own account).
          </p>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-6 bg-red-50 rounded-xl p-6">
        <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} />
          Important Points
        </h3>
        <ul className="space-y-2 text-sm text-red-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Loan recovery starts from the next month after disbursal</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Cannot take same type of loan if previous one is pending</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>HBA requires mortgage of property to government</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Vehicle must be insured and hypothecated to government</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Outstanding loans are recovered from retirement benefits</span>
          </li>
        </ul>
      </div>

      {/* Where to Apply */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Where to Apply
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Festival Advance:</strong> Submit to your DDO (Drawing & Disbursing Officer)</p>
          <p><strong>GPF Advance:</strong> Apply through DDO to Treasury/AG Office</p>
          <p><strong>HBA, Vehicle, Computer Loans:</strong> Apply through DDO to District Treasury</p>
          <p><strong>Medical Advance:</strong> Apply to DDO with medical documents</p>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/loan-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          GPF Loan Calculator
        </Link>
        <Link href="/tools/gpf-interest-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          GPF Interest Calculator
        </Link>
        <Link href="/forms" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Loan Application Forms
        </Link>
      </div>
    </div>
  );
}
