"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, PiggyBank, Calculator, Info, TrendingUp, Download } from "lucide-react";
import * as XLSX from "xlsx";

// TPF Interest Rate: 7.1% per annum
const TPF_INTEREST_RATE = 7.1;

// Financial Year months (April to March)
const MONTHS = [
  { name: "April", short: "Apr" },
  { name: "May", short: "May" },
  { name: "June", short: "Jun" },
  { name: "July", short: "Jul" },
  { name: "August", short: "Aug" },
  { name: "September", short: "Sep" },
  { name: "October", short: "Oct" },
  { name: "November", short: "Nov" },
  { name: "December", short: "Dec" },
  { name: "January", short: "Jan" },
  { name: "February", short: "Feb" },
  { name: "March", short: "Mar" },
];

// Generate financial year options (last 5 years)
function getFinancialYears(): { value: string; startYear: number }[] {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const fyStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;

  const years: { value: string; startYear: number }[] = [];
  for (let i = 0; i < 5; i++) {
    const start = fyStartYear - i;
    years.push({
      value: `${start}-${(start + 1).toString().slice(-2)}`,
      startYear: start,
    });
  }
  return years;
}

// Format currency in Indian format (without symbol for table)
function formatNumber(amount: number): string {
  if (amount === 0) return "";
  return new Intl.NumberFormat("en-IN").format(amount);
}

// Format month-year
function formatMonthYear(month: number, startYear: number): string {
  const monthData = MONTHS[month];
  const year = month >= 9 ? startYear + 1 : startYear;
  return `${monthData.short}-${year.toString().slice(-2)}`;
}

interface MonthlyData {
  subscription: number;
  refunds: number;
  daArrear: number;
  withdrawal: number;
}

interface BreakdownRow {
  monthYear: string;
  subscription: number;
  refunds: number;
  daArrear: number;
  totalDeposit: number;
  withdrawal: number;
  monthlyBalance: number;
}

interface Calculations {
  breakdown: BreakdownRow[];
  totalSubscription: number;
  totalRefunds: number;
  totalDaArrear: number;
  totalDeposits: number;
  totalWithdrawals: number;
  grandTotal: number;
  principal: number;
  sumOfMonthlyBalances: number;
  interest: number;
  closingBalance: number;
}

