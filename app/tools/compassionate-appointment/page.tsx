"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Info, CheckCircle, AlertCircle, FileText } from "lucide-react";

const eligibleRelations = [
  { relation: "Spouse (Husband/Wife)", priority: 1, notes: "First priority if qualified" },
  { relation: "Son", priority: 2, notes: "If spouse not available/willing" },
  { relation: "Unmarried Daughter", priority: 2, notes: "Equal priority as son" },
  { relation: "Married Daughter", priority: 3, notes: "If son not available" },
  { relation: "Adopted Son/Daughter", priority: 4, notes: "Legally adopted children only" },
  { relation: "Brother (if dependent)", priority: 5, notes: "Only if wholly dependent" },
];

const eligibilityCriteria = [
  { criteria: "Employee died while in service", critical: true },
  { criteria: "Employee was in regular/permanent service", critical: true },
  { criteria: "Death not due to misconduct", critical: true },
  { criteria: "Application within 5 years of death", critical: true },
  { criteria: "Applicant is dependent on deceased", critical: true },
  { criteria: "Applicant meets minimum educational qualification for post", critical: true },
  { criteria: "Age limit: 18-40 years at time of application", critical: true },
  { criteria: "Applicant is unemployed", critical: false },
  { criteria: "No other family member already appointed on compassionate grounds", critical: true },
];

const applicationProcess = [
  {
    step: 1,
    title: "Death Certificate",
    description: "Obtain death certificate from local authorities immediately.",
  },
  {
    step: 2,
    title: "Collect Documents",
    description: "Gather all required documents including service records, family details.",
  },
  {
    step: 3,
    title: "Submit Application",
    description: "Submit application to DDO/HM within 5 years of employee's death.",
  },
  {
    step: 4,
    title: "Verification",
    description: "Application verified by DDO and forwarded to competent authority.",
  },
  {
    step: 5,
    title: "Committee Review",
    description: "Compassionate Appointment Committee reviews the case.",
  },
  {
    step: 6,
    title: "Appointment Order",
    description: "If approved, appointment order issued for suitable post.",
  },
];

const requiredDocuments = [
  "Application in prescribed format",
  "Death certificate of employee",
  "Service certificate of deceased employee",
  "Family member certificate from Tahsildar",
  "Income certificate of family",
  "Educational qualification certificates of applicant",
  "Age proof of applicant (SSLC/Birth certificate)",
  "Dependency certificate",
  "Legal heir certificate",
  "Ration card/Aadhar card of family",
  "Bank account details",
  "Passport size photographs",
  "Affidavit stating unemployment",
  "Marriage certificate (if spouse applying)",
];

const postCategories = [
  {
    category: "Group D (Class IV)",
    qualification: "8th Pass",
    examples: "Office Assistant, Watchman, Sweeper",
    notes: "Easiest to get",
  },
  {
    category: "Group C (Class III)",
    qualification: "10th/12th Pass",
    examples: "Junior Assistant, Typist, Record Clerk",
    notes: "Based on qualification",
  },
  {
    category: "Group B",
    qualification: "Graduate",
    examples: "Assistant, Accountant",
    notes: "If graduate and vacancy exists",
  },
  {
    category: "Teaching Posts",
    qualification: "B.Ed./D.T.Ed.",
    examples: "BT Assistant, Primary Teacher",
    notes: "Only if fully qualified",
  },
];

