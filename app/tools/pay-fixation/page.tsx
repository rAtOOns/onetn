"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, TrendingUp, Info, ArrowRight, Printer } from "lucide-react";
import { CURRENT_DA_RATE } from "@/lib/constants/rates";

// 7th Pay Commission Pay Matrix
const payMatrix: Record<number, number[]> = {
  1: [15700, 16200, 16700, 17200, 17700, 18300, 18800, 19400, 20000, 20600, 21200, 21800, 22500, 23200, 23900, 24600, 25300, 26100, 26900, 27700, 28500, 29400, 30300, 31200, 32100, 33100, 34100, 35100, 36200, 37300, 38400, 39600, 40800],
  2: [19500, 20100, 20700, 21300, 22000, 22600, 23300, 24000, 24700, 25500, 26200, 27000, 27800, 28700, 29500, 30400, 31300, 32300, 33200, 34200, 35300, 36300, 37400, 38500, 39700, 40900, 42100, 43400, 44700, 46000, 47400],
  3: [21700, 22400, 23000, 23700, 24400, 25200, 25900, 26700, 27500, 28300, 29200, 30100, 31000, 31900, 32900, 33900, 34900, 35900, 37000, 38100, 39200, 40400, 41600, 42900, 44200, 45500, 46900, 48300, 49700, 51200, 52800],
  4: [25500, 26300, 27100, 27900, 28700, 29600, 30500, 31400, 32300, 33300, 34300, 35300, 36400, 37500, 38600, 39800, 41000, 42200, 43500, 44800, 46100, 47500, 48900, 50400, 51900, 53500, 55100, 56700, 58400, 60200, 62000],
  5: [29200, 30100, 31000, 31900, 32900, 33900, 34900, 35900, 37000, 38100, 39200, 40400, 41600, 42900, 44200, 45500, 46900, 48300, 49700, 51200, 52800, 54400, 56000, 57700, 59400, 61200, 63000, 64900, 66900, 68900],
  6: [35400, 36500, 37600, 38700, 39900, 41100, 42300, 43600, 44900, 46200, 47600, 49000, 50500, 52000, 53600, 55200, 56800, 58500, 60300, 62100, 63900, 65900, 67800, 69900, 72000, 74100, 76300, 78600, 81000, 83400],
  7: [44900, 46200, 47600, 49000, 50500, 52000, 53600, 55200, 56800, 58500, 60300, 62100, 63900, 65900, 67800, 69900, 72000, 74100, 76300, 78600, 81000, 83400, 85900, 88500, 91100, 93800, 96700, 99600, 102600, 105700],
  8: [47600, 49000, 50500, 52000, 53600, 55200, 56800, 58500, 60300, 62100, 63900, 65900, 67800, 69900, 72000, 74100, 76300, 78600, 81000, 83400, 85900, 88500, 91100, 93800, 96700, 99600, 102600, 105700, 108900],
  9: [53100, 54700, 56300, 58000, 59700, 61500, 63400, 65300, 67200, 69200, 71300, 73400, 75600, 77900, 80200, 82600, 85100, 87600, 90300, 93000, 95800, 98700, 101600, 104700, 107800, 111100, 114400, 117800, 121400],
  10: [56100, 57800, 59500, 61300, 63100, 65000, 67000, 69000, 71100, 73200, 75400, 77700, 80000, 82400, 84900, 87400, 90100, 92800, 95600, 98400, 101400, 104400, 107600, 110800, 114100, 117500, 121100, 124700, 128400],
  11: [67700, 69700, 71800, 74000, 76200, 78500, 80800, 83200, 85700, 88300, 90900, 93600, 96400, 99300, 102300, 105300, 108500, 111700, 115100, 118500, 122100, 125700, 129500, 133400, 137400, 141500, 145700, 150100, 154600],
  12: [78800, 81200, 83600, 86100, 88700, 91400, 94100, 96900, 99800, 102800, 105900, 109100, 112400, 115700, 119200, 122800, 126500, 130300, 134200, 138200, 142300, 146600, 151000, 155500, 160200, 165000, 169900, 175000, 180200],
  13: [123100, 126800, 130600, 134500, 138500, 142700, 147000, 151400, 155900, 160600, 165400, 170400, 175500, 180800, 186200, 191800, 197600, 203500, 209600, 215900, 222400, 229100, 236000, 243100, 250400, 257900, 265600, 273600],
  14: [131100, 135000, 139100, 143200, 147500, 151900, 156500, 161200, 166000, 171000, 176100, 181400, 186800, 192400, 198200, 204100, 210200, 216500, 223000, 229700, 236600, 243700, 251000, 258500, 266300, 274300, 282500, 291000],
  15: [144200, 148500, 153000, 157600, 162300, 167200, 172200, 177400, 182700, 188200, 193800, 199600, 205600, 211800, 218200, 224700, 231400, 238300, 245400, 252800, 260400, 268200, 276200, 284500, 293000, 301800, 310900, 320200],
  16: [182200, 187700, 193300, 199100, 205100, 211200, 217600, 224100, 230800, 237700, 244800, 252200, 259800, 267500, 275500, 283800, 292300, 301100, 310100, 319400, 329000, 338900, 349100, 359500, 370300, 381400, 392900, 404700],
  17: [205400, 211600, 217900, 224400, 231100, 238100, 245200, 252600, 260200, 268000, 276000, 284300, 292800, 301600, 310600, 319900, 329500, 339400, 349600, 360100, 370900, 382100, 393600, 405400, 417600, 430100, 443000, 456300],
};

