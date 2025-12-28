"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Calculator, Info, Printer, AlertCircle } from "lucide-react";

const schoolTypes = [
  { id: "primary", name: "Primary School (1-5)", minRatio: 30, maxRatio: 40 },
  { id: "middle", name: "Middle School (6-8)", minRatio: 35, maxRatio: 40 },
  { id: "high", name: "High School (9-10)", minRatio: 40, maxRatio: 45 },
  { id: "hss", name: "Higher Secondary (11-12)", minRatio: 40, maxRatio: 50 },
];

const standardNorms = {
  primary: { min: 1, perStudents: 30, minStudentsForExtra: 25 },
  middle: { min: 1, perStudents: 35, minStudentsForExtra: 25 },
  high: { min: 1, perStudents: 40, minStudentsForExtra: 30 },
  hss: { min: 1, perStudents: 40, minStudentsForExtra: 30 },
};

export default function StudentStrengthCalculatorPage() {
  const [schoolType, setSchoolType] = useState<string>("high");
  const [sections, setSections] = useState<{ class: string; students: number }[]>([
    { class: "9A", students: 42 },
    { class: "9B", students: 38 },
    { class: "10A", students: 45 },
    { class: "10B", students: 40 },
  ]);
  const [existingTeachers, setExistingTeachers] = useState<number>(8);

  const addSection = () => {
    setSections([...sections, { class: "", students: 0 }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: string, value: string | number) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const calculations = useMemo(() => {
    const norms = standardNorms[schoolType as keyof typeof standardNorms];
    const schoolInfo = schoolTypes.find(s => s.id === schoolType);

    // Total students
    const totalStudents = sections.reduce((sum, s) => sum + s.students, 0);
    const totalSections = sections.length;

    // Calculate sanctioned posts based on student strength
    // General rule: 1 teacher per 30-40 students (varies by level)
    const teachersNeeded = Math.ceil(totalStudents / norms.perStudents);

    // Additional teachers for subject-wise requirement (simplified)
    const subjectTeachers = Math.ceil(totalSections * 1.5); // Approx 1.5 teachers per section for subject coverage

    // Take higher of the two
    const sanctionedPosts = Math.max(teachersNeeded, subjectTeachers);

    // Teacher-student ratio
    const tsRatio = existingTeachers > 0 ? Math.round(totalStudents / existingTeachers) : 0;
    const idealRatio = schoolInfo?.minRatio || 35;

    // Vacancy
    const vacancy = sanctionedPosts - existingTeachers;

    // Status
    let status = "Adequate";
    let statusColor = "green";
    if (vacancy > 2) {
      status = "Critical Shortage";
      statusColor = "red";
    } else if (vacancy > 0) {
      status = "Shortage";
      statusColor = "amber";
    } else if (vacancy < -2) {
      status = "Surplus";
      statusColor = "blue";
    }

    return {
      totalStudents,
      totalSections,
      teachersNeeded,
      sanctionedPosts,
      tsRatio,
      idealRatio,
      vacancy,
      status,
      statusColor,
    };
  }, [sections, schoolType, existingTeachers]);

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
              <Users className="text-teal-600" size={28} />
              Student Strength Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">மாணவர் எண்ணிக்கை கால்குலேட்டர்</p>
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

      {/* Info */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-teal-800">
          Calculate teacher-student ratio and sanctioned posts based on student strength.
          Norms are as per RTE Act and state government guidelines.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            School Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Type
              </label>
              <select
                value={schoolType}
                onChange={(e) => setSchoolType(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
              >
                {schoolTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Existing Teachers (Working Strength)
              </label>
              <input
                type="number"
                value={existingTeachers}
                onChange={(e) => setExistingTeachers(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
                min={0}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">Section-wise Strength</p>
                <button
                  onClick={addSection}
                  className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200"
                >
                  + Add Section
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {sections.map((section, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={section.class}
                      onChange={(e) => updateSection(index, "class", e.target.value)}
                      placeholder="Class"
                      className="w-24 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="number"
                      value={section.students}
                      onChange={(e) => updateSection(index, "students", Number(e.target.value))}
                      placeholder="Students"
                      className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500"
                      min={0}
                    />
                    <button
                      onClick={() => removeSection(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Main Stats */}
          <div className={`bg-gradient-to-r ${
            calculations.statusColor === "green" ? "from-green-500 to-green-600" :
            calculations.statusColor === "red" ? "from-red-500 to-red-600" :
            calculations.statusColor === "amber" ? "from-amber-500 to-amber-600" :
            "from-blue-500 to-blue-600"
          } rounded-xl p-6 text-white`}>
            <p className="text-white/80 text-sm">Teacher-Student Ratio</p>
            <p className="text-4xl font-bold mt-1">1 : {calculations.tsRatio}</p>
            <p className="text-white/80 text-sm mt-2">
              Status: {calculations.status}
            </p>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Students</span>
                <span className="font-bold text-lg">{calculations.totalStudents}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Sections</span>
                <span className="font-medium">{calculations.totalSections}</span>
              </div>
              <div className="flex justify-between p-3 bg-teal-50 rounded-lg">
                <span className="text-gray-600">Sanctioned Posts</span>
                <span className="font-bold text-teal-600">{calculations.sanctionedPosts}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Existing Teachers</span>
                <span className="font-medium">{existingTeachers}</span>
              </div>
              <div className={`flex justify-between p-3 rounded-lg ${
                calculations.vacancy > 0 ? "bg-red-50" : calculations.vacancy < 0 ? "bg-blue-50" : "bg-green-50"
              }`}>
                <span className="text-gray-600">Vacancy / Surplus</span>
                <span className={`font-bold ${
                  calculations.vacancy > 0 ? "text-red-600" : calculations.vacancy < 0 ? "text-blue-600" : "text-green-600"
                }`}>
                  {calculations.vacancy > 0 ? `+${calculations.vacancy} Vacancy` :
                   calculations.vacancy < 0 ? `${Math.abs(calculations.vacancy)} Surplus` : "Adequate"}
                </span>
              </div>
            </div>
          </div>

          {/* Ideal Ratio */}
          <div className="bg-amber-50 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertCircle size={18} className="text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Ideal Ratio</p>
                <p className="text-sm text-amber-700">
                  Recommended: 1:{calculations.idealRatio} as per RTE norms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Norms Reference */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          RTE & State Norms
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Teacher-Student Ratio:</p>
            <ul className="space-y-1">
              <li>• Primary (1-5): 1:30</li>
              <li>• Upper Primary (6-8): 1:35</li>
              <li>• Secondary (9-10): 1:40</li>
              <li>• Higher Secondary: 1:40-50</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Minimum Teachers:</p>
            <ul className="space-y-1">
              <li>• Primary: Min 2 teachers up to 60 students</li>
              <li>• Middle: Subject teachers required</li>
              <li>• High School: PG/BT as per subject</li>
              <li>• Lab/PT teachers as per norms</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/rte-compliance" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          RTE Compliance
        </Link>
        <Link href="/tools/contact-directory" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          DEO Contacts
        </Link>
      </div>
    </div>
  );
}
