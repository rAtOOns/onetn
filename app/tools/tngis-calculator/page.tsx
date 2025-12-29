"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Calculator, Info, Printer } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const insuranceSlabs = [
  { minPay: 0, maxPay: 20000, premium: 120, sumAssured: 120000 },
  { minPay: 20001, maxPay: 30000, premium: 180, sumAssured: 180000 },
  { minPay: 30001, maxPay: 40000, premium: 240, sumAssured: 240000 },
  { minPay: 40001, maxPay: 50000, premium: 300, sumAssured: 300000 },
  { minPay: 50001, maxPay: 60000, premium: 360, sumAssured: 360000 },
  { minPay: 60001, maxPay: 80000, premium: 480, sumAssured: 480000 },
  { minPay: 80001, maxPay: 100000, premium: 600, sumAssured: 600000 },
  { minPay: 100001, maxPay: 150000, premium: 900, sumAssured: 900000 },
  { minPay: 150001, maxPay: 999999, premium: 1200, sumAssured: 1200000 },
];

export default function TNGISCalculatorPage() {
  const [basicPay, setBasicPay] = useState<number>(56100);
  const [yearsOfService, setYearsOfService] = useState<number>(15);
  const [age, setAge] = useState<number>(45);

  const calculations = useMemo(() => {
    // Find applicable slab
    const slab = insuranceSlabs.find(s => basicPay >= s.minPay && basicPay <= s.maxPay) || insuranceSlabs[insuranceSlabs.length - 1];

    const monthlyPremium = slab.premium;
    const yearlyPremium = monthlyPremium * 12;
    const sumAssured = slab.sumAssured;

    // Bonus calculation (approximate - actual depends on scheme performance)
    const bonusRate = 50; // ₹50 per ₹1000 sum assured (approximate)
    const accumulatedBonus = Math.round((sumAssured / 1000) * bonusRate * Math.min(yearsOfService, 30));

    // Total benefit on death
    const deathBenefit = sumAssured + accumulatedBonus;

    // Total premium paid
    const totalPremiumPaid = yearlyPremium * yearsOfService;

    // Retirement benefit (if survived)
    const retirementBenefit = Math.round(sumAssured * 0.5 + accumulatedBonus);

    return {
      monthlyPremium,
      yearlyPremium,
      sumAssured,
      accumulatedBonus,
      deathBenefit,
      totalPremiumPaid,
      retirementBenefit,
      slab,
    };
  }, [basicPay, yearsOfService]);

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
              <Shield className="text-blue-600" size={28} />
              TNGIS Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">TN அரசு காப்பீட்டு திட்டம்</p>
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-blue-800 font-medium">Tamil Nadu Government Insurance Scheme</p>
            <p className="text-sm text-blue-700 mt-1">
              Compulsory group insurance for all TN government employees. Premium deducted from salary monthly.
              Provides life cover and retirement benefits.
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
                Basic Pay (₹)
              </label>
              <input
                type="number"
                value={basicPay}
                onChange={(e) => setBasicPay(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Service
              </label>
              <input
                type="number"
                value={yearsOfService}
                onChange={(e) => setYearsOfService(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                min={1}
                max={35}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                min={18}
                max={60}
              />
            </div>
          </div>

          {/* Premium Slabs */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Premium Slabs</h3>
            <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
              {insuranceSlabs.map((slab, i) => (
                <div
                  key={i}
                  className={`flex justify-between p-1 rounded ${
                    basicPay >= slab.minPay && basicPay <= slab.maxPay ? "bg-blue-100" : ""
                  }`}
                >
                  <span>₹{slab.minPay.toLocaleString()} - ₹{slab.maxPay.toLocaleString()}</span>
                  <span className="font-medium">₹{slab.premium}/month</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Premium Details */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <p className="text-white/80 text-sm">Monthly Premium</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(calculations.monthlyPremium)}</p>
            <p className="text-white/80 text-sm mt-2">
              Yearly: {formatCurrency(calculations.yearlyPremium)}
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Insurance Benefits</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Sum Assured</span>
                <span className="font-bold text-blue-600">{formatCurrency(calculations.sumAssured)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Accumulated Bonus (Est.)</span>
                <span className="font-medium">{formatCurrency(calculations.accumulatedBonus)}</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Death Benefit</span>
                <span className="font-bold text-green-600">{formatCurrency(calculations.deathBenefit)}</span>
              </div>
              <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700 font-medium">Retirement Benefit</span>
                <span className="font-bold text-purple-600">{formatCurrency(calculations.retirementBenefit)}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Premium Paid</span>
                <span className="font-medium">{formatCurrency(calculations.totalPremiumPaid)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Coverage Ratio</span>
                <span className="font-medium text-green-600">
                  {Math.round(calculations.deathBenefit / calculations.totalPremiumPaid * 10) / 10}x
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheme Details */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          TNGIS Scheme Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Key Features:</p>
            <ul className="space-y-1">
              <li>• Compulsory for all TN Govt employees</li>
              <li>• Premium based on pay slab</li>
              <li>• Life cover + savings component</li>
              <li>• Bonus declared annually</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Benefits:</p>
            <ul className="space-y-1">
              <li>• Death: Sum Assured + Bonus</li>
              <li>• Retirement: 50% SA + Bonus</li>
              <li>• Resignation: Savings portion only</li>
              <li>• Nomination can be changed anytime</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/die-in-harness" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Die-in-Harness Benefits
        </Link>
        <Link href="/tools/salary-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Salary Calculator
        </Link>
      </div>
    </div>
  );
}
