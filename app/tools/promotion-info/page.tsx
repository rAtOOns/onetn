"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, Info, CheckCircle, Clock, Award } from "lucide-react";

const teacherCadres = [
  {
    current: "Secondary Grade Teacher (SGT)",
    currentTamil: "இரண்டாம் நிலை ஆசிரியர்",
    payLevel: "Level 11 (₹35,400 - 1,12,400)",
    nextPromotion: "B.T. Assistant",
    eligibility: "5 years service + B.Ed qualification",
    mode: "By promotion through departmental exam",
  },
  {
    current: "B.T. Assistant",
    currentTamil: "பட்டதாரி ஆசிரியர்",
    payLevel: "Level 14 (₹47,600 - 1,51,100)",
    nextPromotion: "Post Graduate Assistant / Headmaster",
    eligibility: "5-8 years service",
    mode: "By promotion / Departmental exam",
  },
  {
    current: "Post Graduate Assistant (PG)",
    currentTamil: "முதுகலை ஆசிரியர்",
    payLevel: "Level 17 (₹56,100 - 1,77,500)",
    nextPromotion: "Headmaster / School Assistant",
    eligibility: "8 years service",
    mode: "By promotion based on seniority",
  },
  {
    current: "Headmaster (HM)",
    currentTamil: "தலைமையாசிரியர்",
    payLevel: "Level 20 (₹67,700 - 2,08,700)",
    nextPromotion: "District Educational Officer",
    eligibility: "As per vacancy and seniority",
    mode: "By promotion",
  },
];

const promotionCriteria = [
  {
    title: "Service Requirement",
    icon: Clock,
    points: [
      "Minimum 5-8 years in current post (varies by cadre)",
      "No break in service",
      "Satisfactory APAR for last 5 years",
    ],
  },
  {
    title: "Qualification",
    icon: Award,
    points: [
      "Required educational qualification for next post",
      "Departmental exam pass (if applicable)",
      "Computer literacy certificate (for some posts)",
    ],
  },
  {
    title: "Other Requirements",
    icon: CheckCircle,
    points: [
      "No pending disciplinary action",
      "No vigilance case pending",
      "Physical fitness (medical certificate)",
    ],
  },
];

export default function PromotionInfoPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <TrendingUp className="text-orange-600" size={28} />
            Promotion Information
          </h1>
          <p className="text-sm text-gray-500 tamil">பதவி உயர்வு தகவல்</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This is general information for reference only.
          Promotion rules, pay scales, and eligibility criteria are subject to change.
          Always refer to the latest Government Orders.
        </p>
      </div>

      {/* Teacher Cadre Hierarchy */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="font-semibold text-tn-text">Teacher Cadre - Promotion Hierarchy</h2>
          <p className="text-sm text-gray-500">School Education Department</p>
        </div>
        <div className="divide-y">
          {teacherCadres.map((cadre, idx) => (
            <div key={idx} className="p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-medium text-tn-text">{cadre.current}</h3>
                  <p className="text-xs text-gray-500 tamil">{cadre.currentTamil}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {cadre.payLevel}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="grid md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-500">Next Promotion:</span>
                    <span className="ml-2 font-medium text-green-700">{cadre.nextPromotion}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Mode:</span>
                    <span className="ml-2">{cadre.mode}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-500">Eligibility:</span>
                  <span className="ml-2 text-orange-700">{cadre.eligibility}</span>
                </div>
              </div>
              {idx < teacherCadres.length - 1 && (
                <div className="flex justify-center mt-3">
                  <div className="text-green-500">↓</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Promotion Criteria */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {promotionCriteria.map((criteria, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-2 text-orange-600 font-medium mb-3">
              <criteria.icon size={18} />
              {criteria.title}
            </div>
            <ul className="space-y-2 text-sm">
              {criteria.points.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Pay Fixation on Promotion */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Pay Fixation on Promotion</h2>
        <div className="text-sm text-gray-700 space-y-2">
          <p>When promoted to a higher post, pay is fixed as follows:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Find the next higher cell in the promoted pay level</li>
            <li>If existing pay matches a cell, move to next higher cell</li>
            <li>Minimum increment of 3% is ensured</li>
            <li>Date of next increment may change based on promotion date</li>
          </ol>
          <p className="mt-4 text-orange-700">
            <strong>Note:</strong> Use the Pay Fixation Calculator (coming soon) for exact calculation.
          </p>
        </div>
      </div>

      {/* Departmental Exams */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Departmental Examinations
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>TRB conducts:</strong> TET, PG TRB, and other recruitment exams
          </p>
          <p>
            <strong>TNPSC conducts:</strong> Departmental exams for promotion in various services
          </p>
          <p>
            <strong>When to Apply:</strong> Check TNPSC/TRB websites for notifications.
            Usually announced 2-3 months before exam.
          </p>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-purple-50 rounded-xl p-6">
        <h3 className="font-semibold text-purple-800 mb-3">Important Notes</h3>
        <ul className="space-y-2 text-sm text-purple-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Promotion is not automatic - depends on vacancy and seniority</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Keep your service book updated with all entries</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Submit APAR on time every year</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Acquire additional qualifications for better prospects</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Check seniority list published by department annually</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/pay-matrix" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Pay Matrix
        </Link>
        <Link href="/tools/increment-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Increment Calculator
        </Link>
        <Link href="/exams" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Exam Calendar
        </Link>
      </div>
    </div>
  );
}
