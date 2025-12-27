"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Info, CheckCircle } from "lucide-react";

interface LeaveType {
  name: string;
  nameTamil: string;
  credit: string;
  accumulation: string;
  rules: string[];
  color: string;
}

const leaveTypes: LeaveType[] = [
  {
    name: "Casual Leave (CL)",
    nameTamil: "தற்செயல் விடுப்பு",
    credit: "12 days per year",
    accumulation: "Cannot be accumulated. Lapses at year end.",
    rules: [
      "Maximum 12 days in a calendar year",
      "Can be combined with Sundays/holidays (prefix/suffix)",
      "Cannot be combined with any other leave type",
      "Half-day CL is allowed",
      "Prior approval required (except emergency)",
      "Cannot exceed 5 days at a stretch (with holidays)",
    ],
    color: "bg-blue-500",
  },
  {
    name: "Earned Leave (EL)",
    nameTamil: "ஈட்டிய விடுப்பு",
    credit: "15 days per year (30 for vacation staff)",
    accumulation: "Maximum 300 days",
    rules: [
      "Credited on January 1st and July 1st (half-yearly)",
      "1.5 days per month for non-vacation staff",
      "Can be accumulated up to 300 days",
      "Encashable at retirement (max 300 days)",
      "Prior sanction required",
      "Can be combined with other leaves",
      "Minimum 3 days EL should be availed at a time",
    ],
    color: "bg-green-500",
  },
  {
    name: "Half Pay Leave (HPL)",
    nameTamil: "அரை ஊதிய விடுப்பு",
    credit: "20 days per year",
    accumulation: "Can be accumulated without limit",
    rules: [
      "Credited on January 1st each year",
      "20 days per year of service",
      "Can be commuted to full pay with Medical Certificate",
      "Commuted leave = 2 HPL for 1 day full pay",
      "Can be encashed at retirement (max 180 days)",
      "No limit on accumulation",
    ],
    color: "bg-yellow-500",
  },
  {
    name: "Medical Leave (ML)",
    nameTamil: "மருத்துவ விடுப்பு",
    credit: "As per HPL balance",
    accumulation: "Drawn from HPL balance",
    rules: [
      "Requires Medical Certificate from authorized doctor",
      "For illness/medical treatment only",
      "Can be availed as full pay (commuted from HPL)",
      "2 HPL = 1 day Medical Leave with full pay",
      "Must be supported by medical documents",
    ],
    color: "bg-red-500",
  },
  {
    name: "Maternity Leave",
    nameTamil: "மகப்பேறு விடுப்பு",
    credit: "180 days",
    accumulation: "Not applicable",
    rules: [
      "180 days for first two children",
      "90 days from third child onwards",
      "Full pay during maternity leave",
      "Can be combined with other leaves",
      "Miscarriage: 45 days leave",
      "Can commence 6 weeks before expected delivery",
    ],
    color: "bg-pink-500",
  },
  {
    name: "Paternity Leave",
    nameTamil: "தந்தைவழி விடுப்பு",
    credit: "15 days",
    accumulation: "Not applicable",
    rules: [
      "15 days for birth of child",
      "Available for first two children",
      "To be availed within 6 months of child birth",
      "Full pay during paternity leave",
    ],
    color: "bg-indigo-500",
  },
  {
    name: "Special Casual Leave",
    nameTamil: "சிறப்பு தற்செயல் விடுப்பு",
    credit: "Varies by purpose",
    accumulation: "Not applicable",
    rules: [
      "For blood/organ donation: 1 day",
      "For participating in sports: As required",
      "For family planning operations",
      "For exam duty: Actual exam days",
      "For natural calamities: As sanctioned",
    ],
    color: "bg-purple-500",
  },
  {
    name: "Compensatory Off (CO)",
    nameTamil: "ஈடுசெய் விடுப்பு",
    credit: "Equal to duty days",
    accumulation: "Must be availed within 30 days",
    rules: [
      "For working on holidays/Sundays",
      "Must be availed within 30 days",
      "Prior sanction for working on holiday required",
      "Cannot be accumulated beyond 30 days",
    ],
    color: "bg-teal-500",
  },
  {
    name: "Leave Not Due (LND)",
    nameTamil: "கடன் விடுப்பு",
    credit: "Max 360 days in service",
    accumulation: "Not applicable",
    rules: [
      "When all leave balances exhausted",
      "Maximum 90 days at a time",
      "Maximum 360 days in entire service",
      "Granted only for medical grounds",
      "Half pay during LND",
      "Recovery from future HPL credits",
    ],
    color: "bg-gray-500",
  },
  {
    name: "Study Leave",
    nameTamil: "கல்வி விடுப்பு",
    credit: "Max 24 months",
    accumulation: "Not applicable",
    rules: [
      "For higher studies/research",
      "Minimum 5 years of service required",
      "Maximum 24 months in entire career",
      "Bond required to serve after return",
      "Full pay or half pay based on approval",
    ],
    color: "bg-orange-500",
  },
];

