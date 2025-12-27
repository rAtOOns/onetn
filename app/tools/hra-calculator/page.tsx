"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Home, Info, Calculator } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function HRACalculatorPage() {
  const [basicPay, setBasicPay] = useState<number>(50000);
  const [da, setDA] = useState<number>(25000);
  const [hraReceived, setHRAReceived] = useState<number>(12000);
  const [rentPaid, setRentPaid] = useState<number>(15000);
  const [isMetroCity, setIsMetroCity] = useState<boolean>(true);

  const calculations = useMemo(() => {
    // Total salary for HRA calculation = Basic + DA
    const totalSalary = basicPay + da;

    // Annual values
    const annualSalary = totalSalary * 12;
    const annualHRA = hraReceived * 12;
    const annualRent = rentPaid * 12;

    // Three conditions for HRA exemption:
    // 1. Actual HRA received
    // 2. Rent paid - 10% of salary
    // 3. 50% of salary (metro) or 40% of salary (non-metro)

    const condition1 = annualHRA;
    const condition2 = Math.max(0, annualRent - (annualSalary * 0.10));
    const condition3 = isMetroCity ? (annualSalary * 0.50) : (annualSalary * 0.40);

    // HRA exemption = minimum of all three
    const hraExemption = Math.min(condition1, condition2, condition3);

    // Taxable HRA
    const taxableHRA = annualHRA - hraExemption;

    // Monthly values
    const monthlyExemption = Math.round(hraExemption / 12);
    const monthlyTaxable = Math.round(taxableHRA / 12);

    // Which condition applied?
    let appliedCondition = 1;
    if (hraExemption === condition2) appliedCondition = 2;
    else if (hraExemption === condition3) appliedCondition = 3;

    return {
      totalSalary,
      annualSalary,
      annualHRA,
      annualRent,
      condition1,
      condition2,
      condition3,
      hraExemption,
      taxableHRA,
      monthlyExemption,
      monthlyTaxable,
      appliedCondition,
      tenPercentSalary: annualSalary * 0.10,
    };
  }, [basicPay, da, hraReceived, rentPaid, isMetroCity]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Home className="text-cyan-600" size={28} />
            HRA Exemption Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">வீட்டு வாடகை படி விலக்கு கால்குலேட்டர்</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> HRA exemption is calculated under Section 10(13A) of Income Tax Act.
          This is applicable for Old Tax Regime only.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4">Enter Monthly Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Basic Pay (₹/month)
              </label>
              <input
                type="number"
                value={basicPay}
                onChange={(e) => setBasicPay(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-cyan-500"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dearness Allowance (₹/month)
              </label>
              <input
                type="number"
                value={da}
                onChange={(e) => setDA(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-cyan-500"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HRA Received (₹/month)
              </label>
              <input
                type="number"
                value={hraReceived}
                onChange={(e) => setHRAReceived(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-cyan-500"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Rent Paid (₹/month)
              </label>
              <input
                type="number"
                value={rentPaid}
                onChange={(e) => setRentPaid(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-cyan-500"
                min={0}
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                City Classification
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cityType"
                    checked={isMetroCity}
                    onChange={() => setIsMetroCity(true)}
                    className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm">Metro City (50%)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cityType"
                    checked={!isMetroCity}
                    onChange={() => setIsMetroCity(false)}
                    className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm">Non-Metro (40%)</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Metro cities: Delhi, Mumbai, Chennai, Kolkata
              </p>
            </div>
          </div>

          {/* Salary Summary */}
          <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
            <h3 className="font-medium text-cyan-700 mb-3">Salary Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Basic Pay</span>
                <span>{formatCurrency(basicPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">DA</span>
                <span>{formatCurrency(da)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Monthly Salary (for HRA)</span>
                <span className="font-bold">{formatCurrency(calculations.totalSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Annual Salary</span>
                <span className="font-bold">{formatCurrency(calculations.annualSalary)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* HRA Exemption Card */}
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Home size={20} />
              <span className="text-cyan-200 text-sm">Annual HRA Exemption</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(calculations.hraExemption)}</p>
            <p className="text-cyan-200 text-sm mt-2">
              Monthly: {formatCurrency(calculations.monthlyExemption)}
            </p>
          </div>

          {/* Three Conditions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <Calculator size={18} className="text-cyan-500" />
              HRA Exemption Calculation
            </h3>
            <div className="space-y-4">
              {/* Condition 1 */}
              <div className={`p-3 rounded-lg ${calculations.appliedCondition === 1 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">1. Actual HRA Received</p>
                    <p className="text-xs text-gray-500">{formatCurrency(hraReceived)} × 12 months</p>
                  </div>
                  <span className="font-bold">{formatCurrency(calculations.condition1)}</span>
                </div>
                {calculations.appliedCondition === 1 && (
                  <span className="text-xs text-green-600 font-medium">✓ Lowest - Applied</span>
                )}
              </div>

              {/* Condition 2 */}
              <div className={`p-3 rounded-lg ${calculations.appliedCondition === 2 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">2. Rent Paid - 10% of Salary</p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(calculations.annualRent)} - {formatCurrency(calculations.tenPercentSalary)}
                    </p>
                  </div>
                  <span className="font-bold">{formatCurrency(calculations.condition2)}</span>
                </div>
                {calculations.appliedCondition === 2 && (
                  <span className="text-xs text-green-600 font-medium">✓ Lowest - Applied</span>
                )}
              </div>

              {/* Condition 3 */}
              <div className={`p-3 rounded-lg ${calculations.appliedCondition === 3 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">3. {isMetroCity ? '50%' : '40%'} of Salary</p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(calculations.annualSalary)} × {isMetroCity ? '50%' : '40%'}
                    </p>
                  </div>
                  <span className="font-bold">{formatCurrency(calculations.condition3)}</span>
                </div>
                {calculations.appliedCondition === 3 && (
                  <span className="text-xs text-green-600 font-medium">✓ Lowest - Applied</span>
                )}
              </div>
            </div>
          </div>

          {/* Tax Impact */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Tax Impact (Annual)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total HRA Received</span>
                <span>{formatCurrency(calculations.annualHRA)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Less: HRA Exemption</span>
                <span>-{formatCurrency(calculations.hraExemption)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold text-red-700">Taxable HRA</span>
                <span className="font-bold text-red-700">{formatCurrency(calculations.taxableHRA)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Monthly taxable HRA: {formatCurrency(calculations.monthlyTaxable)}
              </p>
            </div>
          </div>

          {/* No Rent Warning */}
          {rentPaid === 0 && (
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-sm text-red-700">
                <strong>⚠️ Warning:</strong> If you don&apos;t pay rent, no HRA exemption is available.
                The entire HRA received will be taxable.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About HRA Exemption
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Section 10(13A):</strong> HRA exemption is available only under Old Tax Regime.</p>
          <p><strong>Exemption:</strong> Lowest of: (1) Actual HRA, (2) Rent - 10% of salary, (3) 50%/40% of salary.</p>
          <p><strong>Metro Cities:</strong> Delhi, Mumbai, Chennai, Kolkata qualify for 50% calculation.</p>
          <p><strong>Non-Metro:</strong> All other cities qualify for 40% calculation.</p>
          <p><strong>Salary:</strong> For HRA calculation, salary means Basic Pay + DA (if forming part of retirement benefits).</p>
          <p><strong>Documents:</strong> Keep rent receipts and landlord PAN (if rent exceeds ₹1 lakh/year).</p>
        </div>
      </div>
    </div>
  );
}
