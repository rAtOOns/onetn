"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Landmark, Calculator, Info, Printer } from "lucide-react";

const loanTypes = [
  {
    id: "hba",
    name: "House Building Advance (HBA)",
    nameTamil: "வீட்டு கட்டுமான முன்பணம்",
    defaultRate: 7.9,
    maxTenure: 300,
    maxAmount: 2500000,
  },
  {
    id: "car",
    name: "Motor Car Advance",
    nameTamil: "கார் முன்பணம்",
    defaultRate: 11.5,
    maxTenure: 80,
    maxAmount: 500000,
  },
  {
    id: "twowheeler",
    name: "Two-Wheeler Advance",
    nameTamil: "இரு சக்கர வாகன முன்பணம்",
    defaultRate: 11.5,
    maxTenure: 60,
    maxAmount: 100000,
  },
  {
    id: "computer",
    name: "Computer Advance",
    nameTamil: "கணினி முன்பணம்",
    defaultRate: 10,
    maxTenure: 36,
    maxAmount: 80000,
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function LoanEMICalculatorPage() {
  const [loanType, setLoanType] = useState<string>("hba");
  const [principal, setPrincipal] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(7.9);
  const [tenureMonths, setTenureMonths] = useState<number>(180);

  const selectedLoan = loanTypes.find(l => l.id === loanType);

  // Update defaults when loan type changes
  const handleLoanTypeChange = (newType: string) => {
    setLoanType(newType);
    const loan = loanTypes.find(l => l.id === newType);
    if (loan) {
      setInterestRate(loan.defaultRate);
      setTenureMonths(Math.min(tenureMonths, loan.maxTenure));
      if (principal > loan.maxAmount) {
        setPrincipal(loan.maxAmount);
      }
    }
  };

  const calculations = useMemo(() => {
    // EMI Formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    const P = principal;
    const r = interestRate / 12 / 100; // Monthly interest rate
    const n = tenureMonths;

    if (r === 0) {
      // Simple interest case
      const emi = P / n;
      return {
        emi: Math.round(emi),
        totalPayment: P,
        totalInterest: 0,
        schedule: [],
      };
    }

    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Generate amortization schedule (first 12 months + last month)
    const schedule: { month: number; emi: number; principal: number; interest: number; balance: number }[] = [];
    let balance = P;

    for (let month = 1; month <= n; month++) {
      const interestPayment = balance * r;
      const principalPayment = emi - interestPayment;
      balance = balance - principalPayment;

      if (month <= 12 || month === n) {
        schedule.push({
          month,
          emi: Math.round(emi),
          principal: Math.round(principalPayment),
          interest: Math.round(interestPayment),
          balance: Math.max(0, Math.round(balance)),
        });
      }
    }

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      schedule,
    };
  }, [principal, interestRate, tenureMonths]);

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
              <Landmark className="text-amber-600" size={28} />
              Loan EMI Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">கடன் EMI கால்குலேட்டர்</p>
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

      {/* Loan Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {loanTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleLoanTypeChange(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                loanType === type.id
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            {selectedLoan?.name}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-amber-500"
                max={selectedLoan?.maxAmount}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {formatCurrency(selectedLoan?.maxAmount || 0)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (% per annum)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-amber-500"
                step={0.1}
                min={0}
                max={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenure (months)
              </label>
              <input
                type="number"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-amber-500"
                max={selectedLoan?.maxTenure}
                min={1}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {selectedLoan?.maxTenure} months ({Math.floor((selectedLoan?.maxTenure || 0) / 12)} years)
              </p>
            </div>
          </div>

          {/* Loan Info */}
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <h3 className="font-medium text-amber-800 mb-2">{selectedLoan?.name}</h3>
            <p className="text-xs text-amber-700 tamil mb-2">{selectedLoan?.nameTamil}</p>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• Interest Rate: {selectedLoan?.defaultRate}% p.a.</li>
              <li>• Max Amount: {formatCurrency(selectedLoan?.maxAmount || 0)}</li>
              <li>• Max Tenure: {selectedLoan?.maxTenure} months</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* EMI */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
            <p className="text-amber-100 text-sm">Monthly EMI</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(calculations.emi)}</p>
            <p className="text-amber-100 text-sm mt-2">
              For {tenureMonths} months ({Math.floor(tenureMonths / 12)} years {tenureMonths % 12} months)
            </p>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Loan Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Principal Amount</span>
                <span className="font-medium">{formatCurrency(principal)}</span>
              </div>
              <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-gray-600">Total Interest</span>
                <span className="font-medium text-red-600">{formatCurrency(calculations.totalInterest)}</span>
              </div>
              <div className="flex justify-between p-3 bg-amber-50 rounded-lg">
                <span className="text-gray-700 font-medium">Total Payment</span>
                <span className="font-bold text-amber-600">{formatCurrency(calculations.totalPayment)}</span>
              </div>
            </div>

            {/* Visual breakdown */}
            <div className="mt-4">
              <div className="flex h-4 rounded-full overflow-hidden">
                <div
                  className="bg-green-500"
                  style={{ width: `${(principal / calculations.totalPayment) * 100}%` }}
                  title="Principal"
                ></div>
                <div
                  className="bg-red-500"
                  style={{ width: `${(calculations.totalInterest / calculations.totalPayment) * 100}%` }}
                  title="Interest"
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-green-600">Principal: {Math.round((principal / calculations.totalPayment) * 100)}%</span>
                <span className="text-red-600">Interest: {Math.round((calculations.totalInterest / calculations.totalPayment) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Amortization Preview */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-3">Payment Schedule (Preview)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b">
                    <th className="py-2 text-left">Month</th>
                    <th className="py-2 text-right">EMI</th>
                    <th className="py-2 text-right">Principal</th>
                    <th className="py-2 text-right">Interest</th>
                    <th className="py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.schedule.map((row, i) => (
                    <tr key={row.month} className={`border-b border-gray-100 ${i === calculations.schedule.length - 1 ? "bg-green-50" : ""}`}>
                      <td className="py-2">{row.month}</td>
                      <td className="py-2 text-right">{formatCurrency(row.emi)}</td>
                      <td className="py-2 text-right text-green-600">{formatCurrency(row.principal)}</td>
                      <td className="py-2 text-right text-red-600">{formatCurrency(row.interest)}</td>
                      <td className="py-2 text-right">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tenureMonths > 13 && (
              <p className="text-xs text-gray-500 mt-2 text-center">... showing first 12 and last month</p>
            )}
          </div>
        </div>
      </div>

      {/* Loan Types Info */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Government Employee Loan Benefits
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Eligibility:</p>
            <ul className="space-y-1">
              <li>• Permanent employees only</li>
              <li>• Minimum service period varies by loan</li>
              <li>• No outstanding dues on previous loans</li>
              <li>• EMI should not exceed 50% of gross salary</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Process:</p>
            <ul className="space-y-1">
              <li>• Apply through DDO with required documents</li>
              <li>• Forwarded to Treasury/AG Office</li>
              <li>• Deducted from monthly salary</li>
              <li>• Interest calculated on reducing balance</li>
            </ul>
          </div>
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
        <Link href="/tools/gpf-interest-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          GPF Calculator
        </Link>
      </div>
    </div>
  );
}