export default function TPFCalculatorPage() {
  const financialYears = getFinancialYears();

  const [financialYear, setFinancialYear] = useState<string>(financialYears[0].value);
  const [openingBalance, setOpeningBalance] = useState<number>(1749702);

  // Monthly data - initialized with sample data matching the Excel
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([
    { subscription: 15000, refunds: 0, daArrear: 19700, withdrawal: 500000 }, // Apr
    { subscription: 15000, refunds: 0, daArrear: 19700, withdrawal: 0 }, // May
    { subscription: 15000, refunds: 0, daArrear: 0, withdrawal: 0 }, // Jun
    { subscription: 15000, refunds: 0, daArrear: 0, withdrawal: 0 }, // Jul
    { subscription: 15000, refunds: 0, daArrear: 0, withdrawal: 0 }, // Aug
    { subscription: 15000, refunds: 0, daArrear: 0, withdrawal: 0 }, // Sep
    { subscription: 15000, refunds: 0, daArrear: 0, withdrawal: 0 }, // Oct
    { subscription: 15000, refunds: 0, daArrear: 0, withdrawal: 0 }, // Nov
    { subscription: 15000, refunds: 0, daArrear: 0, withdrawal: 0 }, // Dec
    { subscription: 15000, refunds: 0, daArrear: 0, withdrawal: 0 }, // Jan
    { subscription: 0, refunds: 0, daArrear: 0, withdrawal: 0 }, // Feb - no subscription
    { subscription: 0, refunds: 0, daArrear: 0, withdrawal: 0 }, // Mar - no subscription
  ]);

  const selectedFY = financialYears.find((fy) => fy.value === financialYear);
  const startYear = selectedFY?.startYear || new Date().getFullYear();

  const calculations: Calculations = useMemo(() => {
    let runningBalance = openingBalance;
    let totalSubscription = 0;
    let totalRefunds = 0;
    let totalDaArrear = 0;
    let totalWithdrawals = 0;
    let sumOfMonthlyBalances = 0;

    const breakdown = MONTHS.map((month, index) => {
      const data = monthlyData[index];
      const subscription = data.subscription;
      const refunds = data.refunds;
      const daArrear = data.daArrear;
      const withdrawal = data.withdrawal;
      const totalDeposit = subscription + refunds + daArrear;

      // Calculate running balance: previous balance + deposits - withdrawals
      runningBalance = runningBalance + totalDeposit - withdrawal;

      totalSubscription += subscription;
      totalRefunds += refunds;
      totalDaArrear += daArrear;
      totalWithdrawals += withdrawal;
      sumOfMonthlyBalances += runningBalance;

      return {
        monthYear: formatMonthYear(index, startYear),
        subscription,
        refunds,
        daArrear,
        totalDeposit,
        withdrawal,
        monthlyBalance: runningBalance,
      };
    });

    const totalDeposits = totalSubscription + totalRefunds + totalDaArrear;
    const grandTotal = openingBalance + totalDeposits;
    const principal = grandTotal - totalWithdrawals;

    // Interest = (Sum of Monthly Balances × Rate) / (12 × 100)
    const interest = Math.round((sumOfMonthlyBalances * TPF_INTEREST_RATE) / 100 / 12);
    const closingBalance = principal + interest;

    return {
      breakdown,
      totalSubscription,
      totalRefunds,
      totalDaArrear,
      totalDeposits,
      totalWithdrawals,
      grandTotal,
      principal,
      sumOfMonthlyBalances,
      interest,
      closingBalance,
    };
  }, [openingBalance, monthlyData, startYear]);

  const updateMonthlyData = (monthIndex: number, field: keyof MonthlyData, value: number) => {
    setMonthlyData((prev) => {
      const newData = [...prev];
      newData[monthIndex] = { ...newData[monthIndex], [field]: value };
      return newData;
    });
  };

  // Export to Excel function
  const exportToExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Build data array matching the Excel format
    const data: (string | number | null)[][] = [];

    // Header row 1
    data.push([
      "Month & Year",
      "Deposits",
      "",
      "",
      "",
      "Withdrawals",
      "Monthly Balance on which Interest is Calculated",
      "INTEREST AMOUNT",
    ]);

    // Header row 2
    data.push([
      "",
      "Subscription",
      "Refunds of Withdrawals",
      "DA Arrear",
      "Total of each month",
      "",
      "",
      "",
    ]);

    // Opening Balance row
    data.push([
      "Opening Balance",
      openingBalance,
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    // Monthly data rows
    calculations.breakdown.forEach((row) => {
      data.push([
        row.monthYear,
        row.subscription || "",
        row.refunds || "",
        row.daArrear || "",
        row.totalDeposit || "",
        row.withdrawal || "",
        row.monthlyBalance,
        "",
      ]);
    });

    // Total row
    data.push([
      "Total",
      calculations.totalSubscription,
      calculations.totalRefunds || "",
      calculations.totalDaArrear || "",
      calculations.totalDeposits,
      calculations.totalWithdrawals || "",
      calculations.sumOfMonthlyBalances,
      "",
    ]);

    // Empty rows
    data.push([]);
    data.push([]);

    // Summary section (side by side layout)
    data.push(["OB", openingBalance, "", "", "MONTH/ YEAR", "", "Rate of", "Amount", "Int."]);
    data.push(["Total Deposits", calculations.totalDeposits, "", "", "FROM", "TO", "Interest", "", "Amount"]);
    data.push([
      "Grand Total",
      calculations.grandTotal,
      "",
      "",
      `Apr-${startYear.toString().slice(-2)}`,
      `Mar-${(startYear + 1).toString().slice(-2)}`,
      `${TPF_INTEREST_RATE}%`,
      calculations.sumOfMonthlyBalances,
      calculations.interest,
    ]);
    data.push(["Withdrawals", calculations.totalWithdrawals, "", "", "", "", "", "", ""]);
    data.push(["Principal", calculations.principal, "", "", "TOTAL INT", "", "", "", calculations.interest]);
    data.push(["Interest", calculations.interest]);
    data.push(["Closing Balance", calculations.closingBalance]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    ws["!cols"] = [
      { wch: 18 }, // Month & Year
      { wch: 12 }, // Subscription
      { wch: 15 }, // Refunds
      { wch: 12 }, // DA Arrear
      { wch: 15 }, // Total
      { wch: 12 }, // Withdrawals
      { wch: 18 }, // Monthly Balance
      { wch: 15 }, // Interest Amount
      { wch: 12 }, // Extra column
    ];

    // Merge cells for header
    ws["!merges"] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 4 } }, // Deposits header
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, `TPF ${financialYear}`);

    // Generate file and download
    XLSX.writeFile(wb, `TPF_Statement_${financialYear}.xlsx`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
              <PiggyBank className="text-emerald-600" size={28} />
              TPF Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">
              தமிழ்நாடு வருங்கால வைப்பு நிதி கால்குலேட்டர்
            </p>
          </div>
        </div>
        {/* Export Button */}
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Download size={18} />
          Export to Excel
        </button>
      </div>

      {/* Basic Inputs */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year</label>
          <select
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
          >
            {financialYears.map((fy) => (
              <option key={fy.value} value={fy.value}>{fy.value}</option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
          <input
            type="number"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(Number(e.target.value))}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate</label>
          <div className="border rounded-lg p-2 bg-emerald-50 text-emerald-700 font-bold text-center">
            7.1% p.a.
          </div>
        </div>
      </div>

      {/* Main Statement Table - Exact Excel Layout */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
        <div className="p-3 border-b bg-emerald-600 text-white flex justify-between items-center">
          <h2 className="font-semibold">TPF Statement - FY {financialYear}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th rowSpan={2} className="border px-2 py-2 text-left font-semibold bg-gray-300">
                  Month & Year
                </th>
                <th colSpan={4} className="border px-2 py-1 text-center font-semibold bg-green-100">
                  Deposits
                </th>
                <th rowSpan={2} className="border px-2 py-2 text-center font-semibold bg-red-100">
                  Withdrawals
                </th>
                <th rowSpan={2} className="border px-2 py-2 text-center font-semibold bg-blue-100 text-xs">
                  Monthly Balance<br/>on which Interest<br/>is Calculated
                </th>
                <th rowSpan={2} className="border px-2 py-2 text-center font-semibold bg-yellow-100">
                  INTEREST<br/>AMOUNT
                </th>
              </tr>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-center text-xs">Subscription</th>
                <th className="border px-2 py-1 text-center text-xs">Refunds of<br/>Withdrawals</th>
                <th className="border px-2 py-1 text-center text-xs">DA Arrear</th>
                <th className="border px-2 py-1 text-center text-xs bg-green-200">Total of each<br/>month</th>
              </tr>
            </thead>
            <tbody>
              {/* Opening Balance Row */}
              <tr className="bg-yellow-50">
                <td className="border px-2 py-2 font-semibold">Opening Balance</td>
                <td className="border px-2 py-2 text-right font-bold text-emerald-700" colSpan={4}>
                  {formatNumber(openingBalance)}
                </td>
                <td className="border px-2 py-2"></td>
                <td className="border px-2 py-2"></td>
                <td className="border px-2 py-2"></td>
              </tr>

              {/* Monthly Rows */}
              {calculations.breakdown.map((row, index) => (
                <tr key={row.monthYear} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border px-2 py-1 font-medium text-emerald-800">{row.monthYear}</td>
                  <td className="border px-1 py-1">
                    <input
                      type="number"
                      value={monthlyData[index].subscription || ""}
                      onChange={(e) => updateMonthlyData(index, "subscription", Number(e.target.value))}
                      className="w-full text-right border-0 bg-transparent px-1 py-0.5 text-sm focus:bg-yellow-50 focus:outline-none"
                      placeholder="0"
                    />
                  </td>
                  <td className="border px-1 py-1">
                    <input
                      type="number"
                      value={monthlyData[index].refunds || ""}
                      onChange={(e) => updateMonthlyData(index, "refunds", Number(e.target.value))}
                      className="w-full text-right border-0 bg-transparent px-1 py-0.5 text-sm focus:bg-yellow-50 focus:outline-none"
                      placeholder="0"
                    />
                  </td>
                  <td className="border px-1 py-1">
                    <input
                      type="number"
                      value={monthlyData[index].daArrear || ""}
                      onChange={(e) => updateMonthlyData(index, "daArrear", Number(e.target.value))}
                      className="w-full text-right border-0 bg-transparent px-1 py-0.5 text-sm focus:bg-yellow-50 focus:outline-none"
                      placeholder="0"
                    />
                  </td>
                  <td className="border px-2 py-1 text-right bg-green-50 font-medium">
                    {row.totalDeposit > 0 ? formatNumber(row.totalDeposit) : ""}
                  </td>
                  <td className="border px-1 py-1 bg-red-50">
                    <input
                      type="number"
                      value={monthlyData[index].withdrawal || ""}
                      onChange={(e) => updateMonthlyData(index, "withdrawal", Number(e.target.value))}
                      className="w-full text-right border-0 bg-transparent px-1 py-0.5 text-sm focus:bg-yellow-50 focus:outline-none"
                      placeholder="0"
                    />
                  </td>
                  <td className="border px-2 py-1 text-right bg-blue-50 font-medium">
                    {formatNumber(row.monthlyBalance)}
                  </td>
                  <td className="border px-2 py-1 text-right bg-yellow-50"></td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-gray-200 font-bold">
                <td className="border px-2 py-2">Total</td>
                <td className="border px-2 py-2 text-right">{formatNumber(calculations.totalSubscription)}</td>
                <td className="border px-2 py-2 text-right">{formatNumber(calculations.totalRefunds)}</td>
                <td className="border px-2 py-2 text-right">{formatNumber(calculations.totalDaArrear)}</td>
                <td className="border px-2 py-2 text-right bg-green-200">{formatNumber(calculations.totalDeposits)}</td>
                <td className="border px-2 py-2 text-right bg-red-200">{formatNumber(calculations.totalWithdrawals)}</td>
                <td className="border px-2 py-2 text-right bg-blue-200">{formatNumber(calculations.sumOfMonthlyBalances)}</td>
                <td className="border px-2 py-2 text-right bg-yellow-200"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Section - Excel Style */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Summary */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="bg-gray-100">
                <td className="border px-3 py-2 font-semibold">OB</td>
                <td className="border px-3 py-2 text-right font-bold">{formatNumber(openingBalance)}</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Total Deposits</td>
                <td className="border px-3 py-2 text-right text-green-700">{formatNumber(calculations.totalDeposits)}</td>
              </tr>
              <tr className="bg-green-50">
                <td className="border px-3 py-2 font-semibold">Grand Total</td>
                <td className="border px-3 py-2 text-right font-bold">{formatNumber(calculations.grandTotal)}</td>
              </tr>
              <tr className="bg-red-50">
                <td className="border px-3 py-2">Withdrawals</td>
                <td className="border px-3 py-2 text-right text-red-700">{formatNumber(calculations.totalWithdrawals)}</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border px-3 py-2 font-semibold">Principal</td>
                <td className="border px-3 py-2 text-right font-bold">{formatNumber(calculations.principal)}</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border px-3 py-2 font-semibold">Interest</td>
                <td className="border px-3 py-2 text-right font-bold text-blue-700">{formatNumber(calculations.interest)}</td>
              </tr>
              <tr className="bg-emerald-100">
                <td className="border px-3 py-2 font-bold text-emerald-800">Closing Balance</td>
                <td className="border px-3 py-2 text-right font-bold text-emerald-800 text-lg">{formatNumber(calculations.closingBalance)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right - Interest Calculation */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-3 bg-blue-600 text-white font-semibold">Interest Calculation</div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-2 text-center" colSpan={2}>MONTH/YEAR</th>
                <th className="border px-2 py-2 text-center">Rate of<br/>Interest</th>
                <th className="border px-2 py-2 text-center">Amount</th>
                <th className="border px-2 py-2 text-center">Int.<br/>Amount</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border px-2 py-1 text-center text-xs">FROM</th>
                <th className="border px-2 py-1 text-center text-xs">TO</th>
                <th className="border px-2 py-1"></th>
                <th className="border px-2 py-1"></th>
                <th className="border px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-2 text-center">Apr-{startYear.toString().slice(-2)}</td>
                <td className="border px-2 py-2 text-center">Mar-{(startYear + 1).toString().slice(-2)}</td>
                <td className="border px-2 py-2 text-center font-semibold">{TPF_INTEREST_RATE}%</td>
                <td className="border px-2 py-2 text-right">{formatNumber(calculations.sumOfMonthlyBalances)}</td>
                <td className="border px-2 py-2 text-right font-bold text-blue-700">{formatNumber(calculations.interest)}</td>
              </tr>
              <tr className="bg-yellow-100">
                <td className="border px-2 py-2 font-bold text-center" colSpan={4}>TOTAL INT</td>
                <td className="border px-2 py-2 text-right font-bold text-blue-800">{formatNumber(calculations.interest)}</td>
              </tr>
            </tbody>
          </table>

          {/* Formula explanation */}
          <div className="p-3 bg-gray-50 text-xs text-gray-600">
            <p><strong>Formula:</strong> (Sum of Monthly Balances × Rate) ÷ (12 × 100)</p>
            <p className="mt-1">= ({formatNumber(calculations.sumOfMonthlyBalances)} × 7.1) ÷ 1200 = <strong>{formatNumber(calculations.interest)}</strong></p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About TPF Interest Calculation
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Interest Rate:</strong> 7.1% per annum</p>
          <p><strong>Calculation:</strong> Interest is calculated on the sum of monthly closing balances throughout the year.</p>
          <p><strong>Deposits:</strong> Subscription + Refunds of Withdrawals + DA Arrear</p>
          <p><strong>Monthly Balance:</strong> Previous Balance + Deposits - Withdrawals</p>
        </div>
      </div>
    </div>
  );
}
