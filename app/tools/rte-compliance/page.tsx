"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Scale, CheckCircle, AlertCircle, Info } from "lucide-react";

const rteCategories = [
  {
    id: "infrastructure",
    name: "Infrastructure Requirements",
    nameTamil: "உள்கட்டமைப்பு தேவைகள்",
    items: [
      { id: "building", item: "All-weather school building", critical: true },
      { id: "classroom", item: "One classroom per teacher (minimum)", critical: true },
      { id: "barrier-free", item: "Barrier-free access for disabled students", critical: true },
      { id: "drinking-water", item: "Safe drinking water facility", critical: true },
      { id: "toilets", item: "Separate toilets for boys and girls", critical: true },
      { id: "kitchen", item: "Kitchen for mid-day meal", critical: true },
      { id: "playground", item: "Playground facility", critical: false },
      { id: "boundary", item: "Boundary wall / fencing", critical: false },
      { id: "library", item: "Library with books", critical: true },
    ],
  },
  {
    id: "teachers",
    name: "Teacher Requirements",
    nameTamil: "ஆசிரியர் தேவைகள்",
    items: [
      { id: "ptr", item: "Pupil-Teacher Ratio 30:1 (Primary), 35:1 (Upper Primary)", critical: true },
      { id: "qualified", item: "All teachers possess minimum qualifications", critical: true },
      { id: "trained", item: "Teachers trained in inclusive education", critical: false },
      { id: "subject", item: "Subject teachers for Science, Math, Languages", critical: true },
      { id: "head", item: "Headmaster/Headmistress appointed", critical: true },
      { id: "vacancy", item: "No teacher vacancy more than 10%", critical: true },
    ],
  },
  {
    id: "curriculum",
    name: "Curriculum & Teaching",
    nameTamil: "பாடத்திட்டம் & கற்பித்தல்",
    items: [
      { id: "working-days", item: "Minimum 200 working days (Primary), 220 days (Upper Primary)", critical: true },
      { id: "teaching-hours", item: "Minimum 800/1000 instructional hours per year", critical: true },
      { id: "cce", item: "Continuous Comprehensive Evaluation (CCE) implemented", critical: true },
      { id: "no-detention", item: "No detention till Class 8", critical: true },
      { id: "mother-tongue", item: "Teaching in mother tongue / regional language", critical: true },
      { id: "textbooks", item: "Free textbooks to all students", critical: true },
      { id: "uniform", item: "Free uniform (2 sets) provided", critical: false },
    ],
  },
  {
    id: "admission",
    name: "Admission & Rights",
    nameTamil: "சேர்க்கை & உரிமைகள்",
    items: [
      { id: "age-proof", item: "Admission without age proof (self-declaration accepted)", critical: true },
      { id: "no-screening", item: "No screening test / interview for admission", critical: true },
      { id: "no-capitation", item: "No capitation fee collected", critical: true },
      { id: "no-tuition", item: "No private tuition by teachers", critical: true },
      { id: "no-punishment", item: "No physical punishment or mental harassment", critical: true },
      { id: "25-percent", item: "25% seats reserved for EWS/disadvantaged in private schools", critical: true },
      { id: "transfer", item: "Transfer certificate issued within 7 days", critical: false },
    ],
  },
  {
    id: "management",
    name: "School Management",
    nameTamil: "பள்ளி நிர்வாகம்",
    items: [
      { id: "smc", item: "School Management Committee (SMC) constituted", critical: true },
      { id: "sdp", item: "School Development Plan prepared", critical: true },
      { id: "recognition", item: "School has valid recognition certificate", critical: true },
      { id: "records", item: "All records maintained properly", critical: true },
      { id: "display", item: "RTE information displayed in school", critical: false },
    ],
  },
];

