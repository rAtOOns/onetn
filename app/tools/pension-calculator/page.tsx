"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, Info, Calculator, Printer, Users } from "lucide-react";
import { CURRENT_DR_RATE, COMMUTATION_FACTORS } from "@/lib/constants/rates";

// Pension calculation constants for TN Government
const MAX_PENSION_PERCENT = 50; // 50% of last pay for full service
const FULL_SERVICE_YEARS = 33; // Years required for full pension
const MIN_SERVICE_YEARS = 10; // Minimum years for pension eligibility
const MAX_COMMUTATION_PERCENT = 40; // Maximum commutation allowed
const FAMILY_PENSION_PERCENT = 30; // 30% of last pay
const ENHANCED_FAMILY_PENSION_PERCENT = 50; // For first 7 years or until age 67

// Additional Pension for senior citizens (as per 7th CPC)
const ADDITIONAL_PENSION_RATES: Record<number, { rate: number; label: string }> = {
  80: { rate: 20, label: "80-84 years" },
  85: { rate: 30, label: "85-89 years" },
  90: { rate: 40, label: "90-94 years" },
  95: { rate: 50, label: "95-99 years" },
  100: { rate: 100, label: "100+ years" },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getAdditionalPensionRate(age: number): { rate: number; label: string } {
  if (age >= 100) return ADDITIONAL_PENSION_RATES[100];
  if (age >= 95) return ADDITIONAL_PENSION_RATES[95];
  if (age >= 90) return ADDITIONAL_PENSION_RATES[90];
  if (age >= 85) return ADDITIONAL_PENSION_RATES[85];
  if (age >= 80) return ADDITIONAL_PENSION_RATES[80];
  return { rate: 0, label: "Below 80 years" };
}

export default function PensionCalculatorPage() {
  const [lastBasicPay, setLastBasicPay] = useState<number>(78800);
  const [serviceYears, setServiceYears] = useState<number>(33);
  const [serviceMonths, setServiceMonths] = useState<number>(0);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [commutationPercent, setCommutationPercent] = useState<number>(40);
  const [currentAge, setCurrentAge] = useState<number>(65);
  const [showFamilyPension, setShowFamilyPension] = useState<boolean>(false);
  const [yearsAfterRetirement, setYearsAfterRetirement] = useState<number>(5);

  const calculations = useMemo(() => {
    // Total service in years (with months as fraction)
    const totalService = serviceYears + serviceMonths / 12;

    // Check eligibility
    const isEligible = totalService >= MIN_SERVICE_YEARS;

    // Calculate pension percentage based on service
    const pensionPercent = Math.min(
      (totalService / FULL_SERVICE_YEARS) * MAX_PENSION_PERCENT,
      MAX_PENSION_PERCENT
    );

    // Basic pension (before commutation)
    const basicPension = Math.round((lastBasicPay * pensionPercent) / 100);

    // Commutation calculation
    const commutationFactor = COMMUTATION_FACTORS[retirementAge] || 8.194;
    const commutedPension = Math.round((basicPension * commutationPercent) / 100);
    const commutedValue = Math.round(commutedPension * 12 * commutationFactor);

    // Reduced pension after commutation
    const reducedPension = basicPension - commutedPension;

    // Additional pension for 80+ (calculated on basic pension, not reduced)
    const additionalPensionInfo = getAdditionalPensionRate(currentAge);
    const additionalPension = Math.round((basicPension * additionalPensionInfo.rate) / 100);

    // Pension for calculation (after 15 years, commutation restores)
    const yearsToRestore = 15;
    const isCommutationRestored = yearsAfterRetirement >= yearsToRestore;
    const effectiveBasicPension = isCommutationRestored ? basicPension : reducedPension;

    // Dearness Relief on pension
    const dearnessRelief = Math.round((effectiveBasicPension * CURRENT_DR_RATE) / 100);
    const additionalDR = Math.round((additionalPension * CURRENT_DR_RATE) / 100);

    // Total monthly pension
    const totalMonthlyPension = effectiveBasicPension + dearnessRelief + additionalPension + additionalDR;

    // Family Pension calculations
    const familyPensionBasic = Math.round((lastBasicPay * FAMILY_PENSION_PERCENT) / 100);
    const enhancedFamilyPension = Math.round((lastBasicPay * ENHANCED_FAMILY_PENSION_PERCENT) / 100);
    const familyPensionDR = Math.round((familyPensionBasic * CURRENT_DR_RATE) / 100);
    const enhancedFamilyPensionDR = Math.round((enhancedFamilyPension * CURRENT_DR_RATE) / 100);
    const familyPensionWithDR = familyPensionBasic + familyPensionDR;
    const enhancedFamilyPensionWithDR = enhancedFamilyPension + enhancedFamilyPensionDR;

    return {
      isEligible,
      totalService,
      pensionPercent,
      basicPension,
      commutedPension,
      commutedValue,
      reducedPension,
      effectiveBasicPension,
      dearnessRelief,
      additionalPension,
      additionalPensionInfo,
      additionalDR,
      totalMonthlyPension,
      familyPensionBasic,
      enhancedFamilyPension,
      familyPensionWithDR,
      enhancedFamilyPensionWithDR,
      commutationFactor,
      isCommutationRestored,
    };
  }, [lastBasicPay, serviceYears, serviceMonths, retirementAge, commutationPercent, currentAge, yearsAfterRetirement]);

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
              <Wallet className="text-purple-600" size={28} />
              Pension Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">ஓய்வூதிய கால்குலேட்டர்</p>
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

      {/* Toggle */}
      <div className="bg-white rounded-xl shadow-sm border p-2 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setShowFamilyPension(false)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !showFamilyPension ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Wallet size={16} />
            Regular Pension
          </button>
          <button
            onClick={() => setShowFamilyPension(true)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFamilyPension ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Users size={16} />
            Family Pension
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> This calculator provides estimates based on TN Government pension rules.
          Actual pension may vary. Current DR rate: {CURRENT_DR_RATE}%.
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
                {Object.keys(COMMUTATION_FACTORS).map((age) => (
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Age (for Additional Pension)
                </label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                  min={60}
                  max={110}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years After Retirement
                </label>
                <input
                  type="number"
                  value={yearsAfterRetirement}
                  onChange={(e) => setYearsAfterRetirement(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                  min={0}
                  max={50}
                />
              </div>
            </div>

            {/* Eligibility Status */}
            <div className={`p-4 rounded-lg ${calculations.isEligible ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`font-medium ${calculations.isEligible ? 'text-green-700' : 'text-red-700'}`}>
                {calculations.isEligible
                  ? `✓ Eligible for pension (${calculations.totalService.toFixed(1)} years service)`
                  : `✗ Not eligible (minimum ${MIN_SERVICE_YEARS} years required)`}
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {!showFamilyPension ? (
            <>
              {/* Monthly Pension Card */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet size={20} />
                  <span className="text-purple-200 text-sm">Total Monthly Pension</span>
                </div>
                <p className="text-3xl font-bold">{formatCurrency(calculations.totalMonthlyPension)}</p>
                <div className="mt-3 text-sm text-purple-200 space-y-1">
                  <p>Basic: {formatCurrency(calculations.effectiveBasicPension)} + DR: {formatCurrency(calculations.dearnessRelief)}</p>
                  {calculations.additionalPension > 0 && (
                    <p>+ Additional (80+): {formatCurrency(calculations.additionalPension + calculations.additionalDR)}</p>
                  )}
                </div>
                {calculations.isCommutationRestored && (
                  <p className="mt-2 text-xs bg-green-400/20 px-2 py-1 rounded inline-block">
                    ✓ Commutation restored after 15 years
                  </p>
                )}
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
                  {commutationPercent > 0 && !calculations.isCommutationRestored && (
                    <div className="flex justify-between text-red-600">
                      <span>Less: Commuted ({commutationPercent}%)</span>
                      <span>-{formatCurrency(calculations.commutedPension)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effective Basic Pension</span>
                    <span className="font-medium">{formatCurrency(calculations.effectiveBasicPension)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Add: DR ({CURRENT_DR_RATE}%)</span>
                    <span>+{formatCurrency(calculations.dearnessRelief)}</span>
                  </div>
                  {calculations.additionalPension > 0 && (
                    <>
                      <div className="flex justify-between text-blue-600">
                        <span>Add: Additional Pension ({calculations.additionalPensionInfo.label})</span>
                        <span>+{formatCurrency(calculations.additionalPension)}</span>
                      </div>
                      <div className="flex justify-between text-blue-600">
                        <span>Add: DR on Additional</span>
                        <span>+{formatCurrency(calculations.additionalDR)}</span>
                      </div>
                    </>
                  )}
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
                  Commuted pension restores after 15 years from retirement.
                </p>
              </div>

              {/* Additional Pension Info */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-blue-800 mb-3">Additional Pension for Senior Citizens</h3>
                <div className="grid grid-cols-5 gap-2 text-center text-sm">
                  {Object.entries(ADDITIONAL_PENSION_RATES).map(([age, info]) => (
                    <div
                      key={age}
                      className={`p-2 rounded-lg ${currentAge >= Number(age) ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <p className="font-bold">{info.rate}%</p>
                      <p className="text-xs">{age}+ yrs</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Family Pension Card */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={20} />
                  <span className="text-blue-200 text-sm">Family Pension</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-blue-200 text-xs">Enhanced (First 7 years / till 67)</p>
                    <p className="text-2xl font-bold">{formatCurrency(calculations.enhancedFamilyPensionWithDR)}</p>
                    <p className="text-blue-200 text-xs">{ENHANCED_FAMILY_PENSION_PERCENT}% of Last Pay</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs">Normal (After 7 years)</p>
                    <p className="text-2xl font-bold">{formatCurrency(calculations.familyPensionWithDR)}</p>
                    <p className="text-blue-200 text-xs">{FAMILY_PENSION_PERCENT}% of Last Pay</p>
                  </div>
                </div>
              </div>

              {/* Family Pension Rules */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">Family Pension Eligibility</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-700">Spouse</p>
                    <p className="text-gray-600">Lifetime (unless remarried)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-700">Unmarried/Divorced/Widowed Daughter</p>
                    <p className="text-gray-600">Until marriage or earning ₹9,000+/month</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-700">Son</p>
                    <p className="text-gray-600">Until 25 years or earning ₹9,000+/month</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-700">Disabled Child</p>
                    <p className="text-gray-600">Lifetime (if disability 40%+)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-700">Dependent Parents</p>
                    <p className="text-gray-600">If no spouse/children eligible</p>
                  </div>
                </div>
              </div>

              {/* Family Pension Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">Family Pension Breakdown</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800 mb-2">Enhanced Family Pension</p>
                    <div className="space-y-1 text-sm text-blue-700">
                      <div className="flex justify-between">
                        <span>Basic ({ENHANCED_FAMILY_PENSION_PERCENT}% of {formatCurrency(lastBasicPay)})</span>
                        <span>{formatCurrency(calculations.enhancedFamilyPension)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DR ({CURRENT_DR_RATE}%)</span>
                        <span>{formatCurrency(calculations.enhancedFamilyPension * CURRENT_DR_RATE / 100)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-blue-200 pt-1">
                        <span>Total</span>
                        <span>{formatCurrency(calculations.enhancedFamilyPensionWithDR)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800 mb-2">Normal Family Pension</p>
                    <div className="space-y-1 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Basic ({FAMILY_PENSION_PERCENT}% of {formatCurrency(lastBasicPay)})</span>
                        <span>{formatCurrency(calculations.familyPensionBasic)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DR ({CURRENT_DR_RATE}%)</span>
                        <span>{formatCurrency(calculations.familyPensionBasic * CURRENT_DR_RATE / 100)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-gray-200 pt-1">
                        <span>Total</span>
                        <span>{formatCurrency(calculations.familyPensionWithDR)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
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
          <p><strong>Commutation:</strong> Up to 40% of pension can be commuted to receive a lump sum. Restores after 15 years.</p>
          <p><strong>Dearness Relief:</strong> DR is added to pension and revised periodically (currently {CURRENT_DR_RATE}%).</p>
          <p><strong>Additional Pension:</strong> 20% extra at 80 years, increasing to 100% at 100 years.</p>
          <p><strong>Family Pension:</strong> Enhanced (50%) for first 7 years or till age 67, then normal (30%).</p>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/gratuity-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Gratuity Calculator
        </Link>
        <Link href="/tools/commutation-restoration" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Commutation Restoration
        </Link>
        <Link href="/tools/leave-encashment-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Leave Encashment
        </Link>
      </div>
    </div>
  );
}
