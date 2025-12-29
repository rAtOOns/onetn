"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Landmark, Home, Car, Laptop, Calculator, Info, AlertCircle } from "lucide-react";

// Loan configuration with TN Government rules
const loanConfig = {
  hba: {
    name: "House Building Advance",
    nameTamil: "வீட்டு கட்டுமான முன்பணம்",
    icon: Home,
    color: "bg-blue-500",
    interestRate: 7.9,
    maxAmount: 2500000, // 25 Lakhs
    maxTenureYears: 25,
    minServiceYears: 5,
    formula: "34 months basic pay or ₹25 lakhs (whichever is less)",
  },
  car: {
    name: "Motor Car Advance",
    nameTamil: "கார் முன்பணம்",
    icon: Car,
    color: "bg-green-500",
    interestRate: 11.5,
    maxAmount: 500000, // 5 Lakhs
    maxTenureMonths: 80,
    minServiceYears: 3,
    minPayLevel: 6,
    formula: "Up to ₹5 lakhs for Level 6 and above",
  },
  twoWheeler: {
    name: "Two-Wheeler Advance",
    nameTamil: "இரு சக்கர வாகன முன்பணம்",
    icon: Car,
    color: "bg-teal-500",
    interestRate: 11.5,
    maxAmount: 100000, // 1 Lakh
    maxTenureMonths: 60,
    minServiceYears: 1,
    formula: "Up to ₹1 lakh for all permanent employees",
  },
  computer: {
    name: "Computer Advance",
    nameTamil: "கணினி முன்பணம்",
    icon: Laptop,
    color: "bg-purple-500",
    interestRate: 10.5,
    maxAmount: 80000,
    maxTenureMonths: 24,
    minServiceYears: 0,
    formula: "Up to ₹80,000 recoverable in 24 months",
  },
};

type LoanType = keyof typeof loanConfig;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// EMI Calculation
function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / tenureMonths;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

