"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Calculator, Info, Search, MapPin } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// HRA rates based on city classification
const hraRates = [
  { category: "X", rate: 24, cities: ["Chennai"] },
  { category: "Y", rate: 16, cities: ["Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"] },
  { category: "Z", rate: 8, cities: ["All other places in Tamil Nadu"] },
];

// Tamil Nadu cities with their HRA categories
const tnCities = [
  { name: "Chennai", district: "Chennai", category: "X", rate: 24 },
  { name: "Coimbatore", district: "Coimbatore", category: "Y", rate: 16 },
  { name: "Madurai", district: "Madurai", category: "Y", rate: 16 },
  { name: "Tiruchirappalli", district: "Tiruchirappalli", category: "Y", rate: 16 },
  { name: "Salem", district: "Salem", category: "Y", rate: 16 },
  { name: "Tirunelveli", district: "Tirunelveli", category: "Y", rate: 16 },
  { name: "Erode", district: "Erode", category: "Z", rate: 8 },
  { name: "Vellore", district: "Vellore", category: "Z", rate: 8 },
  { name: "Thoothukudi", district: "Thoothukudi", category: "Z", rate: 8 },
  { name: "Thanjavur", district: "Thanjavur", category: "Z", rate: 8 },
  { name: "Dindigul", district: "Dindigul", category: "Z", rate: 8 },
  { name: "Cuddalore", district: "Cuddalore", category: "Z", rate: 8 },
  { name: "Kanchipuram", district: "Kanchipuram", category: "Z", rate: 8 },
  { name: "Tiruppur", district: "Tiruppur", category: "Z", rate: 8 },
  { name: "Nagercoil", district: "Kanyakumari", category: "Z", rate: 8 },
  { name: "Karur", district: "Karur", category: "Z", rate: 8 },
  { name: "Kumbakonam", district: "Thanjavur", category: "Z", rate: 8 },
  { name: "Rajapalayam", district: "Virudhunagar", category: "Z", rate: 8 },
  { name: "Pudukkottai", district: "Pudukkottai", category: "Z", rate: 8 },
  { name: "Hosur", district: "Krishnagiri", category: "Z", rate: 8 },
  { name: "Ambur", district: "Tirupattur", category: "Z", rate: 8 },
  { name: "Nagapattinam", district: "Nagapattinam", category: "Z", rate: 8 },
  { name: "Villupuram", district: "Villupuram", category: "Z", rate: 8 },
  { name: "Sivakasi", district: "Virudhunagar", category: "Z", rate: 8 },
  { name: "Namakkal", district: "Namakkal", category: "Z", rate: 8 },
  { name: "Krishnagiri", district: "Krishnagiri", category: "Z", rate: 8 },
  { name: "Dharmapuri", district: "Dharmapuri", category: "Z", rate: 8 },
  { name: "Ariyalur", district: "Ariyalur", category: "Z", rate: 8 },
  { name: "Perambalur", district: "Perambalur", category: "Z", rate: 8 },
  { name: "Kallakurichi", district: "Kallakurichi", category: "Z", rate: 8 },
  { name: "Tiruvannamalai", district: "Tiruvannamalai", category: "Z", rate: 8 },
  { name: "Ranipet", district: "Ranipet", category: "Z", rate: 8 },
  { name: "Tirupattur", district: "Tirupattur", category: "Z", rate: 8 },
  { name: "Chengalpattu", district: "Chengalpattu", category: "Z", rate: 8 },
  { name: "Tiruvallur", district: "Tiruvallur", category: "Z", rate: 8 },
  { name: "Tenkasi", district: "Tenkasi", category: "Z", rate: 8 },
  { name: "Mayiladuthurai", district: "Mayiladuthurai", category: "Z", rate: 8 },
  { name: "The Nilgiris (Ooty)", district: "The Nilgiris", category: "Z", rate: 8 },
];

