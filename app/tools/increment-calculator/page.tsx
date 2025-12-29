"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, TrendingUp, Info, GraduationCap, Award } from "lucide-react";
import {
  PAY_LEVELS,
  TEACHING_PAY_LEVELS,
  ANNUAL_INCREMENT_PERCENT
} from "@/lib/constants/rates";

// Qualification Increments for Teaching Cadre
const QUALIFICATION_INCREMENTS = {
  phd: { increments: 3, label: "Ph.D", description: "Doctor of Philosophy" },
  mphil: { increments: 1, label: "M.Phil", description: "Master of Philosophy" },
  net: { increments: 1, label: "NET/SLET", description: "National/State Eligibility Test" },
  bed: { increments: 1, label: "B.Ed (for non-B.Ed recruited)", description: "Bachelor of Education" },
  med: { increments: 1, label: "M.Ed", description: "Master of Education" },
} as const;

// Convert centralized pay levels to increment slabs format
const incrementSlabs = [
  // Administrative Cadre (Level 1-14)
  ...Object.entries(PAY_LEVELS).map(([level, data]) => ({
    level: Number(level),
    minPay: data.minPay,
    maxPay: data.maxPay,
    incrementPercent: ANNUAL_INCREMENT_PERCENT,
    description: data.description,
    descriptionTamil: data.descriptionTamil,
  })),
  // Teaching Cadre (T1-T4)
  ...Object.entries(TEACHING_PAY_LEVELS).map(([level, data]) => ({
    level,
    minPay: data.minPay,
    maxPay: data.maxPay,
    incrementPercent: ANNUAL_INCREMENT_PERCENT,
    description: data.description,
    descriptionTamil: data.descriptionTamil,
  })),
];

// Pay Matrix based increment - amounts vary at different stages
// This is the actual TN 7th Pay matrix system where increment amount changes at different pay points
const payMatrixIncrements: Record<string, number[]> = {
  // Level 1 increments (at each stage, the increment amount)
  "1": [500, 500, 500, 500, 600, 600, 600, 600, 700, 700, 700, 800, 800, 800, 900, 900, 900, 1000, 1000, 1000],
  "2": [600, 600, 600, 700, 700, 700, 800, 800, 800, 900, 900, 900, 1000, 1000, 1100, 1100, 1200, 1200, 1300, 1300],
  "3": [700, 700, 700, 800, 800, 800, 900, 900, 900, 1000, 1000, 1100, 1100, 1200, 1200, 1300, 1300, 1400, 1400, 1500],
  "4": [800, 800, 800, 900, 900, 1000, 1000, 1100, 1100, 1200, 1200, 1300, 1300, 1400, 1400, 1500, 1600, 1600, 1700, 1800],
  "5": [900, 900, 1000, 1000, 1100, 1100, 1200, 1200, 1300, 1300, 1400, 1500, 1500, 1600, 1700, 1700, 1800, 1900, 2000, 2100],
  "6": [1100, 1100, 1200, 1200, 1300, 1400, 1400, 1500, 1600, 1600, 1700, 1800, 1900, 1900, 2000, 2100, 2200, 2300, 2400, 2500],
  "7": [1400, 1400, 1500, 1600, 1600, 1700, 1800, 1900, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000],
  "8": [1500, 1500, 1600, 1700, 1700, 1800, 1900, 2000, 2100, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3200],
  "9": [1700, 1700, 1800, 1900, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3400, 3500],
  "10": [1800, 1800, 1900, 2000, 2100, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2900, 3000, 3100, 3200, 3300, 3500, 3600, 3800],
  "11": [2200, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3200, 3300, 3400, 3600, 3700, 3900, 4000, 4200, 4400, 4500],
  "12": [2500, 2600, 2700, 2800, 2900, 3000, 3100, 3300, 3400, 3500, 3700, 3800, 4000, 4100, 4300, 4500, 4600, 4800, 5000, 5200],
  "13": [3900, 4000, 4200, 4300, 4500, 4700, 4800, 5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000, 7200, 7400],
  "14": [4600, 4700, 4900, 5100, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600, 6900, 7100, 7300, 7500, 7800, 8000, 8200, 8400],
  // Teaching Cadre
  "T1": [1200, 1200, 1300, 1300, 1400, 1400, 1500, 1600, 1600, 1700, 1800, 1800, 1900, 2000, 2100, 2100, 2200, 2300, 2400, 2500],
  "T2": [1500, 1500, 1600, 1700, 1700, 1800, 1900, 2000, 2100, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3200],
  "T3": [1800, 1800, 1900, 2000, 2100, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2900, 3000, 3100, 3200, 3300, 3500, 3600, 3800],
  "T4": [2500, 2600, 2700, 2800, 2900, 3000, 3100, 3300, 3400, 3500, 3700, 3800, 4000, 4100, 4300, 4500, 4600, 4800, 5000, 5200],
};

