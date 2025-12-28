"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRightLeft, Info, CheckCircle, AlertCircle, FileText } from "lucide-react";

const deputationTypes = [
  {
    type: "Within State",
    typeTamil: "மாநிலத்திற்குள்",
    examples: ["DIET", "SCERT", "SSA/RMSA", "Directorate", "Other Departments"],
    tenure: "Initially 3 years, extendable up to 5 years",
    payProtection: "Full pay protection with deputation allowance",
  },
  {
    type: "Central Deputation",
    typeTamil: "மத்திய அரசு பணி நிலை",
    examples: ["KVS", "NVS", "CBSE", "NCERT", "Central Ministries"],
    tenure: "3-5 years as per central norms",
    payProtection: "Pay as per central pay + deputation allowance",
  },
  {
    type: "Foreign Service",
    typeTamil: "வெளிநாட்டு சேவை",
    examples: ["UN Agencies", "World Bank Projects", "International Organizations"],
    tenure: "As per project/agreement",
    payProtection: "As per terms of deputation",
  },
];

const eligibilityCriteria = [
  { criteria: "Minimum 5 years of regular service", critical: true },
  { criteria: "No major penalty in last 5 years", critical: true },
  { criteria: "Good APAR ratings (minimum 'Good')", critical: true },
  { criteria: "Vigilance clearance", critical: true },
  { criteria: "No court case pending related to service", critical: false },
  { criteria: "Physical fitness (for certain posts)", critical: false },
  { criteria: "Age limit as specified in notification", critical: true },
  { criteria: "Qualification matching the post requirement", critical: true },
];

const deputationProcess = [
  {
    step: 1,
    title: "Apply for NOC",
    description: "Submit application to your DDO/HM seeking No Objection Certificate for deputation.",
  },
  {
    step: 2,
    title: "Forward to Higher Office",
    description: "Application forwarded through DEO to Directorate for approval.",
  },
  {
    step: 3,
    title: "Vigilance Clearance",
    description: "Vigilance department verifies no pending cases or inquiries.",
  },
  {
    step: 4,
    title: "NOC Issue",
    description: "If approved, NOC issued by competent authority (Director/Secretary).",
  },
  {
    step: 5,
    title: "Apply to Borrowing Dept",
    description: "Apply to the organization where you want to go on deputation.",
  },
  {
    step: 6,
    title: "Selection & Joining",
    description: "After selection, relieving order issued and you join new organization.",
  },
];

const allowances = [
  {
    name: "Deputation Allowance",
    rate: "5% of basic pay (same station) / 10% (different station)",
    conditions: "Payable during entire deputation period",
  },
  {
    name: "Pay Protection",
    rate: "Last pay drawn + increments as due",
    conditions: "Increment in parent cadre continues",
  },
  {
    name: "TA/DA for Joining",
    rate: "As per TA rules",
    conditions: "For initial joining and return",
  },
  {
    name: "HRA",
    rate: "As applicable at deputation station",
    conditions: "May differ from parent station rate",
  },
];

const requiredDocuments = [
  "Application for NOC",
  "Service Certificate",
  "Last 5 years APARs",
  "Vigilance Clearance Certificate",
  "No Penalty Certificate",
  "Educational Qualification Certificates",
  "Caste Certificate (if applicable)",
  "Medical Fitness Certificate",
  "Joining Report format of borrowing organization",
];

export default function DeputationGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <ArrowRightLeft className="text-cyan-600" size={28} />
            Deputation Rules Guide
          </h1>
          <p className="text-sm text-gray-500 tamil">பணி நிலை மாற்ற விதிகள் வழிகாட்டி</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-cyan-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-cyan-800 font-medium">What is Deputation?</p>
            <p className="text-sm text-cyan-700 mt-1">
              Deputation is temporary transfer of a government employee to another department/organization
              while retaining the lien in parent department. The employee returns after deputation period.
            </p>
          </div>
        </div>
      </div>

      {/* Types of Deputation */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {deputationTypes.map((type) => (
          <div key={type.type} className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="font-semibold text-tn-text">{type.type}</h3>
            <p className="text-xs text-gray-500 tamil mb-2">{type.typeTamil}</p>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Examples:</p>
                <p className="text-gray-700">{type.examples.join(", ")}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Tenure:</p>
                <p className="text-gray-700">{type.tenure}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Pay:</p>
                <p className="text-cyan-600 font-medium">{type.payProtection}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Eligibility */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Eligibility Criteria</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {eligibilityCriteria.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 p-3 rounded-lg ${
                item.critical ? "bg-cyan-50" : "bg-gray-50"
              }`}
            >
              <CheckCircle size={16} className={item.critical ? "text-cyan-600" : "text-gray-400"} />
              <span className="text-sm">{item.criteria}</span>
              {item.critical && (
                <span className="text-xs bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded ml-auto">Required</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
          <FileText size={18} />
          Deputation Process
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deputationProcess.map((step) => (
            <div key={step.step} className="flex gap-3">
              <div className="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                {step.step}
              </div>
              <div>
                <h3 className="font-medium text-sm">{step.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allowances */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Pay & Allowances During Deputation</h2>
        <div className="space-y-3">
          {allowances.map((item) => (
            <div key={item.name} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{item.conditions}</p>
                </div>
                <span className="text-sm font-semibold text-cyan-600">{item.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required Documents */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Required Documents</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {requiredDocuments.map((doc, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <CheckCircle size={14} className="text-cyan-500" />
              <span className="text-sm">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} />
          Important Points
        </h3>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Lien in parent department is retained during deputation</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Deputation period counts for pension and increments</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Prior approval of parent department is mandatory</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Employee can request repatriation before tenure ends</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Promotion in parent cadre possible if eligible during deputation</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Cannot apply for another deputation while already on deputation</span>
          </li>
        </ul>
      </div>

      {/* FR/SR Reference */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Rule References
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Fundamental Rules:</p>
            <ul className="space-y-1">
              <li>• FR 9(7) - Definition of Foreign Service</li>
              <li>• FR 110-127 - Foreign Service rules</li>
              <li>• FR 15 - Pay during deputation</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">State Rules:</p>
            <ul className="space-y-1">
              <li>• TN FR/SR for state employees</li>
              <li>• Specific GOs for education department</li>
              <li>• Central Staffing Scheme for central deputation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/transfer-rules" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Transfer Rules
        </Link>
        <Link href="/tools/document-checklists" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Document Checklists
        </Link>
        <Link href="/tools/promotion-info" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Promotion Info
        </Link>
      </div>
    </div>
  );
}
