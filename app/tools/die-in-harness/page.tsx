"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Info, CheckCircle, AlertCircle, FileText, Phone } from "lucide-react";

const familyBenefits = [
  {
    benefit: "Family Pension",
    benefitTamil: "குடும்ப ஓய்வூதியம்",
    description: "Monthly pension to surviving spouse/family",
    details: [
      "30% of last basic pay (ordinary rate) OR",
      "50% of last basic pay (enhanced rate for 7 years or till remarriage)",
      "Minimum: ₹9,000/month, Maximum: 30% of highest pay in Govt",
      "Payable to spouse, then dependent children, then dependent parents",
    ],
    amount: "30-50% of last pay",
  },
  {
    benefit: "Death Gratuity",
    benefitTamil: "இறப்பு கிருபைத்தொகை",
    description: "Lump sum payment to family",
    details: [
      "Less than 1 year service: 2 × Basic Pay",
      "1-5 years: 6 × Basic Pay",
      "5-11 years: 12 × Basic Pay",
      "11-20 years: 20 × Basic Pay",
      "20+ years: Half of emoluments for each completed 6-month period (max 33 times)",
      "Maximum: ₹20 lakhs",
    ],
    amount: "Up to ₹20 lakhs",
  },
  {
    benefit: "GPF Balance",
    benefitTamil: "GPF இருப்பு",
    description: "Full GPF accumulation with interest",
    details: [
      "Complete GPF balance payable to nominee/family",
      "Includes employer and employee contributions",
      "Interest up to date of payment",
      "No deductions or loans adjusted",
    ],
    amount: "Full balance",
  },
  {
    benefit: "Earned Leave Encashment",
    benefitTamil: "சம்பாதித்த விடுப்பு பணமாக்கல்",
    description: "Cash equivalent of unutilized EL",
    details: [
      "Maximum 300 days EL can be encashed",
      "Calculated on last basic pay + DA",
      "Payable to family/nominee",
    ],
    amount: "Up to 300 days",
  },
  {
    benefit: "Compassionate Appointment",
    benefitTamil: "இரக்க அடிப்படையில் நியமனம்",
    description: "Job to eligible family member",
    details: [
      "One dependent family member eligible",
      "Must meet minimum qualification (10th pass)",
      "Age limit: 18-35 years",
      "Appointment in Group C/D posts",
      "Application within 5 years of death",
    ],
    amount: "Government job",
  },
  {
    benefit: "Group Insurance",
    benefitTamil: "குழு காப்பீடு",
    description: "TNGEA/TNTEA Group Insurance amount",
    details: [
      "Amount varies by scheme joined",
      "Payable to nominee",
      "Additional benefits from department schemes",
    ],
    amount: "As per scheme",
  },
  {
    benefit: "Ex-gratia Payment",
    benefitTamil: "பரிவுத்தொகை",
    description: "Special payment in certain cases",
    details: [
      "If death due to duty (accident, attack, etc.)",
      "Additional ex-gratia from Chief Minister's fund",
      "Special compensation for terrorism/violence",
    ],
    amount: "Case-specific",
  },
];

const requiredDocuments = [
  { doc: "Death Certificate (Original + copies)", critical: true },
  { doc: "Service Register of deceased", critical: true },
  { doc: "Last Pay Certificate", critical: true },
  { doc: "GPF Nomination Form", critical: true },
  { doc: "Family Pension Application", critical: true },
  { doc: "Gratuity Application Form", critical: true },
  { doc: "Legal Heir Certificate / Succession Certificate", critical: true },
  { doc: "Family members details with age proof", critical: true },
  { doc: "Aadhar cards of family members", critical: true },
  { doc: "Bank account details of claimant", critical: true },
  { doc: "Passport photos of claimant", critical: false },
  { doc: "Marriage certificate", critical: false },
  { doc: "Children's birth certificates", critical: false },
  { doc: "Post-mortem report (if applicable)", critical: false },
  { doc: "FIR copy (if death due to accident)", critical: false },
];