// Format currency in Indian format
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Get increment amount based on pay level and current basic pay
function getIncrementAmount(level: string, basicPay: number): number {
  const levelData = incrementSlabs.find((s) => String(s.level) === level);
  if (!levelData) {
    // Default 3% if level not found
    return Math.round((basicPay * 3) / 100 / 100) * 100;
  }

  const increments = payMatrixIncrements[level];
  if (!increments) {
    // Fallback to percentage based
    return Math.round((basicPay * levelData.incrementPercent) / 100 / 100) * 100;
  }

  // Calculate stage based on current basic pay
  const payRange = levelData.maxPay - levelData.minPay;
  const currentPosition = basicPay - levelData.minPay;
  const stageIndex = Math.min(
    Math.floor((currentPosition / payRange) * increments.length),
    increments.length - 1
  );

  return increments[Math.max(0, stageIndex)];
}

// Get next July 1st
function getNextIncrementDate(fromDate: Date = new Date()): Date {
  const year = fromDate.getFullYear();
  const july1 = new Date(year, 6, 1);

  if (fromDate >= july1) {
    return new Date(year + 1, 6, 1);
  }
  return july1;
}

// Check if eligible for increment (6 months service as of July 1)
function isEligibleForIncrement(joiningDate: Date, incrementDate: Date): boolean {
  const sixMonthsBefore = new Date(incrementDate);
  sixMonthsBefore.setMonth(sixMonthsBefore.getMonth() - 6);
  return joiningDate <= sixMonthsBefore;
}

