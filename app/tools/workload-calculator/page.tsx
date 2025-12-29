"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calculator, Info, AlertCircle } from "lucide-react";

const teacherCategories = [
  {
    id: "prt",
    name: "Primary Teacher (PRT)",
    nameTamil: "தொடக்கப்பள்ளி ஆசிரியர்",
    periodsPerWeek: 30,
    periodsPerDay: 6,
    minPerPeriod: 35,
    notes: "All subjects for one class",
  },
  {
    id: "bt",
    name: "BT Assistant",
    nameTamil: "பட்டதாரி ஆசிரியர்",
    periodsPerWeek: 24,
    periodsPerDay: 5,
    minPerPeriod: 40,
    notes: "Subject-wise teaching (6-10)",
  },
  {
    id: "pg",
    name: "PG Assistant",
    nameTamil: "முதுகலை ஆசிரியர்",
    periodsPerWeek: 20,
    periodsPerDay: 4,
    minPerPeriod: 45,
    notes: "Subject-wise (9-12)",
  },
  {
    id: "hm_hs",
    name: "Headmaster (High School)",
    nameTamil: "தலைமை ஆசிரியர் (உயர்நிலை)",
    periodsPerWeek: 8,
    periodsPerDay: 2,
    minPerPeriod: 40,
    notes: "Plus administrative duties",
  },
  {
    id: "hm_hss",
    name: "Principal (Hr. Sec.)",
    nameTamil: "முதல்வர்",
    periodsPerWeek: 6,
    periodsPerDay: 1,
    minPerPeriod: 45,
    notes: "Plus administrative duties",
  },
  {
    id: "pet",
    name: "Physical Education Teacher",
    nameTamil: "உடற்கல்வி ஆசிரியர்",
    periodsPerWeek: 30,
    periodsPerDay: 6,
    minPerPeriod: 35,
    notes: "PT periods + games",
  },
];

const additionalDuties = [
  { duty: "Class Teacher", hours: 2, perWeek: true },
  { duty: "Subject Coordinator", hours: 1, perWeek: true },
  { duty: "Exam Duty", hours: 10, perWeek: false, note: "During exams" },
  { duty: "Co-curricular Activities", hours: 2, perWeek: true },
  { duty: "EMIS Data Entry", hours: 2, perWeek: true },
  { duty: "MDM Supervision", hours: 1, perWeek: true },
  { duty: "Assembly Duty", hours: 1, perWeek: true },
  { duty: "Parent Meetings", hours: 2, perWeek: false, note: "Monthly" },
];

