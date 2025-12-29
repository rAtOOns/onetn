"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Calculator, Info, Printer, CheckCircle } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const educationLevels = [
  { id: "primary", name: "Primary (1-5)", allowance: 250, hostel: 500 },
  { id: "middle", name: "Middle (6-8)", allowance: 500, hostel: 750 },
  { id: "high", name: "High School (9-10)", allowance: 750, hostel: 1000 },
  { id: "hsc", name: "Higher Secondary (11-12)", allowance: 1000, hostel: 1250 },
  { id: "degree", name: "Degree/Diploma", allowance: 1500, hostel: 2000 },
  { id: "pg", name: "Post Graduate", allowance: 2000, hostel: 2500 },
  { id: "professional", name: "Professional (Engg/Medical)", allowance: 3000, hostel: 4000 },
];

const reimbursementItems = [
  { item: "Tuition Fee", reimbursable: true, limit: "As per GO" },
  { item: "Admission Fee", reimbursable: true, limit: "Once per year" },
  { item: "Laboratory Fee", reimbursable: true, limit: "Actual" },
  { item: "Library Fee", reimbursable: true, limit: "Actual" },
  { item: "Games/Sports Fee", reimbursable: true, limit: "Actual" },
  { item: "Examination Fee", reimbursable: true, limit: "Actual" },
  { item: "Development Fee", reimbursable: false, limit: "Not covered" },
  { item: "Donation/Capitation", reimbursable: false, limit: "Not covered" },
  { item: "Transport Fee", reimbursable: false, limit: "Not covered" },
  { item: "Uniform/Books", reimbursable: false, limit: "Not covered" },
];

export default function ChildrenEducationAllowancePage() {
  const [numChildren, setNumChildren] = useState<number>(2);
  const [children, setChildren] = useState([
    { name: "Child 1", level: "high", inHostel: false },
    { name: "Child 2", level: "middle", inHostel: false },
  ]);

  const updateChild = (index: number, field: string, value: string | boolean) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  const addChild = () => {
    if (children.length < 4) {
      setChildren([...children, { name: `Child ${children.length + 1}`, level: "primary", inHostel: false }]);
    }
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const calculations = useMemo(() => {
    let totalMonthly = 0;
    const childDetails = children.map(child => {
      const levelData = educationLevels.find(l => l.id === child.level) || educationLevels[0];
      const monthly = child.inHostel ? levelData.hostel : levelData.allowance;
      totalMonthly += monthly;
      return {
        ...child,
        levelName: levelData.name,
        monthly,
        yearly: monthly * 12,
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
              <GraduationCap className="text-green-600" size={28} />
              Children Education Allowance
            </h1>
            <p className="text-sm text-gray-500 tamil">குழந்தைகள் கல்வி படி</p>
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
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-green-800 font-medium">Children Education Allowance (CEA)</p>
            <p className="text-sm text-green-700 mt-1">
              Monthly allowance for education of children. Maximum 2 children eligible (3rd child born before policy).
              Additional hostel subsidy if child stays in hostel.
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
              Children Details
            </h2>
            {children.length < 4 && (
              <button
                onClick={addChild}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
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
                    className="font-medium bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none"
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Education Level</label>
                    <select
                      value={child.level}
                      onChange={(e) => updateChild(index, "level", e.target.value)}
                      className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500"
                    >
                      {educationLevels.map((level) => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 p-2 bg-white rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={child.inHostel}
                        onChange={(e) => updateChild(index, "inHostel", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">In Hostel</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Allowance Rates */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Allowance Rates (per month)</h3>
            <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
              {educationLevels.map((level) => (
                <div key={level.id} className="flex justify-between">
                  <span>{level.name}</span>
                  <span>₹{level.allowance} / ₹{level.hostel} (Hostel)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Total */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <p className="text-white/80 text-sm">Total Monthly Allowance</p>
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
                <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{child.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({child.levelName}{child.inHostel ? " + Hostel" : ""})
                    </span>
                  </div>
                  <span className="font-medium text-green-600">{formatCurrency(child.monthly)}/mo</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reimbursable Items */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Tuition Fee Reimbursement</h3>
            <div className="space-y-2">
              {reimbursementItems.map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                  item.reimbursable ? "bg-green-50" : "bg-gray-50"
                }`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className={item.reimbursable ? "text-green-600" : "text-gray-400"} />
                    <span>{item.item}</span>
                  </div>
                  <span className={`text-xs ${item.reimbursable ? "text-green-600" : "text-gray-500"}`}>
                    {item.limit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Eligibility & Rules
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Eligibility:</p>
            <ul className="space-y-1">
              <li>• Maximum 2 children eligible</li>
              <li>• Child must be studying in recognized school</li>
              <li>• Age limit: Up to 25 years</li>
              <li>• Both parents govt employees - one can claim</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">How to Claim:</p>
            <ul className="space-y-1">
              <li>• Submit fee receipts to DDO</li>
              <li>• Claim annually or half-yearly</li>
              <li>• Bonafide certificate from school</li>
              <li>• Declaration of children details</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/salary-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Salary Calculator
        </Link>
        <Link href="/tools/income-tax-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Income Tax Calculator
        </Link>
      </div>
    </div>
  );
}
