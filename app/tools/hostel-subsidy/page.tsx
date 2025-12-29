"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Home, Calculator, Info, Printer, CheckCircle } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const hostelRates = [
  { id: "primary", level: "Primary (1-5)", subsidy: 500, boarding: 1000, total: 1500 },
  { id: "middle", level: "Middle School (6-8)", subsidy: 750, boarding: 1250, total: 2000 },
  { id: "high", level: "High School (9-10)", subsidy: 1000, boarding: 1500, total: 2500 },
  { id: "hsc", level: "Higher Secondary (11-12)", subsidy: 1250, boarding: 1750, total: 3000 },
  { id: "degree", level: "Degree/Diploma", subsidy: 2000, boarding: 2500, total: 4500 },
  { id: "pg", level: "Post Graduate", subsidy: 2500, boarding: 3000, total: 5500 },
  { id: "professional", level: "Professional (Engg/Medical)", subsidy: 4000, boarding: 5000, total: 9000 },
];

const eligibilityCriteria = [
  { criteria: "Child studying in recognized institution", required: true },
  { criteria: "Hostel attached to institution or approved", required: true },
  { criteria: "Distance from residence > 8 km", required: true },
  { criteria: "Maximum 2 children eligible", required: true },
  { criteria: "Child age below 25 years", required: true },
  { criteria: "Not availing similar allowance from spouse", required: true },
];

const requiredDocuments = [
  "Hostel admission receipt",
  "Bonafide certificate from institution",
  "Hostel fee receipt",
  "Declaration regarding children",
  "Distance certificate (if required)",
  "No-benefit certificate from spouse's employer",
];

export default function HostelSubsidyPage() {
  const [numChildren, setNumChildren] = useState<number>(1);
  const [children, setChildren] = useState([
    { name: "Child 1", level: "degree" },
  ]);

  const updateChild = (index: number, field: string, value: string) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  const addChild = () => {
    if (children.length < 2) {
      setChildren([...children, { name: `Child ${children.length + 1}`, level: "high" }]);
    }
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const calculations = useMemo(() => {
    let totalMonthly = 0;
    const childDetails = children.map((child) => {
      const rateData = hostelRates.find((r) => r.id === child.level) || hostelRates[0];
      totalMonthly += rateData.total;
      return {
        ...child,
        levelName: rateData.level,
        subsidy: rateData.subsidy,
        boarding: rateData.boarding,
        total: rateData.total,
      };
    });

    return {
      childDetails,
      totalMonthly,
      totalYearly: totalMonthly * 12,
    };
  }, [children]);

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
              <Home className="text-cyan-600" size={28} />
              Hostel Subsidy Guide
            </h1>
            <p className="text-sm text-gray-500 tamil">விடுதி மானியம் வழிகாட்டி</p>
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

      {/* Info Banner */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-cyan-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-cyan-800 font-medium">Hostel Subsidy for Government Employees</p>
            <p className="text-sm text-cyan-700 mt-1">
              Additional allowance for children staying in hostel while studying.
              Includes hostel subsidy and boarding charges. Maximum 2 children eligible.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-tn-text flex items-center gap-2">
              <Calculator size={18} />
              Children in Hostel
            </h2>
            {children.length < 2 && (
              <button
                onClick={addChild}
                className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded hover:bg-cyan-200"
              >
                + Add Child
              </button>
            )}
          </div>

          <div className="space-y-4">
            {children.map((child, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={child.name}
                    onChange={(e) => updateChild(index, "name", e.target.value)}
                    className="font-medium bg-transparent border-b border-gray-300 focus:border-cyan-500 focus:outline-none"
                  />
                  {children.length > 1 && (
                    <button
                      onClick={() => removeChild(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Education Level</label>
                  <select
                    value={child.level}
                    onChange={(e) => updateChild(index, "level", e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-cyan-500"
                  >
                    {hostelRates.map((rate) => (
                      <option key={rate.id} value={rate.id}>
                        {rate.level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Rates Table */}
          <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
            <h3 className="font-medium text-cyan-800 mb-2">Hostel Subsidy Rates (per month)</h3>
            <div className="text-xs space-y-1 max-h-48 overflow-y-auto">
              <div className="flex justify-between font-medium text-gray-700 border-b pb-1">
                <span>Level</span>
                <span>Subsidy + Boarding = Total</span>
              </div>
              {hostelRates.map((rate) => (
                <div key={rate.id} className="flex justify-between">
                  <span>{rate.level}</span>
                  <span>₹{rate.subsidy} + ₹{rate.boarding} = ₹{rate.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Total */}
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-6 text-white">
            <p className="text-white/80 text-sm">Total Monthly Hostel Allowance</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(calculations.totalMonthly)}</p>
            <p className="text-white/80 text-sm mt-2">
              Yearly: {formatCurrency(calculations.totalYearly)}
            </p>
          </div>

          {/* Child-wise Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Child-wise Breakdown</h3>
            <div className="space-y-3">
              {calculations.childDetails.map((child, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{child.name}</span>
                    <span className="font-bold text-cyan-600">{formatCurrency(child.total)}/mo</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="block">{child.levelName}</span>
                    <span>Subsidy: ₹{child.subsidy} + Boarding: ₹{child.boarding}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Checklist */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Eligibility Criteria</h3>
            <div className="space-y-2">
              {eligibilityCriteria.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item.criteria}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Required Documents */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-tn-text mb-4">Required Documents</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {requiredDocuments.map((doc, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="w-6 h-6 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center text-xs font-medium">
                {i + 1}
              </span>
              <span className="text-sm">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Important Rules
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Claiming Process:</p>
            <ul className="space-y-1">
              <li>• Submit application to DDO</li>
              <li>• Attach all required documents</li>
              <li>• Claim annually or semester-wise</li>
              <li>• Reimbursement after verification</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Key Points:</p>
            <ul className="space-y-1">
              <li>• In addition to Children Education Allowance</li>
              <li>• Only for children staying in hostel</li>
              <li>• Hostel must be attached/recognized</li>
              <li>• Not payable during vacation periods</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/children-education-allowance" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Children Education Allowance
        </Link>
        <Link href="/tools/salary-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Salary Calculator
        </Link>
      </div>
    </div>
  );
}