export default function HRACityCategoryPage() {
  const [basicPay, setBasicPay] = useState<number>(56100);
  const [searchCity, setSearchCity] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState(tnCities[0]);

  const filteredCities = useMemo(() => {
    if (!searchCity) return tnCities;
    const search = searchCity.toLowerCase();
    return tnCities.filter(
      city => city.name.toLowerCase().includes(search) || city.district.toLowerCase().includes(search)
    );
  }, [searchCity]);

  const calculations = useMemo(() => {
    const hraAmount = Math.round(basicPay * selectedCity.rate / 100);
    return {
      hraAmount,
      monthlyHRA: hraAmount,
      yearlyHRA: hraAmount * 12,
    };
  }, [basicPay, selectedCity]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Building2 className="text-indigo-600" size={28} />
            HRA by City Category
          </h1>
          <p className="text-sm text-gray-500 tamil">நகர வகை படி வீட்டு வாடகை படி</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-indigo-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-indigo-800 font-medium">House Rent Allowance (HRA)</p>
            <p className="text-sm text-indigo-700 mt-1">
              HRA is based on city classification. Chennai is Category X (24%),
              major cities are Y (16%), and all other places are Z (8%) of Basic Pay.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            Calculate HRA
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Basic Pay (₹)
              </label>
              <input
                type="number"
                value={basicPay}
                onChange={(e) => setBasicPay(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search City/District
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Type city or district name..."
                  className="w-full border rounded-lg p-3 pl-10 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* City List */}
            <div className="max-h-64 overflow-y-auto border rounded-lg">
              {filteredCities.map((city) => (
                <div
                  key={city.name}
                  onClick={() => setSelectedCity(city)}
                  className={`p-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-50 ${
                    selectedCity.name === city.name ? "bg-indigo-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="font-medium">{city.name}</span>
                      <span className="text-xs text-gray-500">({city.district})</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      city.category === "X" ? "bg-purple-100 text-purple-700" :
                      city.category === "Y" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {city.category} - {city.rate}%
                    </span>
                  </div>
                </div>
              ))}
              {filteredCities.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  City not found. Other places fall under Category Z (8%)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* HRA Amount */}
          <div className={`rounded-xl p-6 text-white ${
            selectedCity.category === "X" ? "bg-gradient-to-r from-purple-500 to-purple-600" :
            selectedCity.category === "Y" ? "bg-gradient-to-r from-blue-500 to-blue-600" :
            "bg-gradient-to-r from-gray-500 to-gray-600"
          }`}>
            <p className="text-white/80 text-sm">Monthly HRA</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(calculations.hraAmount)}</p>
            <p className="text-white/80 text-sm mt-2">
              Category {selectedCity.category} @ {selectedCity.rate}% of Basic
            </p>
          </div>

          {/* Selected City Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Selected Location</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">City</span>
                <span className="font-bold">{selectedCity.name}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">District</span>
                <span className="font-medium">{selectedCity.district}</span>
              </div>
              <div className="flex justify-between p-3 bg-indigo-50 rounded-lg">
                <span className="text-gray-700 font-medium">Category</span>
                <span className="font-bold text-indigo-600">{selectedCity.category}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">HRA Rate</span>
                <span className="font-medium">{selectedCity.rate}% of Basic Pay</span>
              </div>
            </div>
          </div>

          {/* Yearly Calculation */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">HRA Calculation</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Basic Pay</span>
                <span className="font-medium">{formatCurrency(basicPay)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">HRA Rate</span>
                <span className="font-medium">{selectedCity.rate}%</span>
              </div>
              <div className="flex justify-between p-3 bg-indigo-50 rounded-lg">
                <span className="text-gray-700 font-medium">Monthly HRA</span>
                <span className="font-bold text-indigo-600">{formatCurrency(calculations.monthlyHRA)}</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Yearly HRA</span>
                <span className="font-bold text-green-600">{formatCurrency(calculations.yearlyHRA)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Reference */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-tn-text mb-4">HRA Category Reference</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {hraRates.map((cat) => (
            <div key={cat.category} className={`p-4 rounded-lg ${
              cat.category === "X" ? "bg-purple-50 border-purple-200" :
              cat.category === "Y" ? "bg-blue-50 border-blue-200" :
              "bg-gray-50 border-gray-200"
            } border`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl font-bold ${
                  cat.category === "X" ? "text-purple-600" :
                  cat.category === "Y" ? "text-blue-600" :
                  "text-gray-600"
                }`}>Category {cat.category}</span>
                <span className="text-xl font-bold">{cat.rate}%</span>
              </div>
              <p className="text-sm text-gray-600">{cat.cities.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          HRA Rules
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Eligibility:</p>
            <ul className="space-y-1">
              <li>• Not eligible if govt quarters allotted</li>
              <li>• Based on place of posting</li>
              <li>• Payable from joining date</li>
              <li>• Changes with transfer</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Important Notes:</p>
            <ul className="space-y-1">
              <li>• Rate based on 7th Pay Commission</li>
              <li>• Calculated on Basic Pay only</li>
              <li>• Subject to rent paid (for IT)</li>
              <li>• May vary with future revisions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/salary-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Salary Calculator
        </Link>
        <Link href="/tools/transfer-rules" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Transfer Rules
        </Link>
      </div>
    </div>
  );
}
