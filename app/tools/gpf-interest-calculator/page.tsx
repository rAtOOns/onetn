"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, PiggyBank, Calculator, Info } from "lucide-react";

const GPF_INTEREST_RATE = 7.1; // Current rate

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function GPFInterestCalculatorPage() {
  const [openingBalance, setOpeningBalance] = useState<number>(500000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(5000);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [withdrawalMonth, setWithdrawalMonth] = useState<number>(0);

  const calculations = useMemo(() => {
    const monthlyRate = GPF_INTEREST_RATE / 12 / 100;
    let balance = openingBalance;
    let totalContribution = 0;
    let totalInterest = 0;
    const monthlyDetails: { month: string; contribution: number; withdrawal: number; interest: number; balance: number }[] = [];

    const months = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];

    for (let i = 0; i < 12; i++) {
      const contribution = monthlyContribution;
      const withdrawal = i === withdrawalMonth && withdrawalAmount > 0 ? withdrawalAmount : 0;

      // Add contribution at start of month
      balance += contribution;
      totalContribution += contribution;

      // Deduct withdrawal
      balance -= withdrawal;

      // Calculate interest on balance at end of month
      // GPF interest is calculated on monthly minimum balance
      const interest = Math.round(balance * monthlyRate);
      totalInterest += interest;
      balance += interest;

      monthlyDetails.push({
        month: months[i],
        contribution,
        withdrawal,
        interest,
        balance: Math.round(balance),
      });
    }

    return {
      closingBalance: Math.round(balance),
      totalContribution,
      totalInterest: Math.round(totalInterest),
      monthlyDetails,
    };
  }, [openingBalance, monthlyContribution, withdrawalAmount, withdrawalMonth]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <PiggyBank className="text-emerald-600" size={28} />
            GPF Interest Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">GPF வட்டி கால்குலேட்டர்</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This is an unofficial calculator for estimation only.
          Current GPF interest rate: {GPF_INTEREST_RATE}%. Actual interest may vary.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            Enter Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Balance (April 1)
              </label>
              <input
                type="number"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Contribution (₹)
              </label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal Amount (₹)
              </label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal Month
              </label>
              <select
                value={withdrawalMonth}
                onChange={(e) => setWithdrawalMonth(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
                disabled={withdrawalAmount === 0}
              >
                {["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"].map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
            </div>

            <div className="bg-emerald-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Interest Rate</p>
              <p className="text-xl font-bold text-emerald-600">{GPF_INTEREST_RATE}% p.a.</p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
              <p className="text-emerald-100 text-sm">Closing Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(calculations.closingBalance)}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <p className="text-blue-100 text-sm">Total Contribution</p>
              <p className="text-2xl font-bold">{formatCurrency(calculations.totalContribution)}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <p className="text-purple-100 text-sm">Total Interest</p>
              <p className="text-2xl font-bold">{formatCurrency(calculations.totalInterest)}</p>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-semibold text-tn-text">Monthly Statement (FY)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Month</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">Contribution</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">Withdrawal</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">Interest</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="bg-blue-50">
                    <td className="px-4 py-2 font-medium">Opening</td>
                    <td className="px-4 py-2 text-right">-</td>
                    <td className="px-4 py-2 text-right">-</td>
                    <td className="px-4 py-2 text-right">-</td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(openingBalance)}</td>
                  </tr>
                  {calculations.monthlyDetails.map((row) => (
                    <tr key={row.month} className={row.withdrawal > 0 ? "bg-red-50" : ""}>
                      <td className="px-4 py-2">{row.month}</td>
                      <td className="px-4 py-2 text-right text-green-600">+{formatCurrency(row.contribution)}</td>
                      <td className="px-4 py-2 text-right text-red-600">
                        {row.withdrawal > 0 ? `-${formatCurrency(row.withdrawal)}` : "-"}
                      </td>
                      <td className="px-4 py-2 text-right text-purple-600">+{formatCurrency(row.interest)}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-50 font-bold">
                    <td className="px-4 py-2">Closing</td>
                    <td className="px-4 py-2 text-right text-green-600">{formatCurrency(calculations.totalContribution)}</td>
                    <td className="px-4 py-2 text-right text-red-600">{withdrawalAmount > 0 ? `-${formatCurrency(withdrawalAmount)}` : "-"}</td>
                    <td className="px-4 py-2 text-right text-purple-600">{formatCurrency(calculations.totalInterest)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(calculations.closingBalance)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About GPF Interest
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>Interest Rate:</strong> GPF interest rate is announced by the government annually.
            Current rate is {GPF_INTEREST_RATE}% (subject to change).
          </p>
          <p>
            <strong>Calculation Method:</strong> Interest is calculated monthly on the minimum balance
            at credit during the month. Interest is credited at the end of the financial year.
          </p>
          <p>
            <strong>Tax Benefit:</strong> GPF contributions qualify for deduction under Section 80C
            up to ₹1.5 lakhs. Interest earned is tax-free.
          </p>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/loan-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          GPF Loan Calculator
        </Link>
        <Link href="/tools/tpf-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          TPF Calculator
        </Link>
      </div>
    </div>
  );
}
