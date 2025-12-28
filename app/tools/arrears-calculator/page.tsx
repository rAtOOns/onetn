"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, TrendingUp, Info } from "lucide-react";

// DA rates for quick reference
const daRates = [
  { period: "January 2025", rate: 55 },
  { period: "July 2024", rate: 53 },
  { period: "January 2024", rate: 50 },
  { period: "July 2023", rate: 46 },
  { period: "January 2023", rate: 42 },
  { period: "July 2022", rate: 38 },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ArrearsCalculatorPage() {
  const [basicPay, setBasicPay] = useState<number>(36900);
  const [oldDARate, setOldDARate] = useState<number>(53);
  const [newDARate, setNewDARate] = useState<number>(55);
  const [months, setMonths] = useState<number>(6);

  // Calculate arrears
  const oldDA = Math.round((basicPay * oldDARate) / 100);
  const newDA = Math.round((basicPay * newDARate) / 100);
  const monthlyDifference = newDA - oldDA;
  const totalArrears = monthlyDifference * months;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <TrendingUp className="text-green-600" size={28} />
            DA Arrears Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">அகவிலைப்படி நிலுவை கால்குலேட்டர்</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This is an unofficial calculator for estimation purposes only.
          Actual arrears may vary. Verify with your pay slip and DDO.
        </p>
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
                Basic Pay (₹)
              </label>
              <input
                type="number"
                value={basicPay}
                onChange={(e) => setBasicPay(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
                placeholder="Enter your basic pay"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Old DA Rate (%)
              </label>
              <select
                value={oldDARate}
                onChange={(e) => setOldDARate(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
              >
                {daRates.map((da) => (
                  <option key={da.period} value={da.rate}>
                    {da.rate}% ({da.period})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New DA Rate (%)
              </label>
              <select
                value={newDARate}
                onChange={(e) => setNewDARate(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
              >
                {daRates.map((da) => (
                  <option key={da.period} value={da.rate}>
                    {da.rate}% ({da.period})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arrears Months
              </label>
              <input
                type="number"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
                min={1}
                max={12}
                placeholder="Number of months"
              />
              <p className="text-xs text-gray-500 mt-1">
                Usually 6 months (Jan-Jun or Jul-Dec)
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Total Arrears Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <p className="text-green-100 text-sm">Total DA Arrears</p>
            <p className="text-sm tamil text-green-100">மொத்த அகவிலைப்படி நிலுவை</p>
            <p className="text-4xl font-bold mt-2">{formatCurrency(totalArrears)}</p>
            <p className="text-green-100 text-sm mt-2">
              For {months} month{months > 1 ? "s" : ""}
            </p>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Calculation Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Basic Pay</span>
                <span className="font-medium">{formatCurrency(basicPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Old DA ({oldDARate}%)</span>
                <span className="font-medium">{formatCurrency(oldDA)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New DA ({newDARate}%)</span>
                <span className="font-medium">{formatCurrency(newDA)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-700 font-medium">Monthly Difference</span>
                <span className="font-bold text-green-600">+{formatCurrency(monthlyDifference)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Months</span>
                <span className="font-medium">× {months}</span>
              </div>
              <div className="flex justify-between border-t pt-2 bg-green-50 -mx-6 px-6 py-2">
                <span className="font-bold text-green-800">Total Arrears</span>
                <span className="font-bold text-green-800">{formatCurrency(totalArrears)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About DA Arrears
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>What are DA Arrears?</strong> When DA rate is revised (usually in January and July),
            the new rate is applied retrospectively from the effective date. The difference between
            new DA and old DA for the past months is paid as arrears.
          </p>
          <p>
            <strong>When are arrears paid?</strong> Arrears are usually paid along with the salary
            in the month when the G.O. is issued, or in the following month.
          </p>
          <p>
            <strong>Tax on Arrears:</strong> DA arrears are fully taxable as part of your salary income.
          </p>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/tools/da-rates"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          View DA Rate Table
        </Link>
        <Link
          href="/tools/salary-calculator"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Salary Calculator
        </Link>
      </div>
    </div>
  );
}
