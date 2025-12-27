"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Gift, Info, Calculator } from "lucide-react";

// Gratuity calculation constants
const MIN_SERVICE_YEARS = 5; // Minimum years for gratuity eligibility
const MAX_GRATUITY = 2000000; // Maximum gratuity limit (₹20 lakhs)
const GRATUITY_FRACTION = 1 / 4; // 1/4th of emoluments for each 6 months

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function GratuityCalculatorPage() {
  const [lastBasicPay, setLastBasicPay] = useState<number>(78800);
  const [lastDA, setLastDA] = useState<number>(39400); // 50% DA
  const [serviceYears, setServiceYears] = useState<number>(30);
  const [serviceMonths, setServiceMonths] = useState<number>(6);

  const calculations = useMemo(() => {
    // Total emoluments = Basic Pay + DA
    const emoluments = lastBasicPay + lastDA;

    // Calculate qualifying service in half years (6-month periods)
    // Round to nearest 6 months
    let totalMonths = serviceYears * 12 + serviceMonths;
    // If remaining months >= 3, round up to next 6 months
    const halfYears = Math.floor(totalMonths / 6);
    const remainingMonths = totalMonths % 6;
    const qualifyingHalfYears = remainingMonths >= 3 ? halfYears + 1 : halfYears;

    // Maximum half years for calculation is 66 (33 years)
    const cappedHalfYears = Math.min(qualifyingHalfYears, 66);

    // Check eligibility
    const isEligible = serviceYears >= MIN_SERVICE_YEARS || (serviceYears === MIN_SERVICE_YEARS - 1 && serviceMonths >= 6);

    // Gratuity = Emoluments × (1/4) × Number of half years
    // But simplified: Gratuity = (Emoluments × Half Years) / 4
    let gratuity = Math.round((emoluments * cappedHalfYears) / 4);

    // Apply maximum cap
    const isCapped = gratuity > MAX_GRATUITY;
    gratuity = Math.min(gratuity, MAX_GRATUITY);

    // Service in years and months for display
    const displayYears = Math.floor(cappedHalfYears / 2);
    const displayMonths = (cappedHalfYears % 2) * 6;

    return {
      emoluments,
      totalMonths,
      halfYears,
      qualifyingHalfYears,
      cappedHalfYears,
      isEligible,
      gratuity,
      isCapped,
      displayYears,
      displayMonths,
    };
  }, [lastBasicPay, lastDA, serviceYears, serviceMonths]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Gift className="text-pink-600" size={28} />
            Gratuity Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">நன்கொடை கால்குலேட்டர்</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Gratuity is calculated as per TN Government rules.
          Maximum gratuity is capped at ₹20 lakhs.
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
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-500"
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
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-500"
                min={0}
              />
              <p className="text-xs text-gray-500 mt-1">
                Current DA rate: 50% of Basic Pay
              </p>
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
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-500"
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
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-500"
                  min={0}
                  max={11}
                />
              </div>
            </div>
          </div>

          {/* Quick Calculator */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-3">Quick Calculation</h3>
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
            </div>
          </div>

          {/* Eligibility Status */}
          <div className={`mt-4 p-4 rounded-lg ${calculations.isEligible ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`font-medium ${calculations.isEligible ? 'text-green-700' : 'text-red-700'}`}>
              {calculations.isEligible
                ? `✓ Eligible for gratuity`
                : `✗ Not eligible (minimum ${MIN_SERVICE_YEARS} years required)`}
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Gratuity Amount Card */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Gift size={20} />
              <span className="text-pink-200 text-sm">Total Gratuity Amount</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(calculations.gratuity)}</p>
            {calculations.isCapped && (
              <p className="text-pink-200 text-sm mt-2">
                ⚠️ Capped at maximum limit of ₹20 lakhs
              </p>
            )}
          </div>

          {/* Calculation Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <Calculator size={18} className="text-pink-500" />
              Calculation Breakdown
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Emoluments (Basic + DA)</span>
                <span className="font-medium">{formatCurrency(calculations.emoluments)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Service</span>
                <span className="font-medium">{serviceYears} years {serviceMonths} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Qualifying Half Years</span>
                <span className="font-medium">{calculations.cappedHalfYears} (max 66)</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Gratuity Fraction</span>
                <span className="font-medium">1/4 per half year</span>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg mt-2">
                <p className="text-xs text-pink-700 mb-2">
                  <strong>Formula:</strong> Emoluments × Half Years × (1/4)
                </p>
                <p className="text-sm text-pink-800">
                  = {formatCurrency(calculations.emoluments)} × {calculations.cappedHalfYears} × 0.25
                </p>
                <p className="text-lg font-bold text-pink-800 mt-1">
                  = {formatCurrency(calculations.gratuity)}
                </p>
              </div>
            </div>
          </div>

          {/* Service Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Service Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Actual Service</span>
                <span>{serviceYears} yrs {serviceMonths} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rounded to Half Years</span>
                <span>{calculations.cappedHalfYears} half years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Equivalent to</span>
                <span className="font-medium">
                  {calculations.displayYears} yrs {calculations.displayMonths} months
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Service is rounded to nearest 6 months (3+ months rounds up)
            </p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About Gratuity Calculation
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Eligibility:</strong> Minimum 5 years of continuous service required.</p>
          <p><strong>Emoluments:</strong> Last drawn Basic Pay + Dearness Allowance.</p>
          <p><strong>Calculation:</strong> Gratuity = Emoluments × (1/4) × Number of half years of service.</p>
          <p><strong>Rounding:</strong> Service is rounded to nearest half year (6 months). 3+ months rounds up.</p>
          <p><strong>Maximum:</strong> Gratuity is capped at ₹20,00,000 (20 lakhs).</p>
          <p><strong>Maximum Service:</strong> Only 33 years (66 half years) considered for calculation.</p>
        </div>
      </div>
    </div>
  );
}