const claimProcess = [
  {
    step: 1,
    title: "Immediate Steps",
    description: "Inform office immediately. Obtain death certificate from hospital/municipality.",
  },
  {
    step: 2,
    title: "Collect Documents",
    description: "Gather Service Register, GPF nomination, and all certificates from office.",
  },
  {
    step: 3,
    title: "Apply for Legal Heir",
    description: "Get Legal Heir Certificate from Revenue Department (takes 15-30 days).",
  },
  {
    step: 4,
    title: "Submit Applications",
    description: "Submit Family Pension, Gratuity, GPF, and EL encashment applications.",
  },
  {
    step: 5,
    title: "Compassionate Appointment",
    description: "If eligible, apply for compassionate appointment within timeline.",
  },
  {
    step: 6,
    title: "Follow Up",
    description: "Track applications. Family pension usually starts within 2-3 months.",
  },
];

export default function DieInHarnessPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Heart className="text-rose-600" size={28} />
            Die-in-Harness Benefits
          </h1>
          <p className="text-sm text-gray-500 tamil">பணியில் இறப்பு சலுகைகள்</p>
        </div>
      </div>

      {/* Sympathy Note */}
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-rose-800">
          This guide helps families of government employees understand the benefits and process
          when an employee passes away while in service. Our condolences to affected families.
        </p>
      </div>

      {/* Quick Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-3xl font-bold text-green-600">7</p>
          <p className="text-sm text-gray-600">Major Benefits</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">₹20L</p>
          <p className="text-sm text-gray-600">Max Gratuity</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">5 yrs</p>
          <p className="text-sm text-gray-600">Compassionate Appt Timeline</p>
        </div>
      </div>

      {/* Benefits List */}
      <div className="space-y-4 mb-8">
        <h2 className="font-semibold text-tn-text text-lg">Benefits Available</h2>
        {familyBenefits.map((benefit) => (
          <div key={benefit.benefit} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <div>
                <h3 className="font-medium text-tn-text">{benefit.benefit}</h3>
                <p className="text-xs text-gray-500 tamil">{benefit.benefitTamil}</p>
              </div>
              <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {benefit.amount}
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">{benefit.description}</p>
              <ul className="space-y-1">
                {benefit.details.map((detail, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Process */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
          <FileText size={18} />
          Claim Process
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {claimProcess.map((step) => (
            <div key={step.step} className="flex gap-3">
              <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
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

      {/* Required Documents */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Required Documents</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {requiredDocuments.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                item.critical ? "bg-red-50" : "bg-gray-50"
              }`}
            >
              <CheckCircle size={14} className={item.critical ? "text-red-500" : "text-gray-400"} />
              <span className="text-sm">{item.doc}</span>
              {item.critical && (
                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded ml-auto">Required</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Important Points */}
      <div className="bg-amber-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} />
          Important Points
        </h3>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Family pension continues to spouse till death/remarriage, then to dependent children</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Enhanced family pension (50%) is available for first 7 years or up to notional retirement date</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Compassionate appointment application must be made within 5 years of death</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>If both parents were government employees, children can get pension from both</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Legal Heir Certificate is essential - start this process immediately</span>
          </li>
        </ul>
      </div>

      {/* Helpline */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Phone size={18} />
          Helpline & Contacts
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">For Claims:</p>
            <ul className="space-y-1">
              <li>• Contact: DDO/Office where employee worked</li>
              <li>• AG Office for pension processing</li>
              <li>• Treasury for GPF matters</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">For Compassionate Appointment:</p>
            <ul className="space-y-1">
              <li>• DEO office for School Education</li>
              <li>• Respective department HR section</li>
              <li>• Check TN Govt website for latest GO</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/pension-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Pension Calculator
        </Link>
        <Link href="/tools/document-checklists" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Document Checklists
        </Link>
        <Link href="/tools/gpf-interest-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          GPF Calculator
        </Link>
      </div>
    </div>
  );
}
