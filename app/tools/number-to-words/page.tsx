"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Type, Copy, Check, Info } from "lucide-react";

const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const onesTamil = ["", "ஒன்று", "இரண்டு", "மூன்று", "நான்கு", "ஐந்து", "ஆறு", "ஏழு", "எட்டு", "ஒன்பது", "பத்து", "பதினொன்று", "பன்னிரண்டு", "பதிமூன்று", "பதினான்கு", "பதினைந்து", "பதினாறு", "பதினேழு", "பதினெட்டு", "பத்தொன்பது"];
const tensTamil = ["", "", "இருபது", "முப்பது", "நாற்பது", "ஐம்பது", "அறுபது", "எழுபது", "எண்பது", "தொண்ணூறு"];

function convertToWords(num: number): string {
  if (num === 0) return "Zero";
  if (num < 0) return "Minus " + convertToWords(Math.abs(num));

  let words = "";

  // Crores
  if (Math.floor(num / 10000000) > 0) {
    words += convertToWords(Math.floor(num / 10000000)) + " Crore ";
    num %= 10000000;
  }

  // Lakhs
  if (Math.floor(num / 100000) > 0) {
    words += convertToWords(Math.floor(num / 100000)) + " Lakh ";
    num %= 100000;
  }

  // Thousands
  if (Math.floor(num / 1000) > 0) {
    words += convertToWords(Math.floor(num / 1000)) + " Thousand ";
    num %= 1000;
  }

  // Hundreds
  if (Math.floor(num / 100) > 0) {
    words += ones[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }

  if (num > 0) {
    if (num < 20) {
      words += ones[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10 > 0) {
        words += " " + ones[num % 10];
      }
    }
  }

  return words.trim();
}

function convertToTamilWords(num: number): string {
  if (num === 0) return "பூஜ்யம்";
  if (num < 0) return "கழித்தல் " + convertToTamilWords(Math.abs(num));

  let words = "";

  // Crores
  if (Math.floor(num / 10000000) > 0) {
    words += convertToTamilWords(Math.floor(num / 10000000)) + " கோடி ";
    num %= 10000000;
  }

  // Lakhs
  if (Math.floor(num / 100000) > 0) {
    words += convertToTamilWords(Math.floor(num / 100000)) + " லட்சம் ";
    num %= 100000;
  }

  // Thousands
  if (Math.floor(num / 1000) > 0) {
    words += convertToTamilWords(Math.floor(num / 1000)) + " ஆயிரம் ";
    num %= 1000;
  }

  // Hundreds
  if (Math.floor(num / 100) > 0) {
    words += onesTamil[Math.floor(num / 100)] + " நூறு ";
    num %= 100;
  }

  if (num > 0) {
    if (num < 20) {
      words += onesTamil[num];
    } else {
      words += tensTamil[Math.floor(num / 10)];
      if (num % 10 > 0) {
        words += " " + onesTamil[num % 10];
      }
    }
  }

  return words.trim();
}

function formatIndianNumber(num: number): string {
  const numStr = num.toString();
  let result = "";
  let count = 0;

  for (let i = numStr.length - 1; i >= 0; i--) {
    if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
      result = "," + result;
    }
    result = numStr[i] + result;
    count++;
  }

  return result;
}

