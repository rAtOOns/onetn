"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Info, Building2 } from "lucide-react";

// TN Government Holidays 2025 (Public holidays only)
const governmentHolidays2025 = [
  "2025-01-01", "2025-01-14", "2025-01-15", "2025-01-16", "2025-01-26",
  "2025-03-31", "2025-04-10", "2025-04-14", "2025-04-18",
  "2025-05-01", "2025-06-07", "2025-07-06",
  "2025-08-15", "2025-08-16", "2025-08-27",
  "2025-09-05", "2025-10-01", "2025-10-02", "2025-10-20", "2025-12-25",
];

function calculateWorkingDays(
  startDate: Date,
  endDate: Date,
  excludeSecondSaturday: boolean,
  excludeFourthSaturday: boolean,
  excludeHolidays: boolean
) {
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  let workingDays = 0;
  let sundays = 0;
  let saturdays = 0;
  let secondSaturdays = 0;
  let fourthSaturdays = 0;
  let holidays = 0;
  let totalDays = 0;

  const holidaySet = new Set(governmentHolidays2025);
  const tempDate = new Date(startDate);

  while (tempDate <= endDate) {
    totalDays++;
    const dayOfWeek = tempDate.getDay();
    const dateStr = tempDate.toISOString().split("T")[0];

    // Check if Sunday
    if (dayOfWeek === 0) {
      sundays++;
      tempDate.setDate(tempDate.getDate() + 1);
      continue;
    }

    // Check Saturday
    if (dayOfWeek === 6) {
      saturdays++;
      const dayOfMonth = tempDate.getDate();
      const weekOfMonth = Math.ceil(dayOfMonth / 7);

      if (weekOfMonth === 2) {
        secondSaturdays++;
        if (excludeSecondSaturday) {
          tempDate.setDate(tempDate.getDate() + 1);
          continue;
        }
      } else if (weekOfMonth === 4) {
        fourthSaturdays++;
        if (excludeFourthSaturday) {
          tempDate.setDate(tempDate.getDate() + 1);
          continue;
        }
      }
    }

    // Check holidays
    if (excludeHolidays && holidaySet.has(dateStr)) {
      holidays++;
      tempDate.setDate(tempDate.getDate() + 1);
      continue;
    }

    workingDays++;
    tempDate.setDate(tempDate.getDate() + 1);
  }

  return {
    totalDays,
    workingDays,
    sundays,
    saturdays,
    secondSaturdays,
    fourthSaturdays,
    holidays: excludeHolidays ? holidays : 0,
    nonWorkingDays: totalDays - workingDays,
  };
}

export default function WorkingDaysPage() {
  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [endDate, setEndDate] = useState<string>("2025-12-31");
  const [excludeSecondSaturday, setExcludeSecondSaturday] = useState<boolean>(true);
  const [excludeFourthSaturday, setExcludeFourthSaturday] = useState<boolean>(true);
  const [excludeHolidays, setExcludeHolidays] = useState<boolean>(true);

  const result = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null;
    }

    return calculateWorkingDays(
      start,
      end,
      excludeSecondSaturday,
      excludeFourthSaturday,
      excludeHolidays
    );
  }, [startDate, endDate, excludeSecondSaturday, excludeFourthSaturday, excludeHolidays]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Building2 className="text-emerald-600" size={28} />
            Working Days Counter
          </h1>
          <p className="text-sm text-gray-500 tamil">பணி நாட்கள் கணக்கு</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-emerald-800">
          Calculate working days excluding Sundays, 2nd & 4th Saturdays, and Government holidays.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4">Select Date Range</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Options */}
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-3">Exclude from Working Days:</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-sm text-gray-600">All Sundays (always excluded)</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={excludeSecondSaturday}
                  onChange={(e) => setExcludeSecondSaturday(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">2nd Saturday of each month</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={excludeFourthSaturday}
                  onChange={(e) => setExcludeFourthSaturday(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">4th Saturday of each month</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={excludeHolidays}
                  onChange={(e) => setExcludeHolidays(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Government Holidays (2025)</span>
              </label>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Select:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setStartDate("2025-01-01");
                  setEndDate("2025-01-31");
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                Jan 2025
              </button>
              <button
                onClick={() => {
                  setStartDate("2025-01-01");
                  setEndDate("2025-03-31");
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                Q1 2025
              </button>
              <button
                onClick={() => {
                  setStartDate("2025-04-01");
                  setEndDate("2025-06-30");
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                Q2 2025
              </button>
              <button
                onClick={() => {
                  setStartDate("2025-01-01");
                  setEndDate("2025-12-31");
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                Full Year
              </button>
              <button
                onClick={() => {
                  setStartDate("2025-06-01");
                  setEndDate("2026-04-30");
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                Academic Year
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Main Result */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 size={20} />
                  <span className="text-emerald-200 text-sm">Working Days</span>
                </div>
                <p className="text-5xl font-bold">{result.workingDays}</p>
                <p className="text-emerald-200 mt-2">
                  out of {result.totalDays} total days
                </p>
              </div>

              {/* Day Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">Day Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-700">Working Days</span>
                    <span className="font-bold text-green-700 text-lg">{result.workingDays}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-red-700">Sundays</span>
                    <span className="font-bold text-red-700">{result.sundays}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-orange-700">Total Saturdays</span>
                    <span className="font-bold text-orange-700">{result.saturdays}</span>
                  </div>
                  {excludeSecondSaturday && (
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg ml-4">
                      <span className="text-yellow-700">↳ 2nd Saturdays (excluded)</span>
                      <span className="font-bold text-yellow-700">{result.secondSaturdays}</span>
                    </div>
                  )}
                  {excludeFourthSaturday && (
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg ml-4">
                      <span className="text-yellow-700">↳ 4th Saturdays (excluded)</span>
                      <span className="font-bold text-yellow-700">{result.fourthSaturdays}</span>
                    </div>
                  )}
                  {excludeHolidays && (
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-700">Government Holidays</span>
                      <span className="font-bold text-purple-700">{result.holidays}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-gray-700">{result.totalDays}</p>
                    <p className="text-sm text-gray-500">Total Days</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-gray-700">{result.nonWorkingDays}</p>
                    <p className="text-sm text-gray-500">Non-Working Days</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-center">
                  <p className="text-sm text-emerald-700">
                    Working days percentage: <strong>{((result.workingDays / result.totalDays) * 100).toFixed(1)}%</strong>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <p className="text-gray-500">Enter valid dates to calculate working days</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About Working Days
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Government Offices:</strong> Work on all days except Sundays, 2nd & 4th Saturdays, and public holidays.</p>
          <p><strong>Schools:</strong> Follow academic calendar which may differ slightly.</p>
          <p><strong>Banks:</strong> Follow RBI calendar - closed on 2nd & 4th Saturdays and bank holidays.</p>
          <p><strong>Note:</strong> Holiday data is for 2025. Some dates may vary based on official announcements.</p>
        </div>
      </div>
    </div>
  );
}