export default function CompassionateAppointmentPage() {
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
            Compassionate Appointment Guide
          </h1>
          <p className="text-sm text-gray-500 tamil">இரக்கப்படி நியமன வழிகாட்டி</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-rose-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-rose-800 font-medium">Compassionate Appointment</p>
            <p className="text-sm text-rose-700 mt-1">
              When a government employee dies while in service, one eligible family member can be appointed
              to a government job on compassionate grounds to support the family.
            </p>
          </div>
        </div>
      </div>

      {/* Eligible Relations */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Who Can Apply? (Priority Order)</h2>
        <div className="space-y-2">
          {eligibleRelations.map((item) => (
            <div key={item.relation} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {item.priority}
                </span>
                <span className="font-medium">{item.relation}</span>
              </div>
              <span className="text-sm text-gray-500">{item.notes}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility Criteria */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Eligibility Criteria</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {eligibilityCriteria.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 p-3 rounded-lg ${
                item.critical ? "bg-rose-50" : "bg-gray-50"
              }`}
            >
              <CheckCircle size={16} className={item.critical ? "text-rose-600" : "text-gray-400"} />
              <span className="text-sm">{item.criteria}</span>
              {item.critical && (
                <span className="text-xs bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded ml-auto">Required</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Post Categories */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Available Posts Based on Qualification</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {postCategories.map((cat) => (
            <div key={cat.category} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-tn-text">{cat.category}</h3>
              <p className="text-sm text-rose-600 mt-1">Requires: {cat.qualification}</p>
              <p className="text-sm text-gray-600 mt-1">Examples: {cat.examples}</p>
              <p className="text-xs text-gray-500 mt-1">{cat.notes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Application Process */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
          <FileText size={18} />
          Application Process
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applicationProcess.map((step) => (
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
          {requiredDocuments.map((doc, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <CheckCircle size={14} className="text-rose-500" />
              <span className="text-sm">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time Limits */}
      <div className="bg-amber-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} />
          Important Time Limits
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-700">
          <div>
            <p className="font-medium mb-2">Application Deadline:</p>
            <ul className="space-y-1">
              <li>• Within 5 years from date of death</li>
              <li>• Earlier application gets priority</li>
              <li>• Delay beyond 5 years - generally not considered</li>
              <li>• Relaxation possible in exceptional cases</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Age Limits:</p>
            <ul className="space-y-1">
              <li>• Minimum: 18 years at time of application</li>
              <li>• Maximum: 40 years (relaxable for SC/ST)</li>
              <li>• Minor children can apply when they turn 18</li>
              <li>• Age relaxation for physically handicapped</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Monetary Benefits Until Appointment */}
      <div className="bg-green-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-green-800 mb-3">Benefits Until Appointment</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
          <div>
            <p className="font-medium mb-2">Family Receives:</p>
            <ul className="space-y-1">
              <li>• Family Pension (30-50% of last pay)</li>
              <li>• Death Gratuity</li>
              <li>• GPF/NPS balance</li>
              <li>• Leave encashment</li>
              <li>• Group Insurance (TNGIS)</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">See Also:</p>
            <ul className="space-y-1">
              <li>• Die-in-Harness Benefits tool</li>
              <li>• Family Pension calculator</li>
              <li>• Ex-gratia payment details</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Important Notes
        </h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Compassionate appointment is not a right - it is subject to availability of posts</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Appointment is on ad-hoc basis initially, made regular after probation</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Only ONE family member can be appointed on compassionate grounds</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>If spouse is appointed, children cannot later claim appointment</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Post will be in the same district where deceased was working</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Appointee must pass probation like regular employees</span>
          </li>
        </ul>
      </div>

      {/* Rule References */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Rule References</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium mb-2">Government Orders:</p>
            <ul className="space-y-1">
              <li>• G.O. Ms. No. 87 (P&AR) dated 18.04.1977</li>
              <li>• Subsequent amendments</li>
              <li>• District-wise committee orders</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Contact:</p>
            <ul className="space-y-1">
              <li>• DDO of deceased employee&apos;s office</li>
              <li>• District Collector office</li>
              <li>• Directorate of School Education</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/die-in-harness" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Die-in-Harness Benefits
        </Link>
        <Link href="/tools/pension-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Family Pension Calculator
        </Link>
        <Link href="/tools/document-checklists" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Document Checklists
        </Link>
      </div>
    </div>
  );
}
