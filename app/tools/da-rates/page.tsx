"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, Calendar, Info } from "lucide-react";
import { useState } from "react";

// Historical DA rates for Tamil Nadu Government Employees (7th Pay Commission)
const daRates7thPC = [
  { effectiveFrom: "July 2024", rate: 53, increase: 3, goNumber: "G.O.Ms.No.215/2024" },
  { effectiveFrom: "January 2024", rate: 50, increase: 4, goNumber: "G.O.Ms.No.1/2024" },
  { effectiveFrom: "July 2023", rate: 46, increase: 4, goNumber: "G.O.Ms.No.234/2023" },
  { effectiveFrom: "January 2023", rate: 42, increase: 4, goNumber: "G.O.Ms.No.12/2023" },
  { effectiveFrom: "July 2022", rate: 38, increase: 3, goNumber: "G.O.Ms.No.198/2022" },
  { effectiveFrom: "January 2022", rate: 35, increase: 3, goNumber: "G.O.Ms.No.5/2022" },
  { effectiveFrom: "July 2021", rate: 32, increase: 3, goNumber: "G.O.Ms.No.210/2021" },
  { effectiveFrom: "January 2021", rate: 29, increase: 3, goNumber: "G.O.Ms.No.8/2021" },
  { effectiveFrom: "July 2020", rate: 26, increase: 0, goNumber: "Frozen due to COVID-19" },
  { effectiveFrom: "January 2020", rate: 26, increase: 4, goNumber: "G.O.Ms.No.15/2020" },
  { effectiveFrom: "July 2019", rate: 22, increase: 3, goNumber: "G.O.Ms.No.189/2019" },
  { effectiveFrom: "January 2019", rate: 19, increase: 3, goNumber: "G.O.Ms.No.11/2019" },
  { effectiveFrom: "July 2018", rate: 16, increase: 3, goNumber: "G.O.Ms.No.156/2018" },
  { effectiveFrom: "January 2018", rate: 13, increase: 3, goNumber: "G.O.Ms.No.9/2018" },
  { effectiveFrom: "July 2017", rate: 10, increase: 3, goNumber: "G.O.Ms.No.178/2017" },
  { effectiveFrom: "January 2017", rate: 7, increase: 3, goNumber: "G.O.Ms.No.14/2017" },
  { effectiveFrom: "January 2016", rate: 4, increase: 4, goNumber: "G.O.Ms.No.1/2016 (7th PC)" },
];

// 6th Pay Commission DA rates (2006-2015)
const daRates6thPC = [
  { effectiveFrom: "January 2016", rate: 125, increase: 6, goNumber: "G.O.Ms.No.1/2016" },
  { effectiveFrom: "July 2015", rate: 119, increase: 6, goNumber: "G.O.Ms.No.245/2015" },
  { effectiveFrom: "January 2015", rate: 113, increase: 6, goNumber: "G.O.Ms.No.12/2015" },
  { effectiveFrom: "July 2014", rate: 107, increase: 7, goNumber: "G.O.Ms.No.198/2014" },
  { effectiveFrom: "January 2014", rate: 100, increase: 10, goNumber: "G.O.Ms.No.8/2014" },
  { effectiveFrom: "July 2013", rate: 90, increase: 10, goNumber: "G.O.Ms.No.156/2013" },
  { effectiveFrom: "January 2013", rate: 80, increase: 8, goNumber: "G.O.Ms.No.5/2013" },
  { effectiveFrom: "July 2012", rate: 72, increase: 7, goNumber: "G.O.Ms.No.178/2012" },
  { effectiveFrom: "January 2012", rate: 65, increase: 7, goNumber: "G.O.Ms.No.12/2012" },
  { effectiveFrom: "July 2011", rate: 58, increase: 7, goNumber: "G.O.Ms.No.201/2011" },
  { effectiveFrom: "January 2011", rate: 51, increase: 6, goNumber: "G.O.Ms.No.9/2011" },
  { effectiveFrom: "July 2010", rate: 45, increase: 10, goNumber: "G.O.Ms.No.167/2010" },
  { effectiveFrom: "January 2010", rate: 35, increase: 8, goNumber: "G.O.Ms.No.14/2010" },
  { effectiveFrom: "July 2009", rate: 27, increase: 5, goNumber: "G.O.Ms.No.189/2009" },
  { effectiveFrom: "January 2009", rate: 22, increase: 6, goNumber: "G.O.Ms.No.11/2009" },
  { effectiveFrom: "July 2008", rate: 16, increase: 4, goNumber: "G.O.Ms.No.156/2008" },
  { effectiveFrom: "January 2008", rate: 12, increase: 6, goNumber: "G.O.Ms.No.9/2008" },
  { effectiveFrom: "July 2007", rate: 6, increase: 3, goNumber: "G.O.Ms.No.178/2007" },
  { effectiveFrom: "January 2007", rate: 3, increase: 3, goNumber: "G.O.Ms.No.14/2007" },
  { effectiveFrom: "January 2006", rate: 0, increase: 0, goNumber: "G.O.Ms.No.1/2006 (6th PC)" },
];

