"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Calculator, Info, Printer, CheckCircle } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

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

export default function CommutationRestorationPage() {
  const [retirementDate, setRetirementDate] = useState<string>("2020-06-30");
  const [fullPension, setFullPension] = useState<number>(35000);
  const [commutedPercent, setCommutedPercent] = useState<number>(40);
  const [commutationAmount, setCommutationAmount] = useState<number>(2500000);

  const calculations = useMemo(() => {
    const retirementDateObj = new Date(retirementDate);
    const today = new Date();

    // Commuted pension amount
    const commutedPension = Math.round(fullPension * commutedPercent / 100);
    const reducedPension = fullPension - commutedPension;

    // Restoration date (15 years from retirement)
    const restorationDate = addYears(retirementDateObj, 15);

    // Days/Years remaining
    const msRemaining = restorationDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
    const yearsRemaining = Math.max(0, daysRemaining / 365).toFixed(1);

    // Is already restored?
    const isRestored = today >= restorationDate;

    // Monthly loss during commutation period
    const monthlyLoss = commutedPension;

    // Total pension lost (15 years)
    const totalPensionLost = commutedPension * 12 * 15;

    // Net benefit (commutation received - pension lost)
    const netBenefit = commutationAmount - totalPensionLost;

    // Monthly gain after restoration
    const monthlyGain = commutedPension;

    // Breakeven calculation
    const monthsToBreakeven = Math.ceil(commutationAmount / commutedPension);
    const yearsToBreakeven = (monthsToBreakeven / 12).toFixed(1);

    return {
      commutedPension,
      reducedPension,
      restorationDate,
      daysRemaining,
      yearsRemaining,
      isRestored,
      monthlyLoss,
      totalPensionLost,
      netBenefit,
      monthlyGain,
      yearsToBreakeven,
    };
  }, [retirementDate, fullPension, commutedPercent, commutationAmount]);

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
              <RefreshCw className="text-teal-600" size={28} />
              Commutation Restoration
            </h1>
            <p className="text-sm text-gray-500 tamil">ஓய்வூதிய மீட்டெடுப்பு கால்குலேட்டர்</p>
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

      {/* Info Banner */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-teal-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-teal-800 font-medium">Pension Commutation Restoration</p>
            <p className="text-sm text-teal-700 mt-1">
              When you commute (convert to lump sum) a portion of your pension at retirement,
              the commuted portion is deducted from monthly pension. After 15 years,
              the full pension is restored automatically.
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
                Date of Retirement
              </label>
              <input
                type="date"
                value={retirementDate}
                onChange={(e) => setRetirementDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Pension (before commutation) ₹/month
              </label>
              <input
                type="number"
                value={fullPension}
                onChange={(e) => setFullPension(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commuted Percentage (%)
              </label>
              <select
                value={commutedPercent}
                onChange={(e) => setCommutedPercent(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
              >
                <option value={20}>20%</option>
                <option value={30}>30%</option>
                <option value={40}>40% (Maximum)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commutation Amount Received (₹)
              </label>
              <input
                type="number"
                value={commutationAmount}
                onChange={(e) => setCommutationAmount(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Status */}
          <div className={`rounded-xl p-6 text-white ${
            calculations.isRestored
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : "bg-gradient-to-r from-teal-500 to-teal-600"
          }`}>
            <p className="text-white/80 text-sm">Restoration Status</p>
            <p className="text-3xl font-bold mt-1">
              {calculations.isRestored ? "Restored!" : `${calculations.yearsRemaining} years remaining`}
            </p>
            <p className="text-white/80 text-sm mt-2">
              Restoration Date: {formatDate(calculations.restorationDate)}
            </p>
          </div>

          {/* Pension Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Pension Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Full Pension</span>
                <span className="font-bold">{formatCurrency(fullPension)}/month</span>
              </div>
              <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-gray-600">Commuted ({commutedPercent}%)</span>
                <span className="font-medium text-red-600">-{formatCurrency(calculations.commutedPension)}/month</span>
              </div>
              <div className="flex justify-between p-3 bg-amber-50 rounded-lg">
                <span className="text-gray-700 font-medium">Current Reduced Pension</span>
                <span className="font-bold text-amber-600">{formatCurrency(calculations.reducedPension)}/month</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">After Restoration</span>
                <span className="font-bold text-green-600">{formatCurrency(fullPension)}/month</span>
              </div>
            </div>
          </div>

          {/* Financial Analysis */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Financial Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Commutation Received</span>
                <span className="font-medium text-green-600">{formatCurrency(commutationAmount)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Pension Lost (15 years)</span>
                <span className="font-medium text-red-600">{formatCurrency(calculations.totalPensionLost)}</span>
              </div>
              <div className={`flex justify-between p-3 rounded-lg ${
                calculations.netBenefit >= 0 ? "bg-green-50" : "bg-red-50"
              }`}>
                <span className="text-gray-700 font-medium">Net Benefit/Loss</span>
                <span className={`font-bold ${calculations.netBenefit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(calculations.netBenefit)}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-600">Breakeven Period</span>
                <span className="font-medium">{calculations.yearsToBreakeven} years</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-tn-text mb-4">Restoration Timeline</h3>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
              <p className="text-sm font-medium">Retirement</p>
              <p className="text-xs text-gray-500">{formatDate(new Date(retirementDate))}</p>
            </div>
            <div className="flex-1 mx-4">
              <div className="h-1 bg-gray-200 relative">
                <div
                  className="absolute h-1 bg-teal-500"
                  style={{
                    width: `${Math.min(100, (1 - calculations.daysRemaining / (15 * 365)) * 100)}%`
                  }}
                ></div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-1">15 Years</p>
            </div>
            <div className="text-center">
              {calculations.isRestored ? (
                <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
              ) : (
                <RefreshCw className="mx-auto text-teal-500 mb-2" size={24} />
              )}
              <p className="text-sm font-medium">Restoration</p>
              <p className="text-xs text-gray-500">{formatDate(calculations.restorationDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Commutation Rules
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Key Points:</p>
            <ul className="space-y-1">
              <li>• Maximum 40% pension can be commuted</li>
              <li>• Lump sum = Commutation Factor × 12 × Commuted Pension</li>
              <li>• Reduced pension paid for 15 years</li>
              <li>• Auto-restoration after 15 years</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">After Restoration:</p>
            <ul className="space-y-1">
              <li>• No application needed</li>
              <li>• Automatic from 16th year</li>
              <li>• Full original pension restored</li>
              <li>• Includes all subsequent revisions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/pension-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Pension Calculator
        </Link>
        <Link href="/tools/retirement-summary" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Retirement Summary
        </Link>
      </div>
    </div>
  );
}
