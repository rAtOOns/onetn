"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, Gift, Calendar, PiggyBank, Info, CheckCircle, Printer } from "lucide-react";
import { CURRENT_DA_RATE, MAX_EL_ENCASHMENT_DAYS, GRATUITY_MULTIPLIER } from "@/lib/constants/rates";

// Constants (using centralized rates)
const CURRENT_DA = CURRENT_DA_RATE;
const MAX_EL_DAYS = MAX_EL_ENCASHMENT_DAYS;
const GRATUITY_FACTOR = GRATUITY_MULTIPLIER;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function RetirementSummaryPage() {
  const [lastBasicPay, setLastBasicPay] = useState<number>(78800);
  const [serviceYears, setServiceYears] = useState<number>(33);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [elBalance, setElBalance] = useState<number>(300);
  const [commutationPercent, setCommutationPercent] = useState<number>(40);
  const [gpfBalance, setGpfBalance] = useState<number>(1500000);

  const calculations = useMemo(() => {
    // Pension Calculation
    const pensionPercent = Math.min((serviceYears / 33) * 50, 50);
    const basicPension = Math.round((lastBasicPay * pensionPercent) / 100);

    // Commutation
    const commutationFactor = {
      55: 9.075, 56: 8.943, 57: 8.808, 58: 8.671, 59: 8.531,
      60: 8.194, 61: 8.047, 62: 7.897, 63: 7.744, 64: 7.587, 65: 7.427,
    }[retirementAge] || 8.194;

    const commutedPension = Math.round((basicPension * commutationPercent) / 100);
    const commutationAmount = Math.round(commutedPension * 12 * commutationFactor);
    const reducedPension = basicPension - commutedPension;
    const pensionWithDA = reducedPension + Math.round((reducedPension * CURRENT_DA) / 100);

    // Gratuity
    const gratuity = Math.round((lastBasicPay + (lastBasicPay * CURRENT_DA / 100)) * serviceYears * (15 / 26));
    const maxGratuity = 2500000; // 25 lakhs cap
    const actualGratuity = Math.min(gratuity, maxGratuity);

    // Leave Encashment
    const actualEL = Math.min(elBalance, MAX_EL_DAYS);
    const leaveEncashment = Math.round(((lastBasicPay + (lastBasicPay * CURRENT_DA / 100)) / 30) * actualEL);

    // GPF
    const gpf = gpfBalance;

    // Total One-time Benefits
    const totalOneTime = commutationAmount + actualGratuity + leaveEncashment + gpf;

    return {
      basicPension,
      commutedPension,
      commutationAmount,
      reducedPension,
      pensionWithDA,
      actualGratuity,
      leaveEncashment,
      gpf,
      totalOneTime,
      pensionPercent,
    };
  }, [lastBasicPay, serviceYears, retirementAge, elBalance, commutationPercent, gpfBalance]);

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
              Retirement Benefits Summary
            </h1>
            <p className="text-sm text-gray-500 tamil">ஓய்வு பலன்கள் சுருக்கம்</p>
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

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This is an unofficial calculator for estimation only.
          Actual benefits may vary based on rules applicable at retirement. Verify with AG/Treasury office.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Enter Your Details</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Basic Pay (₹)</label>
            <input
              type="number"
              value={lastBasicPay}
              onChange={(e) => setLastBasicPay(Number(e.target.value))}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Years</label>
            <input
              type="number"
              value={serviceYears}
              onChange={(e) => setServiceYears(Number(e.target.value))}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500"
              max={40}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Age</label>
            <select
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500"
            >
              {[55, 56, 57, 58, 59, 60, 61, 62].map((age) => (
                <option key={age} value={age}>{age} years</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">EL Balance (days)</label>
            <input
              type="number"
              value={elBalance}
              onChange={(e) => setElBalance(Number(e.target.value))}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500"
              max={300}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commutation %</label>
            <select
              value={commutationPercent}
              onChange={(e) => setCommutationPercent(Number(e.target.value))}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500"
            >
              {[0, 10, 20, 30, 40].map((p) => (
                <option key={p} value={p}>{p}%</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GPF Balance (₹)</label>
            <input
              type="number"
              value={gpfBalance}
              onChange={(e) => setGpfBalance(Number(e.target.value))}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Monthly Pension */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={20} />
            <span className="text-purple-100">Monthly Pension</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(calculations.pensionWithDA)}</p>
          <p className="text-purple-200 text-sm mt-1">
            Basic: {formatCurrency(calculations.reducedPension)} + DA: {CURRENT_DA}%
          </p>
        </div>

        {/* One-time Total */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Gift size={20} />
            <span className="text-green-100">Total One-time Benefits</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(calculations.totalOneTime)}</p>
          <p className="text-green-200 text-sm mt-1">
            Lump sum amount at retirement
          </p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="font-semibold text-tn-text">Detailed Breakdown</h2>
        </div>
        <div className="divide-y">
          {/* Pension */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-purple-700 font-medium mb-2">
              <Wallet size={18} />
              Pension
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Pension ({calculations.pensionPercent.toFixed(0)}%)</span>
                  <span>{formatCurrency(calculations.basicPension)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Less: Commuted ({commutationPercent}%)</span>
                  <span>-{formatCurrency(calculations.commutedPension)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Reduced Pension</span>
                  <span>{formatCurrency(calculations.reducedPension)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Add: DA ({CURRENT_DA}%)</span>
                  <span>+{formatCurrency(Math.round(calculations.reducedPension * CURRENT_DA / 100))}</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-purple-700 font-medium">Monthly Pension</p>
                <p className="text-2xl font-bold text-purple-800">{formatCurrency(calculations.pensionWithDA)}</p>
              </div>
            </div>
          </div>

          {/* Commutation */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-orange-700 font-medium mb-2">
              <PiggyBank size={18} />
              Commutation (Lump Sum)
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">
                {commutationPercent}% of pension commuted for lump sum
              </span>
              <span className="text-xl font-bold text-orange-700">{formatCurrency(calculations.commutationAmount)}</span>
            </div>
          </div>

          {/* Gratuity */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-pink-700 font-medium mb-2">
              <Gift size={18} />
              Gratuity
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">
                Based on {serviceYears} years of service (max ₹25 lakhs)
              </span>
              <span className="text-xl font-bold text-pink-700">{formatCurrency(calculations.actualGratuity)}</span>
            </div>
          </div>

          {/* Leave Encashment */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-teal-700 font-medium mb-2">
              <Calendar size={18} />
              Leave Encashment
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">
                {elBalance} days EL (max 300 days)
              </span>
              <span className="text-xl font-bold text-teal-700">{formatCurrency(calculations.leaveEncashment)}</span>
            </div>
          </div>

          {/* GPF */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2">
              <PiggyBank size={18} />
              GPF Final Balance
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">
                Accumulated GPF with interest
              </span>
              <span className="text-xl font-bold text-emerald-700">{formatCurrency(calculations.gpf)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="p-4 bg-green-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-green-800">Total One-time Amount</p>
                <p className="text-sm text-green-700">Commutation + Gratuity + Leave + GPF</p>
              </div>
              <span className="text-2xl font-bold text-green-800">{formatCurrency(calculations.totalOneTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <CheckCircle size={18} />
          Retirement Checklist
        </h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-700">
          {[
            "Submit pension papers 6 months before retirement",
            "Update GPF nomination",
            "Verify service book entries",
            "Get No Dues Certificate from all departments",
            "Submit LPC (Last Pay Certificate)",
            "Update bank account details for pension",
            "Apply for Pensioner ID card",
            "Inform Treasury office about commutation preference",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/pension-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Detailed Pension Calculator
        </Link>
        <Link href="/tools/gratuity-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Gratuity Calculator
        </Link>
        <Link href="/tools/leave-encashment-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Leave Encashment Calculator
        </Link>
      </div>
    </div>
  );
}
