"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Info, HelpCircle } from "lucide-react";

const salaryComponents = [
  {
    category: "Earnings",
    items: [
      {
        code: "BASIC",
        name: "Basic Pay",
        nameTamil: "அடிப்படை ஊதியம்",
        description: "Your base salary as per pay matrix level and index. This is the foundation for calculating most other components.",
        taxable: true,
      },
      {
        code: "DA",
        name: "Dearness Allowance",
        nameTamil: "அகவிலைப்படி",
        description: "Inflation adjustment allowance. Currently 55% of Basic Pay. Revised twice a year (Jan & July).",
        taxable: true,
      },
      {
        code: "HRA",
        name: "House Rent Allowance",
        nameTamil: "வீட்டு வாடகைப்படி",
        description: "Allowance for housing. X cities: 24%, Y cities: 16%, Z areas: 8% of Basic Pay. Partially exempt from tax.",
        taxable: "Partial",
      },
      {
        code: "CCA",
        name: "City Compensatory Allowance",
        nameTamil: "நகர ஈட்டுப்படி",
        description: "Compensation for higher living costs in cities. X: ₹600, Y: ₹300, Z: Nil.",
        taxable: true,
      },
      {
        code: "MA",
        name: "Medical Allowance",
        nameTamil: "மருத்துவப்படி",
        description: "Fixed monthly medical allowance. Usually ₹350/month.",
        taxable: true,
      },
      {
        code: "CONV",
        name: "Conveyance Allowance",
        nameTamil: "பயணப்படி",
        description: "Travel allowance for commuting. Varies by designation, typically ₹400-800/month.",
        taxable: true,
      },
      {
        code: "PP",
        name: "Personal Pay",
        nameTamil: "தனிப்பட்ட ஊதியம்",
        description: "Protection of pay during pay revision or transfer. Given to prevent loss of pay.",
        taxable: true,
      },
      {
        code: "SP",
        name: "Special Pay",
        nameTamil: "சிறப்பு ஊதியம்",
        description: "Additional pay for special responsibilities or difficult postings.",
        taxable: true,
      },
    ],
  },
  {
    category: "Deductions",
    items: [
      {
        code: "GPF",
        name: "General Provident Fund",
        nameTamil: "பொது வருங்கால வைப்பு நிதி",
        description: "Your retirement savings. Minimum 6% of Basic Pay, you can increase up to 100%. Earns 7.1% interest. Tax-free withdrawal.",
        taxable: "80C Deduction",
      },
      {
        code: "NPS",
        name: "National Pension System",
        nameTamil: "தேசிய ஓய்வூதிய திட்டம்",
        description: "For employees joined after 01.04.2003. 10% of (Basic+DA) by employee, 14% by government.",
        taxable: "80CCD Deduction",
      },
      {
        code: "PT",
        name: "Professional Tax",
        nameTamil: "தொழில் வரி",
        description: "State tax on profession. Maximum ₹2,500/year in Tamil Nadu. Deducted monthly.",
        taxable: "Deductible",
      },
      {
        code: "IT",
        name: "Income Tax (TDS)",
        nameTamil: "வருமான வரி",
        description: "Tax Deducted at Source based on your declared investments and regime (Old/New).",
        taxable: "N/A",
      },
      {
        code: "NHIS",
        name: "New Health Insurance Scheme",
        nameTamil: "புதிய சுகாதார காப்பீட்டு திட்டம்",
        description: "Government health insurance. ₹150/month for employee + family coverage.",
        taxable: "No",
      },
      {
        code: "GIS",
        name: "Group Insurance Scheme",
        nameTamil: "குழு காப்பீட்டு திட்டம்",
        description: "Life insurance with savings. Premium varies by pay level. Lump sum on retirement/death.",
        taxable: "80C Deduction",
      },
      {
        code: "PLI",
        name: "Postal Life Insurance",
        nameTamil: "அஞ்சல் ஆயுள் காப்பீடு",
        description: "Optional life insurance through postal department. Premium as per policy.",
        taxable: "80C Deduction",
      },
      {
        code: "HBA",
        name: "House Building Advance",
        nameTamil: "வீட்டுக்கடன் தவணை",
        description: "EMI for government house building loan. Recovered monthly from salary.",
        taxable: "No",
      },
      {
        code: "VEH",
        name: "Vehicle Advance",
        nameTamil: "வாகனக்கடன் தவணை",
        description: "EMI for car/two-wheeler advance from government. Recovered monthly.",
        taxable: "No",
      },
      {
        code: "FEST",
        name: "Festival Advance",
        nameTamil: "பண்டிகை முன்பணம்",
        description: "Recovery of festival advance (Diwali/Pongal). Usually ₹1,000/month for 10 months.",
        taxable: "No",
      },
      {
        code: "REC",
        name: "Other Recovery",
        nameTamil: "பிற பிடித்தம்",
        description: "Any other recoveries like GPF loan, court attachment, etc.",
        taxable: "Varies",
      },
    ],
  },
];

