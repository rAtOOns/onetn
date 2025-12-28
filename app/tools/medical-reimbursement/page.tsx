"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Info, CheckCircle, AlertCircle, FileText } from "lucide-react";

const medicalCategories = [
  {
    name: "Indoor Treatment (Hospitalization)",
    nameTamil: "உள்நோயாளி சிகிச்சை",
    coverage: "Full reimbursement in government hospitals. Private hospital: As per CGHS/approved rates",
    documents: [
      "Medical claim form",
      "Original bills and receipts",
      "Discharge summary",
      "Doctor's prescription",
      "Investigation reports",
      "Emergency certificate (if applicable)",
    ],
    limit: "No upper limit for government hospitals. Private: As per approved rates",
  },
  {
    name: "Outdoor Treatment (OPD)",
    nameTamil: "வெளிநோயாளி சிகிச்சை",
    coverage: "Reimbursement for consultation, medicines, and tests",
    documents: [
      "Medical claim form",
      "Doctor's prescription",
      "Original bills (medicine, lab tests)",
      "Referral letter (for specialist)",
    ],
    limit: "Usually limited to approved rates",
  },
  {
    name: "Chronic Disease Treatment",
    nameTamil: "நீண்டகால நோய் சிகிச்சை",
    coverage: "Diabetes, Hypertension, Heart disease, Cancer, Kidney disease, etc.",
    documents: [
      "Medical claim form",
      "Specialist certificate confirming chronic condition",
      "Monthly prescription",
      "Medicine bills",
    ],
    limit: "Continuing treatment covered",
  },
  {
    name: "Emergency Treatment",
    nameTamil: "அவசர சிகிச்சை",
    coverage: "Any hospital including private in emergency. Later referral to govt hospital",
    documents: [
      "Emergency certificate from hospital",
      "Medical claim form",
      "All original bills",
      "Discharge summary",
      "Post-emergency referral (if continued in private)",
    ],
    limit: "Full coverage for genuine emergencies",
  },
];

const claimProcess = [
  {
    step: 1,
    title: "Get Treatment",
    description: "Seek treatment at government/recognized hospital. For emergency, any hospital is allowed.",
  },
  {
    step: 2,
    title: "Collect Documents",
    description: "Obtain all original bills, prescriptions, discharge summary, and investigation reports.",
  },
  {
    step: 3,
    title: "Fill Claim Form",
    description: "Complete the medical reimbursement claim form with all details.",
  },
  {
    step: 4,
    title: "Get Countersignature",
    description: "Get the form countersigned by your immediate superior/DDO.",
  },
  {
    step: 5,
    title: "Submit to Office",
    description: "Submit the claim with all documents to your office/treasury.",
  },
  {
    step: 6,
    title: "Receive Reimbursement",
    description: "Amount credited to salary account after verification (usually 2-3 months).",
  },
];

const eligibleFamily = [
  { member: "Self", eligible: true },
  { member: "Spouse", eligible: true },
  { member: "Dependent Children (unmarried)", eligible: true },
  { member: "Dependent Parents", eligible: true },
  { member: "Married Daughter", eligible: false },
  { member: "Employed Spouse", eligible: false },
];

export default function MedicalReimbursementPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Heart className="text-red-600" size={28} />
            Medical Reimbursement Guide
          </h1>
          <p className="text-sm text-gray-500 tamil">மருத்துவ செலவு திருப்பி வழிகாட்டி</p>
        </div>
      </div>

      {/* NHIS Info */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
          <Info size={18} />
          New Health Insurance Scheme (NHIS)
        </h3>
        <p className="text-sm text-red-700">
          TN Government employees are covered under NHIS with ₹150/month premium.
          This provides cashless treatment at empaneled hospitals. For non-empaneled hospitals,
          reimbursement claim is required.
        </p>
      </div>

      {/* Claim Process */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Claim Process</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {claimProcess.map((step) => (
            <div key={step.step} className="flex gap-3">
              <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
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

      {/* Coverage Categories */}
      <div className="space-y-4 mb-6">
        <h2 className="font-semibold text-tn-text">Coverage Categories</h2>
        {medicalCategories.map((category) => (
          <div key={category.name} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 bg-red-50 border-b">
              <h3 className="font-medium text-tn-text">{category.name}</h3>
              <p className="text-xs text-gray-500 tamil">{category.nameTamil}</p>
            </div>
            <div className="p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Coverage:</strong> {category.coverage}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Limit:</strong> {category.limit}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Documents:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {category.documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Eligible Family Members */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Eligible Family Members</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {eligibleFamily.map((item) => (
            <div
              key={item.member}
              className={`p-3 rounded-lg flex items-center gap-2 ${
                item.eligible ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              {item.eligible ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <AlertCircle size={16} className="text-gray-400" />
              )}
              <span className={`text-sm ${item.eligible ? "text-green-700" : "text-gray-500"}`}>
                {item.member}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recognized Hospitals */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Recognized Hospitals
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Full Reimbursement:</p>
            <ul className="space-y-1">
              <li>• Government hospitals (GH, Medical College)</li>
              <li>• ESI hospitals</li>
              <li>• Government medical college hospitals</li>
              <li>• PHC, CHC for minor treatments</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Partial/CGHS Rate Reimbursement:</p>
            <ul className="space-y-1">
              <li>• CGHS empaneled private hospitals</li>
              <li>• Hospitals approved by state government</li>
              <li>• Private hospitals in emergency (with certificate)</li>
            </ul>
          </div>
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
            <span>Claims must be submitted within 3 months of treatment completion</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>All bills must be original - photocopies not accepted</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>For treatment outside headquarters, prior permission needed except emergency</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Cosmetic treatments, vitamins, tonics generally not covered</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Advance can be taken for expensive treatments (surgery, etc.)</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Keep copies of all submitted documents for your record</span>
          </li>
        </ul>
      </div>

      {/* Claim Form Download */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-tn-text mb-3 flex items-center gap-2">
          <FileText size={18} />
          Required Forms
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Medical Reimbursement Claim Form</p>
            <p className="text-xs text-gray-500 mt-1">Main form for all claims</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Medical Advance Form</p>
            <p className="text-xs text-gray-500 mt-1">For advance before expensive treatment</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Emergency Treatment Certificate</p>
            <p className="text-xs text-gray-500 mt-1">For emergency treatment in private hospital</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Chronic Disease Certificate</p>
            <p className="text-xs text-gray-500 mt-1">For continuing treatment claims</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          * Forms available at your office or download from IFHRMS portal
        </p>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/loans-advances" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Medical Advance
        </Link>
        <Link href="/forms" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Forms Guide
        </Link>
        <Link href="/tools/pay-slip-decoder" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          NHIS Deduction
        </Link>
      </div>
    </div>
  );
}
