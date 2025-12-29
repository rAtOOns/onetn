"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, UserMinus, Calculator, Info, AlertCircle, Printer } from "lucide-react";
import { CURRENT_DA_RATE, MAX_EL_ENCASHMENT_DAYS, MAX_GRATUITY_AMOUNT } from "@/lib/constants/rates";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function VoluntaryRetirementPage() {
  const [dob, setDob] = useState<string>("1975-06-15");
  const [doj, setDoj] = useState<string>("2000-07-01");
  const [vrsDate, setVrsDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [basicPay, setBasicPay] = useState<number>(78800);
  const [gpfBalance, setGpfBalance] = useState<number>(1500000);
  const [elBalance, setElBalance] = useState<number>(300);

  const calculations = useMemo(() => {
    const dobDate = new Date(dob);
    const dojDate = new Date(doj);
    const vrsDateObj = new Date(vrsDate);
    const superannuationDate = new Date(dobDate);
    superannuationDate.setFullYear(superannuationDate.getFullYear() + 60);

    // Age at VRS
    const ageAtVRS = (vrsDateObj.getTime() - dobDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

    // Service at VRS
    const serviceYears = (vrsDateObj.getTime() - dojDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

    // Eligibility check
    const isEligibleByAge = ageAtVRS >= 50;
    const isEligibleByService = serviceYears >= 20;
    const isEligible = isEligibleByAge || isEligibleByService;

    // Qualifying service (capped at 33 years for pension)
    const qualifyingService = Math.min(serviceYears, 33);

    // Pension calculation (50% of last basic for 33 years)
    const pensionFactor = Math.min(qualifyingService / 33, 1);
    const monthlyPension = Math.round((basicPay * 0.5) * pensionFactor);

    // Commutation (40% of pension can be commuted)
    const commutablePension = monthlyPension * 0.4;
    const commutationFactor = getCommutationFactor(Math.floor(ageAtVRS));
    const commutationAmount = Math.round(commutablePension * 12 * commutationFactor);
    const reducedPension = Math.round(monthlyPension - commutablePension);

    // Gratuity (1/4 of basic * qualifying service * 2, max 20 lakhs)
    const gratuity = Math.min(Math.round((basicPay / 4) * qualifyingService * 2), MAX_GRATUITY_AMOUNT);

    // Leave encashment (max 300 days)
    const leaveEncashmentDays = Math.min(elBalance, MAX_EL_ENCASHMENT_DAYS);
    const dailyPay = (basicPay + (basicPay * CURRENT_DA_RATE / 100)) / 30;
    const leaveEncashment = Math.round(dailyPay * leaveEncashmentDays);

    // Total benefits
    const totalBenefits = commutationAmount + gratuity + leaveEncashment + gpfBalance;

    // Service left if continued till 60
    const serviceLeftYears = (superannuationDate.getTime() - vrsDateObj.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

    return {
      ageAtVRS: Math.floor(ageAtVRS),
      serviceYears: Math.floor(serviceYears),
      serviceMonths: Math.floor((serviceYears % 1) * 12),
      qualifyingService: Math.floor(qualifyingService),
      isEligible,
      isEligibleByAge,
      isEligibleByService,
      monthlyPension,
      commutationAmount,
      reducedPension,
      gratuity,
      leaveEncashment,
      gpfBalance,
      totalBenefits,
      superannuationDate,
      serviceLeftYears: Math.floor(serviceLeftYears),
      serviceLeftMonths: Math.floor((serviceLeftYears % 1) * 12),
    };
  }, [dob, doj, vrsDate, basicPay, gpfBalance, elBalance]);

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
              <UserMinus className="text-orange-600" size={28} />
              Voluntary Retirement Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">தன்னார்வ ஓய்வு கால்குலேட்டர்</p>
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
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-orange-800 font-medium">Voluntary Retirement Scheme (VRS)</p>
            <p className="text-sm text-orange-700 mt-1">
              TN Government employees can opt for voluntary retirement after completing 20 years of service
              OR attaining 50 years of age. 3 months advance notice required.
            </p>
          </div>
        </div>
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
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Joining Service
              </label>
              <input
                type="date"
                value={doj}
                onChange={(e) => setDoj(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposed VRS Date
              </label>
              <input
                type="date"
                value={vrsDate}
                onChange={(e) => setVrsDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPF Balance (₹)
              </label>
              <input
                type="number"
                value={gpfBalance}
                onChange={(e) => setGpfBalance(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                EL Balance (days)
              </label>
              <input
                type="number"
                value={elBalance}
                onChange={(e) => setElBalance(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
                max={300}
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Eligibility */}
          <div className={`rounded-xl p-6 text-white ${
            calculations.isEligible
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : "bg-gradient-to-r from-red-500 to-red-600"
          }`}>
            <p className="text-white/80 text-sm">VRS Eligibility</p>
            <p className="text-3xl font-bold mt-1">
              {calculations.isEligible ? "Eligible" : "Not Eligible"}
            </p>
            <div className="mt-3 text-sm space-y-1">
              <p>Age at VRS: {calculations.ageAtVRS} years {calculations.isEligibleByAge ? "✓" : "✗"}</p>
              <p>Service: {calculations.serviceYears} years {calculations.serviceMonths} months {calculations.isEligibleByService ? "✓" : "✗"}</p>
            </div>
          </div>

          {/* Pension */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Pension Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Qualifying Service</span>
                <span className="font-medium">{calculations.qualifyingService} years</span>
              </div>
              <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-600">Monthly Pension (Full)</span>
                <span className="font-bold text-orange-600">{formatCurrency(calculations.monthlyPension)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Commutation Amount (40%)</span>
                <span className="font-medium">{formatCurrency(calculations.commutationAmount)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Reduced Pension (after commutation)</span>
                <span className="font-medium">{formatCurrency(calculations.reducedPension)}/month</span>
              </div>
            </div>
          </div>

          {/* Total Benefits */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Lump Sum Benefits</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Commutation</span>
                <span className="font-medium">{formatCurrency(calculations.commutationAmount)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Gratuity</span>
                <span className="font-medium">{formatCurrency(calculations.gratuity)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Leave Encashment</span>
                <span className="font-medium">{formatCurrency(calculations.leaveEncashment)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">GPF Balance</span>
                <span className="font-medium">{formatCurrency(calculations.gpfBalance)}</span>
              </div>
              <div className="flex justify-between p-3 bg-green-100 rounded-lg">
                <span className="text-gray-700 font-medium">Total Lump Sum</span>
                <span className="font-bold text-green-600 text-lg">{formatCurrency(calculations.totalBenefits)}</span>
              </div>
            </div>
          </div>

          {/* What You're Giving Up */}
          <div className="bg-amber-50 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertCircle size={18} className="text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">If You Continue Till 60</p>
                <p className="text-sm text-amber-700 mt-1">
                  Superannuation: {formatDate(calculations.superannuationDate)}<br />
                  Service remaining: {calculations.serviceLeftYears} years {calculations.serviceLeftMonths} months
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VRS Rules */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          VRS Rules - Tamil Nadu
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Eligibility:</p>
            <ul className="space-y-1">
              <li>• Minimum 20 years of qualifying service, OR</li>
              <li>• Attained 50 years of age</li>
              <li>• 3 months advance notice required</li>
              <li>• Can be accepted with shorter notice</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Benefits:</p>
            <ul className="space-y-1">
              <li>• Pension based on qualifying service</li>
              <li>• Full gratuity as per rules</li>
              <li>• GPF final settlement</li>
              <li>• Leave encashment (max 300 days EL)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/pension-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Pension Calculator
        </Link>
        <Link href="/tools/gratuity-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Gratuity Calculator
        </Link>
        <Link href="/tools/retirement-summary" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Retirement Summary
        </Link>
      </div>
    </div>
  );
}

// Commutation factor based on age
function getCommutationFactor(age: number): number {
  const factors: Record<number, number> = {
    50: 9.26, 51: 9.11, 52: 8.95, 53: 8.78, 54: 8.62,
    55: 8.45, 56: 8.27, 57: 8.10, 58: 7.92, 59: 7.74, 60: 7.56,
  };
  return factors[age] || 8.00;
}
