"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Calculator, Info } from "lucide-react";

const CURRENT_DA = 55;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SurrenderLeaveCalculatorPage() {
  const [basicPay, setBasicPay] = useState<number>(56900);
  const [surrenderDays, setSurrenderDays] = useState<number>(15);

  // Calculate
  const daAmount = Math.round((basicPay * CURRENT_DA) / 100);
  const totalPay = basicPay + daAmount;
  const dailyRate = Math.round(totalPay / 30);
  const surrenderAmount = dailyRate * surrenderDays;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Calendar className="text-teal-600" size={28} />
            Surrender Leave Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">விடுப்பு சரண் கால்குலேட்டர்</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This is an unofficial calculator for estimation only.
          Actual amount may vary based on current rules. Verify with your DDO.
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
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days to Surrender
              </label>
              <input
                type="number"
                value={surrenderDays}
                onChange={(e) => setSurrenderDays(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
                min={1}
                max={15}
              />
              <p className="text-xs text-gray-500 mt-1">Maximum 15 days per year</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Current DA Rate</p>
              <p className="text-xl font-bold text-teal-600">{CURRENT_DA}%</p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Total Amount Card */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
            <p className="text-teal-100 text-sm">Surrender Leave Amount</p>
            <p className="text-sm tamil text-teal-100">விடுப்பு சரண் தொகை</p>
            <p className="text-4xl font-bold mt-2">{formatCurrency(surrenderAmount)}</p>
            <p className="text-teal-100 text-sm mt-2">
              For {surrenderDays} days
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
                <span className="text-gray-600">DA ({CURRENT_DA}%)</span>
                <span className="font-medium">{formatCurrency(daAmount)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-700 font-medium">Total (Basic + DA)</span>
                <span className="font-bold">{formatCurrency(totalPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Rate (÷ 30)</span>
                <span className="font-medium">{formatCurrency(dailyRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Days to Surrender</span>
                <span className="font-medium">× {surrenderDays}</span>
              </div>
              <div className="flex justify-between border-t pt-2 bg-teal-50 -mx-6 px-6 py-2">
                <span className="font-bold text-teal-800">Total Amount</span>
                <span className="font-bold text-teal-800">{formatCurrency(surrenderAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Surrender Leave Rules
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>Eligibility:</strong> Employees with EL balance of more than 15 days can surrender up to 15 days per calendar year.
          </p>
          <p>
            <strong>Calculation:</strong> Surrender amount = (Basic Pay + DA) ÷ 30 × Number of days
          </p>
          <p>
            <strong>When to Apply:</strong> Usually before June and December every year. Check department circular for exact dates.
          </p>
          <p>
            <strong>Tax:</strong> Surrender leave encashment is taxable as salary income.
          </p>
          <p>
            <strong>Note:</strong> Minimum EL balance of 15 days should remain after surrender.
          </p>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/tools/leave-calculator"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Leave Balance Calculator
        </Link>
        <Link
          href="/tools/leave-encashment-calculator"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Leave Encashment (Retirement)
        </Link>
      </div>
    </div>
  );
}
