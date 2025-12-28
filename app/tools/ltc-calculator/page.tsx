"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plane, Calculator, Info, CheckCircle } from "lucide-react";

const CURRENT_DA = 55;

// LTC entitlement based on pay level
const ltcEntitlement = {
  ac2: { label: "AC 2-Tier", payLevels: "Level 14 and above" },
  ac3: { label: "AC 3-Tier", payLevels: "Level 9 to 13" },
  sleeper: { label: "Sleeper Class", payLevels: "Level 1 to 8" },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function LTCCalculatorPage() {
  const [basicPay, setBasicPay] = useState<number>(56900);
  const [familyMembers, setFamilyMembers] = useState<number>(4);
  const [travelClass, setTravelClass] = useState<string>("ac3");
  const [estimatedFare, setEstimatedFare] = useState<number>(2500);
  const [hometown, setHometown] = useState<string>("yes");

  // Calculate
  const daAmount = Math.round((basicPay * CURRENT_DA) / 100);
  const totalPay = basicPay + daAmount;

  // LTC advance (usually 90% of estimated fare)
  const totalFare = estimatedFare * familyMembers * 2; // Round trip
  const ltcAdvance = Math.round(totalFare * 0.9);

  // Leave encashment with LTC (10 days)
  const leaveEncashmentDays = 10;
  const leaveEncashment = Math.round((totalPay / 30) * leaveEncashmentDays);

  const totalBenefit = ltcAdvance + leaveEncashment;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Plane className="text-sky-600" size={28} />
            LTC Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">விடுப்பு பயண சலுகை கால்குலேட்டர்</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This is an unofficial calculator for estimation only.
          LTC rules and entitlements may vary. Verify with your DDO before applying.
        </p>
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
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Family Members (including self)
              </label>
              <input
                type="number"
                value={familyMembers}
                onChange={(e) => setFamilyMembers(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-sky-500"
                min={1}
                max={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Travel Class Entitled
              </label>
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-sky-500"
              >
                <option value="ac2">AC 2-Tier (Level 14+)</option>
                <option value="ac3">AC 3-Tier (Level 9-13)</option>
                <option value="sleeper">Sleeper Class (Level 1-8)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated One-way Fare (₹ per person)
              </label>
              <input
                type="number"
                value={estimatedFare}
                onChange={(e) => setEstimatedFare(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LTC Type
              </label>
              <select
                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-sky-500"
              >
                <option value="yes">Home Town</option>
                <option value="no">Anywhere in India (once in 4 years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Total Benefit Card */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl p-6 text-white">
            <p className="text-sky-100 text-sm">Total LTC Benefit</p>
            <p className="text-sm tamil text-sky-100">மொத்த LTC பலன்</p>
            <p className="text-4xl font-bold mt-2">{formatCurrency(totalBenefit)}</p>
            <p className="text-sky-100 text-sm mt-2">
              Advance + Leave Encashment
            </p>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Calculation Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">One-way Fare (per person)</span>
                <span className="font-medium">{formatCurrency(estimatedFare)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Family Members</span>
                <span className="font-medium">× {familyMembers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Round Trip</span>
                <span className="font-medium">× 2</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-700 font-medium">Total Fare</span>
                <span className="font-bold">{formatCurrency(totalFare)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">LTC Advance (90%)</span>
                <span className="font-medium text-sky-600">{formatCurrency(ltcAdvance)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-700 font-medium">Leave Encashment ({leaveEncashmentDays} days)</span>
                <span className="font-bold text-green-600">{formatCurrency(leaveEncashment)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 bg-sky-50 -mx-6 px-6 py-2">
                <span className="font-bold text-sky-800">Total Benefit</span>
                <span className="font-bold text-sky-800">{formatCurrency(totalBenefit)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LTC Rules */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          LTC Rules Summary
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Eligibility:</p>
            <ul className="space-y-1">
              <li>• Home Town LTC: Once in 2 years</li>
              <li>• All India LTC: Once in 4 years</li>
              <li>• Can convert Home Town to All India</li>
              <li>• Family includes spouse, children, dependent parents</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Leave Encashment with LTC:</p>
            <ul className="space-y-1">
              <li>• Up to 10 days EL can be encashed</li>
              <li>• Only when actually availing LTC</li>
              <li>• Subject to having sufficient EL balance</li>
              <li>• Taxable as salary income</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="mt-6 bg-green-50 rounded-xl p-6">
        <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
          <CheckCircle size={18} />
          LTC Claim Checklist
        </h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-green-700">
          {[
            "LTC advance application form",
            "Declaration of family members",
            "Previous LTC details",
            "Leave application for travel period",
            "Original tickets (for reimbursement)",
            "Boarding passes (for air travel)",
            "Hotel bills (if claiming)",
            "Certificate of travel (self-declaration)",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span>•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/ta-da-rates" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          TA/DA Rates
        </Link>
        <Link href="/tools/leave-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Leave Calculator
        </Link>
        <Link href="/forms" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          LTC Forms
        </Link>
      </div>
    </div>
  );
}