export default function NumberToWordsPage() {
  const [amount, setAmount] = useState<number>(125000);
  const [includePaise, setIncludePaise] = useState<boolean>(false);
  const [paise, setPaise] = useState<number>(0);
  const [copied, setCopied] = useState<string | null>(null);

  const result = useMemo(() => {
    const wholeAmount = Math.floor(amount);
    const english = convertToWords(wholeAmount);
    const tamil = convertToTamilWords(wholeAmount);

    let englishFull = `Rupees ${english}`;
    let tamilFull = `ரூபாய் ${tamil}`;

    if (includePaise && paise > 0) {
      englishFull += ` and ${convertToWords(paise)} Paise`;
      tamilFull += ` மற்றும் ${convertToTamilWords(paise)} பைசா`;
    }

    englishFull += " Only";
    tamilFull += " மட்டும்";

    return {
      english,
      tamil,
      englishFull,
      tamilFull,
      formatted: formatIndianNumber(wholeAmount),
    };
  }, [amount, includePaise, paise]);

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
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
            <Type className="text-violet-600" size={28} />
            Number to Words
          </h1>
          <p className="text-sm text-gray-500 tamil">எண்ணை சொல்லாக மாற்று</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-violet-800">
          Convert numbers to words in <strong>English</strong> and <strong>Tamil</strong> for cheques, vouchers, and official documents.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4">Enter Amount</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount in Rupees (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border rounded-lg p-3 text-xl font-mono focus:ring-2 focus:ring-violet-500"
                min={0}
                max={999999999999}
              />
              <p className="text-right text-sm text-gray-500 mt-1">
                ₹ {result.formatted}
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="includePaise"
                checked={includePaise}
                onChange={(e) => setIncludePaise(e.target.checked)}
                className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
              />
              <label htmlFor="includePaise" className="text-sm text-gray-700">
                Include Paise
              </label>
            </div>

            {includePaise && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paise (0-99)
                </label>
                <input
                  type="number"
                  value={paise}
                  onChange={(e) => setPaise(Math.min(99, Math.max(0, Number(e.target.value))))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-violet-500"
                  min={0}
                  max={99}
                />
              </div>
            )}
          </div>

          {/* Quick Amounts */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Amounts:</p>
            <div className="flex flex-wrap gap-2">
              {[1000, 5000, 10000, 25000, 50000, 100000, 500000, 1000000].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                >
                  ₹{formatIndianNumber(val)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* English Result */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-tn-text">English</h3>
              <button
                onClick={() => handleCopy(result.englishFull, "english")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied === "english" ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <Copy size={18} className="text-gray-400" />
                )}
              </button>
            </div>
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4">
              <p className="text-lg text-violet-800 font-medium leading-relaxed">
                {result.englishFull}
              </p>
            </div>
          </div>

          {/* Tamil Result */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-tn-text">Tamil (தமிழ்)</h3>
              <button
                onClick={() => handleCopy(result.tamilFull, "tamil")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied === "tamil" ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <Copy size={18} className="text-gray-400" />
                )}
              </button>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4">
              <p className="text-lg text-orange-800 font-medium leading-relaxed tamil">
                {result.tamilFull}
              </p>
            </div>
          </div>

          {/* Formatted Number */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-tn-text">Formatted Number</h3>
              <button
                onClick={() => handleCopy(`₹${result.formatted}`, "formatted")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied === "formatted" ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <Copy size={18} className="text-gray-400" />
                )}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-tn-text font-mono">
                ₹ {result.formatted}
                {includePaise && paise > 0 && <span className="text-xl">.{paise.toString().padStart(2, "0")}</span>}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reference Table */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-tn-text mb-4">Indian Number System Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Number</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Tamil</th>
                <th className="px-4 py-2 text-left">Zeros</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="px-4 py-2 font-mono">1,000</td><td className="px-4 py-2">One Thousand</td><td className="px-4 py-2 tamil">ஓர் ஆயிரம்</td><td className="px-4 py-2">3</td></tr>
              <tr><td className="px-4 py-2 font-mono">10,000</td><td className="px-4 py-2">Ten Thousand</td><td className="px-4 py-2 tamil">பத்தாயிரம்</td><td className="px-4 py-2">4</td></tr>
              <tr><td className="px-4 py-2 font-mono">1,00,000</td><td className="px-4 py-2">One Lakh</td><td className="px-4 py-2 tamil">ஒரு லட்சம்</td><td className="px-4 py-2">5</td></tr>
              <tr><td className="px-4 py-2 font-mono">10,00,000</td><td className="px-4 py-2">Ten Lakh</td><td className="px-4 py-2 tamil">பத்து லட்சம்</td><td className="px-4 py-2">6</td></tr>
              <tr><td className="px-4 py-2 font-mono">1,00,00,000</td><td className="px-4 py-2">One Crore</td><td className="px-4 py-2 tamil">ஒரு கோடி</td><td className="px-4 py-2">7</td></tr>
              <tr><td className="px-4 py-2 font-mono">10,00,00,000</td><td className="px-4 py-2">Ten Crore</td><td className="px-4 py-2 tamil">பத்து கோடி</td><td className="px-4 py-2">8</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Usage Tips
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Cheques:</strong> Always write amount in words to prevent fraud.</p>
          <p><strong>Vouchers:</strong> Both figures and words should match exactly.</p>
          <p><strong>Indian System:</strong> Uses Lakhs (1,00,000) and Crores (1,00,00,000) instead of Millions/Billions.</p>
        </div>
      </div>
    </div>
  );
}
