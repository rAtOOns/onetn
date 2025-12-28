"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Calculator, Info, Printer } from "lucide-react";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function calculateYearsMonthsDays(startDate: Date, endDate: Date): { years: number; months: number; days: number; totalDays: number } {
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

  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays };
}

export default function SeniorityCalculatorPage() {
  const [joiningDate, setJoiningDate] = useState<string>("2010-07-15");
  const [currentPostDate, setCurrentPostDate] = useState<string>("2015-06-01");
  const [eolDays, setEolDays] = useState<number>(0);
  const [suspensionDays, setSuspensionDays] = useState<number>(0);
  const [diesNonDays, setDiesNonDays] = useState<number>(0);
  const [category, setCategory] = useState<string>("OC");

  const calculations = useMemo(() => {
    const today = new Date();
    const joining = new Date(joiningDate);
    const currentPost = new Date(currentPostDate);

    // Total service
    const totalService = calculateYearsMonthsDays(joining, today);

    // Service in current post
    const currentPostService = calculateYearsMonthsDays(currentPost, today);

    // Non-qualifying service (EOL, suspension not regularized, dies non)
    const nonQualifyingDays = eolDays + suspensionDays + diesNonDays;

    // Qualifying service in days
    const qualifyingDays = totalService.totalDays - nonQualifyingDays;

    // Convert back to years/months/days
    const qualifyingYears = Math.floor(qualifyingDays / 365);
    const remainingDays = qualifyingDays % 365;
    const qualifyingMonths = Math.floor(remainingDays / 30);
    const qualifyingDaysRemainder = remainingDays % 30;

    // Seniority points calculation (simplified TN model)
    // 1 point per year of service in current cadre
    const seniorityPoints = currentPostService.years + (currentPostService.months / 12);

    return {
      totalService,
      currentPostService,
      nonQualifyingDays,
      qualifyingDays,
      qualifyingYears,
      qualifyingMonths,
      qualifyingDaysRemainder,
      seniorityPoints: seniorityPoints.toFixed(2),
    };
  }, [joiningDate, currentPostDate, eolDays, suspensionDays, diesNonDays]);

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
              <Users className="text-blue-600" size={28} />
              Seniority Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">மூப்பு கால்குலேட்டர்</p>
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
          <strong>Note:</strong> Seniority calculation rules vary by cadre and department.
          This is a general calculator. Please verify with official seniority list.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            Service Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of First Joining in Service
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Joining in Current Post/Cadre
              </label>
              <input
                type="date"
                value={currentPostDate}
                onChange={(e) => setCurrentPostDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category (for roster point)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              >
                <option value="OC">OC (General)</option>
                <option value="BC">BC (Backward Class)</option>
                <option value="BCM">BC (Muslim)</option>
                <option value="MBC">MBC (Most Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="SCA">SC (Arunthathiyar)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Non-Qualifying Service (if any)</p>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">EOL (days)</label>
                  <input
                    type="number"
                    value={eolDays}
                    onChange={(e) => setEolDays(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Suspension (days)</label>
                  <input
                    type="number"
                    value={suspensionDays}
                    onChange={(e) => setSuspensionDays(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Dies Non (days)</label>
                  <input
                    type="number"
                    value={diesNonDays}
                    onChange={(e) => setDiesNonDays(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    min={0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Seniority Points */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <p className="text-blue-100 text-sm">Seniority Points (Current Cadre)</p>
            <p className="text-4xl font-bold mt-1">{calculations.seniorityPoints}</p>
            <p className="text-blue-100 text-sm mt-2">
              Based on {calculations.currentPostService.years}y {calculations.currentPostService.months}m service
            </p>
          </div>

          {/* Service Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Service Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Service</span>
                <span className="font-medium">
                  {calculations.totalService.years}y {calculations.totalService.months}m {calculations.totalService.days}d
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Service in Current Post</span>
                <span className="font-medium">
                  {calculations.currentPostService.years}y {calculations.currentPostService.months}m {calculations.currentPostService.days}d
                </span>
              </div>
              <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-gray-600">Non-Qualifying Days</span>
                <span className="font-medium text-red-600">-{calculations.nonQualifyingDays} days</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Qualifying Service</span>
                <span className="font-bold text-green-600">
                  {calculations.qualifyingYears}y {calculations.qualifyingMonths}m {calculations.qualifyingDaysRemainder}d
                </span>
              </div>
            </div>
          </div>

          {/* Category Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-3">Roster Information</h3>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Category:</strong> {category}
              </p>
              <p className="text-xs text-blue-700 mt-2">
                Seniority is determined within your category as per roster points.
                For transfers, combined seniority list may be used.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seniority Rules */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Seniority Determination Rules
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">General Principles:</p>
            <ul className="space-y-1">
              <li>• Date of joining in the cadre determines seniority</li>
              <li>• Earlier joining = Higher seniority</li>
              <li>• EOL/Suspension period may affect seniority</li>
              <li>• Promotion seniority starts from promotion date</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">For Transfers:</p>
            <ul className="space-y-1">
              <li>• Unit seniority for intra-district transfers</li>
              <li>• Combined state seniority for inter-district</li>
              <li>• Counseling based on seniority + preference</li>
              <li>• Spouse/medical cases get special consideration</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/transfer-rules" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Transfer Rules
        </Link>
        <Link href="/tools/promotion-info" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Promotion Info
        </Link>
        <Link href="/tools/service-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Service Calculator
        </Link>
      </div>
    </div>
  );
}
