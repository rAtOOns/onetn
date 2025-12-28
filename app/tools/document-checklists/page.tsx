"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileCheck, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from "lucide-react";

const documentChecklists = [
  {
    id: "joining",
    title: "New Joining Documents",
    titleTamil: "புதிய சேர்க்கை ஆவணங்கள்",
    icon: "📋",
    documents: [
      { name: "Appointment Order (Original + 2 copies)", critical: true },
      { name: "Educational Certificates (SSLC, HSC, Degree, B.Ed)", critical: true },
      { name: "Community Certificate", critical: true },
      { name: "Transfer Certificate from last institution", critical: true },
      { name: "Date of Birth Proof (Birth Certificate/SSLC)", critical: true },
      { name: "Passport size photos (10 copies)", critical: false },
      { name: "Aadhar Card copy", critical: true },
      { name: "PAN Card copy", critical: true },
      { name: "Bank Passbook first page copy", critical: true },
      { name: "Medical Fitness Certificate", critical: true },
      { name: "Character Certificate from gazetted officer", critical: false },
      { name: "Previous Employment Certificate (if any)", critical: false },
      { name: "Joining Report (format from office)", critical: true },
      { name: "Declaration of assets and liabilities", critical: false },
      { name: "Oath of allegiance", critical: true },
    ],
  },
  {
    id: "promotion",
    title: "Promotion Documents",
    titleTamil: "பதவி உயர்வு ஆவணங்கள்",
    icon: "📈",
    documents: [
      { name: "Promotion Order (Original)", critical: true },
      { name: "Pay Fixation Option Form", critical: true },
      { name: "Last 5 years APARs (Good/Outstanding)", critical: true },
      { name: "No Disciplinary Action Certificate", critical: true },
      { name: "Clearance from Vigilance", critical: true },
      { name: "Service Register extract", critical: true },
      { name: "Probation Declaration Certificate", critical: true },
      { name: "Confirmation Order copy", critical: true },
      { name: "Training completion certificates (if any)", critical: false },
      { name: "Relieving Order from present post", critical: true },
      { name: "Joining Report in new post", critical: true },
    ],
  },
  {
    id: "transfer",
    title: "Transfer Documents",
    titleTamil: "இடமாற்ற ஆவணங்கள்",
    icon: "🔄",
    documents: [
      { name: "Transfer Order copy", critical: true },
      { name: "Relieving Order from present school", critical: true },
      { name: "Last Pay Certificate (LPC)", critical: true },
      { name: "Service Register", critical: true },
      { name: "Leave account statement", critical: true },
      { name: "GPF/NPS passbook", critical: true },
      { name: "No Dues Certificate", critical: true },
      { name: "Charge handing over certificate", critical: true },
      { name: "Stock verification certificate (if applicable)", critical: false },
      { name: "Library books return certificate", critical: false },
      { name: "Joining Report at new place", critical: true },
    ],
  },
  {
    id: "retirement",
    title: "Retirement Documents",
    titleTamil: "ஓய்வு ஆவணங்கள்",
    icon: "🎉",
    documents: [
      { name: "Service Register (verified & complete)", critical: true },
      { name: "Last Pay Certificate", critical: true },
      { name: "No Dues Certificate", critical: true },
      { name: "Pension Application Form", critical: true },
      { name: "Gratuity Application Form", critical: true },
      { name: "Commutation Application (if opted)", critical: false },
      { name: "GPF Final Withdrawal Form / NPS Exit Form", critical: true },
      { name: "Family Details Form", critical: true },
      { name: "Nominee Declaration for pension", critical: true },
      { name: "Joint Photo with spouse", critical: true },
      { name: "Bank Account details (Pension)", critical: true },
      { name: "Identity Card surrender", critical: false },
      { name: "Life Certificate format", critical: true },
      { name: "Medical Certificate (if medical pension)", critical: false },
      { name: "Earned Leave encashment form", critical: true },
    ],
  },
  {
    id: "loan",
    title: "Loan Application Documents",
    titleTamil: "கடன் விண்ணப்ப ஆவணங்கள்",
    icon: "🏠",
    documents: [
      { name: "Loan Application Form", critical: true },
      { name: "Salary Certificate", critical: true },
      { name: "Last 3 months pay slips", critical: true },
      { name: "Service Certificate", critical: true },
      { name: "No Objection Certificate from DDO", critical: true },
      { name: "GPF Account Statement", critical: true },
      { name: "Property documents (for HBA)", critical: true },
      { name: "Construction estimate (for HBA)", critical: false },
      { name: "Surety bond (for certain loans)", critical: false },
      { name: "Previous loan clearance certificate", critical: true },
      { name: "Aadhar & PAN copies", critical: true },
    ],
  },
  {
    id: "ltc",
    title: "LTC Claim Documents",
    titleTamil: "விடுப்பு பயண சலுகை ஆவணங்கள்",
    icon: "✈️",
    documents: [
      { name: "LTC Application Form (advance)", critical: true },
      { name: "LTC Claim Form (final)", critical: true },
      { name: "Leave Sanction Order", critical: true },
      { name: "Original travel tickets", critical: true },
      { name: "Boarding passes (for air travel)", critical: true },
      { name: "Family details declaration", critical: true },
      { name: "Certificate of visit to hometown", critical: true },
      { name: "Certificate from school (for children)", critical: false },
      { name: "Hotel bills (if applicable)", critical: false },
      { name: "Self-declaration for expenses", critical: true },
    ],
  },
  {
    id: "medical",
    title: "Medical Reimbursement Documents",
    titleTamil: "மருத்துவ செலவு திரும்பப்பெறல் ஆவணங்கள்",
    icon: "🏥",
    documents: [
      { name: "Medical Claim Form", critical: true },
      { name: "Original hospital bills", critical: true },
      { name: "Original medicine bills", critical: true },
      { name: "Doctor's prescription", critical: true },
      { name: "Discharge summary", critical: true },
      { name: "Investigation reports (lab, scan, etc.)", critical: true },
      { name: "Emergency certificate (if private hospital)", critical: true },
      { name: "Essentiality certificate (for certain items)", critical: false },
      { name: "Referral letter (if specialist)", critical: false },
      { name: "NHIS non-coverage certificate", critical: false },
    ],
  },
  {
    id: "deputation",
    title: "Deputation Documents",
    titleTamil: "பணி நியமன ஆவணங்கள்",
    icon: "🔀",
    documents: [
      { name: "Deputation Order", critical: true },
      { name: "Willingness letter", critical: true },
      { name: "NOC from parent department", critical: true },
      { name: "Service particulars", critical: true },
      { name: "APAR copies (last 5 years)", critical: true },
      { name: "Vigilance clearance", critical: true },
      { name: "Medical fitness certificate", critical: false },
      { name: "Relieving order", critical: true },
      { name: "Joining report at new office", critical: true },
      { name: "Pay protection order (if applicable)", critical: false },
    ],
  },
];

