"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, PiggyBank, Calculator, Info, Printer } from "lucide-react";
import { CURRENT_DA_RATE, NPS_EMPLOYEE_CONTRIBUTION, NPS_GOVT_CONTRIBUTION } from "@/lib/constants/rates";

const CURRENT_DA = CURRENT_DA_RATE;
const EMPLOYEE_CONTRIBUTION = NPS_EMPLOYEE_CONTRIBUTION;
const GOVT_CONTRIBUTION = NPS_GOVT_CONTRIBUTION;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function NPSCalculatorPage() {
  const [basicPay, setBasicPay] = useState<number>(56100);
  const [currentAge, setCurrentAge] = useState<number>(35);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [currentCorpus, setCurrentCorpus] = useState<number>(500000);
  const [expectedReturn, setExpectedReturn] = useState<number>(10);
  const [annuityPercent, setAnnuityPercent] = useState<number>(40);

  const calculations = useMemo(() => {
    const da = Math.round((basicPay * CURRENT_DA) / 100);
    const totalPay = basicPay + da;

    // Monthly contributions
    const employeeContribution = Math.round((totalPay * EMPLOYEE_CONTRIBUTION) / 100);
    const govtContribution = Math.round((totalPay * GOVT_CONTRIBUTION) / 100);
    const totalMonthlyContribution = employeeContribution + govtContribution;

    // Years to retirement
    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;

    // Future value calculation (compound interest)
    const monthlyRate = expectedReturn / 12 / 100;

    // Future value of current corpus
    const fvCurrentCorpus = currentCorpus * Math.pow(1 + monthlyRate, monthsToRetirement);

    // Future value of monthly contributions (annuity)
    const fvContributions = totalMonthlyContribution *
      ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);

    const totalCorpus = Math.round(fvCurrentCorpus + fvContributions);

    // At retirement
    const lumpSumPercent = 60; // Can withdraw up to 60% tax-free
    const lumpSumAmount = Math.round((totalCorpus * lumpSumPercent) / 100);
    const annuityCorpus = totalCorpus - lumpSumAmount;

    // Estimated monthly pension from annuity (assuming 6% annuity rate)
    const annuityRate = 6;
    const monthlyPension = Math.round((annuityCorpus * annuityRate) / 100 / 12);

    // Total contribution till retirement
    const totalEmployeeContribution = employeeContribution * monthsToRetirement;
    const totalGovtContribution = govtContribution * monthsToRetirement;

    return {
      da,
      totalPay,
      employeeContribution,
      govtContribution,
      totalMonthlyContribution,
      yearsToRetirement,
      totalCorpus,
      lumpSumAmount,
      annuityCorpus,
      monthlyPension,
      totalEmployeeContribution,
      totalGovtContribution,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicPay, currentAge, retirementAge, currentCorpus, expectedReturn]);

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
              <PiggyBank className="text-orange-600" size={28} />
              NPS Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">தேசிய ஓய்வூதிய திட்ட கால்குலேட்டர்</p>
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
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-orange-800">
          <strong>NPS (National Pension System):</strong> Applicable to TN Government employees who joined service on or after 01.04.2003.
          Employee contributes 10% and Government contributes 14% of (Basic + DA).
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
                Current Basic Pay (₹)
              </label>
              <input
                type="number"
                value={basicPay}
                onChange={(e) => setBasicPay(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Age
                </label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
                  min={20}
                  max={59}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Retirement Age
                </label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
                  min={currentAge + 1}
                  max={65}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current NPS Corpus (₹)
              </label>
              <input
                type="number"
                value={currentCorpus}
                onChange={(e) => setCurrentCorpus(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Annual Return (%)
              </label>
              <select
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
              >
                <option value={8}>8% (Conservative)</option>
                <option value={9}>9% (Moderate-Low)</option>
                <option value={10}>10% (Moderate)</option>
                <option value={11}>11% (Moderate-High)</option>
                <option value={12}>12% (Aggressive)</option>
              </select>
            </div>
          </div>

          {/* Monthly Contribution Summary */}
          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <h3 className="font-medium text-orange-800 mb-2">Monthly Contribution</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Your Contribution (10%)</span>
                <span className="font-medium">{formatCurrency(calculations.employeeContribution)}</span>
              </div>
              <div className="flex justify-between">
                <span>Govt Contribution (14%)</span>
                <span className="font-medium">{formatCurrency(calculations.govtContribution)}</span>
              </div>
              <div className="flex justify-between border-t pt-1 mt-1 font-semibold">
                <span>Total Monthly</span>
                <span className="text-orange-600">{formatCurrency(calculations.totalMonthlyContribution)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Corpus at Retirement */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <p className="text-orange-100 text-sm">Estimated Corpus at Retirement</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(calculations.totalCorpus)}</p>
            <p className="text-orange-100 text-sm mt-2">
              After {calculations.yearsToRetirement} years
            </p>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">At Retirement Options</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Lump Sum Withdrawal (up to 60%)</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(calculations.lumpSumAmount)}</p>
                <p className="text-xs text-gray-500 mt-1">Tax-free withdrawal</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Annuity Purchase (minimum 40%)</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculations.annuityCorpus)}</p>
                <p className="text-xs text-gray-500 mt-1">For monthly pension</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Estimated Monthly Pension</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(calculations.monthlyPension)}</p>
                <p className="text-xs text-gray-500 mt-1">From annuity @ 6% p.a.</p>
              </div>
            </div>
          </div>

          {/* Total Contributions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-3">Total Contributions Till Retirement</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Your Total</p>
                <p className="font-bold text-lg">{formatCurrency(calculations.totalEmployeeContribution)}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Govt Total</p>
                <p className="font-bold text-lg">{formatCurrency(calculations.totalGovtContribution)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NPS Rules */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          NPS Rules for Government Employees
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Contribution:</p>
            <ul className="space-y-1">
              <li>• Employee: 10% of (Basic + DA)</li>
              <li>• Government: 14% of (Basic + DA)</li>
              <li>• Deducted monthly from salary</li>
              <li>• Invested in Pension Funds (LIC, SBI, etc.)</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">At Retirement:</p>
            <ul className="space-y-1">
              <li>• Withdraw up to 60% as lump sum (tax-free)</li>
              <li>• Minimum 40% must buy annuity</li>
              <li>• Annuity provides monthly pension</li>
              <li>• Can exit after age 60</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tax Benefits */}
      <div className="mt-6 bg-green-50 rounded-xl p-6">
        <h3 className="font-semibold text-green-800 mb-3">Tax Benefits of NPS</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-green-700">
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium">Section 80CCD(1)</p>
            <p>Up to 10% of salary - within ₹1.5L limit of 80C</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium">Section 80CCD(1B)</p>
            <p>Additional ₹50,000 deduction - exclusive to NPS</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium">Section 80CCD(2)</p>
            <p>Govt contribution (14%) - no limit, extra benefit</p>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/gpf-interest-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          GPF Calculator (Old Pension)
        </Link>
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
