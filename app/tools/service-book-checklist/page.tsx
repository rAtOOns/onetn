"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, AlertCircle, Info } from "lucide-react";

const serviceBookSections = [
  {
    section: "Personal Information",
    sectionTamil: "தனிப்பட்ட தகவல்கள்",
    items: [
      { id: "name", item: "Full Name (as per records)", critical: true },
      { id: "dob", item: "Date of Birth (with proof)", critical: true },
      { id: "community", item: "Community Certificate details", critical: true },
      { id: "qualification", item: "Educational Qualifications", critical: true },
      { id: "photo", item: "Photograph attested", critical: false },
      { id: "address", item: "Permanent Address", critical: false },
      { id: "nominee", item: "Nomination for Gratuity/GPF", critical: true },
    ],
  },
  {
    section: "Appointment Details",
    sectionTamil: "நியமன விவரங்கள்",
    items: [
      { id: "appointment-order", item: "Appointment Order number & date", critical: true },
      { id: "joining-date", item: "Date of Joining (first appointment)", critical: true },
      { id: "joining-report", item: "Joining Report copy", critical: true },
      { id: "probation", item: "Probation declaration", critical: true },
      { id: "confirmation", item: "Confirmation order", critical: true },
      { id: "medical", item: "Medical Fitness Certificate", critical: true },
      { id: "character", item: "Character & Antecedents verification", critical: true },
    ],
  },
  {
    section: "Pay & Allowances",
    sectionTamil: "ஊதியம் & படிகள்",
    items: [
      { id: "initial-pay", item: "Initial Pay fixation order", critical: true },
      { id: "increments", item: "All increment entries (yearly)", critical: true },
      { id: "pay-revision", item: "Pay revision fixation orders (5th, 6th, 7th CPC)", critical: true },
      { id: "promotion-pay", item: "Pay fixation on promotion", critical: true },
      { id: "aqpay", item: "AQ Pay / Special Pay entries", critical: false },
      { id: "da-arrears", item: "DA Arrears disbursement entries", critical: false },
    ],
  },
  {
    section: "Promotions & Transfers",
    sectionTamil: "பதவி உயர்வு & இடமாற்றம்",
    items: [
      { id: "promotion-orders", item: "All promotion orders", critical: true },
      { id: "transfer-orders", item: "All transfer orders", critical: true },
      { id: "relieving", item: "Relieving orders/reports", critical: true },
      { id: "joining-new", item: "Joining in new post/place", critical: true },
      { id: "charge-handing", item: "Charge handing over/taking over", critical: false },
    ],
  },
  {
    section: "Leave Record",
    sectionTamil: "விடுப்பு பதிவு",
    items: [
      { id: "el-balance", item: "Earned Leave balance (opening & closing)", critical: true },
      { id: "leave-availed", item: "All leave availed (CL, EL, ML, etc.)", critical: true },
      { id: "leave-encash", item: "Leave encashment entries", critical: true },
      { id: "ltc", item: "LTC availed details", critical: false },
      { id: "eol", item: "Extra Ordinary Leave (if any)", critical: true },
    ],
  },
  {
    section: "GPF/NPS Details",
    sectionTamil: "GPF/NPS விவரங்கள்",
    items: [
      { id: "gpf-number", item: "GPF/NPS Account Number", critical: true },
      { id: "gpf-nomination", item: "GPF/NPS Nomination", critical: true },
      { id: "gpf-loans", item: "GPF Loans/Advances taken", critical: true },
      { id: "gpf-withdrawal", item: "GPF Withdrawals", critical: false },
    ],
  },
  {
    section: "Other Important Entries",
    sectionTamil: "பிற முக்கிய பதிவுகள்",
    items: [
      { id: "apar", item: "APAR entries (last 5 years)", critical: true },
      { id: "awards", item: "Awards/Appreciation entries", critical: false },
      { id: "training", item: "Training/Courses attended", critical: false },
      { id: "disciplinary", item: "Disciplinary proceedings (if any)", critical: true },
      { id: "suspension", item: "Suspension period (if any)", critical: true },
      { id: "court-cases", item: "Court cases (if any)", critical: true },
    ],
  },
];

export default function ServiceBookChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalItems = serviceBookSections.reduce((acc, s) => acc + s.items.length, 0);
  const checkedCount = checkedItems.size;
  const criticalItems = serviceBookSections.reduce(
    (acc, s) => acc + s.items.filter((i) => i.critical).length,
    0
  );
  const criticalChecked = serviceBookSections.reduce(
    (acc, s) => acc + s.items.filter((i) => i.critical && checkedItems.has(i.id)).length,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <BookOpen className="text-amber-600" size={28} />
            Service Book Checklist
          </h1>
          <p className="text-sm text-gray-500 tamil">சேவை புத்தக சரிபார்ப்பு பட்டியல்</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Verification Progress</span>
          <span className="text-sm text-gray-500">{checkedCount} / {totalItems} items</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(checkedCount / totalItems) * 100}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className={criticalChecked === criticalItems ? "text-green-600" : "text-amber-600"}>
            Critical Items: {criticalChecked} / {criticalItems}
          </span>
          <button
            onClick={() => setCheckedItems(new Set())}
            className="text-gray-500 hover:text-gray-700"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-amber-800 font-medium">Why is Service Book Important?</p>
            <p className="text-sm text-amber-700 mt-1">
              Your Service Book is the official record of your entire career. All entries must be
              verified and attested. Missing or incorrect entries can delay retirement benefits.
              Check your service book at least once a year!
            </p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-6">
        {serviceBookSections.map((section) => (
          <div key={section.section} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold text-tn-text">{section.section}</h2>
              <p className="text-xs text-gray-500 tamil">{section.sectionTamil}</p>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {section.items.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      checkedItems.has(item.id)
                        ? "bg-green-50"
                        : item.critical
                        ? "bg-red-50 hover:bg-red-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className={`flex-1 text-sm ${checkedItems.has(item.id) ? "line-through text-gray-500" : ""}`}>
                      {item.item}
                    </span>
                    {item.critical && !checkedItems.has(item.id) && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Critical</span>
                    )}
                    {checkedItems.has(item.id) && (
                      <CheckCircle size={16} className="text-green-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Important Notes */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Important Guidelines
        </h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>All entries must be in ink (not pencil) and attested by competent authority</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>No overwriting allowed - corrections must be attested separately</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Get your Service Book verified at least 2 years before retirement</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Keep photocopies of all pages for your record</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Missing entries can be added with supporting documents</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Date of Birth entry is most critical - cannot be changed after 5 years of service</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/document-checklists" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Document Checklists
        </Link>
        <Link href="/tools/retirement-summary" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Retirement Summary
        </Link>
        <Link href="/tools/pension-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Pension Calculator
        </Link>
      </div>
    </div>
  );
}
