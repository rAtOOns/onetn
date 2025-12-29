"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Info, Printer } from "lucide-react";
import { CURRENT_DA_RATE, HRA_RATES, CCA_RATES } from "@/lib/constants/rates";

// TN 7th Pay Commission Pay Levels with sample pay ranges
const payLevels = [
  { level: 1, minPay: 15700, maxPay: 50000, description: "Multi Tasking Staff" },
  { level: 2, minPay: 19500, maxPay: 62000, description: "Junior Assistant" },
  { level: 3, minPay: 21700, maxPay: 69100, description: "Typist/Steno" },
  { level: 4, minPay: 25500, maxPay: 81100, description: "Assistant" },
  { level: 5, minPay: 29200, maxPay: 92300, description: "Senior Assistant" },
  { level: 6, minPay: 35400, maxPay: 112400, description: "Superintendent" },
  { level: 7, minPay: 44900, maxPay: 142400, description: "Section Officer" },
  { level: 8, minPay: 47600, maxPay: 151100, description: "Asst. Section Officer" },
  { level: 9, minPay: 53100, maxPay: 167800, description: "Deputy Section Officer" },
  { level: 10, minPay: 56100, maxPay: 177500, description: "Under Secretary" },
  { level: 11, minPay: 67700, maxPay: 208700, description: "Deputy Secretary" },
  { level: 12, minPay: 78800, maxPay: 209200, description: "Joint Secretary" },
  { level: 13, minPay: 123100, maxPay: 215900, description: "Additional Secretary" },
  { level: 14, minPay: 144200, maxPay: 218200, description: "Secretary" },
  // Teaching Cadre
  { level: "T1", minPay: 36900, maxPay: 116600, description: "BT Assistant / PG Teacher" },
  { level: "T2", minPay: 47600, maxPay: 151100, description: "Graduate Teacher" },
  { level: "T3", minPay: 56100, maxPay: 177500, description: "Headmaster" },
  { level: "T4", minPay: 78800, maxPay: 209200, description: "Principal" },
];

// City classification for HRA and CCA (using centralized rates)
const cityTypes = [
  { value: "X", label: "X - Chennai/Metro", hraPercent: HRA_RATES.X, cca: CCA_RATES.chennai },
  { value: "Y", label: "Y - District HQ", hraPercent: HRA_RATES.Y, cca: CCA_RATES.other_cities },
  { value: "Z", label: "Z - Other Areas", hraPercent: HRA_RATES.Z, cca: CCA_RATES.none },
];

// Fixed allowances
const MEDICAL_ALLOWANCE = 350; // Per month
const CONVEYANCE_ALLOWANCE = 400; // Per month (varies by designation)

// Professional Tax slabs for Tamil Nadu
function getProfessionalTax(grossSalary: number): number {
  if (grossSalary <= 21000) return 0;
  if (grossSalary <= 30000) return 135;
  if (grossSalary <= 45000) return 315;
  if (grossSalary <= 60000) return 690;
  if (grossSalary <= 75000) return 1025;
  return 1250; // Maximum for TN
}

