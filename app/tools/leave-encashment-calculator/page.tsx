"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Info, Calculator } from "lucide-react";

// Leave encashment constants
const MAX_EL_ENCASHMENT = 300; // Maximum Earned Leave days for encashment
const MAX_HPL_ENCASHMENT = 180; // Maximum Half Pay Leave days (if applicable)

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function LeaveEncashmentCalculatorPage() {
  const [lastBasicPay, setLastBasicPay] = useState<number>(78800);
  const [lastDA, setLastDA] = useState<number>(39400);
  const [earnedLeave, setEarnedLeave] = useState<number>(240);
  const [halfPayLeave, setHalfPayLeave] = useState<number>(120);
  const [includeHPL, setIncludeHPL] = useState<boolean>(false);

  const calculations = useMemo(() => {
    // Total emoluments
    const emoluments = lastBasicPay + lastDA;

    // Daily rate = Emoluments / 30
    const dailyRate = emoluments / 30;

    // Earned Leave encashment (capped at 300 days)
    const elDays = Math.min(earnedLeave, MAX_EL_ENCASHMENT);
    const elAmount = Math.round(elDays * dailyRate);

    // Half Pay Leave encashment (capped at 180 days, converted to full pay equivalent)
    const hplDays = Math.min(halfPayLeave, MAX_HPL_ENCASHMENT);
    const hplFullPayEquivalent = hplDays / 2; // HPL is at half pay
    const hplAmount = includeHPL ? Math.round(hplFullPayEquivalent * dailyRate) : 0;

    // Total encashment
    const totalAmount = elAmount + hplAmount;

    // Excess leave (not encashable)
    const excessEL = Math.max(0, earnedLeave - MAX_EL_ENCASHMENT);
    const excessHPL = Math.max(0, halfPayLeave - MAX_HPL_ENCASHMENT);

    return {
      emoluments,
      dailyRate,
      elDays,
      elAmount,
      hplDays,
      hplFullPayEquivalent,
      hplAmount,
      totalAmount,
      excessEL,
      excessHPL,
    };
  }, [lastBasicPay, lastDA, earnedLeave, halfPayLeave, includeHPL]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Calendar className="text-teal-600" size={28} />
            Leave Encashment Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">விடுப்பு பணமாக்கல் கால்குலேட்டர்</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Leave encashment is calculated as per TN Government rules.
          Maximum EL: 300 days, Maximum HPL: 180 days (at half pay rate).
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4">Enter Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Drawn Basic Pay (₹)
              </label>
              <input
                type="number"
                value={lastBasicPay}
                onChange={(e) => setLastBasicPay(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
                min={15700}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Drawn DA (₹)
              </label>
              <input
                type="number"
                value={lastDA}
                onChange={(e) => setLastDA(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Earned Leave Balance (days)
              </label>
              <input
                type="number"
                value={earnedLeave}
                onChange={(e) => setEarnedLeave(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
                min={0}
                max={450}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum encashable: {MAX_EL_ENCASHMENT} days
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Half Pay Leave Balance (days)
              </label>
              <input
                type="number"
                value={halfPayLeave}
                onChange={(e) => setHalfPayLeave(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
                min={0}
                max={300}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum encashable: {MAX_HPL_ENCASHMENT} days (at half pay)
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="includeHPL"
                checked={includeHPL}
                onChange={(e) => setIncludeHPL(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <label htmlFor="includeHPL" className="text-sm text-gray-700">
                Include Half Pay Leave encashment
              </label>
            </div>
          </div>

          {/* Daily Rate Card */}
          <div className="mt-6 p-4 bg-teal-50 rounded-lg">
            <h3 className="font-medium text-teal-700 mb-3">Daily Rate Calculation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Basic Pay</span>
                <span>{formatCurrency(lastBasicPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">DA</span>
                <span>{formatCurrency(lastDA)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Emoluments</span>
                <span className="font-bold">{formatCurrency(calculations.emoluments)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Rate (÷30)</span>
                <span className="font-bold text-teal-700">{formatCurrency(Math.round(calculations.dailyRate))}/day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Total Amount Card */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={20} />
              <span className="text-teal-200 text-sm">Total Leave Encashment</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(calculations.totalAmount)}</p>
            <p className="text-teal-200 text-sm mt-2">
              EL: {formatCurrency(calculations.elAmount)}
              {includeHPL && ` + HPL: ${formatCurrency(calculations.hplAmount)}`}
            </p>
          </div>

          {/* Earned Leave Encashment */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <Calculator size={18} className="text-teal-500" />
              Earned Leave Encashment
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">EL Balance</span>
                <span>{earnedLeave} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Encashable Days (max 300)</span>
                <span className="font-medium">{calculations.elDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Rate</span>
                <span>{formatCurrency(Math.round(calculations.dailyRate))}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold text-teal-700">EL Encashment Amount</span>
                <span className="font-bold text-teal-700">{formatCurrency(calculations.elAmount)}</span>
              </div>
              {calculations.excessEL > 0 && (
                <p className="text-amber-600 text-xs mt-2">
                  ⚠️ {calculations.excessEL} days EL will lapse (exceeds 300 days limit)
                </p>
              )}
            </div>
          </div>

          {/* Half Pay Leave Encashment */}
          <div className={`bg-white rounded-xl shadow-sm border p-6 ${!includeHPL && 'opacity-50'}`}>
            <h3 className="font-semibold text-tn-text mb-4">Half Pay Leave Encashment</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">HPL Balance</span>
                <span>{halfPayLeave} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Encashable Days (max 180)</span>
                <span className="font-medium">{calculations.hplDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Full Pay Equivalent (÷2)</span>
                <span className="font-medium">{calculations.hplFullPayEquivalent} days</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold text-purple-700">HPL Encashment Amount</span>
                <span className="font-bold text-purple-700">{formatCurrency(calculations.hplAmount)}</span>
              </div>
              {calculations.excessHPL > 0 && (
                <p className="text-amber-600 text-xs mt-2">
                  ⚠️ {calculations.excessHPL} days HPL will lapse (exceeds 180 days limit)
                </p>
              )}
            </div>
            {!includeHPL && (
              <p className="text-sm text-gray-500 mt-3 italic">
                Enable &quot;Include HPL encashment&quot; to calculate
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-semibold text-green-800 mb-2">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Earned Leave Amount</span>
                <span className="font-medium">{formatCurrency(calculations.elAmount)}</span>
              </div>
              {includeHPL && (
                <div className="flex justify-between">
                  <span className="text-green-700">Half Pay Leave Amount</span>
                  <span className="font-medium">{formatCurrency(calculations.hplAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-green-200 pt-2">
                <span className="font-bold text-green-800">Total Encashment</span>
                <span className="font-bold text-green-800">{formatCurrency(calculations.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About Leave Encashment
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Earned Leave (EL):</strong> Maximum 300 days can be encashed at the time of retirement.</p>
          <p><strong>Half Pay Leave (HPL):</strong> Maximum 180 days can be encashed at half the rate.</p>
          <p><strong>Calculation:</strong> Encashment = Number of Days × (Basic Pay + DA) / 30</p>
          <p><strong>HPL Conversion:</strong> HPL days are converted to full pay equivalent (divided by 2) for calculation.</p>
          <p><strong>Tax:</strong> Leave encashment up to certain limits is exempt from income tax.</p>
        </div>
      </div>
    </div>
  );
}
