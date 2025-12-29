"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpCircle, Calculator, Info, Printer, AlertCircle } from "lucide-react";

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

export default function SteppingUpCalculatorPage() {
  const [seniorBasic, setSeniorBasic] = useState<number>(67700);
  const [seniorJoinDate, setSeniorJoinDate] = useState<string>("2015-06-15");
  const [juniorBasic, setJuniorBasic] = useState<number>(72500);
  const [juniorJoinDate, setJuniorJoinDate] = useState<string>("2018-03-20");
  const [promotionDate, setPromotionDate] = useState<string>("2020-07-01");

  const calculations = useMemo(() => {
    const seniorJoin = new Date(seniorJoinDate);
    const juniorJoin = new Date(juniorJoinDate);
    const promotion = new Date(promotionDate);

    // Check if anomaly exists
    const isAnomaly = juniorBasic > seniorBasic && juniorJoin > seniorJoin;

    // Calculate stepping up amount
    const steppedUpBasic = isAnomaly ? juniorBasic : seniorBasic;
    const difference = steppedUpBasic - seniorBasic;

    // Arrears calculation (from promotion date to current)
    const today = new Date();
    const monthsFromPromotion = Math.max(
      0,
      (today.getFullYear() - promotion.getFullYear()) * 12 +
        (today.getMonth() - promotion.getMonth())
    );

    // Monthly difference with DA (assuming 50% DA)
    const daPercent = 50;
    const monthlyDifference = Math.round(difference + (difference * daPercent) / 100);
    const totalArrears = monthlyDifference * monthsFromPromotion;

    // Seniority difference
    const seniorityDiffMonths = Math.round(
      (juniorJoin.getTime() - seniorJoin.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    return {
      isAnomaly,
      steppedUpBasic,
      difference,
      monthlyDifference,
      monthsFromPromotion,
      totalArrears,
      seniorityDiffMonths,
    };
  }, [seniorBasic, seniorJoinDate, juniorBasic, juniorJoinDate, promotionDate]);

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
              <ArrowUpCircle className="text-rose-600" size={28} />
              Stepping Up Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">படிநிலை சரிசெய்தல் கால்குலேட்டர்</p>
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
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-rose-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-rose-800 font-medium">Stepping Up of Pay</p>
            <p className="text-sm text-rose-700 mt-1">
              When a junior promoted later draws higher pay than a senior promoted earlier,
              the senior&apos;s pay is stepped up to match the junior&apos;s pay. This removes pay anomaly.
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

          <div className="space-y-6">
            {/* Senior Employee */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-3">Senior Employee (You)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Date of Joining (in cadre)</label>
                  <input
                    type="date"
                    value={seniorJoinDate}
                    onChange={(e) => setSeniorJoinDate(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Current Basic Pay (₹)</label>
                  <input
                    type="number"
                    value={seniorBasic}
                    onChange={(e) => setSeniorBasic(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Junior Employee */}
            <div className="p-4 bg-amber-50 rounded-lg">
              <h3 className="font-medium text-amber-800 mb-3">Junior Employee (Comparator)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Date of Joining (in cadre)</label>
                  <input
                    type="date"
                    value={juniorJoinDate}
                    onChange={(e) => setJuniorJoinDate(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Current Basic Pay (₹)</label>
                  <input
                    type="number"
                    value={juniorBasic}
                    onChange={(e) => setJuniorBasic(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Promotion Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Promotion (Senior)
              </label>
              <input
                type="date"
                value={promotionDate}
                onChange={(e) => setPromotionDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Anomaly Status */}
          <div className={`rounded-xl p-6 text-white ${
            calculations.isAnomaly
              ? "bg-gradient-to-r from-rose-500 to-rose-600"
              : "bg-gradient-to-r from-green-500 to-green-600"
          }`}>
            <p className="text-white/80 text-sm">Pay Anomaly Status</p>
            <p className="text-3xl font-bold mt-1">
              {calculations.isAnomaly ? "Anomaly Exists" : "No Anomaly"}
            </p>
            <p className="text-white/80 text-sm mt-2">
              {calculations.isAnomaly
                ? "You are eligible for stepping up"
                : "Your pay is already higher or equal"}
            </p>
          </div>

          {calculations.isAnomaly && (
            <>
              {/* Stepped Up Pay */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">Stepping Up Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Your Current Basic</span>
                    <span className="font-medium">{formatCurrency(seniorBasic)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Junior&apos;s Basic</span>
                    <span className="font-medium">{formatCurrency(juniorBasic)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-rose-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Pay Difference</span>
                    <span className="font-bold text-rose-600">
                      +{formatCurrency(calculations.difference)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Your Stepped Up Basic</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(calculations.steppedUpBasic)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrears Estimate */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">Arrears Estimate</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Monthly Difference (with DA)</span>
                    <span className="font-medium">{formatCurrency(calculations.monthlyDifference)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Months Since Promotion</span>
                    <span className="font-medium">{calculations.monthsFromPromotion} months</span>
                  </div>
                  <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Estimated Total Arrears</span>
                    <span className="font-bold text-purple-600">
                      {formatCurrency(calculations.totalArrears)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * Estimate only. Actual arrears depend on official calculation from date of entitlement.
                </p>
              </div>
            </>
          )}

          {/* Seniority Comparison */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Seniority Comparison</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-600">Senior Joined</span>
                <span className="font-medium">{formatDate(new Date(seniorJoinDate))}</span>
              </div>
              <div className="flex justify-between p-3 bg-amber-50 rounded-lg">
                <span className="text-gray-600">Junior Joined</span>
                <span className="font-medium">{formatDate(new Date(juniorJoinDate))}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Seniority Difference</span>
                <span className="font-medium">{Math.abs(calculations.seniorityDiffMonths)} months</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      {calculations.isAnomaly && (
        <div className="mt-6 bg-amber-50 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-amber-600 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-amber-800">Important Note</p>
              <p className="text-sm text-amber-700 mt-1">
                Stepping up is not automatic. You must submit an application to your DDO with
                comparative statement. The order will be issued after verification by AG/DTO.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rules */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Stepping Up Rules
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">When Eligible:</p>
            <ul className="space-y-1">
              <li>• Junior drawing more pay than senior</li>
              <li>• Both in same cadre/post</li>
              <li>• Senior promoted earlier</li>
              <li>• Anomaly due to increment/promotion timing</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">How to Apply:</p>
            <ul className="space-y-1">
              <li>• Submit application to DDO</li>
              <li>• Attach comparative pay statement</li>
              <li>• Service book copies of both employees</li>
              <li>• No time limit for claiming</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/increment-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Increment Calculator
        </Link>
        <Link href="/tools/promotion-info" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Promotion Info
        </Link>
      </div>
    </div>
  );
}