const CURRENT_DA = CURRENT_DA_RATE;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function findPayCell(level: number, targetPay: number): { index: number; pay: number } | null {
  const levelPays = payMatrix[level];
  if (!levelPays) return null;

  // Find the cell equal to or just above the target pay
  for (let i = 0; i < levelPays.length; i++) {
    if (levelPays[i] >= targetPay) {
      return { index: i, pay: levelPays[i] };
    }
  }

  // If target pay exceeds max, return max
  return { index: levelPays.length - 1, pay: levelPays[levelPays.length - 1] };
}

export default function PayFixationCalculatorPage() {
  const [currentLevel, setCurrentLevel] = useState<number>(6);
  const [currentBasicPay, setCurrentBasicPay] = useState<number>(35400);
  const [newLevel, setNewLevel] = useState<number>(7);
  const [fixationType, setFixationType] = useState<string>("promotion");

  const currentLevelPays = payMatrix[currentLevel] || [];
  const newLevelPays = payMatrix[newLevel] || [];

  const calculation = useMemo(() => {
    if (!currentBasicPay || !newLevel) return null;

    // Step 1: Add notional increment (3%) to current pay
    const notionalIncrement = Math.round(currentBasicPay * 0.03);
    const payAfterNotionalIncrement = currentBasicPay + notionalIncrement;

    // Step 2: Find the cell in new level equal to or just above
    const newPayCell = findPayCell(newLevel, payAfterNotionalIncrement);
    if (!newPayCell) return null;

    // Step 3: Calculate benefit
    const benefit = newPayCell.pay - currentBasicPay;
    const benefitPercentage = ((benefit / currentBasicPay) * 100).toFixed(1);

    // Step 4: Calculate DA
    const oldDA = Math.round((currentBasicPay * CURRENT_DA) / 100);
    const newDA = Math.round((newPayCell.pay * CURRENT_DA) / 100);

    // Step 5: Calculate gross
    const oldGross = currentBasicPay + oldDA;
    const newGross = newPayCell.pay + newDA;

    return {
      currentBasicPay,
      notionalIncrement,
      payAfterNotionalIncrement,
      newBasicPay: newPayCell.pay,
      newPayIndex: newPayCell.index + 1,
      benefit,
      benefitPercentage,
      oldDA,
      newDA,
      oldGross,
      newGross,
      grossIncrease: newGross - oldGross,
    };
  }, [currentBasicPay, newLevel]);

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
              <TrendingUp className="text-purple-600" size={28} />
              Pay Fixation Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">ஊதிய நிர்ணய கால்குலேட்டர்</p>
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
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 print:hidden">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This is an unofficial calculator for estimation only.
          Pay fixation rules may vary. Always verify with your DDO and refer to official Government Orders.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 print:shadow-none print:border-gray-300">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            Enter Details
          </h2>

          <div className="space-y-4">
            {/* Fixation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fixation Type
              </label>
              <select
                value={fixationType}
                onChange={(e) => setFixationType(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
              >
                <option value="promotion">Promotion</option>
                <option value="macp">MACP (Modified ACP)</option>
                <option value="upgradation">Pay Upgradation</option>
              </select>
            </div>

            {/* Current Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Pay Level
              </label>
              <select
                value={currentLevel}
                onChange={(e) => {
                  const level = Number(e.target.value);
                  setCurrentLevel(level);
                  setCurrentBasicPay(payMatrix[level]?.[0] || 0);
                  if (level >= newLevel) {
                    setNewLevel(level + 1);
                  }
                }}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
              >
                {Object.keys(payMatrix).map((level) => (
                  <option key={level} value={level}>
                    Level {level} (Entry: {formatCurrency(payMatrix[parseInt(level)][0])})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Basic Pay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Basic Pay
              </label>
              <select
                value={currentBasicPay}
                onChange={(e) => setCurrentBasicPay(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
              >
                {currentLevelPays.map((pay, index) => (
                  <option key={index} value={pay}>
                    Index {index + 1}: {formatCurrency(pay)}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Or enter manually:
                <input
                  type="number"
                  value={currentBasicPay}
                  onChange={(e) => setCurrentBasicPay(Number(e.target.value))}
                  className="ml-2 w-32 border rounded px-2 py-1"
                />
              </p>
            </div>

            {/* New Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promoted to Pay Level
              </label>
              <select
                value={newLevel}
                onChange={(e) => setNewLevel(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
              >
                {Object.keys(payMatrix)
                  .filter((level) => parseInt(level) > currentLevel)
                  .map((level) => (
                    <option key={level} value={level}>
                      Level {level} (Entry: {formatCurrency(payMatrix[parseInt(level)][0])})
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {calculation && (
            <>
              {/* Main Result Card */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <p className="text-purple-100 text-sm">New Basic Pay after {fixationType}</p>
                <p className="text-4xl font-bold mt-1">{formatCurrency(calculation.newBasicPay)}</p>
                <p className="text-purple-100 text-sm mt-2">
                  Level {newLevel}, Index {calculation.newPayIndex}
                </p>
              </div>

              {/* Calculation Steps */}
              <div className="bg-white rounded-xl shadow-sm border p-6 print:shadow-none print:border-gray-300">
                <h3 className="font-semibold text-tn-text mb-4">Pay Fixation Steps</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <div className="flex-1">
                      <p className="text-gray-600">Current Basic Pay (Level {currentLevel})</p>
                      <p className="font-semibold">{formatCurrency(calculation.currentBasicPay)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <div className="flex-1">
                      <p className="text-gray-600">Add Notional Increment (3%)</p>
                      <p className="font-semibold text-blue-600">+ {formatCurrency(calculation.notionalIncrement)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <div className="flex-1">
                      <p className="text-gray-600">Pay after Notional Increment</p>
                      <p className="font-semibold">{formatCurrency(calculation.payAfterNotionalIncrement)}</p>
                    </div>
                  </div>

                  <div className="flex justify-center py-2">
                    <ArrowRight className="text-purple-500" />
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <div className="flex-1">
                      <p className="text-gray-600">Fixed at Level {newLevel}, Index {calculation.newPayIndex}</p>
                      <p className="font-semibold text-purple-600">{formatCurrency(calculation.newBasicPay)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden print:shadow-none print:border-gray-300">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-tn-text">Before vs After Comparison</h3>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Component</th>
                      <th className="px-4 py-2 text-right">Before</th>
                      <th className="px-4 py-2 text-right">After</th>
                      <th className="px-4 py-2 text-right">Increase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-3">Basic Pay</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(calculation.currentBasicPay)}</td>
                      <td className="px-4 py-3 text-right font-medium text-purple-600">{formatCurrency(calculation.newBasicPay)}</td>
                      <td className="px-4 py-3 text-right text-green-600">+{formatCurrency(calculation.benefit)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">DA ({CURRENT_DA}%)</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(calculation.oldDA)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(calculation.newDA)}</td>
                      <td className="px-4 py-3 text-right text-green-600">+{formatCurrency(calculation.newDA - calculation.oldDA)}</td>
                    </tr>
                    <tr className="bg-green-50 font-semibold">
                      <td className="px-4 py-3">Gross Pay</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(calculation.oldGross)}</td>
                      <td className="px-4 py-3 text-right text-green-700">{formatCurrency(calculation.newGross)}</td>
                      <td className="px-4 py-3 text-right text-green-700">+{formatCurrency(calculation.grossIncrease)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Benefit Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-green-700">Basic Pay Increase</p>
                  <p className="text-2xl font-bold text-green-600">+{calculation.benefitPercentage}%</p>
                  <p className="text-sm text-green-600">{formatCurrency(calculation.benefit)}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-blue-700">Monthly Gross Increase</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculation.grossIncrease)}</p>
                  <p className="text-sm text-blue-600">per month</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pay Fixation Rules */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6 print:bg-white print:border print:border-gray-300">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Pay Fixation Rules (7th CPC)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">On Promotion:</p>
            <ul className="space-y-1">
              <li>1. Add one notional increment (3%) to existing pay</li>
              <li>2. Locate the pay in promoted level equal to or just above</li>
              <li>3. That becomes the new basic pay</li>
              <li>4. Next increment date may change based on promotion date</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Important Notes:</p>
            <ul className="space-y-1">
              <li>• Minimum benefit is one increment (3%)</li>
              <li>• Option available to fix from date of promotion or next increment date</li>
              <li>• MACP follows similar rules as promotion</li>
              <li>• Refer to FR 22(I)(a)(1) for detailed rules</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/pay-matrix" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Pay Matrix Lookup
        </Link>
        <Link href="/tools/increment-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Increment Calculator
        </Link>
        <Link href="/tools/promotion-info" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Promotion Information
        </Link>
      </div>
    </div>
  );
}
