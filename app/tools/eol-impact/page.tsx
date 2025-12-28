"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Calculator, Info, AlertCircle, Printer } from "lucide-react";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function EOLImpactPage() {
  const [eolDays, setEolDays] = useState<number>(30);
  const [basicPay, setBasicPay] = useState<number>(56100);
  const [currentRetirementDate, setCurrentRetirementDate] = useState<string>("2040-05-31");
  const [incrementMonth, setIncrementMonth] = useState<number>(7); // July

  const calculations = useMemo(() => {
    const retirementDate = new Date(currentRetirementDate);

    // New retirement date (EOL extends retirement by same number of days)
    const newRetirementDate = addDays(retirementDate, eolDays);

    // Increment postponement calculation
    // If EOL > 180 days in a year, increment may be postponed
    const incrementPostponed = eolDays > 180;
    const incrementDelay = incrementPostponed ? Math.ceil(eolDays / 30) : 0;

    // Pay loss during EOL (no salary during EOL)
    const monthlyPay = basicPay * 1.55; // Basic + DA (55%)
    const dailyPay = monthlyPay / 30;
    const salaryLoss = Math.round(dailyPay * eolDays);

    // GPF contribution loss (10% of Basic+DA)
    const monthlyGPF = monthlyPay * 0.1;
    const dailyGPF = monthlyGPF / 30;
    const gpfLoss = Math.round(dailyGPF * eolDays);

    // Pension impact (if EOL exceeds limits)
    // EOL up to 5 years is non-qualifying for pension
    const pensionImpact = eolDays > 1825 // 5 years = 1825 days
      ? "May affect qualifying service for pension"
      : eolDays > 365
      ? "EOL beyond 1 year may not count for pension"
      : "Minimal impact if EOL is approved";

    // EL accumulation loss (approx 15 days per year lost proportionally)
    const elLossApprox = Math.round((eolDays / 365) * 15);

    // Total financial impact
    const totalImpact = salaryLoss + gpfLoss;

    return {
      originalRetirement: retirementDate,
      newRetirementDate,
      incrementPostponed,
      incrementDelay,
      salaryLoss,
      gpfLoss,
      pensionImpact,
      elLossApprox,
      totalImpact,
      dailyPay: Math.round(dailyPay),
    };
  }, [eolDays, basicPay, currentRetirementDate]);

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
              <Calendar className="text-violet-600" size={28} />
              EOL Impact Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">சம்பளமில்லா விடுப்பு தாக்க கால்குலேட்டர்</p>
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
      <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-violet-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-violet-800 font-medium">Extra Ordinary Leave (EOL)</p>
            <p className="text-sm text-violet-700 mt-1">
              EOL is leave without pay granted when no other leave is available. It affects
              retirement date, increments, pension calculation, and other service benefits.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            Enter EOL Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                EOL Duration (Days)
              </label>
              <input
                type="number"
                value={eolDays}
                onChange={(e) => setEolDays(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-violet-500"
                min={1}
                max={1825}
              />
              <p className="text-xs text-gray-500 mt-1">Maximum EOL: 5 years (1825 days)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Basic Pay (₹)
              </label>
              <input
                type="number"
                value={basicPay}
                onChange={(e) => setBasicPay(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Retirement Date
              </label>
              <input
                type="date"
                value={currentRetirementDate}
                onChange={(e) => setCurrentRetirementDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Increment Month
              </label>
              <select
                value={incrementMonth}
                onChange={(e) => setIncrementMonth(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-violet-500"
              >
                <option value={1}>January</option>
                <option value={7}>July</option>
              </select>
            </div>
          </div>

          {/* EOL Rules Summary */}
          <div className="mt-6 p-4 bg-violet-50 rounded-lg">
            <h3 className="font-medium text-violet-800 mb-2">EOL Rules</h3>
            <ul className="space-y-1 text-sm text-violet-700">
              <li>• EOL is granted only when other leave is not available</li>
              <li>• No salary/allowances during EOL</li>
              <li>• EOL period extends retirement date</li>
              <li>• EOL beyond 180 days may postpone increment</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Financial Impact */}
          <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl p-6 text-white">
            <p className="text-violet-100 text-sm">Total Financial Impact</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(calculations.totalImpact)}</p>
            <p className="text-violet-100 text-sm mt-2">
              Loss during {eolDays} days EOL
            </p>
          </div>

          {/* Retirement Date Impact */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Retirement Date Impact</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Original Retirement</span>
                <span className="font-medium">{formatDate(calculations.originalRetirement)}</span>
              </div>
              <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-gray-600">New Retirement Date</span>
                <span className="font-bold text-red-600">{formatDate(calculations.newRetirementDate)}</span>
              </div>
              <div className="flex justify-between p-3 bg-amber-50 rounded-lg">
                <span className="text-gray-600">Extension</span>
                <span className="font-medium text-amber-600">+{eolDays} days</span>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Detailed Impact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Salary Loss</span>
                <span className="font-medium text-red-600">-{formatCurrency(calculations.salaryLoss)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">GPF Contribution Loss</span>
                <span className="font-medium text-red-600">-{formatCurrency(calculations.gpfLoss)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Daily Pay Rate</span>
                <span className="font-medium">{formatCurrency(calculations.dailyPay)}/day</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">EL Accumulation Loss (approx)</span>
                <span className="font-medium text-amber-600">~{calculations.elLossApprox} days</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-600">Increment Postponement</span>
                <span className={`font-medium ${calculations.incrementPostponed ? "text-red-600" : "text-green-600"}`}>
                  {calculations.incrementPostponed
                    ? `Yes (+${calculations.incrementDelay} months)`
                    : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Pension Impact */}
          <div className="bg-amber-50 rounded-xl p-4">
            <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <AlertCircle size={16} />
              Pension Impact
            </h3>
            <p className="text-sm text-amber-700">{calculations.pensionImpact}</p>
          </div>
        </div>
      </div>

      {/* EOL Rules Detailed */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          EOL Rules & Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">When EOL Can Be Granted:</p>
            <ul className="space-y-1">
              <li>• When EL/HPL/Commuted Leave exhausted</li>
              <li>• For higher studies (with prior approval)</li>
              <li>• For accompanying spouse abroad</li>
              <li>• On medical grounds (with certificate)</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Impact on Service:</p>
            <ul className="space-y-1">
              <li>• Retirement date extends by EOL days</li>
              <li>• EOL does not count for pension (usually)</li>
              <li>• Increment postponed if EOL &gt; 180 days/year</li>
              <li>• Maximum EOL: 5 years in entire service</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Alternative Options */}
      <div className="mt-6 bg-green-50 rounded-xl p-6">
        <h3 className="font-semibold text-green-800 mb-3">Before Taking EOL - Consider:</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-green-700">
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium">Earned Leave</p>
            <p>Use accumulated EL first (max 300 days)</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium">Half Pay Leave</p>
            <p>Consider HPL with medical certificate</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium">Commuted Leave</p>
            <p>2 days HPL = 1 day Commuted Leave</p>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/surrender-leave-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Leave Surrender Calculator
        </Link>
        <Link href="/tools/retirement-summary" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Retirement Summary
        </Link>
        <Link href="/tools/pension-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Pension Calculator
        </Link>
      </div>
    </div>
  );
}
