"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Calculator, Info, Printer } from "lucide-react";

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

function monthsBetween(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

export default function IncrementArrearsPage() {
  const [oldBasic, setOldBasic] = useState<number>(56100);
  const [incrementPercent, setIncrementPercent] = useState<number>(3);
  const [dueDate, setDueDate] = useState<string>("2024-07-01");
  const [paidDate, setPaidDate] = useState<string>("2024-12-01");
  const [daPercent, setDaPercent] = useState<number>(50);

  const calculations = useMemo(() => {
    const dueDateObj = new Date(dueDate);
    const paidDateObj = new Date(paidDate);

    // New basic after increment
    const incrementAmount = Math.round(oldBasic * incrementPercent / 100);
    const newBasic = oldBasic + incrementAmount;

    // Months delayed
    const monthsDelayed = Math.max(0, monthsBetween(dueDateObj, paidDateObj));

    // DA on increment
    const daOnIncrement = Math.round(incrementAmount * daPercent / 100);

    // Total difference per month
    const monthlyDifference = incrementAmount + daOnIncrement;

    // Total arrears
    const totalArrears = monthlyDifference * monthsDelayed;

    // Generate month-wise breakdown
    const breakdown = [];
    const tempDate = new Date(dueDateObj);
    for (let i = 0; i < monthsDelayed; i++) {
      breakdown.push({
        month: formatDate(tempDate),
        basic: incrementAmount,
        da: daOnIncrement,
        total: monthlyDifference,
      });
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    return {
      incrementAmount,
      newBasic,
      monthsDelayed,
      daOnIncrement,
      monthlyDifference,
      totalArrears,
      breakdown,
    };
  }, [oldBasic, incrementPercent, dueDate, paidDate, daPercent]);

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
              <TrendingUp className="text-purple-600" size={28} />
              Increment Arrears Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">ஊதிய உயர்வு நிலுவை கால்குலேட்டர்</p>
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
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-purple-800 font-medium">Increment Arrears</p>
            <p className="text-sm text-purple-700 mt-1">
              When annual increment is delayed (e.g., due to late order or probation extension),
              arrears are due from the original due date.
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
                Old Basic Pay (₹)
              </label>
              <input
                type="number"
                value={oldBasic}
                onChange={(e) => setOldBasic(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Increment Rate (%)
              </label>
              <select
                value={incrementPercent}
                onChange={(e) => setIncrementPercent(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
              >
                <option value={3}>3% (Standard)</option>
                <option value={5}>5% (Special)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Increment Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Usually July 1st every year</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Increment Paid From Date
              </label>
              <input
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current DA Rate (%)
              </label>
              <input
                type="number"
                value={daPercent}
                onChange={(e) => setDaPercent(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Total Arrears */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <p className="text-white/80 text-sm">Total Arrears</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(calculations.totalArrears)}</p>
            <p className="text-white/80 text-sm mt-2">
              For {calculations.monthsDelayed} months delay
            </p>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Calculation Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Old Basic Pay</span>
                <span className="font-medium">{formatCurrency(oldBasic)}</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-600">Increment Amount ({incrementPercent}%)</span>
                <span className="font-medium text-green-600">+{formatCurrency(calculations.incrementAmount)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">New Basic Pay</span>
                <span className="font-bold">{formatCurrency(calculations.newBasic)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">DA on Increment ({daPercent}%)</span>
                <span className="font-medium">+{formatCurrency(calculations.daOnIncrement)}</span>
              </div>
              <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700 font-medium">Monthly Difference</span>
                <span className="font-bold text-purple-600">{formatCurrency(calculations.monthlyDifference)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Months Delayed</span>
                <span className="font-medium">{calculations.monthsDelayed} months</span>
              </div>
            </div>
          </div>

          {/* Month-wise Breakdown */}
          {calculations.breakdown.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-tn-text mb-3">Month-wise Breakdown</h3>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-2">Month</th>
                      <th className="text-right py-2 px-2">Basic</th>
                      <th className="text-right py-2 px-2">DA</th>
                      <th className="text-right py-2 px-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.breakdown.map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2 px-2">{row.month}</td>
                        <td className="py-2 px-2 text-right">{formatCurrency(row.basic)}</td>
                        <td className="py-2 px-2 text-right">{formatCurrency(row.da)}</td>
                        <td className="py-2 px-2 text-right text-purple-600">{formatCurrency(row.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rules */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Increment Rules
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Annual Increment:</p>
            <ul className="space-y-1">
              <li>• Standard: 3% of basic pay</li>
              <li>• Due date: July 1st every year</li>
              <li>• Probationers: After completion of probation</li>
              <li>• Withheld increment: Order required</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Arrears Situations:</p>
            <ul className="space-y-1">
              <li>• Delayed probation declaration</li>
              <li>• Late increment order</li>
              <li>• Restoration after penalty</li>
              <li>• Court order implementation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/increment-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Increment Calculator
        </Link>
        <Link href="/tools/arrears-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          DA Arrears Calculator
        </Link>
      </div>
    </div>
  );
}