// Vacation rules for teachers
const vacationRules = [
  { period: "Summer Vacation", days: "30-45 days (April-May)", note: "For teaching staff only" },
  { period: "Pongal Vacation", days: "12-15 days (January)", note: "For school students and teachers" },
  { period: "Dussehra/Deepavali", days: "10-12 days (October)", note: "Mid-term vacation" },
  { period: "Christmas Vacation", days: "10-12 days (December)", note: "For school students and teachers" },
];

export default function LeaveRulesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <FileText className="text-teal-600" size={28} />
            Leave Rules Reference
          </h1>
          <p className="text-sm text-gray-500 tamil">விடுப்பு விதிகள் குறிப்பு</p>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white mb-6">
        <h2 className="font-bold text-lg mb-4">Annual Leave Entitlement Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm opacity-90">CL/Year</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">15</p>
            <p className="text-sm opacity-90">EL/Year</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">20</p>
            <p className="text-sm opacity-90">HPL/Year</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">300</p>
            <p className="text-sm opacity-90">Max EL</p>
          </div>
        </div>
      </div>

      {/* Leave Types */}
      <div className="space-y-4">
        {leaveTypes.map((leave, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className={`${leave.color} px-4 py-3 text-white`}>
              <h3 className="font-bold">{leave.name}</h3>
              <p className="text-sm opacity-90 tamil">{leave.nameTamil}</p>
            </div>
            <div className="p-4">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase">Credit</p>
                  <p className="font-medium text-tn-text">{leave.credit}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase">Accumulation</p>
                  <p className="font-medium text-tn-text">{leave.accumulation}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Rules & Conditions:</p>
                <ul className="space-y-1">
                  {leave.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vacation Rules for Teachers */}
      <div className="mt-8 bg-orange-50 rounded-xl p-6">
        <h3 className="font-semibold text-orange-800 mb-4 flex items-center gap-2">
          <FileText size={18} />
          Vacation Rules (Education Department)
        </h3>
        <div className="space-y-3">
          {vacationRules.map((vacation, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-tn-text">{vacation.period}</p>
                <p className="text-xs text-gray-500">{vacation.note}</p>
              </div>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {vacation.days}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Important Notes
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Leave Year:</strong> Calendar year (January to December) for CL. Financial year for EL calculation.</p>
          <p><strong>Vacation Staff:</strong> Teachers get 30 days EL per year (instead of 15) but cannot avail during term time.</p>
          <p><strong>Probationers:</strong> CL only during probation. EL credited after confirmation.</p>
          <p><strong>Joining Time:</strong> 1 day for first 500 km, additional day per 500 km (max 10 days).</p>
          <p><strong>Leave Surrender:</strong> EL can be surrendered for cash (subject to limits and conditions).</p>
        </div>
      </div>

      {/* Reference */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Reference: Tamil Nadu Leave Rules, 1933 (as amended)</p>
        <p className="tamil">குறிப்பு: தமிழ்நாடு விடுப்பு விதிகள், 1933</p>
      </div>
    </div>
  );
}
