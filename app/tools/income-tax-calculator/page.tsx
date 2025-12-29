"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Info, Receipt, Home, Printer } from "lucide-react";
import { CURRENT_DA_RATE, HRA_RATES } from "@/lib/constants/rates";

// Tax slabs for FY 2024-25 (AY 2025-26)
const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 },
];

const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 700000, rate: 5 },
  { min: 700000, max: 1000000, rate: 10 },
  { min: 1000000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Infinity, rate: 30 },
];

// Standard Deduction
const STANDARD_DEDUCTION_OLD = 50000;
const STANDARD_DEDUCTION_NEW = 75000; // Increased in Budget 2024

// Section 87A Rebate limits
const REBATE_LIMIT_OLD = 500000;
const REBATE_LIMIT_NEW = 700000;
const MAX_REBATE_OLD = 12500;
const MAX_REBATE_NEW = 25000;

// Format currency in Indian format
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Calculate tax based on slabs
function calculateTaxFromSlabs(income: number, slabs: typeof OLD_REGIME_SLABS): number {
  let tax = 0;
  let remainingIncome = income;

  for (const slab of slabs) {
    if (remainingIncome <= 0) break;

    const taxableInSlab = Math.min(remainingIncome, slab.max - slab.min);
    tax += (taxableInSlab * slab.rate) / 100;
    remainingIncome -= taxableInSlab;
  }

  return Math.round(tax);
}

// Calculate HRA Exemption (minimum of 3 values)
function calculateHRAExemption(
  basicPay: number,
  daPercent: number,
  hraReceived: number,
  rentPaid: number,
  cityCategory: "X" | "Y" | "Z"
): { exemption: number; breakdown: { actual: number; rentMinus10: number; percentOfSalary: number } } {
  const basicPlusDA = basicPay + (basicPay * daPercent / 100);

  // HRA percentage based on city
  const hraPercent = cityCategory === "X" ? 50 : 40;

  // Three conditions for HRA exemption
  const actualHRA = hraReceived;
  const rentMinus10 = Math.max(0, rentPaid - (0.1 * basicPlusDA));
  const percentOfSalary = (hraPercent / 100) * basicPlusDA;

  const exemption = Math.min(actualHRA, rentMinus10, percentOfSalary);

  return {
    exemption: Math.round(exemption * 12), // Annual
    breakdown: {
      actual: Math.round(actualHRA * 12),
      rentMinus10: Math.round(rentMinus10 * 12),
      percentOfSalary: Math.round(percentOfSalary * 12),
    }
  };
}