// 5th Pay Commission DA rates (2001-2005)
const daRates5thPC = [
  { effectiveFrom: "January 2006", rate: 50, increase: 4, goNumber: "Merged into 6th PC" },
  { effectiveFrom: "July 2005", rate: 50, increase: 3, goNumber: "G.O.Ms.No.201/2005" },
  { effectiveFrom: "January 2005", rate: 47, increase: 4, goNumber: "G.O.Ms.No.12/2005" },
  { effectiveFrom: "July 2004", rate: 43, increase: 3, goNumber: "G.O.Ms.No.178/2004" },
  { effectiveFrom: "April 2004", rate: 40, increase: 0, goNumber: "50% DA merged into DP" },
  { effectiveFrom: "January 2004", rate: 90, increase: 5, goNumber: "G.O.Ms.No.14/2004" },
  { effectiveFrom: "July 2003", rate: 85, increase: 6, goNumber: "G.O.Ms.No.189/2003" },
  { effectiveFrom: "January 2003", rate: 79, increase: 5, goNumber: "G.O.Ms.No.9/2003" },
  { effectiveFrom: "July 2002", rate: 74, increase: 5, goNumber: "G.O.Ms.No.156/2002" },
  { effectiveFrom: "January 2002", rate: 69, increase: 5, goNumber: "G.O.Ms.No.11/2002" },
  { effectiveFrom: "July 2001", rate: 64, increase: 4, goNumber: "G.O.Ms.No.178/2001" },
  { effectiveFrom: "January 2001", rate: 60, increase: 5, goNumber: "G.O.Ms.No.14/2001" },
];

// Sample calculation
const sampleBasicPay = 36900;

type PayCommission = "7th" | "6th" | "5th";

export default function DARatesPage() {
  const [selectedPC, setSelectedPC] = useState<PayCommission>("7th");
  const currentDA = daRates7thPC[0];

  const getDAData = () => {
    switch (selectedPC) {
      case "7th": return daRates7thPC;
      case "6th": return daRates6thPC;
      case "5th": return daRates5thPC;
    }
  };

  const getPCLabel = () => {
    switch (selectedPC) {
      case "7th": return "7th Pay Commission (2016-Present)";
      case "6th": return "6th Pay Commission (2006-2015)";
      case "5th": return "5th Pay Commission (2001-2005)";
    }
  };

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
            <TrendingUp className="text-blue-600" size={28} />
            DA Rate Table
          </h1>
          <p className="text-sm text-gray-500 tamil">
            அகவிலைப்படி விகித அட்டவணை
          </p>
        </div>
      </div>

      {/* Current DA Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm">Current DA Rate</p>
            <p className="text-sm tamil text-blue-200">தற்போதைய அகவிலைப்படி</p>
            <p className="text-4xl font-bold mt-2">{currentDA.rate}%</p>
            <p className="text-blue-200 text-sm mt-1">
              Effective from {currentDA.effectiveFrom}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm">For Basic Pay ₹{sampleBasicPay.toLocaleString("en-IN")}</p>
              <p className="text-2xl font-bold">
                ₹{Math.round((sampleBasicPay * currentDA.rate) / 100).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-blue-200">DA Amount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> DA rates shown are for Tamil Nadu State Government employees
          under 7th Pay Commission. Central Government employees have different rates.
          G.O. numbers are indicative. Verify with official sources.
        </p>
      </div>

      {/* Pay Commission Selector */}
      <div className="flex gap-2 mb-6">
        {(["7th", "6th", "5th"] as PayCommission[]).map((pc) => (
          <button
            key={pc}
            onClick={() => setSelectedPC(pc)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPC === pc
                ? "bg-tn-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {pc} PC
          </button>
        ))}
      </div>

      {/* DA Rate Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-tn-text flex items-center gap-2">
            <Calendar size={18} />
            {getPCLabel()}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Effective From
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  DA Rate
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Increase
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  DA for ₹36,900
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {getDAData().map((da, index) => (
                <tr
                  key={da.effectiveFrom}
                  className={`${selectedPC === "7th" && index === 0 ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {selectedPC === "7th" && index === 0 && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                          Current
                        </span>
                      )}
                      {da.effectiveFrom}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-lg font-bold text-tn-primary">
                      {da.rate}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {da.increase > 0 ? (
                      <span className="text-green-600 font-medium">+{da.increase}%</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₹{Math.round((sampleBasicPay * da.rate) / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {da.goNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DA Calculator */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-tn-text mb-4">Quick DA Calculator</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter your Basic Pay to calculate DA at current rate ({currentDA.rate}%)
        </p>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Basic Pay (₹)
            </label>
            <input
              type="number"
              defaultValue={sampleBasicPay}
              id="basicPayInput"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
              onChange={(e) => {
                const basic = Number(e.target.value);
                const daAmount = Math.round((basic * currentDA.rate) / 100);
                const resultEl = document.getElementById("daResult");
                if (resultEl) resultEl.textContent = `₹${daAmount.toLocaleString("en-IN")}`;
              }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DA Amount
            </label>
            <div className="w-full border rounded-lg p-3 bg-gray-50">
              <span id="daResult" className="text-xl font-bold text-green-600">
                ₹{Math.round((sampleBasicPay * currentDA.rate) / 100).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About Dearness Allowance (DA)
        </h3>
        <div className="text-sm text-blue-700 space-y-3">
          <p>
            <strong>Dearness Allowance (DA)</strong> is a cost of living adjustment
            allowance paid to government employees to compensate for inflation.
            It is calculated as a percentage of the Basic Pay.
          </p>
          <p>
            <strong>Revision Schedule:</strong> DA is typically revised twice a year -
            in January and July. The Tamil Nadu government announces DA hikes through
            Government Orders (G.O.).
          </p>
          <p>
            <strong>Calculation:</strong> DA Amount = (Basic Pay × DA Rate) / 100
          </p>
          <p>
            <strong>DA Merger:</strong> When DA crosses 50%, it is often merged with
            Basic Pay during the next Pay Commission. This resets DA to 0% and increases
            the Basic Pay proportionally.
          </p>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/tools/salary-calculator"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Salary Calculator
        </Link>
        <Link
          href="/documents?search=DA"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          DA Related G.O.s
        </Link>
      </div>
    </div>
  );
}
