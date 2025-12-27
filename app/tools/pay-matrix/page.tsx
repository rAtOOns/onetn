"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Table, Info } from "lucide-react";

// 7th Pay Commission Pay Matrix for Tamil Nadu Government
// Level 1 to Level 24
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
  18: [67700, 69700, 71800, 74000, 76200, 78500, 80800, 83200, 85700, 88300, 90900, 93600, 96400, 99300, 102300, 105300, 108500, 111700, 115100, 118500, 122100, 125700, 129500, 133400, 137400, 141500, 145700, 150100],
  19: [78800, 81200, 83600, 86100, 88700, 91400, 94100, 96900, 99800, 102800, 105900, 109100, 112400, 115700, 119200, 122800, 126500, 130300, 134200, 138200, 142300, 146600, 151000, 155500, 160200, 165000, 169900],
  20: [123100, 126800, 130600, 134500, 138500, 142700, 147000, 151400, 155900, 160600, 165400, 170400, 175500, 180800, 186200, 191800, 197600, 203500, 209600, 215900, 222400, 229100, 236000, 243100, 250400],
  21: [131100, 135000, 139100, 143200, 147500, 151900, 156500, 161200, 166000, 171000, 176100, 181400, 186800, 192400, 198200, 204100, 210200, 216500, 223000, 229700, 236600, 243700, 251000, 258500],
  22: [144200, 148500, 153000, 157600, 162300, 167200, 172200, 177400, 182700, 188200, 193800, 199600, 205600, 211800, 218200, 224700, 231400, 238300, 245400, 252800, 260400, 268200, 276200],
  23: [182200, 187700, 193300, 199100, 205100, 211200, 217600, 224100, 230800, 237700, 244800, 252200, 259800, 267500, 275500, 283800, 292300, 301100, 310100, 319400, 329000, 338900],
  24: [205400, 211600, 217900, 224400, 231100, 238100, 245200, 252600, 260200, 268000, 276000, 284300, 292800, 301600, 310600, 319900, 329500, 339400, 349600, 360100, 370900],
};