// Calculate days until date
function daysUntil(targetDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function IncrementCalculatorPage() {
  const today = new Date();
  const defaultJoining = new Date(today.getFullYear() - 5, 0, 15);

  const [basicPay, setBasicPay] = useState<number>(36900);
  const [selectedLevel, setSelectedLevel] = useState<string>("T1");
  const [joiningDate, setJoiningDate] = useState<string>(
    defaultJoining.toISOString().split("T")[0]
  );
  const [yearsToProject, setYearsToProject] = useState<number>(5);
  const [showQualificationCalc, setShowQualificationCalc] = useState<boolean>(false);

  // Qualification increment states
  const [hasPhd, setHasPhd] = useState<boolean>(false);
  const [hasMphil, setHasMphil] = useState<boolean>(false);
  const [hasNet, setHasNet] = useState<boolean>(false);
  const [hasBed, setHasBed] = useState<boolean>(false);
  const [hasMed, setHasMed] = useState<boolean>(false);

  const selectedLevelData = incrementSlabs.find((s) => String(s.level) === selectedLevel);
  const isTeachingCadre = selectedLevel.startsWith("T");

  // Calculate qualification increments
  const qualificationCalc = useMemo(() => {
    let totalIncrements = 0;
    const qualifications: string[] = [];

    if (hasPhd) {
      totalIncrements += QUALIFICATION_INCREMENTS.phd.increments;
      qualifications.push(`Ph.D (+${QUALIFICATION_INCREMENTS.phd.increments})`);
    }
    if (hasMphil && !hasPhd) { // M.Phil not counted if Ph.D already claimed
      totalIncrements += QUALIFICATION_INCREMENTS.mphil.increments;
      qualifications.push(`M.Phil (+${QUALIFICATION_INCREMENTS.mphil.increments})`);
    }
    if (hasNet) {
      totalIncrements += QUALIFICATION_INCREMENTS.net.increments;
      qualifications.push(`NET/SLET (+${QUALIFICATION_INCREMENTS.net.increments})`);
    }
    if (hasBed) {
      totalIncrements += QUALIFICATION_INCREMENTS.bed.increments;
      qualifications.push(`B.Ed (+${QUALIFICATION_INCREMENTS.bed.increments})`);
    }
    if (hasMed) {
      totalIncrements += QUALIFICATION_INCREMENTS.med.increments;
      qualifications.push(`M.Ed (+${QUALIFICATION_INCREMENTS.med.increments})`);
    }

    // Calculate new pay after qualification increments
    let newPay = basicPay;
    for (let i = 0; i < totalIncrements; i++) {
      const inc = getIncrementAmount(selectedLevel, newPay);
      newPay += inc;
    }

    return {
      totalIncrements,
      qualifications,
      originalPay: basicPay,
      newPayAfterQualification: Math.min(newPay, selectedLevelData?.maxPay || 220000),
      increase: newPay - basicPay,
    };
  }, [basicPay, selectedLevel, hasPhd, hasMphil, hasNet, hasBed, hasMed, selectedLevelData?.maxPay]);

  const calculations = useMemo(() => {
    const joining = new Date(joiningDate);
    const nextIncrement = getNextIncrementDate();
    const isEligible = isEligibleForIncrement(joining, nextIncrement);
    const daysToIncrement = daysUntil(nextIncrement);

    // Calculate increment amount based on pay matrix
    const incrementAmount = getIncrementAmount(selectedLevel, basicPay);
    const newBasicPay = basicPay + incrementAmount;

    // Check if max pay reached
    const maxPay = selectedLevelData?.maxPay || 220000;
    const willReachMax = newBasicPay >= maxPay;

    // Project future increments
    const projections: Array<{
      year: number;
      date: Date;
      beforePay: number;
      increment: number;
      afterPay: number;
      isStagnation: boolean;
    }> = [];

    let projectedPay = basicPay;
    for (let i = 0; i < yearsToProject; i++) {
      const projectionDate = new Date(nextIncrement);
      projectionDate.setFullYear(nextIncrement.getFullYear() + i);

      const isStagnation = projectedPay >= maxPay;
      const inc = isStagnation ? 0 : getIncrementAmount(selectedLevel, projectedPay);
      const newPay = Math.min(projectedPay + inc, maxPay);

      projections.push({
        year: projectionDate.getFullYear(),
        date: projectionDate,
        beforePay: projectedPay,
        increment: inc,
        afterPay: newPay,
        isStagnation,
      });

      projectedPay = newPay;
    }

    return {
      nextIncrement,
      isEligible,
      daysToIncrement,
      incrementAmount,
      newBasicPay: Math.min(newBasicPay, maxPay),
      projections,
      totalGrowth: projectedPay - basicPay,
      willReachMax,
      maxPay,
    };
  }, [basicPay, selectedLevel, joiningDate, yearsToProject, selectedLevelData]);

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    const levelData = incrementSlabs.find((s) => String(s.level) === level);
    if (levelData) {
      setBasicPay(levelData.minPay);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/tools"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Calendar className="text-orange-600" size={28} />
            Increment Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">
            ஊதிய உயர்வு கால்குலேட்டர் - Pay Matrix Based
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Increment is based on TN Pay Matrix. Amount varies by pay level and stage.
          Annual increment granted on 1st July. Amount rounded to nearest ₹100.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4">Enter Details</h2>

          <div className="space-y-4">
            {/* Pay Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pay Level / Post
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => handleLevelChange(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
              >
                <optgroup label="Administrative Cadre">
                  {incrementSlabs
                    .filter((p) => typeof p.level === "number")
                    .map((p) => (
                      <option key={p.level} value={String(p.level)}>
                        Level {p.level} - {p.description}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Teaching Cadre">
                  {incrementSlabs
                    .filter((p) => typeof p.level === "string")
                    .map((p) => (
                      <option key={p.level} value={String(p.level)}>
                        Level {p.level} - {p.description}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Basic Pay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Basic Pay (₹)
              </label>
              <input
                type="number"
                value={basicPay}
                onChange={(e) => setBasicPay(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                min={selectedLevelData?.minPay || 15700}
                max={selectedLevelData?.maxPay || 220000}
              />
              {selectedLevelData && (
                <p className="text-xs text-gray-500 mt-1">
                  Range: {formatCurrency(selectedLevelData.minPay)} - {formatCurrency(selectedLevelData.maxPay)}
                </p>
              )}
            </div>

            {/* Date of Joining */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Joining
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                For eligibility check (6 months service required)
              </p>
            </div>

            {/* Years to Project */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project for (years)
              </label>
              <select
                value={yearsToProject}
                onChange={(e) => setYearsToProject(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
              >
                {[3, 5, 10, 15, 20, 25, 30].map((y) => (
                  <option key={y} value={y}>
                    {y} years
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Increment Info Card */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium text-gray-700 mb-3">Pay Matrix Increment</h3>
            <div className="bg-orange-50 rounded-lg p-4 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Current Basic Pay</span>
                <span className="font-medium">{formatCurrency(basicPay)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Increment Amount</span>
                <span className="font-bold text-orange-600">+{formatCurrency(calculations.incrementAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-orange-200">
                <span className="text-gray-700 font-medium">New Basic Pay</span>
                <span className="font-bold text-orange-700">{formatCurrency(calculations.newBasicPay)}</span>
              </div>
              {calculations.willReachMax && (
                <p className="text-amber-700 text-xs mt-2">
                  ⚠️ Approaching maximum pay for this level
                </p>
              )}
            </div>
          </div>

          {/* Qualification Increment Section (Teachers Only) */}
          {isTeachingCadre && (
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => setShowQualificationCalc(!showQualificationCalc)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <GraduationCap size={18} className="text-purple-600" />
                  Qualification Increment Calculator
                </h3>
                <span className="text-sm text-purple-600">
                  {showQualificationCalc ? "Hide" : "Show"}
                </span>
              </button>

              {showQualificationCalc && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg space-y-4">
                  <p className="text-xs text-purple-700">
                    Select qualifications acquired after joining to calculate additional increments:
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-2 bg-white rounded-lg cursor-pointer hover:bg-purple-100">
                      <input
                        type="checkbox"
                        checked={hasPhd}
                        onChange={(e) => setHasPhd(e.target.checked)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <div>
                        <span className="font-medium">Ph.D</span>
                        <span className="text-xs text-purple-600 ml-2">(+3 increments)</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-2 bg-white rounded-lg cursor-pointer hover:bg-purple-100 ${hasPhd ? 'opacity-50' : ''}`}>
                      <input
                        type="checkbox"
                        checked={hasMphil}
                        onChange={(e) => setHasMphil(e.target.checked)}
                        disabled={hasPhd}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <div>
                        <span className="font-medium">M.Phil</span>
                        <span className="text-xs text-purple-600 ml-2">(+1 increment)</span>
                        {hasPhd && <span className="text-xs text-gray-500 ml-2">(Not applicable with Ph.D)</span>}
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-2 bg-white rounded-lg cursor-pointer hover:bg-purple-100">
                      <input
                        type="checkbox"
                        checked={hasNet}
                        onChange={(e) => setHasNet(e.target.checked)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <div>
                        <span className="font-medium">NET / SLET / SET</span>
                        <span className="text-xs text-purple-600 ml-2">(+1 increment)</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-2 bg-white rounded-lg cursor-pointer hover:bg-purple-100">
                      <input
                        type="checkbox"
                        checked={hasBed}
                        onChange={(e) => setHasBed(e.target.checked)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <div>
                        <span className="font-medium">B.Ed</span>
                        <span className="text-xs text-purple-600 ml-2">(+1 increment, if not recruited with B.Ed)</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-2 bg-white rounded-lg cursor-pointer hover:bg-purple-100">
                      <input
                        type="checkbox"
                        checked={hasMed}
                        onChange={(e) => setHasMed(e.target.checked)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <div>
                        <span className="font-medium">M.Ed</span>
                        <span className="text-xs text-purple-600 ml-2">(+1 increment)</span>
                      </div>
                    </label>
                  </div>

                  {qualificationCalc.totalIncrements > 0 && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Award size={16} className="text-purple-600" />
                        <span className="font-medium text-purple-800">Qualification Increment Result</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Qualifications</span>
                          <span className="font-medium">{qualificationCalc.qualifications.join(", ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Increments</span>
                          <span className="font-bold text-purple-600">{qualificationCalc.totalIncrements}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Pay</span>
                          <span className="font-medium">{formatCurrency(qualificationCalc.originalPay)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-purple-100">
                          <span className="text-gray-700 font-medium">New Pay (after qualification)</span>
                          <span className="font-bold text-purple-700">{formatCurrency(qualificationCalc.newPayAfterQualification)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Pay Increase</span>
                          <span className="font-bold">+{formatCurrency(qualificationCalc.increase)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Next Increment Card */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={20} />
              <span className="text-orange-200 text-sm">Next Increment Date</span>
            </div>
            <p className="text-3xl font-bold">
              {calculations.nextIncrement.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Days remaining</p>
                <p className="text-2xl font-bold">{calculations.daysToIncrement}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  calculations.isEligible
                    ? "bg-green-400 text-green-900"
                    : "bg-red-400 text-red-900"
                }`}
              >
                {calculations.isEligible ? "Eligible" : "Not Eligible Yet"}
              </div>
            </div>
          </div>

          {/* Increment Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <TrendingUp size={18} />
              Next Increment Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Basic Pay</span>
                <span className="font-medium">{formatCurrency(basicPay)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pay Matrix Increment</span>
                <span className="font-medium text-green-600">
                  +{formatCurrency(calculations.incrementAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-semibold">New Basic Pay</span>
                <span className="font-bold text-lg text-orange-600">
                  {formatCurrency(calculations.newBasicPay)}
                </span>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-green-700">
              After {yearsToProject} years, your Basic Pay will grow from{" "}
              <strong>{formatCurrency(basicPay)}</strong> to{" "}
              <strong>
                {formatCurrency(
                  calculations.projections[calculations.projections.length - 1]?.afterPay || basicPay
                )}
              </strong>
            </p>
            <p className="text-sm text-green-600 mt-1">
              Total growth: {formatCurrency(calculations.totalGrowth)}
            </p>
          </div>
        </div>
      </div>

      {/* Projection Table */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-tn-text">
            {yearsToProject}-Year Increment Projection (Level {selectedLevel})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Year</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                  Before
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                  Increment
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                  After
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {calculations.projections.map((proj, index) => (
                <tr
                  key={proj.year}
                  className={
                    index === 0
                      ? "bg-orange-50"
                      : proj.isStagnation
                      ? "bg-amber-50"
                      : "hover:bg-gray-50"
                  }
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                          Next
                        </span>
                      )}
                      {proj.isStagnation && (
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                          Max
                        </span>
                      )}
                      {proj.year}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    1st July {proj.year}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {formatCurrency(proj.beforePay)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                    {proj.isStagnation ? (
                      <span className="text-amber-600">Stagnation</span>
                    ) : (
                      `+${formatCurrency(proj.increment)}`
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">
                    {formatCurrency(proj.afterPay)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About Pay Matrix Based Increment
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>Pay Matrix System:</strong> Under TN 7th Pay Commission, increment
            amount is fixed at each stage of the pay matrix, not a flat percentage.
            The increment amount increases as you progress through the matrix.
          </p>
          <p>
            <strong>Increment Date:</strong> Annual increment is granted on <strong>1st July</strong> every year.
          </p>
          <p>
            <strong>Eligibility:</strong> Employees must have completed at least
            6 months of qualifying service as of 1st July to receive increment that year.
          </p>
          <p>
            <strong>Maximum Pay:</strong> When an employee reaches the maximum of their
            pay level, they enter stagnation until promoted to the next level.
          </p>
        </div>
      </div>
    </div>
  );
}
