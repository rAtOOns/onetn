"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Gift, Calculator, Info, Printer } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const festivals = [
  { id: "pongal", name: "Pongal", month: "January" },
  { id: "diwali", name: "Deepavali", month: "October/November" },
  { id: "ramzan", name: "Ramzan", month: "As per Islamic Calendar" },
  { id: "christmas", name: "Christmas", month: "December" },
  { id: "onam", name: "Onam", month: "August/September" },
];

export default function FestivalAdvancePage() {
  const [advanceAmount, setAdvanceAmount] = useState<number>(10000);
  const [recoveryMonths, setRecoveryMonths] = useState<number>(10);
  const [festival, setFestival] = useState<string>("pongal");

  const calculations = useMemo(() => {
    const monthlyDeduction = Math.ceil(advanceAmount / recoveryMonths);
    const totalRecovery = monthlyDeduction * recoveryMonths;
    const lastMonthDeduction = advanceAmount - (monthlyDeduction * (recoveryMonths - 1));

    // Generate recovery schedule
    const schedule = [];
    let remaining = advanceAmount;
    for (let i = 1; i <= recoveryMonths; i++) {
      const deduction = i === recoveryMonths ? lastMonthDeduction : monthlyDeduction;
      remaining -= deduction;
      schedule.push({
        month: i,
        deduction,
        remaining: Math.max(0, remaining),
      });
    }

    return {
      monthlyDeduction,
      totalRecovery,
      lastMonthDeduction,
      schedule,
    };
  }, [advanceAmount, recoveryMonths]);

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
              <Gift className="text-orange-600" size={28} />
              Festival Advance Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">திருவிழா முன்பணம் கால்குலேட்டர்</p>
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
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-orange-800 font-medium">Festival Advance</p>
            <p className="text-sm text-orange-700 mt-1">
              Interest-free advance given to TN government employees during major festivals.
              Usually ₹3,000 to ₹10,000. Recovered in 10 equal monthly installments.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            Advance Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Festival
              </label>
              <select
                value={festival}
                onChange={(e) => setFestival(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
              >
                {festivals.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} ({f.month})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Advance Amount (₹)
              </label>
              <input
                type="number"
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
                min={1000}
                max={15000}
                step={1000}
              />
              <p className="text-xs text-gray-500 mt-1">Usually ₹3,000 to ₹10,000</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recovery Period (Months)
              </label>
              <select
                value={recoveryMonths}
                onChange={(e) => setRecoveryMonths(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
              >
                <option value={6}>6 Months</option>
                <option value={10}>10 Months (Standard)</option>
                <option value={12}>12 Months</option>
              </select>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Quick Select Amount:</p>
            <div className="flex flex-wrap gap-2">
              {[3000, 5000, 7000, 10000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setAdvanceAmount(amount)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    advanceAmount === amount
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  ₹{amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Monthly Deduction */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <p className="text-white/80 text-sm">Monthly Deduction</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(calculations.monthlyDeduction)}</p>
            <p className="text-white/80 text-sm mt-2">
              For {recoveryMonths} months (Interest Free)
            </p>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Advance Amount</span>
                <span className="font-bold text-orange-600">{formatCurrency(advanceAmount)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Recovery Period</span>
                <span className="font-medium">{recoveryMonths} months</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Monthly Deduction</span>
                <span className="font-medium">{formatCurrency(calculations.monthlyDeduction)}</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Interest Charged</span>
                <span className="font-bold text-green-600">₹0 (Interest Free)</span>
              </div>
            </div>
          </div>

          {/* Recovery Schedule */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-3">Recovery Schedule</h3>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-2 px-2">Month</th>
                    <th className="text-right py-2 px-2">Deduction</th>
                    <th className="text-right py-2 px-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.schedule.map((row) => (
                    <tr key={row.month} className="border-t">
                      <td className="py-2 px-2">{row.month}</td>
                      <td className="py-2 px-2 text-right text-red-600">{formatCurrency(row.deduction)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.remaining)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Festival Advance Rules
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Eligibility:</p>
            <ul className="space-y-1">
              <li>• All regular government employees</li>
              <li>• Probationers also eligible</li>
              <li>• One festival advance at a time</li>
              <li>• Previous advance must be cleared</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">How to Apply:</p>
            <ul className="space-y-1">
              <li>• Apply to DDO before festival</li>
              <li>• Usually announced by GO</li>
              <li>• Deduction starts from next month</li>
              <li>• Recovered in 10 equal installments</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Available Festivals */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-tn-text mb-4">Available Festival Advances</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {festivals.map((f) => (
            <div key={f.id} className="p-3 bg-orange-50 rounded-lg text-center">
              <p className="font-medium text-orange-700">{f.name}</p>
              <p className="text-xs text-gray-500">{f.month}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/loans-advances" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Loans & Advances Guide
        </Link>
        <Link href="/tools/salary-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Salary Calculator
        </Link>
      </div>
    </div>
  );
}
