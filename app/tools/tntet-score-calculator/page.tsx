"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Calculator, Info, Printer } from "lucide-react";

const qualifications = [
  { id: "sslc", name: "SSLC / 10th", maxMarks: 500 },
  { id: "hsc", name: "HSC / +2", maxMarks: 600 },
  { id: "ug", name: "UG Degree", maxMarks: 1800 },
  { id: "pg", name: "PG Degree", maxMarks: 1000 },
  { id: "bed", name: "B.Ed", maxMarks: 1000 },
  { id: "tet", name: "TET Score", maxMarks: 150 },
];

// Weightage as per TRB norms (varies by post)
const weightageSchemes = {
  bt: {
    name: "BT Assistant",
    weights: { sslc: 10, hsc: 15, ug: 25, pg: 0, bed: 20, tet: 30 },
  },
  pgt: {
    name: "PG Assistant",
    weights: { sslc: 5, hsc: 10, ug: 20, pg: 25, bed: 15, tet: 25 },
  },
  primary: {
    name: "Primary Teacher",
    weights: { sslc: 15, hsc: 20, ug: 20, pg: 0, bed: 15, tet: 30 },
  },
};

export default function TNTETScoreCalculatorPage() {
  const [scheme, setScheme] = useState<string>("bt");
  const [marks, setMarks] = useState<Record<string, number>>({
    sslc: 420,
    hsc: 500,
    ug: 1400,
    pg: 0,
    bed: 750,
    tet: 110,
  });

  const selectedScheme = weightageSchemes[scheme as keyof typeof weightageSchemes];

  const calculations = useMemo(() => {
    const results: { qual: string; name: string; obtained: number; max: number; percentage: number; weightage: number; weightedScore: number }[] = [];
    let totalWeightedScore = 0;

    qualifications.forEach((qual) => {
      const obtained = marks[qual.id] || 0;
      const weight = selectedScheme.weights[qual.id as keyof typeof selectedScheme.weights] || 0;

      if (weight > 0) {
        const percentage = (obtained / qual.maxMarks) * 100;
        const weightedScore = (percentage * weight) / 100;

        results.push({
          qual: qual.id,
          name: qual.name,
          obtained,
          max: qual.maxMarks,
          percentage: Math.round(percentage * 100) / 100,
          weightage: weight,
          weightedScore: Math.round(weightedScore * 100) / 100,
        });

        totalWeightedScore += weightedScore;
      }
    });

    return {
      results,
      totalWeightedScore: Math.round(totalWeightedScore * 100) / 100,
      maxPossible: 100,
    };
  }, [marks, selectedScheme]);

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
              <GraduationCap className="text-purple-600" size={28} />
              TNTET / TRB Score Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">TNTET / TRB மதிப்பெண் கால்குலேட்டர்</p>
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
          <strong>Disclaimer:</strong> Weightage may vary based on TRB notification.
          Please verify with the latest recruitment notification.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            Enter Your Marks
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post Applied For
              </label>
              <select
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(weightageSchemes).map(([key, value]) => (
                  <option key={key} value={key}>{value.name}</option>
                ))}
              </select>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Academic Marks</p>

              {qualifications.map((qual) => {
                const weight = selectedScheme.weights[qual.id as keyof typeof selectedScheme.weights] || 0;
                if (weight === 0 && qual.id !== "pg") return null;

                return (
                  <div key={qual.id} className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-600">{qual.name}</label>
                      <span className="text-xs text-purple-600">Weightage: {weight}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={marks[qual.id] || 0}
                        onChange={(e) => setMarks({ ...marks, [qual.id]: Number(e.target.value) })}
                        className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                        min={0}
                        max={qual.maxMarks}
                      />
                      <span className="text-sm text-gray-500">/ {qual.maxMarks}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weightage Info */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-purple-800 mb-2">{selectedScheme.name} Weightage</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {Object.entries(selectedScheme.weights).map(([key, value]) => {
                if (value === 0) return null;
                const qual = qualifications.find(q => q.id === key);
                return (
                  <div key={key} className="text-purple-700">
                    {qual?.name.split(" ")[0]}: {value}%
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Total Score */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <p className="text-purple-100 text-sm">Your Weighted Score</p>
            <p className="text-4xl font-bold mt-1">{calculations.totalWeightedScore}</p>
            <p className="text-purple-100 text-sm mt-2">
              Out of {calculations.maxPossible} maximum
            </p>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Score Breakdown</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-500 pb-2 border-b">
                <span>Qualification</span>
                <span className="text-center">Marks</span>
                <span className="text-center">%</span>
                <span className="text-center">Weight</span>
                <span className="text-right">Score</span>
              </div>
              {calculations.results.map((result) => (
                <div key={result.qual} className="grid grid-cols-5 gap-2 text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-700">{result.name}</span>
                  <span className="text-center">{result.obtained}/{result.max}</span>
                  <span className="text-center">{result.percentage}%</span>
                  <span className="text-center text-purple-600">{result.weightage}%</span>
                  <span className="text-right font-medium">{result.weightedScore}</span>
                </div>
              ))}
              <div className="grid grid-cols-5 gap-2 text-sm py-2 font-bold">
                <span className="col-span-4 text-right">Total Weighted Score:</span>
                <span className="text-right text-purple-600">{calculations.totalWeightedScore}</span>
              </div>
            </div>
          </div>

          {/* Merit Info */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-semibold text-green-800 mb-2">Cut-off Reference</h3>
            <p className="text-sm text-green-700">
              Cut-off marks vary each year based on vacancies and applicants.
              Previous years: OC: 85-92, BC: 80-88, MBC: 75-85, SC/ST: 70-80 (approximate)
            </p>
          </div>
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
            <p className="font-medium mb-2">Eligibility:</p>
            <ul className="space-y-1">
              <li>• Must have passed TNTET (Paper I or II)</li>
              <li>• B.Ed is mandatory for BT/PG posts</li>
              <li>• Age limit as per GO (relaxation for reserved)</li>
              <li>• Tamil qualification required</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Selection Process:</p>
            <ul className="space-y-1">
              <li>• Merit based on weighted score</li>
              <li>• Certificate verification</li>
              <li>• Counseling for posting preference</li>
              <li>• Separate ranking for each category</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/seniority-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Seniority Calculator
        </Link>
        <Link href="/tools/promotion-info" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Promotion Info
        </Link>
        <Link href="/links" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          TRB Official Site
        </Link>
      </div>
    </div>
  );
}