export default function PaySlipDecoderPage() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <FileText className="text-blue-600" size={28} />
            Pay Slip Decoder
          </h1>
          <p className="text-sm text-gray-500 tamil">சம்பள சீட்டு விளக்கம்</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Understanding Your Pay Slip:</strong> Click on any component below to see detailed explanation.
          This guide helps you understand each earning and deduction in your monthly salary statement.
        </p>
      </div>

      {/* Components */}
      {salaryComponents.map((section) => (
        <div key={section.category} className="mb-8">
          <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
            section.category === "Earnings" ? "text-green-700" : "text-red-700"
          }`}>
            <span className={`w-3 h-3 rounded-full ${
              section.category === "Earnings" ? "bg-green-500" : "bg-red-500"
            }`}></span>
            {section.category}
            <span className="text-sm font-normal text-gray-500">({section.items.length} items)</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-3">
            {section.items.map((item) => (
              <div
                key={item.code}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedComponent === item.code ? "ring-2 ring-blue-500 shadow-md" : ""
                }`}
                onClick={() => setSelectedComponent(selectedComponent === item.code ? null : item.code)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                        section.category === "Earnings"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {item.code}
                      </span>
                      <h3 className="font-medium text-tn-text">{item.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500 tamil mt-1">{item.nameTamil}</p>
                  </div>
                  <HelpCircle size={16} className="text-gray-400" />
                </div>

                {selectedComponent === item.code && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-700">{item.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Tax Status:</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        item.taxable === true ? "bg-amber-100 text-amber-700" :
                        item.taxable === false || item.taxable === "No" ? "bg-green-100 text-green-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {item.taxable === true ? "Taxable" :
                         item.taxable === false || item.taxable === "No" ? "Not Taxable" :
                         String(item.taxable)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Sample Pay Slip Structure */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
          <Info size={18} />
          Sample Pay Slip Structure
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-medium text-green-700 mb-2">Gross Earnings</p>
            <div className="space-y-1 text-gray-600">
              <p>Basic Pay + DA + HRA + CCA + MA + Conveyance + Other Allowances</p>
            </div>
          </div>
          <div>
            <p className="font-medium text-red-700 mb-2">Total Deductions</p>
            <div className="space-y-1 text-gray-600">
              <p>GPF/NPS + PT + IT + NHIS + GIS + Loan Recoveries + Others</p>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded-lg text-center">
          <p className="text-sm text-blue-800">
            <strong>Net Salary = Gross Earnings - Total Deductions</strong>
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 rounded-xl p-6">
        <h3 className="font-semibold text-amber-800 mb-3">Important Tips</h3>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Always verify your GPF/NPS contribution matches your intended percentage</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Check if DA rate is updated after government announcements (Jan/July)</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Keep track of loan recoveries and their remaining balance</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Submit investment proofs timely to avoid higher TDS deduction</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Download pay slips from IFHRMS/Paymanager portal for records</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/salary-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Salary Calculator
        </Link>
        <Link href="/tools/income-tax-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Income Tax Calculator
        </Link>
        <Link href="/tools/gpf-interest-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          GPF Calculator
        </Link>
      </div>
    </div>
  );
}
