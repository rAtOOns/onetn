"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Info, Train, Car, Utensils } from "lucide-react";

interface TARate {
  grade: string;
  payRange: string;
  dailyAllowance: number;
  trainClass: string;
  busClass: string;
  hotelLimit: number;
}

const taRates: TARate[] = [
  {
    grade: "Grade I",
    payRange: "₹78,800 and above",
    dailyAllowance: 600,
    trainClass: "AC First Class",
    busClass: "AC Volvo / Taxi",
    hotelLimit: 5000,
  },
  {
    grade: "Grade II",
    payRange: "₹56,100 to ₹78,799",
    dailyAllowance: 450,
    trainClass: "AC 2-Tier",
    busClass: "AC Bus / Taxi",
    hotelLimit: 3500,
  },
  {
    grade: "Grade III",
    payRange: "₹35,400 to ₹56,099",
    dailyAllowance: 350,
    trainClass: "AC 3-Tier / First Class",
    busClass: "Deluxe Bus",
    hotelLimit: 2500,
  },
  {
    grade: "Grade IV",
    payRange: "₹25,500 to ₹35,399",
    dailyAllowance: 250,
    trainClass: "Sleeper Class",
    busClass: "Express Bus",
    hotelLimit: 1500,
  },
  {
    grade: "Grade V",
    payRange: "₹19,500 to ₹25,499",
    dailyAllowance: 200,
    trainClass: "Sleeper Class",
    busClass: "Ordinary Bus",
    hotelLimit: 1000,
  },
  {
    grade: "Grade VI",
    payRange: "Below ₹19,500",
    dailyAllowance: 150,
    trainClass: "Second Class",
    busClass: "Ordinary Bus",
    hotelLimit: 750,
  },
];

const cityClassification = [
  {
    category: "X Cities (Metro)",
    cities: ["Chennai", "Mumbai", "Delhi", "Kolkata", "Bangalore", "Hyderabad"],
    hra: "24%",
    cca: "₹450",
  },
  {
    category: "Y Cities",
    cities: ["Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli", "Other District HQs"],
    hra: "16%",
    cca: "₹225",
  },
  {
    category: "Z Cities (Other)",
    cities: ["All other places"],
    hra: "8%",
    cca: "₹0",
  },
];

const mileageRates = [
  { vehicle: "Own Car", rate: "₹16 per km" },
  { vehicle: "Own Scooter/Motorcycle", rate: "₹8 per km" },
  { vehicle: "Auto-rickshaw", rate: "Actual fare" },
  { vehicle: "Taxi", rate: "As per entitlement" },
  { vehicle: "Local Bus", rate: "Actual fare" },
];

const specialAllowances = [
  { type: "Halting Allowance (Day)", description: "When journey < 8 hours", rate: "50% of DA" },
  { type: "Night Halt", description: "When stay at outstation", rate: "Full DA + Hotel" },
  { type: "Transfer TA", description: "On transfer posting", rate: "1 month Basic Pay + TA" },
  { type: "LTC (Leave Travel)", description: "Once in 2 years", rate: "As per block year" },
  { type: "Tour Advance", description: "Before official tour", rate: "75% of estimated TA" },
];

export default function TADARatesPage() {
  const [selectedGrade, setSelectedGrade] = useState<number>(2);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <MapPin className="text-orange-600" size={28} />
            TA/DA Rates
          </h1>
          <p className="text-sm text-gray-500 tamil">பயண படி / தினப்படி விகிதங்கள்</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-orange-800">
          <strong>Travel Allowance & Daily Allowance</strong> - As per TN Government Rules.
          Rates may vary. Verify with your DDO.
        </p>
      </div>

      {/* TA Rates Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Train size={18} />
            Travel Allowance by Grade
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Grade</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pay Range</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Daily Allow.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Train Class</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Hotel Limit</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {taRates.map((rate, idx) => (
                <tr
                  key={idx}
                  className={`cursor-pointer transition-colors ${
                    selectedGrade === idx ? "bg-orange-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedGrade(idx)}
                >
                  <td className="px-4 py-3 font-medium">{rate.grade}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{rate.payRange}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                      ₹{rate.dailyAllowance}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{rate.trainClass}</td>
                  <td className="px-4 py-3 text-center text-sm">₹{rate.hotelLimit}/night</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Grade Details */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h3 className="font-semibold text-tn-text mb-4">
          {taRates[selectedGrade].grade} - Entitlements
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Train className="text-blue-500" size={20} />
              <span className="font-medium">Travel Entitlement</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Train</span>
                <span className="font-medium">{taRates[selectedGrade].trainClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bus</span>
                <span className="font-medium">{taRates[selectedGrade].busClass}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="text-orange-500" size={20} />
              <span className="font-medium">Allowances</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Allowance</span>
                <span className="font-bold text-green-600">₹{taRates[selectedGrade].dailyAllowance}/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hotel Limit</span>
                <span className="font-medium">₹{taRates[selectedGrade].hotelLimit}/night</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mileage Rates */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h3 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
          <Car size={18} className="text-blue-500" />
          Mileage Allowance
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mileageRates.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
              <span className="text-sm text-gray-700">{item.vehicle}</span>
              <span className="font-medium text-blue-700">{item.rate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* City Classification */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h3 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-purple-500" />
          City Classification (HRA/CCA)
        </h3>
        <div className="space-y-4">
          {cityClassification.map((city, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-tn-text">{city.category}</span>
                <div className="flex gap-2">
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-sm">
                    HRA: {city.hra}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">
                    CCA: {city.cca}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{city.cities.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Special Allowances */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h3 className="font-semibold text-tn-text mb-4">Special Allowances</h3>
        <div className="space-y-3">
          {specialAllowances.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-tn-text">{item.type}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium">
                {item.rate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Important Notes
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>DA Calculation:</strong> Daily Allowance covers food and incidental expenses during tour.</p>
          <p><strong>TA Bill:</strong> Must be submitted within 15 days of completing tour.</p>
          <p><strong>Advance:</strong> Tour advance up to 75% can be drawn before tour.</p>
          <p><strong>Local Conveyance:</strong> Actuals or fixed monthly conveyance as applicable.</p>
          <p><strong>Air Travel:</strong> For Grade I officers, with prior approval for distances &gt;500 km.</p>
        </div>
      </div>
    </div>
  );
}
