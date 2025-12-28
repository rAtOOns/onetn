"use client";

import Link from "next/link";
import { ArrowLeft, Monitor, Info, ExternalLink, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

const emisModules = [
  {
    name: "Student Module",
    nameTamil: "மாணவர் தொகுதி",
    icon: "👨‍🎓",
    features: [
      "Student enrollment & admission",
      "EMIS ID generation",
      "Student profile management",
      "Transfer Certificate (TC) generation",
      "Attendance tracking",
      "Scholarship eligibility check",
    ],
    url: "https://emis.tnschools.gov.in/",
  },
  {
    name: "Teacher Module",
    nameTamil: "ஆசிரியர் தொகுதி",
    icon: "👩‍🏫",
    features: [
      "Teacher profile & service details",
      "Leave application & approval",
      "Transfer request",
      "Attendance management",
      "Subject allocation",
      "Training records",
    ],
    url: "https://emis.tnschools.gov.in/",
  },
  {
    name: "School Module",
    nameTamil: "பள்ளி தொகுதி",
    icon: "🏫",
    features: [
      "School infrastructure details",
      "UDISE+ data entry",
      "Asset management",
      "Staff position & vacancy",
      "Enrollment statistics",
      "Recognition & affiliation",
    ],
    url: "https://emis.tnschools.gov.in/",
  },
  {
    name: "Payroll/IFHRMS",
    nameTamil: "சம்பள மேலாண்மை",
    icon: "💰",
    features: [
      "Monthly salary processing",
      "GPF/NPS management",
      "Leave encashment",
      "TA/DA claims",
      "Income tax calculation",
      "Pay slip download",
    ],
    url: "https://ifhrms.tn.gov.in/",
  },
];

const commonTasks = [
  {
    task: "Download Pay Slip",
    steps: [
      "Login to IFHRMS portal",
      "Go to Employee Self Service",
      "Click on Pay Slip",
      "Select Month & Year",
      "Download PDF",
    ],
    portal: "IFHRMS",
  },
  {
    task: "Apply for Leave",
    steps: [
      "Login to EMIS/IFHRMS",
      "Go to Leave Management",
      "Select Leave Type",
      "Enter dates and reason",
      "Submit for approval",
    ],
    portal: "EMIS/IFHRMS",
  },
  {
    task: "Update Student Data",
    steps: [
      "Login to EMIS",
      "Go to Student Module",
      "Search student by EMIS ID",
      "Edit required fields",
      "Save changes",
    ],
    portal: "EMIS",
  },
  {
    task: "Generate TC",
    steps: [
      "Login to EMIS",
      "Go to TC Generation",
      "Enter student EMIS ID",
      "Fill TC details",
      "Generate & Print",
    ],
    portal: "EMIS",
  },
  {
    task: "Mark Attendance",
    steps: [
      "Login to EMIS",
      "Go to Attendance Module",
      "Select Class & Date",
      "Mark Present/Absent",
      "Submit attendance",
    ],
    portal: "EMIS",
  },
  {
    task: "View Service Details",
    steps: [
      "Login to IFHRMS",
      "Go to Employee Self Service",
      "Click Service Book",
      "View/Download details",
    ],
    portal: "IFHRMS",
  },
];

const portalLinks = [
  {
    name: "EMIS Portal",
    url: "https://emis.tnschools.gov.in/",
    description: "Educational Management Information System",
  },
  {
    name: "IFHRMS Portal",
    url: "https://ifhrms.tn.gov.in/",
    description: "Integrated Financial & HR Management System",
  },
  {
    name: "TNDGE Portal",
    url: "https://www.dge.tn.gov.in/",
    description: "Directorate of Govt Examinations",
  },
  {
    name: "TNSCERT",
    url: "https://tnscert.org/",
    description: "State Council for Educational Research & Training",
  },
  {
    name: "Kalvi TV",
    url: "https://www.kalvitv.com/",
    description: "Educational TV Channel content",
  },
  {
    name: "DIKSHA",
    url: "https://diksha.gov.in/",
    description: "Digital learning platform",
  },
];

const troubleshooting = [
  {
    issue: "Unable to login",
    solutions: [
      "Clear browser cache and cookies",
      "Try incognito/private browsing mode",
      "Use Chrome browser (recommended)",
      "Reset password using 'Forgot Password'",
      "Contact DEO IT cell if issue persists",
    ],
  },
  {
    issue: "Page not loading",
    solutions: [
      "Check internet connection",
      "Try during non-peak hours (early morning)",
      "Disable ad-blockers and extensions",
      "Use stable WiFi instead of mobile data",
    ],
  },
  {
    issue: "Data not saving",
    solutions: [
      "Don't use back button - use menu navigation",
      "Fill all mandatory fields (marked with *)",
      "Check for validation errors",
      "Take screenshot before submitting",
    ],
  },
  {
    issue: "Pay slip not available",
    solutions: [
      "Check if salary processed for that month",
      "Verify employee ID is correct",
      "Contact DDO/office for treasury issues",
      "Try after 10th of next month",
    ],
  },
];

export default function EMISGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Monitor className="text-sky-600" size={28} />
            EMIS / Paymanager Guide
          </h1>
          <p className="text-sm text-gray-500 tamil">EMIS / சம்பள மேலாளர் வழிகாட்டி</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {portalLinks.slice(0, 4).map((portal) => (
          <a
            key={portal.name}
            href={portal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow text-center"
          >
            <p className="font-medium text-tn-text text-sm">{portal.name}</p>
            <ExternalLink size={14} className="mx-auto mt-2 text-gray-400" />
          </a>
        ))}
      </div>

      {/* Modules Overview */}
      <div className="space-y-4 mb-8">
        <h2 className="font-semibold text-tn-text text-lg">Portal Modules</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {emisModules.map((module) => (
            <div key={module.name} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 bg-sky-50 border-b flex items-center gap-3">
                <span className="text-2xl">{module.icon}</span>
                <div>
                  <h3 className="font-medium text-tn-text">{module.name}</h3>
                  <p className="text-xs text-gray-500 tamil">{module.nameTamil}</p>
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-1">
                  {module.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Tasks */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
          <BookOpen size={18} />
          Step-by-Step Guides
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {commonTasks.map((item) => (
            <div key={item.task} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm text-tn-text">{item.task}</h3>
                <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded">{item.portal}</span>
              </div>
              <ol className="space-y-1">
                {item.steps.map((step, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="w-4 h-4 bg-sky-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-amber-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          Common Issues & Solutions
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {troubleshooting.map((item) => (
            <div key={item.issue} className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-amber-800 mb-2">{item.issue}</h4>
              <ul className="space-y-1">
                {item.solutions.map((solution, i) => (
                  <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                    <span>•</span>
                    {solution}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* All Portal Links */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h3 className="font-semibold text-tn-text mb-4">All Important Portals</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {portalLinks.map((portal) => (
            <a
              key={portal.name}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium text-sm text-tn-text">{portal.name}</p>
                <p className="text-xs text-gray-500">{portal.description}</p>
              </div>
              <ExternalLink size={14} className="text-gray-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Best Practices
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">For Smooth Usage:</p>
            <ul className="space-y-1">
              <li>• Use Google Chrome browser</li>
              <li>• Keep login credentials secure</li>
              <li>• Update profile information regularly</li>
              <li>• Take screenshots before submitting forms</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">For Data Entry:</p>
            <ul className="space-y-1">
              <li>• Double-check all entries before saving</li>
              <li>• Complete student data before 10th of month</li>
              <li>• Update attendance daily</li>
              <li>• Keep UDISE data current</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/pay-slip-decoder" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Pay Slip Decoder
        </Link>
        <Link href="/links" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          All Important Links
        </Link>
        <Link href="/forms" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Forms Guide
        </Link>
      </div>
    </div>
  );
}
