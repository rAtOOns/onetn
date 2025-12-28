"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Baby, Calculator, Info, Printer } from "lucide-react";

const leaveTypes = [
  { id: "maternity", name: "Maternity Leave", nameTamil: "மகப்பேறு விடுப்பு" },
  { id: "paternity", name: "Paternity Leave", nameTamil: "தந்தைவழி விடுப்பு" },
  { id: "ccl", name: "Child Care Leave", nameTamil: "குழந்தை பராமரிப்பு விடுப்பு" },
];

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SpecialLeaveCalculatorPage() {
  const [leaveType, setLeaveType] = useState<string>("maternity");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [basicPay, setBasicPay] = useState<number>(56100);
  const [childCount, setChildCount] = useState<number>(1);
  const [childAge, setChildAge] = useState<number>(5);
  const [cclDays, setCclDays] = useState<number>(30);

  const calculations = useMemo(() => {
    const start = new Date(startDate);
    const DA_PERCENT = 55;
    const monthlyPay = basicPay + (basicPay * DA_PERCENT / 100);
    const dailyPay = monthlyPay / 30;

    let leaveDays = 0;
    let payType = "";
    let eligibility = true;
    let notes: string[] = [];

    switch (leaveType) {
      case "maternity":
        leaveDays = 180;
        payType = "Full Pay";
        if (childCount > 2) {
          eligibility = false;
          notes.push("Maternity leave for third child is limited to 12 weeks (84 days)");
          leaveDays = 84;
        }
        notes.push("Can be combined with other leave types");
        notes.push("Applicable for miscarriage/MTP also (6 weeks)");
        break;

      case "paternity":
        leaveDays = 15;
        payType = "Full Pay";
        notes.push("Must be availed within 6 months of child birth");
        notes.push("Cannot be accumulated");
        break;

      case "ccl":
        leaveDays = cclDays;
        payType = "Full Pay (first 365 days lifetime)";
        if (childAge > 18) {
          eligibility = false;
          notes.push("CCL only for children below 18 years");
        }
        notes.push("Maximum 730 days during entire service");
        notes.push("Can be taken in spells (min 15 days)");
        notes.push("Leave salary after 365 days at 80%");
        break;
    }

    const endDate = addDays(start, leaveDays - 1);
    const joiningDate = addDays(start, leaveDays);
    const totalPay = Math.round(dailyPay * leaveDays);

    return {
      leaveDays,
      payType,
      eligibility,
      notes,
      startDate: start,
      endDate,
      joiningDate,
      dailyPay: Math.round(dailyPay),
      totalPay,
    };
  }, [leaveType, startDate, basicPay, childCount, childAge, cclDays]);

  const handlePrint = () => {
    window.print();
  };

  const selectedLeave = leaveTypes.find(l => l.id === leaveType);

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
              <Baby className="text-pink-600" size={28} />
              Special Leave Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">சிறப்பு விடுப்பு கால்குலேட்டர்</p>
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

      {/* Leave Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {leaveTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setLeaveType(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                leaveType === type.id
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            {selectedLeave?.name} Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Basic Pay (₹)
              </label>
              <input
                type="number"
                value={basicPay}
                onChange={(e) => setBasicPay(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {leaveType === "maternity" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  This is child number
                </label>
                <select
                  value={childCount}
                  onChange={(e) => setChildCount(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-500"
                >
                  <option value={1}>1st Child</option>
                  <option value={2}>2nd Child</option>
                  <option value={3}>3rd Child or more</option>
                </select>
              </div>
            )}

            {leaveType === "ccl" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Child Age (years)
                  </label>
                  <input
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-500"
                    min={0}
                    max={18}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CCL Days Required
                  </label>
                  <input
                    type="number"
                    value={cclDays}
                    onChange={(e) => setCclDays(Number(e.target.value))}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-500"
                    min={15}
                    max={730}
                  />
                  <p className="text-xs text-gray-500 mt-1">Min 15 days per spell, Max 730 days in service</p>
                </div>
              </>
            )}
          </div>

          {/* Leave Rules */}
          <div className="mt-6 p-4 bg-pink-50 rounded-lg">
            <h3 className="font-medium text-pink-800 mb-2">{selectedLeave?.name} Rules</h3>
            <ul className="space-y-1 text-sm text-pink-700">
              {leaveType === "maternity" && (
                <>
                  <li>• 180 days (26 weeks) for 1st & 2nd child</li>
                  <li>• 84 days (12 weeks) for 3rd child onwards</li>
                  <li>• Full pay during leave period</li>
                  <li>• Can start 8 weeks before expected delivery</li>
                </>
              )}
              {leaveType === "paternity" && (
                <>
                  <li>• 15 days with full pay</li>
                  <li>• Within 6 months of child birth</li>
                  <li>• For male employees only</li>
                  <li>• Cannot be combined with other leave</li>
                </>
              )}
              {leaveType === "ccl" && (
                <>
                  <li>• Maximum 730 days during entire service</li>
                  <li>• For children below 18 years</li>
                  <li>• Minimum 15 days per spell</li>
                  <li>• Full pay for first 365 days (lifetime)</li>
                  <li>• 80% pay for remaining days</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Main Result */}
          <div className={`rounded-xl p-6 text-white ${
            calculations.eligibility
              ? "bg-gradient-to-r from-pink-500 to-pink-600"
              : "bg-gradient-to-r from-gray-500 to-gray-600"
          }`}>
            <p className="text-white/80 text-sm">{selectedLeave?.name} Duration</p>
            <p className="text-4xl font-bold mt-1">{calculations.leaveDays} Days</p>
            <p className="text-white/80 text-sm mt-2">
              {calculations.payType}
            </p>
            {!calculations.eligibility && (
              <p className="mt-2 text-sm bg-white/20 p-2 rounded">
                ⚠️ Limited eligibility - see notes
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Leave Period</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Start Date</span>
                <span className="font-medium">{formatDate(calculations.startDate)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">End Date</span>
                <span className="font-medium">{formatDate(calculations.endDate)}</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-600">Joining Date</span>
                <span className="font-bold text-green-600">{formatDate(calculations.joiningDate)}</span>
              </div>
            </div>
          </div>

          {/* Pay Calculation */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Pay During Leave</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Daily Pay (Basic+DA)</span>
                <span className="font-medium">{formatCurrency(calculations.dailyPay)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Leave Days</span>
                <span className="font-medium">{calculations.leaveDays} days</span>
              </div>
              <div className="flex justify-between p-3 bg-pink-50 rounded-lg">
                <span className="text-gray-700 font-medium">Total Leave Salary</span>
                <span className="font-bold text-pink-600">{formatCurrency(calculations.totalPay)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {calculations.notes.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-2">Important Notes</h3>
              <ul className="space-y-1 text-sm text-amber-700">
                {calculations.notes.map((note, i) => (
                  <li key={i}>• {note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* General Info */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          General Guidelines
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium text-pink-600">Maternity Leave</p>
            <p>180 days for 1st/2nd child. Apply with medical certificate.</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium text-blue-600">Paternity Leave</p>
            <p>15 days within 6 months of birth. Birth certificate required.</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="font-medium text-purple-600">Child Care Leave</p>
            <p>730 days total for children &lt;18. Min 15 days per spell.</p>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/leave-rules" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          All Leave Rules
        </Link>
        <Link href="/tools/leave-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Leave Balance
        </Link>
        <Link href="/tools/eol-impact" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          EOL Impact
        </Link>
      </div>
    </div>
  );
}
