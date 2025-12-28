"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, Calculator, Info, Printer } from "lucide-react";

// Exam duty remuneration rates (approximate - may vary)
const examTypes = [
  {
    id: "sslc",
    name: "SSLC Public Exam",
    nameTamil: "பத்தாம் வகுப்பு பொதுத்தேர்வு",
    rates: {
      chiefSuperintendent: 600,
      departmentalOfficer: 500,
      invigilator: 400,
      scribe: 300,
    },
    daysTypical: 10,
  },
  {
    id: "hsc",
    name: "HSC (+2) Public Exam",
    nameTamil: "பன்னிரண்டாம் வகுப்பு பொதுத்தேர்வு",
    rates: {
      chiefSuperintendent: 700,
      departmentalOfficer: 600,
      invigilator: 450,
      scribe: 350,
    },
    daysTypical: 15,
  },
  {
    id: "tet",
    name: "TET / TRB Exam",
    nameTamil: "ஆசிரியர் தகுதித் தேர்வு",
    rates: {
      chiefSuperintendent: 800,
      departmentalOfficer: 700,
      invigilator: 500,
      scribe: 400,
    },
    daysTypical: 1,
  },
  {
    id: "tnpsc",
    name: "TNPSC Exam",
    nameTamil: "தமிழ்நாடு அரசுப் பணியாளர் தேர்வு",
    rates: {
      chiefSuperintendent: 800,
      departmentalOfficer: 700,
      invigilator: 500,
      scribe: 400,
    },
    daysTypical: 1,
  },
  {
    id: "quarterly",
    name: "Quarterly / Half-Yearly Exam",
    nameTamil: "காலாண்டு / அரையாண்டு தேர்வு",
    rates: {
      chiefSuperintendent: 300,
      departmentalOfficer: 250,
      invigilator: 200,
      scribe: 150,
    },
    daysTypical: 5,
  },
  {
    id: "valuation",
    name: "Central Valuation Camp",
    nameTamil: "மத்திய மதிப்பீட்டு முகாம்",
    rates: {
      chiefExaminer: 700,
      examiner: 500,
      assistant: 350,
      dayRate: 20, // Per answer script
    },
    daysTypical: 15,
  },
];

