"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, Info, Calculator } from "lucide-react";

// Pension calculation constants for TN Government
const MAX_PENSION_PERCENT = 50; // 50% of last pay for full service
const FULL_SERVICE_YEARS = 33; // Years required for full pension
const MIN_SERVICE_YEARS = 10; // Minimum years for pension eligibility
const MAX_COMMUTATION_PERCENT = 40; // Maximum commutation allowed
const COMMUTATION_FACTOR = 8.194; // For age 60
const FAMILY_PENSION_PERCENT = 30; // 30% of last pay

// Commutation factors by age
const commutationFactors: Record<number, number> = {
  55: 9.075, 56: 8.943, 57: 8.808, 58: 8.671, 59: 8.531,
  60: 8.194, 61: 8.047, 62: 7.897, 63: 7.744, 64: 7.587,
  65: 7.427,
};

// Dearness Relief rate (current)
const DR_RATE = 50; // 50% DR

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PensionCalculatorPage() {
  const [lastBasicPay, setLastBasicPay] = useState<number>(78800);
  const [serviceYears, setServiceYears] = useState<number>(33);
  const [serviceMonths, setServiceMonths] = useState<number>(0);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [commutationPercent, setCommutationPercent] = useState<number>(40);

  const calculations = useMemo(() => {
    // Total service in years (with months as fraction)
    const totalService = serviceYears + serviceMonths / 12;

    // Check eligibility
    const isEligible = totalService >= MIN_SERVICE_YEARS;

    // Calculate pension percentage based on service
    // Full pension (50%) for 33 years, proportionate for less
    const pensionPercent = Math.min(
      (totalService / FULL_SERVICE_YEARS) * MAX_PENSION_PERCENT,
      MAX_PENSION_PERCENT
    );

    // Basic pension (before commutation)
    const basicPension = Math.round((lastBasicPay * pensionPercent) / 100);

    // Commutation calculation
    const commutationFactor = commutationFactors[retirementAge] || 8.194;
    const commutedPension = Math.round((basicPension * commutationPercent) / 100);
    const commutedValue = Math.round(commutedPension * 12 * commutationFactor);

    // Reduced pension after commutation
    const reducedPension = basicPension - commutedPension;

    // Dearness Relief on reduced pension
    const dearnessRelief = Math.round((reducedPension * DR_RATE) / 100);

    // Total monthly pension
    const totalMonthlyPension = reducedPension + dearnessRelief;

    // Family Pension
    const familyPension = Math.round((lastBasicPay * FAMILY_PENSION_PERCENT) / 100);
    const familyPensionWithDR = familyPension + Math.round((familyPension * DR_RATE) / 100);

    return {
      isEligible,
      totalService,
      pensionPercent,
      basicPension,
      commutedPension,
      commutedValue,
      reducedPension,
      dearnessRelief,
      totalMonthlyPension,
      familyPension,
      familyPensionWithDR,
      commutationFactor,
    };
  }, [lastBasicPay, serviceYears, serviceMonths, retirementAge, commutationPercent]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Wallet className="text-purple-600" size={28} />
            Pension Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">ஓய்வூதிய கால்குலேட்டர்</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> This calculator provides estimates based on TN Government pension rules.
          Actual pension may vary. Current DR rate: {DR_RATE}%.
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
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                min={15700}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Years
                </label>
                <input
                  type="number"
                  value={serviceYears}
                  onChange={(e) => setServiceYears(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                  min={0}
                  max={40}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Months
                </label>
                <input
                  type="number"
                  value={serviceMonths}
                  onChange={(e) => setServiceMonths(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                  min={0}
                  max={11}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retirement Age
              </label>
              <select
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
              >
                {[55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65].map((age) => (
                  <option key={age} value={age}>{age} years</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commutation: {commutationPercent}%
              </label>
              <input
                type="range"
                value={commutationPercent}
                onChange={(e) => setCommutationPercent(Number(e.target.value))}
                className="w-full accent-purple-500"
                min={0}
                max={40}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0% (No commutation)</span>
                <span>40% (Maximum)</span>
              </div>
            </div>
          </div>

          {/* Eligibility Status */}
          <div className={`mt-6 p-4 rounded-lg ${calculations.isEligible ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`font-medium ${calculations.isEligible ? 'text-green-700' : 'text-red-700'}`}>
              {calculations.isEligible
                ? `✓ Eligible for pension (${calculations.totalService.toFixed(1)} years service)`
                : `✗ Not eligible (minimum ${MIN_SERVICE_YEARS} years required)`}
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Monthly Pension Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={20} />
              <span className="text-purple-200 text-sm">Monthly Pension (after commutation)</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(calculations.totalMonthlyPension)}</p>
            <p className="text-purple-200 text-sm mt-2">
              Basic: {formatCurrency(calculations.reducedPension)} + DR: {formatCurrency(calculations.dearnessRelief)}
            </p>
          </div>

          {/* Pension Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <Calculator size={18} className="text-purple-500" />
              Pension Breakdown
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Basic Pay</span>
                <span className="font-medium">{formatCurrency(lastBasicPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pension % (for {calculations.totalService.toFixed(1)} yrs)</span>
                <span className="font-medium">{calculations.pensionPercent.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-700 font-medium">Basic Pension</span>
                <span className="font-bold">{formatCurrency(calculations.basicPension)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Less: Commuted ({commutationPercent}%)</span>
                <span>-{formatCurrency(calculations.commutedPension)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reduced Pension</span>
                <span className="font-medium">{formatCurrency(calculations.reducedPension)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Add: DR ({DR_RATE}%)</span>
                <span>+{formatCurrency(calculations.dearnessRelief)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold text-purple-700">Total Monthly Pension</span>
                <span className="font-bold text-purple-700">{formatCurrency(calculations.totalMonthlyPension)}</span>
              </div>
            </div>
          </div>

          {/* Commutation Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Commutation Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Commutation Factor (Age {retirementAge})</span>
                <span className="font-medium">{calculations.commutationFactor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commuted Pension Amount</span>
                <span className="font-medium">{formatCurrency(calculations.commutedPension)}/month</span>
              </div>
              <div className="flex justify-between border-t pt-2 bg-yellow-50 -mx-6 px-6 py-2">
                <span className="font-bold text-yellow-800">Lump Sum Amount</span>
                <span className="font-bold text-yellow-800 text-lg">{formatCurrency(calculations.commutedValue)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Formula: Commuted Pension × 12 × Commutation Factor
            </p>
          </div>

          {/* Family Pension */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Family Pension</h3>
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Basic Family Pension ({FAMILY_PENSION_PERCENT}%)</span>
              <span className="font-medium">{formatCurrency(calculations.familyPension)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-blue-700">With DR ({DR_RATE}%)</span>
              <span className="font-bold">{formatCurrency(calculations.familyPensionWithDR)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About Pension Calculation
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Basic Pension:</strong> 50% of last drawn Basic Pay for 33 years of qualifying service.</p>
          <p><strong>Proportionate Pension:</strong> For service less than 33 years, pension is calculated proportionately.</p>
          <p><strong>Commutation:</strong> Up to 40% of pension can be commuted to receive a lump sum amount.</p>
          <p><strong>Dearness Relief:</strong> DR is added to pension and revised periodically (currently {DR_RATE}%).</p>
          <p><strong>Family Pension:</strong> 30% of last Basic Pay payable to eligible family members.</p>
        </div>
      </div>
    </div>
  );
}
