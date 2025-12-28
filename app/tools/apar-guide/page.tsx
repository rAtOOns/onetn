"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, Info, CheckCircle, AlertCircle, Star, FileText } from "lucide-react";

const aparSections = [
  {
    section: "Part I - Basic Information",
    items: ["Name, Designation, Place of posting", "Period of report", "Leave taken during year"],
    filledBy: "Establishment",
  },
  {
    section: "Part II - Self-Appraisal",
    items: ["Brief description of duties", "Achievements during the year", "Difficulties faced", "Training attended"],
    filledBy: "Employee",
  },
  {
    section: "Part III - Assessment",
    items: ["Work output", "Personal attributes", "Functional competency", "Overall grading"],
    filledBy: "Reporting Officer",
  },
  {
    section: "Part IV - Review",
    items: ["Review of reporting officer's assessment", "Final grading", "Integrity certificate"],
    filledBy: "Reviewing Officer",
  },
];

const gradingCriteria = [
  { grade: "Outstanding", score: "9-10", description: "Exceptional performance, exceeds all expectations" },
  { grade: "Very Good", score: "7-8", description: "Consistently above average performance" },
  { grade: "Good", score: "5-6", description: "Meets expectations, satisfactory performance" },
  { grade: "Average", score: "3-4", description: "Needs improvement in some areas" },
  { grade: "Below Average", score: "1-2", description: "Significant improvement needed" },
];

const selfAppraisalTips = [
  {
    category: "Duties Performed",
    tips: [
      "List all classes/subjects taught",
      "Mention administrative duties handled",
      "Include co-curricular activities organized",
      "Note special assignments completed",
    ],
  },
  {
    category: "Achievements",
    tips: [
      "Student pass percentage and improvements",
      "Board exam results if applicable",
      "Awards/recognition received",
      "Innovations in teaching methodology",
      "Research papers/publications",
      "Training programs conducted",
    ],
  },
  {
    category: "Difficulties Faced",
    tips: [
      "Infrastructure issues (if any)",
      "Student attendance challenges",
      "Resource constraints",
      "Be objective, don't complain excessively",
    ],
  },
  {
    category: "Training & Development",
    tips: [
      "In-service training attended",
      "Workshops/seminars participated",
      "Online courses completed",
      "Skills acquired",
    ],
  },
];

const commonMistakes = [
  "Submitting blank or incomplete self-appraisal",
  "Not mentioning specific achievements with numbers/data",
  "Being too modest about accomplishments",
  "Not maintaining records of achievements throughout the year",
  "Late submission of APAR",
  "Not reviewing the APAR before signing",
  "Ignoring adverse remarks without representation",
];

const timeline = [
  { month: "April 1", event: "APAR year begins" },
  { month: "March 31", event: "APAR year ends" },
  { month: "April 15", event: "Self-appraisal to be completed" },
  { month: "May 31", event: "Reporting Officer to complete Part III" },
  { month: "June 30", event: "Reviewing Officer to complete Part IV" },
  { month: "July 15", event: "Accepting Authority to record remarks" },
  { month: "August 31", event: "Disclosure to employee" },
];

