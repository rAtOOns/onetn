"use client";

import Link from "next/link";
import { ArrowLeft, GraduationCap, Info, CheckCircle, AlertCircle, FileText } from "lucide-react";

const studyLeaveTypes = [
  {
    type: "Study Leave",
    typeTamil: "படிப்பு விடுப்பு",
    duration: "Up to 24 months (can be extended to 36 months)",
    pay: "Leave salary at 80% of pay for first 12 months, then as approved",
    eligibility: "5 years of continuous service",
    bond: "3 years service bond after return",
  },
  {
    type: "Special Study Leave",
    typeTamil: "சிறப்பு படிப்பு விடுப்பு",
    duration: "Up to 12 months",
    pay: "Half pay leave or as sanctioned",
    eligibility: "3 years of service",
    bond: "2 years service bond",
  },
  {
    type: "Sabbatical Leave",
    typeTamil: "கல்வி ஓய்வு",
    duration: "Up to 2 years",
    pay: "Without pay (lien retained)",
    eligibility: "7 years of service",
    bond: "As per terms",
  },
];

const eligibleCourses = [
  { course: "Ph.D. / Doctorate", approved: true, maxDuration: "36 months" },
  { course: "M.Phil.", approved: true, maxDuration: "18 months" },
  { course: "Post Graduate Degree (MA, M.Sc, M.Com)", approved: true, maxDuration: "24 months" },
  { course: "B.Ed. / M.Ed.", approved: true, maxDuration: "12-24 months" },
  { course: "Professional Courses (MBA, MCA)", approved: true, maxDuration: "24 months" },
  { course: "Foreign University Courses", approved: true, maxDuration: "As per course" },
  { course: "Research Projects", approved: true, maxDuration: "As approved" },
  { course: "Short-term Training (< 6 months)", approved: false, maxDuration: "Use Casual/Earned Leave" },
];

const applicationProcess = [
  {
    step: 1,
    title: "Get Admission",
    description: "Secure admission in the course/university first. Keep admission letter ready.",
  },
  {
    step: 2,
    title: "Apply to HM/Principal",
    description: "Submit study leave application with course details, duration, and university information.",
  },
  {
    step: 3,
    title: "Forward to DEO",
    description: "Application forwarded through proper channel to District Educational Officer.",
  },
  {
    step: 4,
    title: "Directorate Approval",
    description: "For leaves > 12 months, Director of School Education approval required.",
  },
  {
    step: 5,
    title: "Execute Bond",
    description: "Sign service bond agreeing to serve for specified period after return.",
  },
  {
    step: 6,
    title: "Proceed on Leave",
    description: "After approval, relieving order issued. Join the course.",
  },
];

const requiredDocuments = [
  "Application in prescribed format",
  "Admission letter from University/Institution",
  "Course syllabus and duration details",
  "Service certificate (minimum 5 years)",
  "Last 5 years APAR copies",
  "No Objection Certificate from DDO",
  "Vigilance clearance certificate",
  "Undertaking for service bond",
  "Leave account statement",
  "Medical fitness certificate (for foreign study)",
];

export default function StudyLeavePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <GraduationCap className="text-purple-600" size={28} />
            Study Leave Guide
          </h1>
          <p className="text-sm text-gray-500 tamil">படிப்பு விடுப்பு வழிகாட்டி</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-purple-800 font-medium">Study Leave for Higher Education</p>
            <p className="text-sm text-purple-700 mt-1">
              TN Government employees can avail study leave for pursuing higher education like Ph.D., M.Phil.,
              PG degrees etc. Leave salary is admissible. Service bond is mandatory after return.
            </p>
          </div>
        </div>
      </div>

      {/* Types of Study Leave */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {studyLeaveTypes.map((type) => (
          <div key={type.type} className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="font-semibold text-tn-text">{type.type}</h3>
            <p className="text-xs text-gray-500 tamil mb-3">{type.typeTamil}</p>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Duration:</p>
                <p className="text-gray-700">{type.duration}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Pay:</p>
                <p className="text-purple-600 font-medium">{type.pay}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Eligibility:</p>
                <p className="text-gray-700">{type.eligibility}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Bond:</p>
                <p className="text-amber-600">{type.bond}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Eligible Courses */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Eligible Courses</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {eligibleCourses.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-lg ${
                item.approved ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className={item.approved ? "text-green-600" : "text-gray-400"} />
                <span className="text-sm">{item.course}</span>
              </div>
              <span className="text-xs text-gray-500">{item.maxDuration}</span>
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
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
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
              <CheckCircle size={14} className="text-purple-500" />
              <span className="text-sm">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Salary Calculation */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Leave Salary During Study Leave</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-2 px-3">Period</th>
                <th className="text-left py-2 px-3">Leave Salary</th>
                <th className="text-left py-2 px-3">Conditions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-3">First 12 months</td>
                <td className="py-2 px-3 text-green-600 font-medium">80% of (Basic + DA)</td>
                <td className="py-2 px-3 text-gray-600">Automatic if eligible</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3">13-24 months</td>
                <td className="py-2 px-3 text-amber-600 font-medium">As sanctioned (usually 50%)</td>
                <td className="py-2 px-3 text-gray-600">Subject to approval</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3">Beyond 24 months</td>
                <td className="py-2 px-3 text-red-600 font-medium">Usually without pay</td>
                <td className="py-2 px-3 text-gray-600">For Ph.D. extension only</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Foreign Study</td>
                <td className="py-2 px-3 text-purple-600 font-medium">As per scholarship terms</td>
                <td className="py-2 px-3 text-gray-600">Scholarship + partial salary possible</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Bond */}
      <div className="bg-amber-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} />
          Service Bond Conditions
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-700">
          <div>
            <p className="font-medium mb-2">Bond Terms:</p>
            <ul className="space-y-1">
              <li>• Must serve 3 years after returning (2x leave period)</li>
              <li>• If resigned before bond period, repay leave salary</li>
              <li>• Interest at government rate on amount to be repaid</li>
              <li>• Bond executed before proceeding on leave</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Bond Amount:</p>
            <ul className="space-y-1">
              <li>• Total leave salary drawn during study leave</li>
              <li>• Plus any other allowances/expenses paid</li>
              <li>• Scholarship amount (if govt sponsored)</li>
              <li>• Pro-rata refund if partial bond period served</li>
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
            <span>Study leave is not a right - can be refused if exigencies of service require</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Course must be relevant to job or improve efficiency</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Only one study leave in entire service (usually)</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Increments continue during study leave period</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Must submit progress reports periodically</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Extension requires fresh application 3 months before leave ends</span>
          </li>
        </ul>
      </div>

      {/* Rule References */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Rule References</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium mb-2">Fundamental Rules:</p>
            <ul className="space-y-1">
              <li>• FR 84 - Study Leave</li>
              <li>• FR 85 - Study Leave conditions</li>
              <li>• Appendix 10 - Study Leave Rules</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">State Orders:</p>
            <ul className="space-y-1">
              <li>• TN FR applicable to state employees</li>
              <li>• Specific GOs for education department</li>
              <li>• UGC/AICTE guidelines for academic courses</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/leave-rules" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Leave Rules
        </Link>
        <Link href="/tools/eol-impact" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          EOL Impact
        </Link>
        <Link href="/tools/document-checklists" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Document Checklists
        </Link>
      </div>
    </div>
  );
}