// Common posts and their levels
const commonPosts: { post: string; postTamil: string; level: number }[] = [
  { post: "Office Assistant / Peon", postTamil: "அலுவலக உதவியாளர்", level: 1 },
  { post: "Record Clerk", postTamil: "பதிவு எழுத்தர்", level: 1 },
  { post: "Junior Assistant", postTamil: "இளநிலை உதவியாளர்", level: 2 },
  { post: "Typist", postTamil: "தட்டச்சர்", level: 2 },
  { post: "Senior Assistant / Assistant", postTamil: "உதவியாளர்", level: 3 },
  { post: "Lab Assistant", postTamil: "ஆய்வக உதவியாளர்", level: 3 },
  { post: "BT Assistant / PG Assistant", postTamil: "பட்டதாரி ஆசிரியர்", level: 6 },
  { post: "Secondary Grade Teacher (SGT)", postTamil: "இடைநிலை ஆசிரியர்", level: 6 },
  { post: "Graduate Teacher", postTamil: "பட்டதாரி ஆசிரியர்", level: 6 },
  { post: "Physical Director Grade II", postTamil: "உடற்கல்வி இயக்குநர் நிலை II", level: 6 },
  { post: "Headmaster (Primary)", postTamil: "தொடக்கப்பள்ளி தலைமையாசிரியர்", level: 7 },
  { post: "Headmaster (Middle)", postTamil: "நடுநிலைப்பள்ளி தலைமையாசிரியர்", level: 8 },
  { post: "BEO / Block Educational Officer", postTamil: "வட்டக் கல்வி அலுவலர்", level: 9 },
  { post: "Headmaster (High School)", postTamil: "உயர்நிலைப்பள்ளி தலைமையாசிரியர்", level: 10 },
  { post: "Headmaster (Hr. Sec. School)", postTamil: "மேல்நிலைப்பள்ளி தலைமையாசிரியர்", level: 11 },
  { post: "DEO / District Educational Officer", postTamil: "மாவட்டக் கல்வி அலுவலர்", level: 12 },
  { post: "CEO / Chief Educational Officer", postTamil: "முதன்மைக் கல்வி அலுவலர்", level: 13 },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PayMatrixPage() {
  const [selectedLevel, setSelectedLevel] = useState<number>(6);
  const [searchAmount, setSearchAmount] = useState<string>("");
  const [showAllLevels, setShowAllLevels] = useState<boolean>(false);

  const searchResults = useMemo(() => {
    if (!searchAmount) return null;
    const amount = parseInt(searchAmount);
    if (isNaN(amount)) return null;

    const results: { level: number; index: number; pay: number }[] = [];

    Object.entries(payMatrix).forEach(([level, pays]) => {
      pays.forEach((pay, index) => {
        if (pay === amount) {
          results.push({ level: parseInt(level), index: index + 1, pay });
        }
      });
    });

    return results;
  }, [searchAmount]);

  const selectedLevelData = payMatrix[selectedLevel] || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Table className="text-blue-600" size={28} />
            Pay Matrix Lookup
          </h1>
          <p className="text-sm text-gray-500 tamil">7வது ஊதியக்குழு சம்பள அட்டவணை</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-blue-800">
          <strong>7th Pay Commission Pay Matrix</strong> - As per GO(Ms) No.303, Finance Department, dated 11.10.2017
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Search & Select */}
        <div className="space-y-6">
          {/* Search by Amount */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <Search size={18} className="text-blue-500" />
              Search by Amount
            </h2>
            <input
              type="number"
              value={searchAmount}
              onChange={(e) => setSearchAmount(e.target.value)}
              placeholder="Enter pay amount (e.g., 36900)"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
            {searchResults && searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-green-700">Found in:</p>
                {searchResults.map((result, idx) => (
                  <div key={idx} className="bg-green-50 p-2 rounded text-sm">
                    Level {result.level}, Index {result.index}
                  </div>
                ))}
              </div>
            )}
            {searchResults && searchResults.length === 0 && (
              <p className="mt-4 text-sm text-red-600">Amount not found in pay matrix</p>
            )}
          </div>

          {/* Select Level */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4">Select Pay Level</h2>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(payMatrix).map((level) => (
                <option key={level} value={level}>
                  Level {level} (Entry: {formatCurrency(payMatrix[parseInt(level)][0])})
                </option>
              ))}
            </select>
          </div>

          {/* Common Posts Reference */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-tn-text mb-4">Common Posts & Levels</h2>
            <div className="space-y-2 text-sm max-h-80 overflow-y-auto">
              {commonPosts.map((post, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    selectedLevel === post.level
                      ? "bg-blue-100 border border-blue-300"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedLevel(post.level)}
                >
                  <p className="font-medium">{post.post}</p>
                  <p className="text-xs text-gray-500 tamil">{post.postTamil}</p>
                  <p className="text-xs text-blue-600">Level {post.level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Pay Matrix Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-tn-text">
                Level {selectedLevel} Pay Scale
              </h2>
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                Entry Pay: {formatCurrency(selectedLevelData[0])}
              </span>
            </div>

            {/* Pay Matrix Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Index</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">Basic Pay</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">DA (50%)</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">Gross</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLevelData.map((pay, index) => {
                    const da = Math.round(pay * 0.5);
                    const gross = pay + da;
                    return (
                      <tr key={index} className="border-t hover:bg-blue-50">
                        <td className="px-3 py-2 font-medium">{index + 1}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(pay)}</td>
                        <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(da)}</td>
                        <td className="px-3 py-2 text-right font-medium text-blue-700">{formatCurrency(gross)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Level Summary */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">Entry Pay</p>
                <p className="font-bold text-green-600">{formatCurrency(selectedLevelData[0])}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Maximum Pay</p>
                <p className="font-bold text-blue-600">{formatCurrency(selectedLevelData[selectedLevelData.length - 1])}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Stages</p>
                <p className="font-bold">{selectedLevelData.length}</p>
              </div>
            </div>
          </div>

          {/* Toggle All Levels */}
          <div className="mt-6">
            <button
              onClick={() => setShowAllLevels(!showAllLevels)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
            >
              {showAllLevels ? "Hide All Levels" : "Show All Levels Entry Pay"}
            </button>

            {showAllLevels && (
              <div className="mt-4 bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold mb-4">All Levels - Entry Pay</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(payMatrix).map(([level, pays]) => (
                    <div
                      key={level}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedLevel === parseInt(level)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedLevel(parseInt(level))}
                    >
                      <p className="text-xs opacity-75">Level {level}</p>
                      <p className="font-bold">{formatCurrency(pays[0])}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About Pay Matrix
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>7th Pay Commission:</strong> Implemented from 01.01.2016 in Tamil Nadu.</p>
          <p><strong>Increment:</strong> 3% annual increment on Basic Pay, granted on July 1st each year.</p>
          <p><strong>DA Rate:</strong> Currently 50% of Basic Pay (as of Jan 2024).</p>
          <p><strong>Levels:</strong> Pay scales are organized in 24 levels based on post and cadre.</p>
        </div>
      </div>
    </div>
  );
}