// Format currency in Indian format
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SalaryCalculatorPage() {
  const [basicPay, setBasicPay] = useState<number>(36900);
  const [selectedLevel, setSelectedLevel] = useState<string>("T1");
  const [cityType, setCityType] = useState<string>("Y");
  const [daRate, setDaRate] = useState<number>(CURRENT_DA_RATE);
  const [gpfPercent, setGpfPercent] = useState<number>(10);
  const [hasNHIS, setHasNHIS] = useState<boolean>(true);
  const [hasGroupInsurance, setHasGroupInsurance] = useState<boolean>(true);

  // New allowances
  const [personalPay, setPersonalPay] = useState<number>(0);
  const [hasCCA, setHasCCA] = useState<boolean>(true);
  const [hasMA, setHasMA] = useState<boolean>(true);
  const [hasConveyance, setHasConveyance] = useState<boolean>(true);
  const [conveyanceAmount, setConveyanceAmount] = useState<number>(CONVEYANCE_ALLOWANCE);
  const [otherAllowances, setOtherAllowances] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  const calculations = useMemo(() => {
    const city = cityTypes.find((c) => c.value === cityType);
    const hraPercent = city?.hraPercent || 16;
    const ccaAmount = city?.cca || 0;

    // Allowances
    const da = Math.round((basicPay * daRate) / 100);
    const hra = Math.round((basicPay * hraPercent) / 100);
    const cca = hasCCA ? ccaAmount : 0;
    const ma = hasMA ? MEDICAL_ALLOWANCE : 0;
    const conveyance = hasConveyance ? conveyanceAmount : 0;

    // Total Earnings
    const totalAllowances = da + hra + cca + ma + conveyance + personalPay + otherAllowances;
    const grossSalary = basicPay + totalAllowances;

    // Deductions
    const gpf = Math.round((basicPay * gpfPercent) / 100);
    const professionalTax = getProfessionalTax(grossSalary);
    const nhis = hasNHIS ? 150 : 0;
    const groupInsurance = hasGroupInsurance ? 120 : 0;

    const totalDeductions = gpf + professionalTax + nhis + groupInsurance + otherDeductions;
    const netSalary = grossSalary - totalDeductions;

    return {
      basicPay,
      da,
      daRate,
      hra,
      hraPercent,
      cca,
      ma,
      conveyance,
      personalPay,
      otherAllowances,
      totalAllowances,
      grossSalary,
      gpf,
      professionalTax,
      nhis,
      groupInsurance,
      otherDeductions,
      totalDeductions,
      netSalary,
    };
  }, [basicPay, cityType, daRate, gpfPercent, hasNHIS, hasGroupInsurance, hasCCA, hasMA, hasConveyance, conveyanceAmount, personalPay, otherAllowances, otherDeductions]);

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    const payLevel = payLevels.find((p) => String(p.level) === level);
    if (payLevel) {
      setBasicPay(payLevel.minPay);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/tools"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors print:hidden"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
              <Calculator className="text-green-600" size={28} />
              Salary Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">
              சம்பள கால்குலேட்டர் - 7வது ஊதிய குழு
            </p>
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
          <strong>Note:</strong> Calculations are based on Tamil Nadu 7th Pay Commission.
          DA rate as of January 2024. Verify with your DDO for exact figures.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Basic Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4">Basic Details</h2>

            <div className="space-y-4">
              {/* Pay Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pay Level / Post
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                >
                  <optgroup label="Administrative Cadre">
                    {payLevels
                      .filter((p) => typeof p.level === "number")
                      .map((p) => (
                        <option key={p.level} value={String(p.level)}>
                          Level {p.level} - {p.description}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Teaching Cadre">
                    {payLevels
                      .filter((p) => typeof p.level === "string")
                      .map((p) => (
                        <option key={p.level} value={String(p.level)}>
                          Level {p.level} - {p.description}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              {/* Basic Pay */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Basic Pay (₹)
                </label>
                <input
                  type="number"
                  value={basicPay}
                  onChange={(e) => setBasicPay(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                  min={15700}
                  max={220000}
                />
              </div>

              {/* DA Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DA Rate (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={daRate}
                    onChange={(e) => setDaRate(Number(e.target.value))}
                    className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                    min={0}
                    max={100}
                  />
                  <button
                    onClick={() => setDaRate(CURRENT_DA_RATE)}
                    className="px-3 py-3 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                    title="Reset to current rate"
                  >
                    Current: {CURRENT_DA_RATE}%
                  </button>
                </div>
              </div>

              {/* City Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City Classification
                </label>
                <select
                  value={cityType}
                  onChange={(e) => setCityType(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                >
                  {cityTypes.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label} (HRA: {city.hraPercent}%, CCA: ₹{city.cca})
                    </option>
                  ))}
                </select>
              </div>

              {/* Personal Pay */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Pay (₹)
                </label>
                <input
                  type="number"
                  value={personalPay}
                  onChange={(e) => setPersonalPay(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">If applicable (e.g., pay protection)</p>
              </div>
            </div>
          </div>

          {/* Allowances */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4">Allowances</h2>

            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasCCA}
                    onChange={(e) => setHasCCA(e.target.checked)}
                    className="rounded border-gray-300 text-tn-primary focus:ring-tn-primary"
                  />
                  <span className="text-sm">City Compensatory Allowance (CCA)</span>
                </div>
                <span className="text-sm font-medium text-green-600">
                  ₹{cityTypes.find((c) => c.value === cityType)?.cca || 0}
                </span>
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasMA}
                    onChange={(e) => setHasMA(e.target.checked)}
                    className="rounded border-gray-300 text-tn-primary focus:ring-tn-primary"
                  />
                  <span className="text-sm">Medical Allowance (MA)</span>
                </div>
                <span className="text-sm font-medium text-green-600">₹{MEDICAL_ALLOWANCE}</span>
              </label>

              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasConveyance}
                    onChange={(e) => setHasConveyance(e.target.checked)}
                    className="rounded border-gray-300 text-tn-primary focus:ring-tn-primary"
                  />
                  <span className="text-sm">Conveyance Allowance</span>
                </div>
                <input
                  type="number"
                  value={conveyanceAmount}
                  onChange={(e) => setConveyanceAmount(Number(e.target.value))}
                  className="w-24 border rounded p-1 text-sm text-right"
                  disabled={!hasConveyance}
                />
              </div>

              <div className="pt-2 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Allowances (₹)
                </label>
                <input
                  type="number"
                  value={otherAllowances}
                  onChange={(e) => setOtherAllowances(Number(e.target.value))}
                  className="w-full border rounded-lg p-2 text-sm"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">Special Pay, Incentives, etc.</p>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4">Deductions</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPF Contribution (%)
                </label>
                <input
                  type="number"
                  value={gpfPercent}
                  onChange={(e) => setGpfPercent(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                  min={6}
                  max={100}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6% of Basic Pay</p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasNHIS}
                    onChange={(e) => setHasNHIS(e.target.checked)}
                    className="rounded border-gray-300 text-tn-primary focus:ring-tn-primary"
                  />
                  <span className="text-sm">NHIS Deduction (₹150/month)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGroupInsurance}
                    onChange={(e) => setHasGroupInsurance(e.target.checked)}
                    className="rounded border-gray-300 text-tn-primary focus:ring-tn-primary"
                  />
                  <span className="text-sm">Group Insurance (₹120/month)</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Deductions (₹)
                </label>
                <input
                  type="number"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(Number(e.target.value))}
                  className="w-full border rounded-lg p-2 text-sm"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">CPS, Loans, Recovery, etc.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Earnings */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Earnings
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Basic Pay</span>
                <span className="font-medium">{formatCurrency(calculations.basicPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">DA ({calculations.daRate}%)</span>
                <span className="font-medium">{formatCurrency(calculations.da)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">HRA ({calculations.hraPercent}%)</span>
                <span className="font-medium">{formatCurrency(calculations.hra)}</span>
              </div>
              {calculations.cca > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">CCA</span>
                  <span className="font-medium">{formatCurrency(calculations.cca)}</span>
                </div>
              )}
              {calculations.ma > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Medical Allowance</span>
                  <span className="font-medium">{formatCurrency(calculations.ma)}</span>
                </div>
              )}
              {calculations.conveyance > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Conveyance Allowance</span>
                  <span className="font-medium">{formatCurrency(calculations.conveyance)}</span>
                </div>
              )}
              {calculations.personalPay > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Personal Pay</span>
                  <span className="font-medium">{formatCurrency(calculations.personalPay)}</span>
                </div>
              )}
              {calculations.otherAllowances > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Other Allowances</span>
                  <span className="font-medium">{formatCurrency(calculations.otherAllowances)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t font-semibold text-green-700">
                <span>Gross Salary</span>
                <span>{formatCurrency(calculations.grossSalary)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              Deductions
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">GPF ({gpfPercent}%)</span>
                <span className="font-medium text-red-600">-{formatCurrency(calculations.gpf)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Professional Tax</span>
                <span className="font-medium text-red-600">-{formatCurrency(calculations.professionalTax)}</span>
              </div>
              {hasNHIS && (
                <div className="flex justify-between">
                  <span className="text-gray-600">NHIS</span>
                  <span className="font-medium text-red-600">-{formatCurrency(calculations.nhis)}</span>
                </div>
              )}
              {hasGroupInsurance && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Group Insurance</span>
                  <span className="font-medium text-red-600">-{formatCurrency(calculations.groupInsurance)}</span>
                </div>
              )}
              {calculations.otherDeductions > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Other Deductions</span>
                  <span className="font-medium text-red-600">-{formatCurrency(calculations.otherDeductions)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t font-semibold text-red-700">
                <span>Total Deductions</span>
                <span>-{formatCurrency(calculations.totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="bg-gradient-to-r from-tn-primary to-tn-highlight rounded-xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm">Net Salary (Take Home)</p>
                <p className="text-sm tamil text-white/70">கையில் கிடைக்கும் சம்பளம்</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{formatCurrency(calculations.netSalary)}</p>
                <p className="text-sm text-white/80">per month</p>
              </div>
            </div>
          </div>

          {/* Annual Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-700 mb-3">Annual Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Annual Gross</p>
                <p className="font-semibold">{formatCurrency(calculations.grossSalary * 12)}</p>
              </div>
              <div>
                <p className="text-gray-500">Annual Net</p>
                <p className="font-semibold">{formatCurrency(calculations.netSalary * 12)}</p>
              </div>
              <div>
                <p className="text-gray-500">Annual GPF Savings</p>
                <p className="font-semibold text-green-600">{formatCurrency(calculations.gpf * 12)}</p>
              </div>
              <div>
                <p className="text-gray-500">Annual Deductions</p>
                <p className="font-semibold text-red-600">{formatCurrency(calculations.totalDeductions * 12)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About Tamil Nadu 7th Pay Commission
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>DA (Dearness Allowance):</strong> Currently at {CURRENT_DA_RATE}% of Basic Pay.
          </p>
          <p>
            <strong>HRA:</strong> 24% for X cities (Chennai), 16% for Y cities (District HQ), 8% for Z cities.
          </p>
          <p>
            <strong>CCA (City Compensatory Allowance):</strong> ₹600 for Chennai, ₹300 for District HQ.
          </p>
          <p>
            <strong>Medical Allowance:</strong> ₹350 per month for employees not availing medical facilities.
          </p>
          <p>
            <strong>Personal Pay:</strong> Granted for pay protection when pay is reduced due to revision.
          </p>
        </div>
      </div>
    </div>
  );
}