export default function APARGuidePage() {
  const [activeSection, setActiveSection] = useState<string>("self-appraisal");

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <ClipboardList className="text-indigo-600" size={28} />
            APAR Self-Assessment Guide
          </h1>
          <p className="text-sm text-gray-500 tamil">APAR சுய மதிப்பீட்டு வழிகாட்டி</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-indigo-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-indigo-800 font-medium">Annual Performance Appraisal Report (APAR)</p>
            <p className="text-sm text-indigo-700 mt-1">
              APAR is crucial for promotions, transfers, and training nominations. A well-written
              self-appraisal can significantly impact your career progression.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "self-appraisal", label: "Self-Appraisal Tips" },
            { id: "sections", label: "APAR Sections" },
            { id: "grading", label: "Grading Criteria" },
            { id: "timeline", label: "Timeline" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === tab.id
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Self-Appraisal Tips */}
      {activeSection === "self-appraisal" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <Star size={18} className="text-amber-500" />
              How to Write Effective Self-Appraisal
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {selfAppraisalTips.map((category) => (
                <div key={category.category} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-indigo-600 mb-2">{category.category}</h3>
                  <ul className="space-y-1">
                    {category.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Phrases */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4">Sample Phrases for Self-Appraisal</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-700 mb-2">Good Examples</h3>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>&quot;Achieved 95% pass percentage in Class X, up from 88% last year&quot;</li>
                  <li>&quot;Conducted 5 science exhibitions involving 200+ students&quot;</li>
                  <li>&quot;Completed DIKSHA training modules on inclusive education&quot;</li>
                  <li>&quot;Mentored 3 new teachers in lesson planning&quot;</li>
                </ul>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-700 mb-2">Avoid These</h3>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>&quot;I taught my classes regularly&quot; (too vague)</li>
                  <li>&quot;I did my duty sincerely&quot; (no specifics)</li>
                  <li>&quot;Students like my teaching&quot; (no evidence)</li>
                  <li>&quot;I faced many problems&quot; (sounds like complaining)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="bg-amber-50 rounded-xl p-6">
            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <AlertCircle size={18} />
              Common Mistakes to Avoid
            </h3>
            <div className="grid md:grid-cols-2 gap-2">
              {commonMistakes.map((mistake, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-amber-700">
                  <span className="text-red-500">✗</span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* APAR Sections */}
      {activeSection === "sections" && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <FileText size={18} />
            APAR Structure
          </h2>
          <div className="space-y-4">
            {aparSections.map((section, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-tn-text">{section.section}</h3>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                    {section.filledBy}
                  </span>
                </div>
                <ul className="space-y-1">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grading Criteria */}
      {activeSection === "grading" && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4">Grading Criteria</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4">Grade</th>
                  <th className="text-left py-3 px-4">Score</th>
                  <th className="text-left py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {gradingCriteria.map((grade, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        grade.grade === "Outstanding" ? "text-green-600" :
                        grade.grade === "Very Good" ? "text-blue-600" :
                        grade.grade === "Good" ? "text-indigo-600" :
                        grade.grade === "Average" ? "text-amber-600" :
                        "text-red-600"
                      }`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{grade.score}</td>
                    <td className="py-3 px-4 text-gray-600">{grade.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> For promotions and deputation, minimum &quot;Good&quot; grade is usually required.
              &quot;Outstanding&quot; or &quot;Very Good&quot; for last 5 years gives priority in promotions.
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      {activeSection === "timeline" && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4">APAR Timeline</h2>
          <div className="relative">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  {i < timeline.length - 1 && <div className="w-0.5 h-full bg-indigo-200"></div>}
                </div>
                <div className="flex-1 pb-2">
                  <p className="font-medium text-indigo-600">{item.month}</p>
                  <p className="text-sm text-gray-600">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adverse Remarks */}
      <div className="mt-6 bg-red-50 rounded-xl p-6">
        <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} />
          Handling Adverse Remarks
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-red-700">
          <div>
            <p className="font-medium mb-2">Your Rights:</p>
            <ul className="space-y-1">
              <li>• Adverse remarks must be communicated to you</li>
              <li>• You have right to represent against them</li>
              <li>• Representation within 15 days of disclosure</li>
              <li>• Competent authority will review representation</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">How to Respond:</p>
            <ul className="space-y-1">
              <li>• Provide factual clarification</li>
              <li>• Attach supporting documents</li>
              <li>• Be professional, not emotional</li>
              <li>• Request expunction if unjustified</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Importance */}
      <div className="mt-6 bg-green-50 rounded-xl p-6">
        <h3 className="font-semibold text-green-800 mb-3">Why APAR Matters</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-green-700">
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium">Promotions</p>
            <p className="mt-1">Good APAR required for DPC consideration</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium">Deputation</p>
            <p className="mt-1">Last 5 years APAR checked for deputation</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium">Training</p>
            <p className="mt-1">Priority for training based on APAR</p>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/promotion-info" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Promotion Information
        </Link>
        <Link href="/tools/deputation-guide" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Deputation Guide
        </Link>
        <Link href="/tools/seniority-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Seniority Calculator
        </Link>
      </div>
    </div>
  );
}
