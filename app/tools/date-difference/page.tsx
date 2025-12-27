"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Info, ArrowRight } from "lucide-react";

function calculateDateDifference(startDate: Date, endDate: Date) {
  // Ensure start is before end
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  // Calculate years, months, days
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Total calculations
  const totalMilliseconds = endDate.getTime() - startDate.getTime();
  const totalDays = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  // Weekend days
  let weekendDays = 0;
  let weekdayCount = 0;
  const tempDate = new Date(startDate);
  while (tempDate <= endDate) {
    const dayOfWeek = tempDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      weekdayCount++;
    }
    tempDate.setDate(tempDate.getDate() + 1);
  }

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    totalHours,
    totalMinutes,
    weekendDays,
    weekdayCount,
  };
}

export default function DateDifferencePage() {
  const [startDate, setStartDate] = useState<string>("2024-01-01");
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const result = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null;
    }

    return calculateDateDifference(start, end);
  }, [startDate, endDate]);

  const swapDates = () => {
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
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
            <Calendar className="text-indigo-600" size={28} />
            Date Difference Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">தேதி வேறுபாடு கால்குலேட்டர்</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-indigo-800">
          Calculate the difference between two dates in years, months, days, weeks, and more.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4">Enter Dates</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={swapDates}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                title="Swap dates"
              >
                <ArrowRight size={20} className="text-gray-600 rotate-90" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setEndDate(new Date().toISOString().split("T")[0])}
                className="text-sm text-indigo-600 hover:underline mt-1"
              >
                Set to Today
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Presets:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const today = new Date();
                  const yearAgo = new Date(today);
                  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
                  setStartDate(yearAgo.toISOString().split("T")[0]);
                  setEndDate(today.toISOString().split("T")[0]);
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                Last 1 Year
              </button>
              <button
                onClick={() => {
                  setStartDate("2024-04-01");
                  setEndDate("2025-03-31");
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                FY 2024-25
              </button>
              <button
                onClick={() => {
                  setStartDate("2025-01-01");
                  setEndDate("2025-12-31");
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                Year 2025
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
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={20} />
                  <span className="text-indigo-200 text-sm">Duration</span>
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

              {/* Alternative Units */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">In Different Units</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-indigo-600">{result.totalDays.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Days</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-indigo-600">{result.totalWeeks.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Weeks</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-indigo-600">{result.totalMonths.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Months</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-indigo-600">{result.totalHours.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Hours</p>
                  </div>
                </div>
              </div>

              {/* Working Days */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-tn-text mb-4">Day Breakdown</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-700">Weekdays</span>
                    <span className="font-bold text-green-700">{result.weekdayCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-700">Weekend Days</span>
                    <span className="font-bold text-blue-700">{result.weekendDays}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * Weekend days = Saturdays + Sundays
                </p>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <p className="text-gray-500">Enter valid dates to calculate difference</p>
            </div>
          )}
        </div>
      </div>

      {/* Common Calculations Table */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-tn-text mb-4">Quick Reference</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Days in Period</h4>
            <div className="space-y-1">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>1 Week</span>
                <span className="font-mono">7 days</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>1 Month (avg)</span>
                <span className="font-mono">30.44 days</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>1 Year</span>
                <span className="font-mono">365 days</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Academic Year</h4>
            <div className="space-y-1">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Start</span>
                <span className="font-mono">June 1</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>End</span>
                <span className="font-mono">April 30</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Duration</span>
                <span className="font-mono">~334 days</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Financial Year</h4>
            <div className="space-y-1">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Start</span>
                <span className="font-mono">April 1</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>End</span>
                <span className="font-mono">March 31</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Duration</span>
                <span className="font-mono">365 days</span>
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
          <p><strong>Inclusive:</strong> Both start and end dates are counted in the calculation.</p>
          <p><strong>Service Period:</strong> For service calculation, use the Service Calculator tool.</p>
          <p><strong>Working Days:</strong> Excludes only Saturdays and Sundays. Holidays not excluded.</p>
        </div>
      </div>
    </div>
  );
}
