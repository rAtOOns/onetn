"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Wallet, Info, TrendingUp, PiggyBank } from "lucide-react";

// GPF Interest rate (as of 2024)
const GPF_INTEREST_RATE = 7.1;

// Format currency in Indian format
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function LoanCalculatorPage() {
  const [basicPay, setBasicPay] = useState<number>(36900);
  const [gpfPercent, setGpfPercent] = useState<number>(10);
  const [yearsOfService, setYearsOfService] = useState<number>(15);
  const [currentBalance, setCurrentBalance] = useState<number>(500000);
  const [existingLoan, setExistingLoan] = useState<number>(0);

  const calculations = useMemo(() => {
    // Monthly contribution
    const monthlyContribution = Math.round((basicPay * gpfPercent) / 100);
    const annualContribution = monthlyContribution * 12;

    // Net balance (after deducting existing loans)
    const netBalance = currentBalance - existingLoan;

    // Advance eligibility
    // General purpose: 75% of balance or 3 months basic (whichever is less)
    const threeMonthsBasic = basicPay * 3;
    const seventyFivePercent = netBalance * 0.75;
    const generalAdvanceLimit = Math.min(threeMonthsBasic, seventyFivePercent);

    // Special purpose: 90% of balance (education, marriage, housing, medical)
    const ninetyPercent = netBalance * 0.9;
    const specialAdvanceLimit = ninetyPercent;

    // Interest calculation (simple estimate)
    const annualInterest = (currentBalance * GPF_INTEREST_RATE) / 100;
    const monthlyInterest = annualInterest / 12;

    // Projected balance after 1 year
    const projectedBalance = currentBalance + annualContribution + annualInterest;

    // 5-year projection
    const projections: Array<{
      year: number;
      openingBalance: number;
      contribution: number;
      interest: number;
      closingBalance: number;
    }> = [];

    let projBalance = currentBalance;
    for (let i = 1; i <= 5; i++) {
      const interest = (projBalance * GPF_INTEREST_RATE) / 100;
      const closing = projBalance + annualContribution + interest;
      projections.push({
        year: new Date().getFullYear() + i,
        openingBalance: projBalance,
        contribution: annualContribution,
        interest: Math.round(interest),
        closingBalance: Math.round(closing),
      });
      projBalance = closing;
    }

    // Retirement corpus estimate (assuming 5 more years of service)
    const yearsToRetirement = Math.max(0, 60 - (new Date().getFullYear() - yearsOfService - 25));

    return {
      monthlyContribution,
      annualContribution,
      netBalance,
      generalAdvanceLimit: Math.max(0, Math.round(generalAdvanceLimit)),
      specialAdvanceLimit: Math.max(0, Math.round(specialAdvanceLimit)),
      annualInterest: Math.round(annualInterest),
      monthlyInterest: Math.round(monthlyInterest),
      projectedBalance: Math.round(projectedBalance),
      projections,
      yearsToRetirement,
      finalBalance: projections[projections.length - 1]?.closingBalance || currentBalance,
    };
  }, [basicPay, gpfPercent, currentBalance, existingLoan, yearsOfService]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/tools"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Calculator className="text-red-600" size={28} />
            GPF / Loan Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">
            GPF கடன் கால்குலேட்டர்
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> GPF interest rate is {GPF_INTEREST_RATE}% per annum (as of 2024).
          Calculations are estimates. Verify with your GPF account statement.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4">Enter Details</h2>

          <div className="space-y-4">
            {/* Basic Pay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Basic Pay (₹)
              </label>
              <input
                type="number"
                value={basicPay}
                onChange={(e) => setBasicPay(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                min={15700}
              />
            </div>

            {/* GPF Contribution % */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPF Contribution (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  value={gpfPercent}
                  onChange={(e) => setGpfPercent(Number(e.target.value))}
                  className="flex-1"
                  min={6}
                  max={100}
                />
                <span className="w-16 text-center font-medium">{gpfPercent}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6% of Basic Pay</p>
            </div>

            {/* Current Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current GPF Balance (₹)
              </label>
              <input
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                min={0}
              />
            </div>

            {/* Existing Loan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Existing GPF Loan/Advance (₹)
              </label>
              <input
                type="number"
                value={existingLoan}
                onChange={(e) => setExistingLoan(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                min={0}
              />
              <p className="text-xs text-gray-500 mt-1">
                Outstanding amount to be recovered
              </p>
            </div>

            {/* Years of Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Service
              </label>
              <input
                type="number"
                value={yearsOfService}
                onChange={(e) => setYearsOfService(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                min={0}
                max={40}
              />
            </div>
          </div>

          {/* Monthly Contribution */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Monthly Contribution</span>
              <span className="text-xl font-bold text-tn-primary">
                {formatCurrency(calculations.monthlyContribution)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-600">Annual Contribution</span>
              <span className="font-medium">
                {formatCurrency(calculations.annualContribution)}
              </span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Current Status Card */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank size={20} />
              <span className="text-red-200 text-sm">Current GPF Balance</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(currentBalance)}</p>
            {existingLoan > 0 && (
              <div className="mt-2 text-red-200">
                <p className="text-sm">Outstanding Loan: {formatCurrency(existingLoan)}</p>
                <p className="text-lg font-semibold">
                  Net Balance: {formatCurrency(calculations.netBalance)}
                </p>
              </div>
            )}
          </div>

          {/* Advance Eligibility */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <Wallet size={18} />
              Advance Eligibility
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-blue-800">General Purpose</p>
                    <p className="text-xs text-blue-600 mt-1">
                      75% of balance or 3 months Basic (whichever is less)
                    </p>
                  </div>
                  <p className="text-xl font-bold text-blue-700">
                    {formatCurrency(calculations.generalAdvanceLimit)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-green-800">Special Purpose</p>
                    <p className="text-xs text-green-600 mt-1">
                      90% of balance (Education, Marriage, Housing, Medical)
                    </p>
                  </div>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(calculations.specialAdvanceLimit)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interest Earnings */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <TrendingUp size={18} />
              Interest Earnings
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Interest Rate</p>
                <p className="text-xl font-bold text-tn-primary">{GPF_INTEREST_RATE}%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Annual Interest</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(calculations.annualInterest)}
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-green-700">Projected Balance (1 year)</span>
                <span className="font-bold text-green-700">
                  {formatCurrency(calculations.projectedBalance)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Year Projection Table */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-tn-text">5-Year GPF Projection</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Year</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                  Opening Balance
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                  Contribution
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                  Interest
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                  Closing Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {calculations.projections.map((proj, index) => (
                <tr key={proj.year} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{proj.year}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    {formatCurrency(proj.openingBalance)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-blue-600">
                    +{formatCurrency(proj.contribution)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-green-600">
                    +{formatCurrency(proj.interest)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold">
                    {formatCurrency(proj.closingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-green-50">
              <tr>
                <td colSpan={4} className="px-4 py-3 font-semibold text-green-700">
                  Projected Balance after 5 years
                </td>
                <td className="px-4 py-3 text-right font-bold text-xl text-green-700">
                  {formatCurrency(calculations.finalBalance)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Advance Types Info */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-3">General Purpose Advance</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• Maximum: 75% of balance or 3 months Basic Pay</li>
            <li>• No interest charged on advance</li>
            <li>• Recovery in 24-36 monthly installments</li>
            <li>• Can be taken for any personal purpose</li>
            <li>• No documentary proof required</li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="font-semibold text-green-800 mb-3">Special Purpose Advance</h3>
          <ul className="text-sm text-green-700 space-y-2">
            <li>• Maximum: 90% of balance</li>
            <li>• For: Education, Marriage, Housing, Medical</li>
            <li>• Documentary proof required</li>
            <li>• Recovery period can extend to 48 months</li>
            <li>• Multiple advances allowed for different purposes</li>
          </ul>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About GPF (General Provident Fund)
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>Contribution:</strong> Minimum 6% of Basic Pay, maximum 100%.
            Unlike EPF, there is no employer contribution in GPF.
          </p>
          <p>
            <strong>Interest Rate:</strong> Currently {GPF_INTEREST_RATE}% per annum.
            Interest is compounded annually and credited at the end of financial year.
          </p>
          <p>
            <strong>Final Withdrawal:</strong> Employees can withdraw up to 90% of balance
            within 3 months of retirement. No interest is paid on final withdrawal amount.
          </p>
          <p>
            <strong>Nomination:</strong> Employees must nominate family members for GPF.
            In case of death, the balance is paid to nominees without any legal formalities.
          </p>
          <p>
            <strong>Tax Benefit:</strong> GPF contributions are eligible for deduction
            under Section 80C of Income Tax Act (up to ₹1.5 lakh per year).
          </p>
        </div>
      </div>
    </div>
  );
}