export default function WorkloadCalculatorPage() {
  const [teacherType, setTeacherType] = useState<string>("bt");
  const [actualPeriods, setActualPeriods] = useState<number>(24);
  const [additionalHours, setAdditionalHours] = useState<number>(5);

  const selectedTeacher = teacherCategories.find(t => t.id === teacherType) || teacherCategories[1];

  const calculations = useMemo(() => {
    const standardPeriods = selectedTeacher.periodsPerWeek;
    const difference = actualPeriods - standardPeriods;
    const status = difference > 2 ? "Overloaded" : difference < -2 ? "Underloaded" : "Normal";

    const teachingHours = actualPeriods * selectedTeacher.minPerPeriod / 60;
    const totalHours = teachingHours + additionalHours;

    const workingDays = 5;
    const hoursPerDay = totalHours / workingDays;

    return {
      standardPeriods,
      difference,
      status,
      teachingHours,
      totalHours,
      hoursPerDay,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualPeriods, additionalHours, selectedTeacher]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Clock className="text-blue-600" size={28} />
            Workload Calculator
          </h1>
          <p className="text-sm text-gray-500 tamil">பணிச்சுமை கால்குலேட்டர்</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-blue-800 font-medium">Teaching Workload Norms</p>
            <p className="text-sm text-blue-700 mt-1">
              Workload norms are prescribed by the education department. Different categories of teachers
              have different period requirements based on their role and subjects.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Calculator size={18} />
            Enter Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher Category
              </label>
              <select
                value={teacherType}
                onChange={(e) => {
                  setTeacherType(e.target.value);
                  const teacher = teacherCategories.find(t => t.id === e.target.value);
                  if (teacher) setActualPeriods(teacher.periodsPerWeek);
                }}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              >
                {teacherCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Periods Per Week
              </label>
              <input
                type="number"
                value={actualPeriods}
                onChange={(e) => setActualPeriods(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                min={0}
                max={40}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Duty Hours Per Week
              </label>
              <input
                type="number"
                value={additionalHours}
                onChange={(e) => setAdditionalHours(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                min={0}
                max={20}
              />
            </div>
          </div>

          {/* Standard Workload Table */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-3">Standard Workload Norms</h3>
            <div className="text-sm space-y-2 max-h-48 overflow-y-auto">
              {teacherCategories.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex justify-between items-center p-2 rounded ${
                    teacherType === cat.id ? "bg-blue-100" : ""
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="font-medium">{cat.periodsPerWeek} periods/week</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Status */}
          <div className={`rounded-xl p-6 text-white ${
            calculations.status === "Overloaded" ? "bg-gradient-to-r from-red-500 to-red-600" :
            calculations.status === "Underloaded" ? "bg-gradient-to-r from-amber-500 to-amber-600" :
            "bg-gradient-to-r from-green-500 to-green-600"
          }`}>
            <p className="text-white/80 text-sm">Workload Status</p>
            <p className="text-3xl font-bold mt-1">{calculations.status}</p>
            <p className="text-white/80 text-sm mt-2">
              {calculations.difference > 0 ? `+${calculations.difference}` : calculations.difference} periods from norm
            </p>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Workload Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Standard Periods</span>
                <span className="font-medium">{calculations.standardPeriods}/week</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Actual Periods</span>
                <span className="font-medium">{actualPeriods}/week</span>
              </div>
              <div className={`flex justify-between p-3 rounded-lg ${
                calculations.difference > 0 ? "bg-red-50" :
                calculations.difference < 0 ? "bg-amber-50" : "bg-green-50"
              }`}>
                <span className="text-gray-600">Difference</span>
                <span className={`font-medium ${
                  calculations.difference > 0 ? "text-red-600" :
                  calculations.difference < 0 ? "text-amber-600" : "text-green-600"
                }`}>
                  {calculations.difference > 0 ? "+" : ""}{calculations.difference} periods
                </span>
              </div>
            </div>
          </div>

          {/* Time Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Weekly Time Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Teaching Hours</span>
                <span className="font-medium">{calculations.teachingHours.toFixed(1)} hours</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Additional Duties</span>
                <span className="font-medium">{additionalHours} hours</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Total Work Hours</span>
                <span className="font-bold text-blue-600">{calculations.totalHours.toFixed(1)} hours/week</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Average Per Day</span>
                <span className="font-medium">{calculations.hoursPerDay.toFixed(1)} hours</span>
              </div>
            </div>
          </div>

          {/* Alert if overloaded */}
          {calculations.status === "Overloaded" && (
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="text-red-600 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium text-red-800">Workload Exceeded</p>
                  <p className="text-sm text-red-700 mt-1">
                    You may request workload reduction or additional staff through proper channel.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Duties */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-tn-text mb-4">Common Additional Duties</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {additionalDuties.map((duty, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-sm">{duty.duty}</p>
              <p className="text-xs text-gray-500">
                ~{duty.hours} hours {duty.perWeek ? "per week" : duty.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Details */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3">Selected Category Details</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p><strong>Category:</strong> {selectedTeacher.name}</p>
            <p><strong>Tamil:</strong> <span className="tamil">{selectedTeacher.nameTamil}</span></p>
            <p><strong>Standard:</strong> {selectedTeacher.periodsPerWeek} periods/week</p>
          </div>
          <div>
            <p><strong>Per Day:</strong> {selectedTeacher.periodsPerDay} periods</p>
            <p><strong>Period Duration:</strong> {selectedTeacher.minPerPeriod} minutes</p>
            <p><strong>Note:</strong> {selectedTeacher.notes}</p>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/student-strength-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Student Strength
        </Link>
        <Link href="/tools/staff-pattern" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Staff Pattern
        </Link>
      </div>
    </div>
  );
}