export default function IncomeTaxCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState<number>(800000);
  const [regime, setRegime] = useState<"old" | "new">("new");

  // Basic details for HRA calculation
  const [basicPay, setBasicPay] = useState<number>(50000);
  const [hraReceived, setHraReceived] = useState<number>(8000);
  const [rentPaid, setRentPaid] = useState<number>(15000);
  const [cityCategory, setCityCategory] = useState<"X" | "Y" | "Z">("Y");
  const [showHRACalculator, setShowHRACalculator] = useState<boolean>(false);

  // Old Regime Deductions
  const [section80C, setSection80C] = useState<number>(150000);
  const [section80D, setSection80D] = useState<number>(25000);
  const [section80G, setSection80G] = useState<number>(0);
  const [hraExemption, setHraExemption] = useState<number>(0);
  const [lta, setLta] = useState<number>(0);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(0);
  const [nps80CCD, setNps80CCD] = useState<number>(50000);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  // HRA Calculation
  const hraCalculation = useMemo(() => {
    return calculateHRAExemption(basicPay, CURRENT_DA_RATE, hraReceived, rentPaid, cityCategory);
  }, [basicPay, hraReceived, rentPaid, cityCategory]);

  const calculations = useMemo(() => {
    const standardDeduction = regime === "old" ? STANDARD_DEDUCTION_OLD : STANDARD_DEDUCTION_NEW;

    // Gross income after standard deduction
    let taxableIncome = grossSalary - standardDeduction;

    // Old regime specific deductions
    let totalDeductions = standardDeduction;
    if (regime === "old") {
      const section80CLimit = Math.min(section80C, 150000);
      const section80DLimit = Math.min(section80D, 100000); // Max limit
      const homeLoanLimit = Math.min(homeLoanInterest, 200000);
      const npsLimit = Math.min(nps80CCD, 50000);

      totalDeductions += section80CLimit + section80DLimit + section80G +
                         hraExemption + lta + homeLoanLimit + npsLimit + otherDeductions;

      taxableIncome = grossSalary - totalDeductions;
    }

    taxableIncome = Math.max(0, taxableIncome);

    // Calculate tax based on regime
    const slabs = regime === "old" ? OLD_REGIME_SLABS : NEW_REGIME_SLABS;
    let tax = calculateTaxFromSlabs(taxableIncome, slabs);

    // Apply Section 87A Rebate
    const rebateLimit = regime === "old" ? REBATE_LIMIT_OLD : REBATE_LIMIT_NEW;
    const maxRebate = regime === "old" ? MAX_REBATE_OLD : MAX_REBATE_NEW;
    let rebate = 0;

    if (taxableIncome <= rebateLimit) {
      rebate = Math.min(tax, maxRebate);
    }

    const taxAfterRebate = tax - rebate;

    // Health & Education Cess (4%)
    const cess = Math.round(taxAfterRebate * 0.04);
    const totalTax = taxAfterRebate + cess;

    // Monthly breakdown
    const monthlyTax = Math.round(totalTax / 12);
    const monthlyGross = Math.round(grossSalary / 12);
    const monthlyNet = monthlyGross - monthlyTax;

    // Effective tax rate
    const effectiveRate = grossSalary > 0 ? ((totalTax / grossSalary) * 100).toFixed(2) : "0";

    return {
      grossSalary,
      standardDeduction,
      totalDeductions,
      taxableIncome,
      taxBeforeRebate: tax,
      rebate,
      taxAfterRebate,
      cess,
      totalTax,
      monthlyTax,
      monthlyGross,
      monthlyNet,
      effectiveRate,
    };
  }, [grossSalary, regime, section80C, section80D, section80G, hraExemption, lta, homeLoanInterest, nps80CCD, otherDeductions]);

  // Compare regimes
  const comparison = useMemo(() => {
    // Calculate for old regime
    const oldTaxable = Math.max(0, grossSalary - STANDARD_DEDUCTION_OLD -
      Math.min(section80C, 150000) - Math.min(section80D, 100000) - section80G -
      hraExemption - lta - Math.min(homeLoanInterest, 200000) - Math.min(nps80CCD, 50000) - otherDeductions);

    let oldTax = calculateTaxFromSlabs(oldTaxable, OLD_REGIME_SLABS);
    if (oldTaxable <= REBATE_LIMIT_OLD) {
      oldTax = Math.max(0, oldTax - Math.min(oldTax, MAX_REBATE_OLD));
    }
    const oldTotal = oldTax + Math.round(oldTax * 0.04);

    // Calculate for new regime
    const newTaxable = Math.max(0, grossSalary - STANDARD_DEDUCTION_NEW);
    let newTax = calculateTaxFromSlabs(newTaxable, NEW_REGIME_SLABS);
    if (newTaxable <= REBATE_LIMIT_NEW) {
      newTax = Math.max(0, newTax - Math.min(newTax, MAX_REBATE_NEW));
    }
    const newTotal = newTax + Math.round(newTax * 0.04);

    return {
      oldRegimeTax: oldTotal,
      newRegimeTax: newTotal,
      savings: Math.abs(oldTotal - newTotal),
      recommended: oldTotal < newTotal ? "old" : "new",
    };
  }, [grossSalary, section80C, section80D, section80G, hraExemption, lta, homeLoanInterest, nps80CCD, otherDeductions]);

  const applyHRACalculation = () => {
    setHraExemption(hraCalculation.exemption);
    setShowHRACalculator(false);
  };

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
              <Receipt className="text-purple-600" size={28} />
              Income Tax Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">
              வருமான வரி கணக்கிடுதல் - FY 2024-25
            </p>
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

      {/* Regime Comparison Card */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white mb-6">
        <h2 className="text-lg font-semibold mb-4">Regime Comparison</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`bg-white/10 rounded-lg p-4 ${comparison.recommended === "old" ? "ring-2 ring-green-400" : ""}`}>
            <p className="text-purple-200 text-sm">Old Regime Tax</p>
            <p className="text-2xl font-bold">{formatCurrency(comparison.oldRegimeTax)}</p>
            {comparison.recommended === "old" && (
              <span className="text-xs bg-green-400 text-green-900 px-2 py-0.5 rounded-full">Recommended</span>
            )}
          </div>
          <div className={`bg-white/10 rounded-lg p-4 ${comparison.recommended === "new" ? "ring-2 ring-green-400" : ""}`}>
            <p className="text-purple-200 text-sm">New Regime Tax</p>
            <p className="text-2xl font-bold">{formatCurrency(comparison.newRegimeTax)}</p>
            {comparison.recommended === "new" && (
              <span className="text-xs bg-green-400 text-green-900 px-2 py-0.5 rounded-full">Recommended</span>
            )}
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-purple-200 text-sm">You Save</p>
            <p className="text-2xl font-bold text-green-300">{formatCurrency(comparison.savings)}</p>
            <p className="text-xs text-purple-200">with {comparison.recommended} regime</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Basic Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4">Income Details</h2>

            <div className="space-y-4">
              {/* Annual Gross Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Gross Salary (₹)
                </label>
                <input
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Monthly: {formatCurrency(grossSalary / 12)}
                </p>
              </div>

              {/* Tax Regime */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tax Regime
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRegime("new")}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      regime === "new"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium">New Regime</span>
                    <p className="text-xs text-gray-500">No deductions, Lower rates</p>
                  </button>
                  <button
                    onClick={() => setRegime("old")}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      regime === "old"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium">Old Regime</span>
                    <p className="text-xs text-gray-500">With deductions</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Deductions (Old Regime Only) */}
          {regime === "old" && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="font-semibold text-tn-text mb-4">Deductions (Old Regime)</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section 80C (Max ₹1.5L)
                  </label>
                  <input
                    type="number"
                    value={section80C}
                    onChange={(e) => setSection80C(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm"
                    max={150000}
                  />
                  <p className="text-xs text-gray-500">GPF, PPF, LIC, ELSS, etc.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section 80D - Medical Insurance
                  </label>
                  <input
                    type="number"
                    value={section80D}
                    onChange={(e) => setSection80D(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm"
                    max={100000}
                  />
                </div>

                {/* HRA Exemption with Calculator */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">
                      HRA Exemption (Annual)
                    </label>
                    <button
                      onClick={() => setShowHRACalculator(!showHRACalculator)}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Calculator size={12} />
                      {showHRACalculator ? "Hide Calculator" : "Calculate HRA"}
                    </button>
                  </div>
                  <input
                    type="number"
                    value={hraExemption}
                    onChange={(e) => setHraExemption(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm"
                  />

                  {/* HRA Calculator */}
                  {showHRACalculator && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-lg space-y-3">
                      <h4 className="font-medium text-blue-800 flex items-center gap-2">
                        <Home size={16} />
                        HRA Exemption Calculator
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-600">Monthly Basic Pay</label>
                          <input
                            type="number"
                            value={basicPay}
                            onChange={(e) => setBasicPay(Number(e.target.value))}
                            className="w-full border rounded p-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Monthly HRA Received</label>
                          <input
                            type="number"
                            value={hraReceived}
                            onChange={(e) => setHraReceived(Number(e.target.value))}
                            className="w-full border rounded p-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Monthly Rent Paid</label>
                          <input
                            type="number"
                            value={rentPaid}
                            onChange={(e) => setRentPaid(Number(e.target.value))}
                            className="w-full border rounded p-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">City Category</label>
                          <select
                            value={cityCategory}
                            onChange={(e) => setCityCategory(e.target.value as "X" | "Y" | "Z")}
                            className="w-full border rounded p-2 text-sm"
                          >
                            <option value="X">X - Metro (50%)</option>
                            <option value="Y">Y - Other cities (40%)</option>
                            <option value="Z">Z - Rural (40%)</option>
                          </select>
                        </div>
                      </div>

                      <div className="bg-white rounded p-3 space-y-2">
                        <p className="text-xs text-gray-600">HRA exemption is minimum of:</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>1. Actual HRA received</span>
                            <span className={hraCalculation.exemption === hraCalculation.breakdown.actual ? "font-bold text-green-600" : ""}>
                              {formatCurrency(hraCalculation.breakdown.actual)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>2. Rent - 10% of Salary</span>
                            <span className={hraCalculation.exemption === hraCalculation.breakdown.rentMinus10 ? "font-bold text-green-600" : ""}>
                              {formatCurrency(hraCalculation.breakdown.rentMinus10)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>3. {cityCategory === "X" ? "50" : "40"}% of Basic+DA</span>
                            <span className={hraCalculation.exemption === hraCalculation.breakdown.percentOfSalary ? "font-bold text-green-600" : ""}>
                              {formatCurrency(hraCalculation.breakdown.percentOfSalary)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t font-bold text-blue-700">
                            <span>HRA Exemption</span>
                            <span>{formatCurrency(hraCalculation.exemption)}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={applyHRACalculation}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
                      >
                        Apply This Amount
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Loan Interest (80EEA) - Max ₹2L
                  </label>
                  <input
                    type="number"
                    value={homeLoanInterest}
                    onChange={(e) => setHomeLoanInterest(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm"
                    max={200000}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NPS 80CCD(1B) - Max ₹50K
                  </label>
                  <input
                    type="number"
                    value={nps80CCD}
                    onChange={(e) => setNps80CCD(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm"
                    max={50000}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LTA Exemption
                    </label>
                    <input
                      type="number"
                      value={lta}
                      onChange={(e) => setLta(Number(e.target.value))}
                      className="w-full border rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section 80G (Donations)
                    </label>
                    <input
                      type="number"
                      value={section80G}
                      onChange={(e) => setSection80G(Number(e.target.value))}
                      className="w-full border rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Deductions
                  </label>
                  <input
                    type="number"
                    value={otherDeductions}
                    onChange={(e) => setOtherDeductions(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Tax Calculation Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4">
              Tax Calculation ({regime === "old" ? "Old" : "New"} Regime)
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Salary</span>
                <span className="font-medium">{formatCurrency(calculations.grossSalary)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>(-) Total Deductions</span>
                <span>{formatCurrency(calculations.totalDeductions)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-medium">
                <span>Taxable Income</span>
                <span>{formatCurrency(calculations.taxableIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax on Income</span>
                <span>{formatCurrency(calculations.taxBeforeRebate)}</span>
              </div>
              {calculations.rebate > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>(-) Section 87A Rebate</span>
                  <span>{formatCurrency(calculations.rebate)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax after Rebate</span>
                <span>{formatCurrency(calculations.taxAfterRebate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">(+) Health & Education Cess (4%)</span>
                <span>{formatCurrency(calculations.cess)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t text-lg font-bold text-purple-700">
                <span>Total Tax Payable</span>
                <span>{formatCurrency(calculations.totalTax)}</span>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="font-semibold text-purple-800 mb-3">Monthly Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700">Monthly Gross</span>
                <span className="font-medium">{formatCurrency(calculations.monthlyGross)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>(-) Monthly TDS</span>
                <span>{formatCurrency(calculations.monthlyTax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-purple-200 font-bold text-purple-800">
                <span>Monthly In-Hand (before other deductions)</span>
                <span>{formatCurrency(calculations.monthlyNet)}</span>
              </div>
            </div>
          </div>

          {/* Effective Rate */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Effective Tax Rate</span>
              <span className="text-2xl font-bold text-purple-600">{calculations.effectiveRate}%</span>
            </div>
          </div>

          {/* Tax Slabs Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-3">
              {regime === "old" ? "Old" : "New"} Regime Tax Slabs (FY 2024-25)
            </h3>
            <div className="space-y-2 text-sm">
              {(regime === "old" ? OLD_REGIME_SLABS : NEW_REGIME_SLABS).map((slab, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">
                    {slab.max === Infinity
                      ? `Above ${formatCurrency(slab.min)}`
                      : `${formatCurrency(slab.min)} - ${formatCurrency(slab.max)}`}
                  </span>
                  <span className="font-medium">{slab.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Important Notes
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>New Regime (Default from FY 2023-24):</strong> Standard deduction of ₹75,000 (Budget 2024).
            No other deductions allowed. Lower tax rates. Rebate up to ₹7L income.
          </p>
          <p>
            <strong>Old Regime:</strong> Standard deduction of ₹50,000. Various deductions under
            Chapter VI-A (80C, 80D, etc.) allowed. Rebate up to ₹5L income.
          </p>
          <p>
            <strong>For Government Employees:</strong> GPF contributions qualify under 80C (max ₹1.5L).
            NPS contributions get additional ₹50,000 under 80CCD(1B).
          </p>
          <p>
            <strong>HRA Exemption:</strong> Minimum of (Actual HRA, Rent - 10% of Salary, 50%/40% of Basic+DA).
            Use the HRA calculator above for accurate exemption calculation.
          </p>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/salary-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Salary Calculator
        </Link>
        <Link href="/tools/hra-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          HRA Calculator
        </Link>
        <Link href="/tools/gpf-interest-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          GPF Calculator
        </Link>
      </div>
    </div>
  );
}
