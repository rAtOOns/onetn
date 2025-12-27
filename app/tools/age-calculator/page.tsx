"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Info, User } from "lucide-react";

function calculateAge(birthDate: Date, asOnDate: Date) {
  let years = asOnDate.getFullYear() - birthDate.getFullYear();
  let months = asOnDate.getMonth() - birthDate.getMonth();
  let days = asOnDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(asOnDate.getFullYear(), asOnDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((asOnDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  // Next birthday
  let nextBirthday = new Date(asOnDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday <= asOnDate) {
    nextBirthday = new Date(asOnDate.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }
  const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - asOnDate.getTime()) / (1000 * 60 * 60 * 24));

  // Retirement date (60 years)
  const retirementDate = new Date(birthDate.getFullYear() + 60, birthDate.getMonth(), birthDate.getDate());
  const daysToRetirement = Math.ceil((retirementDate.getTime() - asOnDate.getTime()) / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    nextBirthday,
    daysToNextBirthday,
    retirementDate,
    daysToRetirement,
    isRetired: asOnDate >= retirementDate,
  };
}

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState<string>("1985-06-15");
  const [asOnDate, setAsOnDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const result = useMemo(() => {
    const birth = new Date(birthDate);
    const asOn = new Date(asOnDate);

    if (isNaN(birth.getTime()) || isNaN(asOn.getTime())) {
      return null;
    }

    if (birth > asOn) {
      return null;
    }

    return calculateAge(birth, asOn);
  }, [birthDate, asOnDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <User className="text-pink-600" size={28} />
            Age Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">வயது கால்குலேட்டர்</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-pink-800">
          Calculate exact age in years, months, and days. Useful for admissions, retirement, and official records.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4">Enter Dates</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age as on Date
              </label>
              <input
                type="date"
                value={asOnDate}
                onChange={(e) => setAsOnDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={() => setAsOnDate(new Date().toISOString().split("T")[0])}
                className="text-sm text-pink-600 hover:underline mt-1"
              >
                Set to Today
              </button>
            </div>
          </div>

          {/* Quick Date Options */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Common Dates:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setAsOnDate("2025-01-01")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                01-Jan-2025
              </button>
              <button
                onClick={() => setAsOnDate("2025-04-01")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                01-Apr-2025
              </button>
              <button
                onClick={() => setAsOnDate("2025-06-01")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                01-Jun-2025
              </button>
              <button
                onClick={() => setAsOnDate("2025-07-01")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                01-Jul-2025
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Main Age Display */}
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={20} />
                  <span className="text-pink-200 text-sm">Your Age</span>
                </div>
                <div className="flex gap-4 text-center">
                  <div className="flex-1 bg-white/20 rounded-lg p-3">
                    <p className="text-3xl font-bold">{result.years}</p>
                    <p className="text-sm opacity-90">Years</p>
                  </div>
                  <div className="flex-1 bg-white/20 rounded-lg p-3">
                    <p className="text-3xl font-bold">{result.months}</p>
                    <p className="text-sm opacity-90">Months</p>
                  </div>
                  <div className="flex-1 bg-white/20 rounded-lg p-3">
                    <p className="text-3xl font-bold">{result.days}</p>
                    <p className="text-sm opacity-90">Days</p>
                  </div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">Age in Different Units</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-pink-600">{result.totalMonths.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Months</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-pink-600">{result.totalWeeks.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Weeks</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center col-span-2">
                    <p className="text-2xl font-bold text-pink-600">{result.totalDays.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Days</p>
                  </div>
                </div>
              </div>

              {/* Next Birthday */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">Upcoming</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-800">Next Birthday</p>
                      <p className="text-sm text-yellow-600">{formatDate(result.nextBirthday)}</p>
                    </div>
                    <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      {result.daysToNextBirthday} days
                    </span>
                  </div>

                  {!result.isRetired && (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-800">Retirement (Age 60)</p>
                        <p className="text-sm text-blue-600">{formatDate(result.retirementDate)}</p>
                      </div>
                      <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {result.daysToRetirement.toLocaleString()} days
                      </span>
                    </div>
                  )}

                  {result.isRetired && (
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="font-medium text-green-800">Already Retired</p>
                      <p className="text-sm text-green-600">Retirement age (60) reached</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <p className="text-gray-500">Enter valid dates to calculate age</p>
              <p className="text-sm text-gray-400 mt-2">Birth date should be before the &quot;as on&quot; date</p>
            </div>
          )}
        </div>
      </div>

      {/* Age Eligibility Reference */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-tn-text mb-4">Age Eligibility Reference (Education Dept)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">School Admissions</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>LKG (Lower KG)</span>
                <span className="font-medium">3+ years</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>UKG (Upper KG)</span>
                <span className="font-medium">4+ years</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Class 1</span>
                <span className="font-medium">5+ years</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Class 6</span>
                <span className="font-medium">10+ years</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Employment</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Min Age (Govt Job)</span>
                <span className="font-medium">18 years</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Max Age (General)</span>
                <span className="font-medium">30-32 years</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Max Age (BC/MBC)</span>
                <span className="font-medium">35 years</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Retirement Age</span>
                <span className="font-medium">60 years</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Notes
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Age Calculation:</strong> Completed years, months, and days as on the specified date.</p>
          <p><strong>Cut-off Dates:</strong> For admissions, check specific cut-off dates (usually June 1 or July 1).</p>
          <p><strong>Relaxation:</strong> Age relaxation available for SC/ST/BC/MBC/PWD candidates.</p>
        </div>
      </div>
    </div>
  );
}
