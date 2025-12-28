"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Calculator, Info, Printer } from "lucide-react";

// Grade-wise entitlements
const gradeEntitlements = [
  {
    grade: "Grade I",
    description: "Pay Level 14 and above (Officers)",
    trainClass: "AC First Class / Executive",
    busClass: "Deluxe / AC Bus",
    daRate: 450,
  },
  {
    grade: "Grade II",
    description: "Pay Level 9 to 13",
    trainClass: "AC 2-Tier",
    busClass: "Deluxe Bus",
    daRate: 350,
  },
  {
    grade: "Grade III",
    description: "Pay Level 6 to 8",
    trainClass: "AC 3-Tier / First Class",
    busClass: "Express / Ordinary",
    daRate: 300,
  },
  {
    grade: "Grade IV",
    description: "Pay Level 1 to 5",
    trainClass: "Sleeper Class",
    busClass: "Ordinary Bus",
    daRate: 250,
  },
];

const travelModes = [
  { id: "train", name: "Train", icon: "🚂" },
  { id: "bus", name: "Bus", icon: "🚌" },
  { id: "own", name: "Own Vehicle", icon: "🚗" },
  { id: "taxi", name: "Taxi (if entitled)", icon: "🚕" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function TABillCalculatorPage() {
  const [selectedGrade, setSelectedGrade] = useState<string>("Grade III");
  const [travelMode, setTravelMode] = useState<string>("train");
  const [distanceKm, setDistanceKm] = useState<number>(200);
  const [journeys, setJourneys] = useState<number>(2); // Usually to and fro
  const [halts, setHalts] = useState<number>(1);
  const [actualFare, setActualFare] = useState<number>(500);
  const [localConveyance, setLocalConveyance] = useState<number>(100);

  const grade = gradeEntitlements.find((g) => g.grade === selectedGrade);

  const calculations = useMemo(() => {
    if (!grade) return null;

    // Travel fare calculation
    let travelAllowance = 0;
    if (travelMode === "own") {
      // Own vehicle: ₹8-10 per km for car, ₹4-5 for two-wheeler
      travelAllowance = distanceKm * journeys * 8;
    } else {
      travelAllowance = actualFare * journeys;
    }

    // Daily Allowance
    const dailyAllowance = grade.daRate * halts;

    // Halting place local conveyance
    const totalLocalConveyance = localConveyance * halts;

    // Total
    const totalTA = travelAllowance + dailyAllowance + totalLocalConveyance;

    return {
      travelAllowance,
      dailyAllowance,
      totalLocalConveyance,
      totalTA,
      daRate: grade.daRate,
    };
  }, [grade, travelMode, distanceKm, journeys, halts, actualFare, localConveyance]);

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
              <MapPin className="text-cyan-600" size={28} />
              TA Bill Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">பயணப்படி கால்குலேட்டர்</p>
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
          <strong>Disclaimer:</strong> Rates are approximate. Please refer to the latest TA rules
          and Government Orders for exact entitlements.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            Journey Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Grade / Pay Level
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-cyan-500"
              >
                {gradeEntitlements.map((g) => (
                  <option key={g.grade} value={g.grade}>
                    {g.grade} - {g.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode of Travel
              </label>
              <div className="grid grid-cols-2 gap-2">
                {travelModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setTravelMode(mode.id)}
                    className={`p-3 rounded-lg border text-sm flex items-center gap-2 justify-center ${
                      travelMode === mode.id
                        ? "bg-cyan-50 border-cyan-500 text-cyan-700"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span>{mode.icon}</span>
                    {mode.name}
                  </button>
                ))}
              </div>
            </div>

            {travelMode === "own" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-cyan-500"
                />
                <p className="text-xs text-gray-500 mt-1">₹8/km for car, ₹4/km for two-wheeler</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Fare (one way) ₹
                </label>
                <input
                  type="number"
                  value={actualFare}
                  onChange={(e) => setActualFare(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. of Journeys
                </label>
                <input
                  type="number"
                  value={journeys}
                  onChange={(e) => setJourneys(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-cyan-500"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Halting Days
                </label>
                <input
                  type="number"
                  value={halts}
                  onChange={(e) => setHalts(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-cyan-500"
                  min={0}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local Conveyance (per day) ₹
              </label>
              <input
                type="number"
                value={localConveyance}
                onChange={(e) => setLocalConveyance(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Grade Entitlement */}
          {grade && (
            <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
              <h3 className="font-medium text-cyan-800 mb-2">{grade.grade} Entitlements</h3>
              <div className="space-y-1 text-sm text-cyan-700">
                <p>Train: {grade.trainClass}</p>
                <p>Bus: {grade.busClass}</p>
                <p>DA: {formatCurrency(grade.daRate)}/day</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {calculations && (
            <>
              {/* Total */}
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-6 text-white">
                <p className="text-cyan-100 text-sm">Total TA Claim</p>
                <p className="text-4xl font-bold mt-1">{formatCurrency(calculations.totalTA)}</p>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">Claim Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Travel Allowance</span>
                    <span className="font-medium">{formatCurrency(calculations.travelAllowance)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Daily Allowance ({halts} days × {formatCurrency(calculations.daRate)})</span>
                    <span className="font-medium">{formatCurrency(calculations.dailyAllowance)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Local Conveyance</span>
                    <span className="font-medium">{formatCurrency(calculations.totalLocalConveyance)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-cyan-50 rounded-lg font-semibold">
                    <span className="text-cyan-800">Total Claim</span>
                    <span className="text-cyan-600">{formatCurrency(calculations.totalTA)}</span>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-3">Required Documents</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500">✓</span>
                    TA Claim Form (countersigned)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500">✓</span>
                    Original tickets/boarding passes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500">✓</span>
                    Tour program/order copy
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500">✓</span>
                    Hotel bills (if applicable)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500">✓</span>
                    Self-declaration for local conveyance
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* TA Rules Summary */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          TA Rules Summary
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Eligibility:</p>
            <ul className="space-y-1">
              <li>• Official tour approved by competent authority</li>
              <li>• Minimum distance: Usually 8 km from HQ</li>
              <li>• Transfer TA: Different rules apply</li>
              <li>• LTC: Separate entitlement</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Key Points:</p>
            <ul className="space-y-1">
              <li>• Submit within 60 days of journey</li>
              <li>• Advance can be taken before tour</li>
              <li>• Night halt DA: Full rate</li>
              <li>• Day journey without halt: 50% DA</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/ta-da-rates" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          TA/DA Rate Table
        </Link>
        <Link href="/tools/ltc-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          LTC Calculator
        </Link>
        <Link href="/forms" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          TA Claim Forms
        </Link>
      </div>
    </div>
  );
}
