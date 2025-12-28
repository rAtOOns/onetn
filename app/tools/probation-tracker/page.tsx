"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, UserCheck, Calculator, Info, CheckCircle, Clock, AlertCircle } from "lucide-react";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const probationExtensionReasons = [
  "Pending disciplinary proceedings",
  "Unsatisfactory work/conduct",
  "Absence exceeding prescribed limit",
  "Failure to pass departmental test",
  "Any other reason recorded in writing",
];

export default function ProbationTrackerPage() {
  const [doj, setDoj] = useState<string>(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [probationYears, setProbationYears] = useState<number>(2);
  const [eolDays, setEolDays] = useState<number>(0);
  const [suspensionDays, setSuspensionDays] = useState<number>(0);
  const [hasDeptTest, setHasDeptTest] = useState<boolean>(true);
  const [hasGoodConduct, setHasGoodConduct] = useState<boolean>(true);

  const calculations = useMemo(() => {
    const dojDate = new Date(doj);
    const today = new Date();

    // Normal probation end date
    const normalEndDate = addYears(dojDate, probationYears);

    // Adjusted end date (adding EOL and suspension days)
    const totalExtraDays = eolDays + suspensionDays;
    const adjustedEndDate = addDays(normalEndDate, totalExtraDays);

    // Service completed
    const serviceMs = today.getTime() - dojDate.getTime();
    const serviceDays = Math.floor(serviceMs / (24 * 60 * 60 * 1000));
    const serviceYears = Math.floor(serviceDays / 365);
    const serviceMonths = Math.floor((serviceDays % 365) / 30);
    const remainingDays = serviceDays % 30;

    // Probation status
    const isCompleted = today >= adjustedEndDate;
    const daysRemaining = Math.max(0, Math.ceil((adjustedEndDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)));
    const progressPercent = Math.min(100, Math.round((serviceDays / (probationYears * 365 + totalExtraDays)) * 100));

    // Confirmation eligibility
    const isEligibleForConfirmation = isCompleted && hasDeptTest && hasGoodConduct;

    // Issues
    const issues: string[] = [];
    if (!hasDeptTest) issues.push("Departmental test not passed");
    if (!hasGoodConduct) issues.push("Conduct/work not satisfactory");
    if (eolDays > 0) issues.push(`EOL of ${eolDays} days extends probation`);
    if (suspensionDays > 0) issues.push(`Suspension of ${suspensionDays} days extends probation`);

    return {
      dojDate,
      normalEndDate,
      adjustedEndDate,
      serviceYears,
      serviceMonths,
      remainingDays,
      serviceDays,
      isCompleted,
      daysRemaining,
      progressPercent,
      isEligibleForConfirmation,
      issues,
      totalExtraDays,
    };
  }, [doj, probationYears, eolDays, suspensionDays, hasDeptTest, hasGoodConduct]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <UserCheck className="text-blue-600" size={28} />
            Probation Period Tracker
          </h1>
          <p className="text-sm text-gray-500 tamil">தகுதிகாண் பருவ கண்காணிப்பான்</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-blue-800 font-medium">Probation Period</p>
            <p className="text-sm text-blue-700 mt-1">
              As per TN State & Subordinate Service Rules, new appointees must complete a probation period
              (usually 2 years) before confirmation. EOL and suspension periods extend probation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            Enter Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Joining (Probation Start)
              </label>
              <input
                type="date"
                value={doj}
                onChange={(e) => setDoj(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Probation Period (Years)
              </label>
              <select
                value={probationYears}
                onChange={(e) => setProbationYears(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 Year</option>
                <option value={2}>2 Years (Standard)</option>
                <option value={3}>3 Years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                EOL Days (if any)
              </label>
              <input
                type="number"
                value={eolDays}
                onChange={(e) => setEolDays(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                min={0}
              />
              <p className="text-xs text-gray-500 mt-1">Extra Ordinary Leave extends probation</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suspension Days (if any)
              </label>
              <input
                type="number"
                value={suspensionDays}
                onChange={(e) => setSuspensionDays(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                min={0}
              />
            </div>

            <div className="border-t pt-4 space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDeptTest}
                  onChange={(e) => setHasDeptTest(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Departmental Test Passed</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasGoodConduct}
                  onChange={(e) => setHasGoodConduct(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Work & Conduct Satisfactory</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Status */}
          <div className={`rounded-xl p-6 text-white ${
            calculations.isEligibleForConfirmation
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : calculations.isCompleted
              ? "bg-gradient-to-r from-amber-500 to-amber-600"
              : "bg-gradient-to-r from-blue-500 to-blue-600"
          }`}>
            <p className="text-white/80 text-sm">Probation Status</p>
            <p className="text-3xl font-bold mt-1">
              {calculations.isEligibleForConfirmation
                ? "Ready for Confirmation"
                : calculations.isCompleted
                ? "Period Complete - Issues Pending"
                : "In Probation"}
            </p>
            {!calculations.isCompleted && (
              <p className="text-white/80 text-sm mt-2">
                {calculations.daysRemaining} days remaining
              </p>
            )}
          </div>

          {/* Progress */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Progress</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Completed</span>
                <span>{calculations.progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    calculations.progressPercent >= 100 ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${calculations.progressPercent}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Service Completed</span>
                <span className="font-medium">
                  {calculations.serviceYears}y {calculations.serviceMonths}m {calculations.remainingDays}d
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Probation Start</span>
                <span className="font-medium">{formatDate(calculations.dojDate)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Normal End Date</span>
                <span className="font-medium">{formatDate(calculations.normalEndDate)}</span>
              </div>
              {calculations.totalExtraDays > 0 && (
                <div className="flex justify-between p-3 bg-amber-50 rounded-lg">
                  <span className="text-gray-600">Extended By</span>
                  <span className="font-medium text-amber-600">+{calculations.totalExtraDays} days</span>
                </div>
              )}
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Confirmation Due</span>
                <span className="font-bold text-blue-600">{formatDate(calculations.adjustedEndDate)}</span>
              </div>
            </div>
          </div>

          {/* Issues */}
          {calculations.issues.length > 0 && (
            <div className="bg-red-50 rounded-xl p-4">
              <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <AlertCircle size={18} />
                Issues to Address
              </h3>
              <ul className="space-y-1 text-sm text-red-700">
                {calculations.issues.map((issue, i) => (
                  <li key={i}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Confirmation Checklist */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-3">Confirmation Checklist</h3>
            <div className="space-y-2">
              {[
                { label: "Probation period completed", done: calculations.isCompleted },
                { label: "Departmental test passed", done: hasDeptTest },
                { label: "Work & conduct satisfactory", done: hasGoodConduct },
                { label: "No disciplinary proceedings pending", done: true },
                { label: "Medical fitness certificate", done: true },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${item.done ? "bg-green-50" : "bg-red-50"}`}>
                  {item.done ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <Clock size={16} className="text-red-500" />
                  )}
                  <span className={`text-sm ${item.done ? "text-green-700" : "text-red-700"}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Extension Reasons */}
      <div className="mt-8 bg-amber-50 rounded-xl p-6">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} />
          Reasons for Probation Extension
        </h3>
        <div className="grid md:grid-cols-2 gap-2">
          {probationExtensionReasons.map((reason, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-amber-700">
              <span>•</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rules Reference */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          TN Service Rules - Probation
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">General Rules:</p>
            <ul className="space-y-1">
              <li>• Standard probation: 2 years</li>
              <li>• Can be extended for valid reasons</li>
              <li>• EOL period not counted in probation</li>
              <li>• Suspension period not counted</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">After Confirmation:</p>
            <ul className="space-y-1">
              <li>• Full member of the service</li>
              <li>• Eligible for promotions</li>
              <li>• Can apply for transfers</li>
              <li>• Full leave entitlements</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/service-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Service Calculator
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
