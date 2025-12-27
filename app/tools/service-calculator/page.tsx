"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Award, Info } from "lucide-react";

// Retirement age for TN Government employees
const RETIREMENT_AGE = 60; // Changed from 58 to 60 in recent years

function calculateServicePeriod(
  joiningDate: Date,
  endDate: Date
): { years: number; months: number; days: number } {
  let years = endDate.getFullYear() - joiningDate.getFullYear();
  let months = endDate.getMonth() - joiningDate.getMonth();
  let days = endDate.getDate() - joiningDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function formatServicePeriod(period: { years: number; months: number; days: number }): string {
  const parts = [];
  if (period.years > 0) parts.push(`${period.years} year${period.years > 1 ? "s" : ""}`);
  if (period.months > 0) parts.push(`${period.months} month${period.months > 1 ? "s" : ""}`);
  if (period.days > 0) parts.push(`${period.days} day${period.days > 1 ? "s" : ""}`);
  return parts.join(", ") || "0 days";
}

export default function ServiceCalculatorPage() {
  const today = new Date();
  const defaultDob = new Date(today.getFullYear() - 40, 0, 1);
  const defaultJoining = new Date(today.getFullYear() - 15, 0, 1);

  const [dob, setDob] = useState<string>(defaultDob.toISOString().split("T")[0]);
  const [joiningDate, setJoiningDate] = useState<string>(
    defaultJoining.toISOString().split("T")[0]
  );
  const [breaks, setBreaks] = useState<number>(0); // Breaks in service (days)

  const calculations = useMemo(() => {
    const dobDate = new Date(dob);
    const joining = new Date(joiningDate);

    // Calculate retirement date (last day of the month when turning 60)
    const retirementDate = new Date(
      dobDate.getFullYear() + RETIREMENT_AGE,
      dobDate.getMonth() + 1,
      0 // Last day of the month
    );

    // Age at joining
    const ageAtJoining = calculateServicePeriod(dobDate, joining);

    // Service completed till today
    const serviceCompleted = calculateServicePeriod(joining, today);

    // Total service at retirement
    const totalServiceAtRetirement = calculateServicePeriod(joining, retirementDate);

    // Time remaining for retirement
    const timeRemaining = calculateServicePeriod(today, retirementDate);

    // Qualifying service for pension (total service minus breaks)
    const totalDaysOfService =
      serviceCompleted.years * 365 +
      serviceCompleted.months * 30 +
      serviceCompleted.days -
      breaks;

    const qualifyingService = {
      years: Math.floor(totalDaysOfService / 365),
      months: Math.floor((totalDaysOfService % 365) / 30),
      days: totalDaysOfService % 30,
    };

    // Pension eligibility (minimum 10 years qualifying service)
    const isPensionEligible = qualifyingService.years >= 10;

    // Gratuity eligibility (minimum 5 years)
    const isGratuityEligible = qualifyingService.years >= 5;

    // Current age
    const currentAge = calculateServicePeriod(dobDate, today);

    return {
      dobDate,
      retirementDate,
      ageAtJoining,
      currentAge,
      serviceCompleted,
      totalServiceAtRetirement,
      timeRemaining,
      qualifyingService,
      isPensionEligible,
      isGratuityEligible,
      isRetired: today >= retirementDate,
    };
  }, [dob, joiningDate, breaks]);

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
            <Clock className="text-purple-600" size={28} />
            Service Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">
            பணிக்கால கால்குலேட்டர்
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Retirement age is {RETIREMENT_AGE} years for Tamil Nadu
          Government employees. Verify with your service records for exact calculations.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4">Enter Service Details</h2>

          <div className="space-y-4">
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
              />
            </div>

            {/* Date of Joining */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Joining Service
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
              />
            </div>

            {/* Breaks in Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breaks in Service (total days)
              </label>
              <input
                type="number"
                value={breaks}
                onChange={(e) => setBreaks(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                min={0}
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include unauthorized absence, EOL without pay, etc.
              </p>
            </div>
          </div>

          {/* Age Summary */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium text-gray-700 mb-3">Age Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Age</span>
                <span className="font-medium">
                  {formatServicePeriod(calculations.currentAge)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age at Joining</span>
                <span className="font-medium">
                  {formatServicePeriod(calculations.ageAtJoining)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Retirement Card */}
          <div
            className={`rounded-xl p-6 text-white ${
              calculations.isRetired
                ? "bg-gradient-to-r from-gray-600 to-gray-700"
                : "bg-gradient-to-r from-purple-600 to-purple-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={20} />
              <span className="text-purple-200 text-sm">
                {calculations.isRetired ? "Retired On" : "Retirement Date"}
              </span>
            </div>
            <p className="text-3xl font-bold">
              {calculations.retirementDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            {!calculations.isRetired && (
              <p className="text-purple-200 text-sm mt-2">
                Time remaining: {formatServicePeriod(calculations.timeRemaining)}
              </p>
            )}
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <Clock size={18} />
              Service Details
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">Service Completed</p>
                <p className="text-xl font-bold text-green-800">
                  {formatServicePeriod(calculations.serviceCompleted)}
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">Total Service at Retirement</p>
                <p className="text-xl font-bold text-blue-800">
                  {formatServicePeriod(calculations.totalServiceAtRetirement)}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700">Qualifying Service (for pension)</p>
                <p className="text-xl font-bold text-purple-800">
                  {formatServicePeriod(calculations.qualifyingService)}
                </p>
                {breaks > 0 && (
                  <p className="text-xs text-purple-600 mt-1">
                    (After deducting {breaks} days of breaks)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Eligibility */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <Award size={18} />
              Eligibility Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium">Pension Eligibility</p>
                  <p className="text-xs text-gray-500">Minimum 10 years qualifying service</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    calculations.isPensionEligible
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {calculations.isPensionEligible ? "Eligible" : "Not Yet"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium">Gratuity Eligibility</p>
                  <p className="text-xs text-gray-500">Minimum 5 years qualifying service</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    calculations.isGratuityEligible
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {calculations.isGratuityEligible ? "Eligible" : "Not Yet"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Important Information
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>Retirement Age:</strong> Tamil Nadu Government employees retire at
            {RETIREMENT_AGE} years of age. Retirement is on the last day of the month
            in which the employee turns {RETIREMENT_AGE}.
          </p>
          <p>
            <strong>Qualifying Service:</strong> The actual period of service minus
            any breaks (unauthorized absence, extraordinary leave without pay, etc.)
            is considered for pension calculation.
          </p>
          <p>
            <strong>Pension:</strong> Government employees with 10+ years of qualifying
            service are eligible for pension. Pension amount depends on the average
            emoluments of the last 10 months of service.
          </p>
          <p>
            <strong>Gratuity:</strong> Employees with 5+ years of qualifying service
            are eligible for retirement gratuity. Maximum gratuity is ₹20,00,000.
          </p>
        </div>
      </div>
    </div>
  );
}