const dutyRoles = [
  { id: "chiefSuperintendent", name: "Chief Superintendent", nameTamil: "தலைமை மேற்பார்வையாளர்" },
  { id: "departmentalOfficer", name: "Departmental Officer", nameTamil: "துறை அலுவலர்" },
  { id: "invigilator", name: "Invigilator / Room Superintendent", nameTamil: "அறை மேற்பார்வையாளர்" },
  { id: "scribe", name: "Scribe / Writer", nameTamil: "எழுத்தர்" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ExamDutyCalculatorPage() {
  const [selectedExam, setSelectedExam] = useState<string>("sslc");
  const [selectedRole, setSelectedRole] = useState<string>("invigilator");
  const [dutyDays, setDutyDays] = useState<number>(10);
  const [scripts, setScripts] = useState<number>(0);

  const exam = examTypes.find((e) => e.id === selectedExam);

  const calculations = useMemo(() => {
    if (!exam) return null;

    const rates = exam.rates as unknown as Record<string, number>;
    const dailyRate = rates[selectedRole] || 0;
    const totalRemuneration = dailyRate * dutyDays;

    // For valuation, calculate script-based payment
    const scriptPayment = selectedExam === "valuation" && scripts > 0
      ? scripts * (rates.dayRate || 20)
      : 0;

    const grandTotal = totalRemuneration + scriptPayment;

    // TA/DA estimates
    const taEstimate = dutyDays * 100; // Approximate
    const daEstimate = dutyDays * 250; // Approximate daily allowance

    return {
      dailyRate,
      totalRemuneration,
      scriptPayment,
      grandTotal,
      taEstimate,
      daEstimate,
      totalWithTADA: grandTotal + taEstimate + daEstimate,
    };
  }, [exam, selectedRole, dutyDays, scripts, selectedExam]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors print:hidden">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
              <ClipboardCheck className="text-indigo-600" size={28} />
              Exam Duty Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">தேர்வுப் பணி ஊதிய கால்குலேட்டர்</p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
        >
          <Printer size={16} />
          Print
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> Remuneration rates are approximate and may vary based on
          government orders. Please verify with the latest GO for exact rates.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            Enter Duty Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Type
              </label>
              <select
                value={selectedExam}
                onChange={(e) => {
                  setSelectedExam(e.target.value);
                  const newExam = examTypes.find((ex) => ex.id === e.target.value);
                  if (newExam) setDutyDays(newExam.daysTypical);
                }}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              >
                {examTypes.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
              {exam && (
                <p className="text-xs text-gray-500 mt-1 tamil">{exam.nameTamil}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              >
                {dutyRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Duty Days
              </label>
              <input
                type="number"
                value={dutyDays}
                onChange={(e) => setDutyDays(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                min={1}
                max={30}
              />
            </div>

            {selectedExam === "valuation" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Scripts Valued
                </label>
                <input
                  type="number"
                  value={scripts}
                  onChange={(e) => setScripts(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">₹20 per script (approximate)</p>
              </div>
            )}
          </div>

          {/* Rate Card */}
          {exam && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-medium text-indigo-800 mb-2">{exam.name} - Daily Rates</h3>
              <div className="space-y-1 text-sm text-indigo-700">
                {Object.entries(exam.rates).map(([role, rate]) => {
                  const roleInfo = dutyRoles.find((r) => r.id === role);
                  if (!roleInfo && role !== "dayRate" && role !== "chiefExaminer" && role !== "examiner" && role !== "assistant") return null;
                  const label = roleInfo?.name || role.replace(/([A-Z])/g, " $1").trim();
                  return (
                    <div key={role} className="flex justify-between">
                      <span className="capitalize">{label}</span>
                      <span className="font-medium">
                        {formatCurrency(rate as number)}
                        {role === "dayRate" ? "/script" : "/day"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {calculations && (
            <>
              {/* Main Result */}
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                <p className="text-indigo-100 text-sm">Total Exam Duty Remuneration</p>
                <p className="text-4xl font-bold mt-1">{formatCurrency(calculations.grandTotal)}</p>
                <p className="text-indigo-100 text-sm mt-2">
                  {formatCurrency(calculations.dailyRate)}/day × {dutyDays} days
                </p>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">Payment Breakdown</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Daily Rate</span>
                    <span className="font-medium">{formatCurrency(calculations.dailyRate)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Duty Days</span>
                    <span className="font-medium">{dutyDays} days</span>
                  </div>
                  <div className="flex justify-between p-3 bg-indigo-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Duty Remuneration</span>
                    <span className="font-bold text-indigo-600">{formatCurrency(calculations.totalRemuneration)}</span>
                  </div>
                  {calculations.scriptPayment > 0 && (
                    <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Script Valuation ({scripts} scripts)</span>
                      <span className="font-bold text-green-600">+{formatCurrency(calculations.scriptPayment)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* TA/DA Estimate */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">TA/DA Estimate (If Applicable)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel Allowance (approx)</span>
                    <span className="font-medium">{formatCurrency(calculations.taEstimate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Allowance (approx)</span>
                    <span className="font-medium">{formatCurrency(calculations.daEstimate)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Grand Total with TA/DA</span>
                    <span className="font-bold text-green-600">{formatCurrency(calculations.totalWithTADA)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * TA/DA rates vary based on distance and grade. This is an estimate only.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Important Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Duty Assignment:</p>
            <ul className="space-y-1">
              <li>• Duty orders issued by DEO/CEO office</li>
              <li>• Cannot refuse without valid reason</li>
              <li>• Duty leave applicable for exam days</li>
              <li>• Must sign attendance daily</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Payment Process:</p>
            <ul className="space-y-1">
              <li>• Submit duty certificate after exam</li>
              <li>• Include TA/DA claim form</li>
              <li>• Payment usually within 2-3 months</li>
              <li>• Credited to salary account</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/ta-da-rates" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          TA/DA Rates
        </Link>
        <Link href="/tools/salary-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Salary Calculator
        </Link>
        <Link href="/exams" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Exam Calendar
        </Link>
      </div>
    </div>
  );
}