export default function DocumentChecklistsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>("joining");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const toggleItem = (checklistId: string, docIndex: number) => {
    const key = `${checklistId}-${docIndex}`;
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const getProgress = (checklistId: string, docs: { name: string; critical: boolean }[]) => {
    const checked = docs.filter((_, i) => checkedItems.has(`${checklistId}-${i}`)).length;
    return { checked, total: docs.length, percent: Math.round((checked / docs.length) * 100) };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <FileCheck className="text-teal-600" size={28} />
            Document Checklists
          </h1>
          <p className="text-sm text-gray-500 tamil">ஆவண சரிபார்ப்பு பட்டியல்கள்</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-teal-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-teal-800 font-medium">Complete Document Checklists</p>
            <p className="text-sm text-teal-700 mt-1">
              Select the relevant checklist for your requirement. Critical documents are marked in red.
              Keep photocopies of all documents for your records.
            </p>
          </div>
        </div>
      </div>

      {/* Checklists */}
      <div className="space-y-4">
        {documentChecklists.map((checklist) => {
          const progress = getProgress(checklist.id, checklist.documents);
          const isExpanded = expandedSection === checklist.id;

          return (
            <div key={checklist.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <button
                onClick={() => toggleSection(checklist.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{checklist.icon}</span>
                  <div className="text-left">
                    <h2 className="font-semibold text-tn-text">{checklist.title}</h2>
                    <p className="text-xs text-gray-500 tamil">{checklist.titleTamil}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{progress.checked}/{progress.total}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-teal-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${progress.percent}%` }}
                      ></div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 border-t">
                  <div className="space-y-2 mt-4">
                    {checklist.documents.map((doc, index) => {
                      const isChecked = checkedItems.has(`${checklist.id}-${index}`);
                      return (
                        <label
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-green-50"
                              : doc.critical
                              ? "bg-red-50 hover:bg-red-100"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleItem(checklist.id, index)}
                            className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span className={`flex-1 text-sm ${isChecked ? "line-through text-gray-500" : ""}`}>
                            {doc.name}
                          </span>
                          {doc.critical && !isChecked && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Critical</span>
                          )}
                          {isChecked && (
                            <CheckCircle size={16} className="text-green-600" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* General Tips */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3">General Tips</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Always keep 2-3 photocopies of all original documents</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Self-attest photocopies with signature, date, and &quot;True Copy&quot;</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Critical documents marked in red - submit these first</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Keep digital scans of all documents in cloud storage</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Verify all entries in Service Register are correct and attested</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/service-book-checklist" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Service Book Checklist
        </Link>
        <Link href="/tools/retirement-summary" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Retirement Summary
        </Link>
        <Link href="/forms" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Forms Guide
        </Link>
      </div>
    </div>
  );
}