export default function LoansAdvancesPage() {
  const [activeTab, setActiveTab] = useState<LoanType>("hba");
  const [basicPay, setBasicPay] = useState<number>(56100);
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [tenureMonths, setTenureMonths] = useState<number>(240); // 20 years for HBA
  const [serviceYears, setServiceYears] = useState<number>(10);

  const config = loanConfig[activeTab];

  // Calculate max eligible amount
  const maxEligible = useMemo(() => {
    if (activeTab === "hba") {
      const basedOnPay = basicPay * 34;
      return Math.min(basedOnPay, config.maxAmount);
    }
    return config.maxAmount;
  }, [activeTab, basicPay, config.maxAmount]);

  // EMI Calculations
  const calculations = useMemo(() => {
    const actualLoan = Math.min(loanAmount, maxEligible);
    const emi = calculateEMI(actualLoan, config.interestRate, tenureMonths);
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - actualLoan;

    return {
      loanAmount: actualLoan,
      emi,
      totalPayment,
      totalInterest,
      interestRate: config.interestRate,
    };
  }, [loanAmount, maxEligible, config.interestRate, tenureMonths]);

  // Check eligibility
  const isEligible = serviceYears >= (config.minServiceYears || 0);

  // Handle tab change with appropriate defaults
  const handleTabChange = (tab: LoanType) => {
    setActiveTab(tab);
    const newConfig = loanConfig[tab];
    setLoanAmount(Math.min(loanAmount, newConfig.maxAmount));
    if (tab === "hba") {
      setTenureMonths(240);
    } else if (tab === "car") {
      setTenureMonths(60);
    } else if (tab === "twoWheeler") {
      setTenureMonths(48);
    } else {
      setTenureMonths(24);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Landmark className="text-amber-600" size={28} />
            Loans & Advances Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">கடன்கள் மற்றும் முன்பணங்கள் கால்குலேட்டர்</p>
        </div>
      </div>

      {/* Loan Type Tabs */}
      <div className="bg-white rounded-xl shadow-sm border p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(loanConfig) as LoanType[]).map((key) => {
            const loan = loanConfig[key];
            const Icon = loan.icon;
            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === key
                    ? `${loan.color} text-white`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon size={16} />
                {loan.name.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            {config.name}
          </h2>

          <div className="space-y-4">
            {activeTab === "hba" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Basic Pay (₹)
                </label>
                <input
                  type="number"
                  value={basicPay}
                  onChange={(e) => setBasicPay(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max eligible: {formatCurrency(maxEligible)} (34 × Basic Pay)
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                max={config.maxAmount}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {formatCurrency(config.maxAmount)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenure: {tenureMonths} months ({(tenureMonths / 12).toFixed(1)} years)
              </label>
              <input
                type="range"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full accent-blue-500"
                min={12}
                max={activeTab === "hba" ? 300 : (loanConfig[activeTab].maxTenureMonths || 60)}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>12 months</span>
                <span>{activeTab === "hba" ? "25 years" : `${(loanConfig[activeTab].maxTenureMonths || 60) / 12} years`}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Service
              </label>
              <input
                type="number"
                value={serviceYears}
                onChange={(e) => setServiceYears(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                min={0}
              />
            </div>

            {/* Eligibility Status */}
            <div className={`p-4 rounded-lg ${isEligible ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`font-medium ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
                {isEligible
                  ? `✓ Eligible (${config.minServiceYears || 0}+ years service required)`
                  : `✗ Not eligible (need ${config.minServiceYears} years service)`}
              </p>
            </div>
          </div>

          {/* Loan Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">{config.name} Details</h3>
            <div className="space-y-1 text-sm text-blue-700">
              <p><strong>Interest Rate:</strong> {config.interestRate}% p.a.</p>
              <p><strong>Maximum Amount:</strong> {formatCurrency(config.maxAmount)}</p>
              <p><strong>Formula:</strong> {config.formula}</p>
              <p><strong>Min Service:</strong> {config.minServiceYears || 0} years</p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* EMI Card */}
          <div className={`rounded-xl p-6 text-white ${config.color}`}>
            <p className="text-white/80 text-sm">Monthly EMI</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(calculations.emi)}</p>
            <p className="text-white/80 text-sm mt-2">
              @ {calculations.interestRate}% for {tenureMonths} months
            </p>
          </div>

          {/* Loan Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Loan Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Principal Amount</span>
                <span className="font-medium">{formatCurrency(calculations.loanAmount)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Interest Rate</span>
                <span className="font-medium">{calculations.interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Tenure</span>
                <span className="font-medium">{tenureMonths} months</span>
              </div>
              <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-gray-600">Total Interest</span>
                <span className="font-medium text-red-600">{formatCurrency(calculations.totalInterest)}</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Total Repayment</span>
                <span className="font-bold text-blue-700">{formatCurrency(calculations.totalPayment)}</span>
              </div>
            </div>
          </div>

          {/* Repayment Schedule Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Repayment Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500">First EMI</p>
                <p className="font-bold">{formatCurrency(calculations.emi)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500">Last EMI</p>
                <p className="font-bold">{formatCurrency(calculations.emi)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500">Total EMIs</p>
                <p className="font-bold">{tenureMonths}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-gray-500">Completion</p>
                <p className="font-bold text-green-600">
                  {new Date(Date.now() + tenureMonths * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GPF Advance Section */}
      <div className="mt-8 bg-emerald-50 rounded-xl p-6">
        <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
          <Landmark size={18} />
          GPF Advances (Interest-Free)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-emerald-700">
          <div>
            <p className="font-medium mb-2">Refundable Advance:</p>
            <ul className="space-y-1">
              <li>• Up to 75% of balance at credit</li>
              <li>• Refundable in maximum 24 installments</li>
              <li>• No interest charged</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Non-Refundable Withdrawal:</p>
            <ul className="space-y-1">
              <li>• After 15 years of service OR within 10 years of retirement</li>
              <li>• For house, education, marriage, medical</li>
              <li>• No interest charged</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-6 bg-amber-50 rounded-xl p-6">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} />
          Important Points
        </h3>
        <ul className="space-y-2 text-sm text-amber-700">
          <li>• Recovery starts from the month following disbursal</li>
          <li>• Cannot take same type of loan if previous one is pending</li>
          <li>• HBA requires mortgage of property to government</li>
          <li>• Vehicle must be insured and hypothecated to government</li>
          <li>• Outstanding loans are recovered from retirement benefits</li>
          <li>• Interest rates are subject to revision by Government</li>
        </ul>
      </div>

      {/* Info */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Required Documents
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium">HBA Documents:</p>
            <p>Service certificate, Salary certificate, Property documents, NOC, Building plan</p>
          </div>
          <div>
            <p className="font-medium">Vehicle Advance:</p>
            <p>Application form, Salary certificate, Quotation, LIC policy assignment</p>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/gpf-interest-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          GPF Interest Calculator
        </Link>
        <Link href="/tools/loan-emi-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Generic EMI Calculator
        </Link>
        <Link href="/forms" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Loan Application Forms
        </Link>
      </div>
    </div>
  );
}
