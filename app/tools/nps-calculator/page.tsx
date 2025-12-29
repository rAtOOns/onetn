"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, PiggyBank, Calculator, Info, Printer, Scale, TrendingUp, Shield } from "lucide-react";
import { CURRENT_DA_RATE, NPS_EMPLOYEE_CONTRIBUTION, NPS_GOVT_CONTRIBUTION } from "@/lib/constants/rates";

const CURRENT_DA = CURRENT_DA_RATE;
const EMPLOYEE_CONTRIBUTION = NPS_EMPLOYEE_CONTRIBUTION;
const GOVT_CONTRIBUTION = NPS_GOVT_CONTRIBUTION;

type TabType = "calculator" | "comparison";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function NPSCalculatorPage() {
  const [activeTab, setActiveTab] = useState<TabType>("calculator");
  const [basicPay, setBasicPay] = useState<number>(56100);
  const [currentAge, setCurrentAge] = useState<number>(35);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [currentCorpus, setCurrentCorpus] = useState<number>(500000);
  const [expectedReturn, setExpectedReturn] = useState<number>(10);
  const [yearsOfService, setYearsOfService] = useState<number>(25);
  const [lastBasicPay, setLastBasicPay] = useState<number>(120000);

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
    const lumpSumPercent = 60;
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

  // OPS vs NPS Comparison calculations
  const comparison = useMemo(() => {
    const lastDA = Math.round((lastBasicPay * CURRENT_DA) / 100);
    const lastDrawnSalary = lastBasicPay + lastDA;

    // OPS Calculation (Old Pension Scheme)
    const qualifyingService = Math.min(yearsOfService, 33);
    const opsBasicPension = Math.round((lastBasicPay * qualifyingService) / 66); // 50% for 33 years
    const opsPensionWithDA = opsBasicPension + Math.round((opsBasicPension * CURRENT_DA) / 100);

    // OPS Benefits
    const opsGratuity = Math.round((lastBasicPay + lastDA) * 16.5 / 2); // Gratuity formula
    const opsCommutation = Math.round(opsBasicPension * 0.4 * 8.194 * 12); // 40% commutation at age 60
    const opsReducedPension = Math.round(opsBasicPension * 0.6); // After commutation
    const opsReducedPensionWithDA = opsReducedPension + Math.round((opsReducedPension * CURRENT_DA) / 100);

    // Family Pension (OPS)
    const opsFamilyPensionEnhanced = Math.round(opsBasicPension * 0.5); // 50% for first 7 years
    const opsFamilyPensionNormal = Math.round(opsBasicPension * 0.3); // 30% thereafter

    // NPS Calculation (at retirement with similar parameters)
    const npsMonthlyContribution = Math.round((lastDrawnSalary * 0.24)); // 10% + 14%
    const npsCorpus = npsMonthlyContribution * yearsOfService * 12 * 1.5; // Approximate with returns
    const npsLumpSum = Math.round(npsCorpus * 0.6);
    const npsAnnuityCorpus = npsCorpus * 0.4;
    const npsPension = Math.round((npsAnnuityCorpus * 0.06) / 12);

    // NPS Family - depends on nominee continuing annuity or getting corpus
    const npsFamilyLumpSum = Math.round(npsCorpus * 0.6); // If death before retirement

    return {
      ops: {
        basicPension: opsBasicPension,
        pensionWithDA: opsPensionWithDA,
        gratuity: opsGratuity,
        commutationAmount: opsCommutation,
        reducedPension: opsReducedPension,
        reducedPensionWithDA: opsReducedPensionWithDA,
        familyPensionEnhanced: opsFamilyPensionEnhanced,
        familyPensionNormal: opsFamilyPensionNormal,
        totalLumpSum: opsGratuity + opsCommutation,
        daRevisionBenefit: "Yes - Pension increases with DA",
      },
      nps: {
        estimatedCorpus: Math.round(npsCorpus),
        lumpSum: npsLumpSum,
        monthlyPension: npsPension,
        familyBenefit: npsFamilyLumpSum,
        totalContribution: npsMonthlyContribution * yearsOfService * 12,
        daRevisionBenefit: "No - Fixed annuity amount",
      },
    };
  }, [lastBasicPay, yearsOfService]);

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

      {/* Tab Selection */}
      <div className="bg-white rounded-xl shadow-sm border p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "calculator"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Calculator size={16} />
            NPS Calculator
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "comparison"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Scale size={16} />
            NPS vs OPS Comparison
          </button>
        </div>
      </div>

      {activeTab === "calculator" && (
        <>
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
        </>
      )}

      {activeTab === "comparison" && (
        <>
          {/* Comparison Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-4 mb-6">
            <p className="font-semibold flex items-center gap-2">
              <Scale size={18} />
              Old Pension Scheme (OPS) vs New Pension Scheme (NPS)
            </p>
            <p className="text-sm text-white/80 mt-1">
              Compare benefits for employees joined before and after 01.04.2003
            </p>
          </div>

          {/* Input for Comparison */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h2 className="font-semibold text-tn-text mb-4">Enter Retirement Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Drawn Basic Pay (₹)
                </label>
                <input
                  type="number"
                  value={lastBasicPay}
                  onChange={(e) => setLastBasicPay(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Qualifying Service
                </label>
                <input
                  type="number"
                  value={yearsOfService}
                  onChange={(e) => setYearsOfService(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  min={10}
                  max={40}
                />
              </div>
            </div>
          </div>

          {/* Side by Side Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* OPS Column */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={24} />
                  <h3 className="text-xl font-bold">Old Pension Scheme (OPS)</h3>
                </div>
                <p className="text-green-100 text-sm">For employees joined before 01.04.2003</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="font-semibold text-green-700 mb-4">Monthly Pension</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-600">Basic Pension</span>
                    <span className="font-bold text-green-600">{formatCurrency(comparison.ops.basicPension)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-600">Pension + DA ({CURRENT_DA}%)</span>
                    <span className="font-bold text-green-600">{formatCurrency(comparison.ops.pensionWithDA)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-amber-50 rounded-lg">
                    <span className="text-gray-600">After 40% Commutation</span>
                    <span className="font-bold text-amber-600">{formatCurrency(comparison.ops.reducedPensionWithDA)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="font-semibold text-green-700 mb-4">Lump Sum Benefits</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Gratuity</span>
                    <span className="font-medium">{formatCurrency(comparison.ops.gratuity)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Commutation (40%)</span>
                    <span className="font-medium">{formatCurrency(comparison.ops.commutationAmount)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-100 rounded-lg">
                    <span className="font-medium">Total Lump Sum</span>
                    <span className="font-bold text-green-700">{formatCurrency(comparison.ops.totalLumpSum)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="font-semibold text-green-700 mb-4">Family Pension</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Enhanced (First 7 years)</span>
                    <span className="font-medium">{formatCurrency(comparison.ops.familyPensionEnhanced)}/month</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Normal (Thereafter)</span>
                    <span className="font-medium">{formatCurrency(comparison.ops.familyPensionNormal)}/month</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Key Advantages
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✓ Pension increases with DA revision</li>
                  <li>✓ Guaranteed 50% of last pay (for 33 yrs)</li>
                  <li>✓ Family pension for life</li>
                  <li>✓ Commutation restores after 15 years</li>
                  <li>✓ No market risk</li>
                </ul>
              </div>
            </div>

            {/* NPS Column */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <PiggyBank size={24} />
                  <h3 className="text-xl font-bold">New Pension Scheme (NPS)</h3>
                </div>
                <p className="text-orange-100 text-sm">For employees joined on or after 01.04.2003</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="font-semibold text-orange-700 mb-4">Estimated Corpus & Pension</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-gray-600">Total Corpus</span>
                    <span className="font-bold text-orange-600">{formatCurrency(comparison.nps.estimatedCorpus)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-gray-600">Monthly Pension (est.)</span>
                    <span className="font-bold text-orange-600">{formatCurrency(comparison.nps.monthlyPension)}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Pension depends on annuity rate at retirement</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="font-semibold text-orange-700 mb-4">Lump Sum Benefits</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Lump Sum (60%)</span>
                    <span className="font-medium">{formatCurrency(comparison.nps.lumpSum)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Contribution</span>
                    <span className="font-medium">{formatCurrency(comparison.nps.totalContribution)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-orange-100 rounded-lg">
                    <span className="font-medium">Tax-Free Withdrawal</span>
                    <span className="font-bold text-orange-700">{formatCurrency(comparison.nps.lumpSum)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="font-semibold text-orange-700 mb-4">Family Benefits</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">On Death (before retirement)</span>
                    <span className="font-medium">Full corpus to nominee</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">On Death (after retirement)</span>
                    <span className="font-medium">Depends on annuity type</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-4">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Key Features
                </h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>✓ Higher lump sum possible</li>
                  <li>✓ Portability across jobs</li>
                  <li>✓ Tax benefits under 80CCD</li>
                  <li>✗ Pension fixed at retirement (no DA)</li>
                  <li>✗ Market-linked returns (risk)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Summary Comparison Table */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="font-semibold text-tn-text">Quick Comparison Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium">Feature</th>
                    <th className="text-center p-4 font-medium text-green-600">OPS</th>
                    <th className="text-center p-4 font-medium text-orange-600">NPS</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-4">Pension Formula</td>
                    <td className="p-4 text-center">50% of Last Basic (33 yrs)</td>
                    <td className="p-4 text-center">Based on Corpus & Annuity</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4">DA on Pension</td>
                    <td className="p-4 text-center text-green-600 font-medium">Yes ✓</td>
                    <td className="p-4 text-center text-red-600 font-medium">No ✗</td>
                  </tr>
                  <tr>
                    <td className="p-4">Market Risk</td>
                    <td className="p-4 text-center text-green-600 font-medium">None ✓</td>
                    <td className="p-4 text-center text-red-600 font-medium">Yes ✗</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4">Employee Contribution</td>
                    <td className="p-4 text-center">GPF (Optional)</td>
                    <td className="p-4 text-center">10% Mandatory</td>
                  </tr>
                  <tr>
                    <td className="p-4">Govt Contribution</td>
                    <td className="p-4 text-center">Fully Funded</td>
                    <td className="p-4 text-center">14% of Basic+DA</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4">Family Pension</td>
                    <td className="p-4 text-center">30-50% for life</td>
                    <td className="p-4 text-center">Depends on annuity</td>
                  </tr>
                  <tr>
                    <td className="p-4">Commutation</td>
                    <td className="p-4 text-center">Up to 40%, restores</td>
                    <td className="p-4 text-center">60% lump sum</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Important Note */}
          <div className="mt-6 bg-amber-50 rounded-xl p-6">
            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <Info size={18} />
              Important Notes
            </h3>
            <ul className="text-sm text-amber-700 space-y-2">
              <li>• NPS calculations are estimates based on assumed returns and annuity rates</li>
              <li>• Actual NPS pension depends on market performance and annuity rates at retirement</li>
              <li>• OPS provides inflation protection through DA revisions</li>
              <li>• Several state governments are reverting to OPS - check latest government orders</li>
              <li>• This comparison is for educational purposes only</li>
            </ul>
          </div>
        </>
      )}

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/gpf-interest-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          GPF Calculator
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