export default function RTECompliancePage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Calculate compliance stats
  const allItems = rteCategories.flatMap(cat => cat.items);
  const criticalItems = allItems.filter(item => item.critical);
  const totalItems = allItems.length;
  const checkedCount = checkedItems.size;
  const criticalChecked = criticalItems.filter(item => checkedItems.has(item.id)).length;
  const compliancePercent = Math.round((checkedCount / totalItems) * 100);
  const criticalPercent = Math.round((criticalChecked / criticalItems.length) * 100);

  let complianceStatus = "Non-Compliant";
  let statusColor = "red";
  if (criticalPercent === 100 && compliancePercent >= 90) {
    complianceStatus = "Fully Compliant";
    statusColor = "green";
  } else if (criticalPercent >= 80) {
    complianceStatus = "Mostly Compliant";
    statusColor = "amber";
  } else if (criticalPercent >= 50) {
    complianceStatus = "Partially Compliant";
    statusColor = "orange";
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Scale className="text-indigo-600" size={28} />
            RTE Compliance Checklist
          </h1>
          <p className="text-sm text-gray-500 tamil">RTE இணக்க சரிபார்ப்பு பட்டியல்</p>
        </div>
      </div>

      {/* Compliance Summary */}
      <div className={`bg-gradient-to-r ${
        statusColor === "green" ? "from-green-500 to-green-600" :
        statusColor === "amber" ? "from-amber-500 to-amber-600" :
        statusColor === "orange" ? "from-orange-500 to-orange-600" :
        "from-red-500 to-red-600"
      } rounded-xl p-6 text-white mb-6`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm">Compliance Status</p>
            <p className="text-3xl font-bold">{complianceStatus}</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{compliancePercent}%</p>
              <p className="text-sm text-white/80">Overall</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{criticalPercent}%</p>
              <p className="text-sm text-white/80">Critical Items</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <span>{checkedCount} / {totalItems} items completed</span>
          <span>|</span>
          <span>{criticalChecked} / {criticalItems.length} critical items</span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-indigo-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-indigo-800 font-medium">Right to Education Act 2009</p>
            <p className="text-sm text-indigo-700 mt-1">
              All schools must comply with RTE norms. Non-compliance may lead to
              withdrawal of recognition. Critical items (marked in red) are mandatory.
            </p>
          </div>
        </div>
      </div>

      {/* Checklist Categories */}
      <div className="space-y-6">
        {rteCategories.map((category) => {
          const categoryItems = category.items;
          const categoryChecked = categoryItems.filter(item => checkedItems.has(item.id)).length;
          const categoryPercent = Math.round((categoryChecked / categoryItems.length) * 100);

          return (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-tn-text">{category.name}</h2>
                  <p className="text-xs text-gray-500 tamil">{category.nameTamil}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{categoryPercent}%</span>
                  <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${categoryPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {category.items.map((item) => {
                    const isChecked = checkedItems.has(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-green-50"
                            : item.critical
                            ? "bg-red-50 hover:bg-red-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(item.id)}
                          className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={`flex-1 text-sm ${isChecked ? "line-through text-gray-500" : ""}`}>
                          {item.item}
                        </span>
                        {item.critical && !isChecked && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Mandatory</span>
                        )}
                        {isChecked && (
                          <CheckCircle size={16} className="text-green-600" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-4">
        <button
          onClick={() => setCheckedItems(new Set())}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Reset All
        </button>
        <button
          onClick={() => setCheckedItems(new Set(allItems.map(i => i.id)))}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm"
        >
          Mark All Complete
        </button>
      </div>

      {/* Penalties Info */}
      <div className="mt-8 bg-red-50 rounded-xl p-6">
        <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} />
          Non-Compliance Penalties
        </h3>
        <ul className="space-y-2 text-sm text-red-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>School running without recognition: Fine up to ₹1 lakh, additional ₹10,000/day</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Collecting capitation fee: Fine up to 10 times the fee charged</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Denying admission: Fine up to ₹25,000, additional ₹500/day</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Physical punishment: Disciplinary action as per service rules</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/student-strength-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Student Strength Calculator
        </Link>
        <Link href="/tools/document-checklists" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Document Checklists
        </Link>
        <Link href="/links" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Official Links
        </Link>
      </div>
    </div>
  );
}
