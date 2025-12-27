"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Calendar, Info, Plus, Minus, RotateCcw } from "lucide-react";

// Leave types and their rules for TN Government
const LEAVE_RULES = {
  CL: {
    name: "Casual Leave",
    nameTamil: "சாதாரண விடுப்பு",
    annual: 12,
    maxAccumulation: 0, // Cannot accumulate
    canCarryForward: false,
    encashable: false,
  },
  EL: {
    name: "Earned Leave",
    nameTamil: "ஈட்டிய விடுப்பு",
    annual: 15, // 30 for teaching staff
    maxAccumulation: 300,
    canCarryForward: true,
    encashable: true,
  },
  HPL: {
    name: "Half Pay Leave",
    nameTamil: "அரை ஊதிய விடுப்பு",
    annual: 20,
    maxAccumulation: null, // No limit
    canCarryForward: true,
    encashable: false,
  },
  SCL: {
    name: "Special Casual Leave",
    nameTamil: "சிறப்பு சாதாரண விடுப்பு",
    annual: 0, // As per specific rules
    maxAccumulation: 0,
    canCarryForward: false,
    encashable: false,
  },
};

interface LeaveEntry {
  type: keyof typeof LEAVE_RULES;
  days: number;
  reason: string;
  date: string;
}

export default function LeaveCalculatorPage() {
  const currentYear = new Date().getFullYear();

  const [isTeachingStaff, setIsTeachingStaff] = useState(false);
  const [yearsOfService, setYearsOfService] = useState(10);

  // Leave balances
  const [clUsed, setClUsed] = useState(3);
  const [elBalance, setElBalance] = useState(120);
  const [elUsed, setElUsed] = useState(5);
  const [hplBalance, setHplBalance] = useState(40);
  const [hplUsed, setHplUsed] = useState(0);

  const calculations = useMemo(() => {
    const elAnnual = isTeachingStaff ? 30 : 15;

    // CL calculation
    const clAnnual = LEAVE_RULES.CL.annual;
    const clRemaining = clAnnual - clUsed;

    // EL calculation
    const elCredited = elAnnual; // This year's credit
    const elTotal = elBalance + elCredited;
    const elRemaining = elTotal - elUsed;
    const elCapped = Math.min(elRemaining, LEAVE_RULES.EL.maxAccumulation);
    const elLapsing = elRemaining > LEAVE_RULES.EL.maxAccumulation ? elRemaining - LEAVE_RULES.EL.maxAccumulation : 0;

    // HPL calculation
    const hplCredited = LEAVE_RULES.HPL.annual;
    const hplTotal = hplBalance + hplCredited;
    const hplRemaining = hplTotal - hplUsed;

    // Leave encashment calculation (at retirement)
    const basicPay = 36900; // Sample
    const daRate = 50;
    const dailyPay = (basicPay + (basicPay * daRate) / 100) / 30;
    const encashmentValue = Math.min(elRemaining, 300) * dailyPay;

    return {
      cl: {
        annual: clAnnual,
        used: clUsed,
        remaining: clRemaining,
      },
      el: {
        annual: elAnnual,
        openingBalance: elBalance,
        credited: elCredited,
        used: elUsed,
        remaining: elRemaining,
        capped: elCapped,
        lapsing: elLapsing,
      },
      hpl: {
        annual: hplCredited,
        openingBalance: hplBalance,
        used: hplUsed,
        remaining: hplRemaining,
      },
      encashment: {
        eligibleDays: Math.min(elRemaining, 300),
        estimatedValue: encashmentValue,
      },
    };
  }, [isTeachingStaff, clUsed, elBalance, elUsed, hplBalance, hplUsed]);

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
            <FileText className="text-teal-600" size={28} />
            Leave Balance Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">
            விடுப்பு நிலுவை கால்குலேட்டர்
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Leave rules are as per Tamil Nadu Fundamental Rules.
          Verify your actual balance with your office records.
        </p>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Settings</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isTeachingStaff}
              onChange={(e) => setIsTeachingStaff(e.target.checked)}
              className="rounded border-gray-300 text-tn-primary focus:ring-tn-primary"
            />
            <span className="text-sm">Teaching Staff (30 EL/year instead of 15)</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Years of Service:</label>
            <input
              type="number"
              value={yearsOfService}
              onChange={(e) => setYearsOfService(Number(e.target.value))}
              className="w-20 border rounded-lg px-2 py-1 text-sm"
              min={0}
              max={40}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Casual Leave Card */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-blue-500 text-white p-4">
            <h3 className="font-semibold">Casual Leave (CL)</h3>
            <p className="text-xs text-blue-200 tamil">சாதாரண விடுப்பு</p>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-blue-600">
                {calculations.cl.remaining}
              </span>
              <span className="text-sm text-gray-500">
                of {calculations.cl.annual} days
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${(calculations.cl.remaining / calculations.cl.annual) * 100}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Used this year:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setClUsed(Math.max(0, clUsed - 1))}
                  className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-medium">{clUsed}</span>
                <button
                  onClick={() => setClUsed(Math.min(12, clUsed + 1))}
                  className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Lapses at year end. Cannot be accumulated.
            </p>
          </div>
        </div>

        {/* Earned Leave Card */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-green-500 text-white p-4">
            <h3 className="font-semibold">Earned Leave (EL)</h3>
            <p className="text-xs text-green-200 tamil">ஈட்டிய விடுப்பு</p>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-green-600">
                {calculations.el.remaining}
              </span>
              <span className="text-sm text-gray-500">days total</span>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Opening Balance:</span>
                <input
                  type="number"
                  value={elBalance}
                  onChange={(e) => setElBalance(Number(e.target.value))}
                  className="w-20 border rounded px-2 py-0.5 text-right"
                  min={0}
                  max={300}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Credited this year:</span>
                <span className="font-medium">+{calculations.el.annual}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Used:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setElUsed(Math.max(0, elUsed - 1))}
                    className="p-0.5 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center">{elUsed}</span>
                  <button
                    onClick={() => setElUsed(elUsed + 1)}
                    className="p-0.5 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
            {calculations.el.lapsing > 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                {calculations.el.lapsing} days will lapse (max 300)
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Max accumulation: 300 days. Encashable at retirement.
            </p>
          </div>
        </div>

        {/* Half Pay Leave Card */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-purple-500 text-white p-4">
            <h3 className="font-semibold">Half Pay Leave (HPL)</h3>
            <p className="text-xs text-purple-200 tamil">அரை ஊதிய விடுப்பு</p>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-purple-600">
                {calculations.hpl.remaining}
              </span>
              <span className="text-sm text-gray-500">days total</span>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Opening Balance:</span>
                <input
                  type="number"
                  value={hplBalance}
                  onChange={(e) => setHplBalance(Number(e.target.value))}
                  className="w-20 border rounded px-2 py-0.5 text-right"
                  min={0}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Credited this year:</span>
                <span className="font-medium">+{calculations.hpl.annual}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Used:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setHplUsed(Math.max(0, hplUsed - 1))}
                    className="p-0.5 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center">{hplUsed}</span>
                  <button
                    onClick={() => setHplUsed(hplUsed + 1)}
                    className="p-0.5 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Can be commuted to full pay with medical certificate.
            </p>
          </div>
        </div>
      </div>

      {/* EL Encashment Calculator */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white mb-6">
        <h2 className="font-semibold mb-2">EL Encashment at Retirement</h2>
        <p className="text-green-200 text-sm mb-4">
          Earned Leave can be encashed at retirement (max 300 days)
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-green-200 text-sm">Eligible Days</p>
            <p className="text-3xl font-bold">{calculations.encashment.eligibleDays}</p>
          </div>
          <div>
            <p className="text-green-200 text-sm">Estimated Value (approx.)</p>
            <p className="text-3xl font-bold">
              ₹{Math.round(calculations.encashment.estimatedValue).toLocaleString("en-IN")}
            </p>
            <p className="text-green-200 text-xs mt-1">
              Based on ₹36,900 Basic + 50% DA
            </p>
          </div>
        </div>
      </div>

      {/* Leave Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-tn-text">Leave Summary - {currentYear}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Leave Type</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Opening</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Credit</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Used</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium">Casual Leave</p>
                  <p className="text-xs text-gray-500 tamil">சாதாரண விடுப்பு</p>
                </td>
                <td className="px-4 py-3 text-right">-</td>
                <td className="px-4 py-3 text-right text-green-600">+{calculations.cl.annual}</td>
                <td className="px-4 py-3 text-right text-red-600">-{calculations.cl.used}</td>
                <td className="px-4 py-3 text-right font-bold">{calculations.cl.remaining}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium">Earned Leave</p>
                  <p className="text-xs text-gray-500 tamil">ஈட்டிய விடுப்பு</p>
                </td>
                <td className="px-4 py-3 text-right">{calculations.el.openingBalance}</td>
                <td className="px-4 py-3 text-right text-green-600">+{calculations.el.annual}</td>
                <td className="px-4 py-3 text-right text-red-600">-{calculations.el.used}</td>
                <td className="px-4 py-3 text-right font-bold">{calculations.el.remaining}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium">Half Pay Leave</p>
                  <p className="text-xs text-gray-500 tamil">அரை ஊதிய விடுப்பு</p>
                </td>
                <td className="px-4 py-3 text-right">{calculations.hpl.openingBalance}</td>
                <td className="px-4 py-3 text-right text-green-600">+{calculations.hpl.annual}</td>
                <td className="px-4 py-3 text-right text-red-600">-{calculations.hpl.used}</td>
                <td className="px-4 py-3 text-right font-bold">{calculations.hpl.remaining}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Leave Rules for TN Government Employees
        </h3>
        <div className="text-sm text-blue-700 space-y-3">
          <div>
            <p className="font-medium">Casual Leave (CL)</p>
            <p>12 days per calendar year. Cannot be accumulated or carried forward.
            Lapses at year end. Cannot be prefixed/suffixed with EL or holidays (except Sundays).</p>
          </div>
          <div>
            <p className="font-medium">Earned Leave (EL)</p>
            <p>15 days per year for non-teaching staff, 30 days for teaching staff.
            Can accumulate up to 300 days. Encashable at retirement.
            Advance EL up to 15 days can be taken on LTC.</p>
          </div>
          <div>
            <p className="font-medium">Half Pay Leave (HPL)</p>
            <p>20 days per year (credited as half-pay). Can be commuted to full pay
            leave with medical certificate (2 HPL = 1 Commuted Leave).
            No limit on accumulation.</p>
          </div>
          <div>
            <p className="font-medium">Special Casual Leave</p>
            <p>Granted for specific purposes: Blood donation (1 day), Family planning (up to 14 days),
            Sports/cultural events (as sanctioned), Natural calamities (as required).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
