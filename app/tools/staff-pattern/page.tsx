"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Calculator, Info, Printer, AlertTriangle, CheckCircle } from "lucide-react";

// Staff pattern norms for different school types
const schoolTypes = [
  { id: "ps", name: "Primary School (1-5)", minStudents: 40, maxStudents: 150 },
  { id: "ms", name: "Middle School (1-8)", minStudents: 80, maxStudents: 300 },
  { id: "hs", name: "High School (6-10)", minStudents: 150, maxStudents: 600 },
  { id: "hss", name: "Higher Secondary (6-12)", minStudents: 200, maxStudents: 1000 },
];

const staffNorms = {
  ps: {
    headmaster: { min: 0, ratio: 0, fixed: 0 },
    teachers: { min: 2, ratio: 40, fixed: 0 },
    pet: { min: 0, ratio: 0, fixed: 0 },
    lab: { min: 0, ratio: 0, fixed: 0 },
  },
  ms: {
    headmaster: { min: 1, ratio: 0, fixed: 1 },
    teachers: { min: 4, ratio: 35, fixed: 0 },
    pet: { min: 1, ratio: 0, fixed: 1 },
    lab: { min: 0, ratio: 0, fixed: 0 },
  },
  hs: {
    headmaster: { min: 1, ratio: 0, fixed: 1 },
    teachers: { min: 6, ratio: 30, fixed: 0 },
    pet: { min: 1, ratio: 300, fixed: 0 },
    lab: { min: 1, ratio: 0, fixed: 1 },
  },
  hss: {
    headmaster: { min: 1, ratio: 0, fixed: 1 },
    principal: { min: 1, ratio: 0, fixed: 1 },
    teachers: { min: 10, ratio: 30, fixed: 0 },
    pet: { min: 2, ratio: 250, fixed: 0 },
    lab: { min: 2, ratio: 0, fixed: 2 },
  },
};

const subjectTeachers = [
  { subject: "Tamil", shortages: true },
  { subject: "English", shortages: true },
  { subject: "Mathematics", shortages: true },
  { subject: "Science", shortages: false },
  { subject: "Social Science", shortages: false },
  { subject: "Computer Science", shortages: true },
  { subject: "Physical Education", shortages: false },
  { subject: "Commerce", shortages: false },
];

export default function StaffPatternPage() {
  const [schoolType, setSchoolType] = useState<string>("hs");
  const [totalStudents, setTotalStudents] = useState<number>(450);
  const [currentTeachers, setCurrentTeachers] = useState<number>(12);
  const [currentHM, setCurrentHM] = useState<number>(1);
  const [currentPET, setCurrentPET] = useState<number>(1);
  const [currentLab, setCurrentLab] = useState<number>(1);

  const calculations = useMemo(() => {
    const norms = staffNorms[schoolType as keyof typeof staffNorms];
    const school = schoolTypes.find((s) => s.id === schoolType)!;

    // Calculate required staff based on norms
    let requiredTeachers = norms.teachers.fixed;
    if (norms.teachers.ratio > 0) {
      requiredTeachers = Math.max(norms.teachers.min, Math.ceil(totalStudents / norms.teachers.ratio));
    } else {
      requiredTeachers = norms.teachers.min;
    }

    const requiredHM = norms.headmaster.fixed || 0;
    const requiredPrincipal = (norms as Record<string, { min: number; ratio: number; fixed: number }>).principal?.fixed || 0;

    let requiredPET = norms.pet.fixed;
    if (norms.pet.ratio > 0) {
      requiredPET = Math.max(norms.pet.min || 1, Math.ceil(totalStudents / norms.pet.ratio));
    }

    const requiredLab = norms.lab.fixed || 0;

    // Calculate shortages/surplus
    const teacherDiff = currentTeachers - requiredTeachers;
    const hmDiff = currentHM - requiredHM;
    const petDiff = currentPET - requiredPET;
    const labDiff = currentLab - requiredLab;

    // Student-teacher ratio
    const studentTeacherRatio = currentTeachers > 0 ? Math.round(totalStudents / currentTeachers) : 0;
    const idealRatio = norms.teachers.ratio || 30;

    // Status
    const hasShortage = teacherDiff < 0 || hmDiff < 0 || petDiff < 0 || labDiff < 0;
    const hasSurplus = teacherDiff > 2 || petDiff > 1;

    return {
      requiredTeachers,
      requiredHM,
      requiredPrincipal,
      requiredPET,
      requiredLab,
      teacherDiff,
      hmDiff,
      petDiff,
      labDiff,
      studentTeacherRatio,
      idealRatio,
      hasShortage,
      hasSurplus,
      totalRequired: requiredTeachers + requiredHM + requiredPrincipal + requiredPET + requiredLab,
      totalCurrent: currentTeachers + currentHM + currentPET + currentLab,
    };
  }, [schoolType, totalStudents, currentTeachers, currentHM, currentPET, currentLab]);

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
              <Users className="text-violet-600" size={28} />
              Staff Pattern Calculator
            </h1>
            <p className="text-sm text-gray-500 tamil">பணியாளர் கட்டமைப்பு கால்குலேட்டர்</p>
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
      <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-violet-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-violet-800 font-medium">Staff Pattern Norms</p>
            <p className="text-sm text-violet-700 mt-1">
              Calculate sanctioned staff strength based on student enrollment.
              Norms vary by school type and are subject to GO revisions.
            </p>
          </div>
        </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">School Type</label>
              <select
                value={schoolType}
                onChange={(e) => setSchoolType(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-violet-500"
              >
                {schoolTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
              <input
                type="number"
                value={totalStudents}
                onChange={(e) => setTotalStudents(Number(e.target.value))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-violet-500"
                min={1}
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Current Staff Strength</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Teachers</label>
                  <input
                    type="number"
                    value={currentTeachers}
                    onChange={(e) => setCurrentTeachers(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-violet-500"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">HM/Principal</label>
                  <input
                    type="number"
                    value={currentHM}
                    onChange={(e) => setCurrentHM(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-violet-500"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">PET</label>
                  <input
                    type="number"
                    value={currentPET}
                    onChange={(e) => setCurrentPET(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-violet-500"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Lab Asst</label>
                  <input
                    type="number"
                    value={currentLab}
                    onChange={(e) => setCurrentLab(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-violet-500"
                    min={0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Status */}
          <div
            className={`rounded-xl p-6 text-white ${
              calculations.hasShortage
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : calculations.hasSurplus
                ? "bg-gradient-to-r from-amber-500 to-amber-600"
                : "bg-gradient-to-r from-green-500 to-green-600"
            }`}
          >
            <p className="text-white/80 text-sm">Staff Status</p>
            <p className="text-3xl font-bold mt-1">
              {calculations.hasShortage
                ? "Shortage"
                : calculations.hasSurplus
                ? "Surplus"
                : "Adequate"}
            </p>
            <p className="text-white/80 text-sm mt-2">
              Student-Teacher Ratio: {calculations.studentTeacherRatio}:1 (Norm: {calculations.idealRatio}:1)
            </p>
          </div>

          {/* Staff Comparison */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-tn-text mb-4">Staff Requirement Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Teachers</span>
                <div className="text-right">
                  <span className="font-medium">{currentTeachers} / {calculations.requiredTeachers}</span>
                  <span
                    className={`ml-2 text-xs ${
                      calculations.teacherDiff >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ({calculations.teacherDiff >= 0 ? "+" : ""}
                    {calculations.teacherDiff})
                  </span>
                </div>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">HM/Principal</span>
                <div className="text-right">
                  <span className="font-medium">{currentHM} / {calculations.requiredHM + calculations.requiredPrincipal}</span>
                  <span
                    className={`ml-2 text-xs ${
                      calculations.hmDiff >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ({calculations.hmDiff >= 0 ? "+" : ""}
                    {calculations.hmDiff})
                  </span>
                </div>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">PET</span>
                <div className="text-right">
                  <span className="font-medium">{currentPET} / {calculations.requiredPET}</span>
                  <span
                    className={`ml-2 text-xs ${
                      calculations.petDiff >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ({calculations.petDiff >= 0 ? "+" : ""}
                    {calculations.petDiff})
                  </span>
                </div>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Lab Assistant</span>
                <div className="text-right">
                  <span className="font-medium">{currentLab} / {calculations.requiredLab}</span>
                  <span
                    className={`ml-2 text-xs ${
                      calculations.labDiff >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ({calculations.labDiff >= 0 ? "+" : ""}
                    {calculations.labDiff})
                  </span>
                </div>
              </div>
              <div className="flex justify-between p-3 bg-violet-50 rounded-lg">
                <span className="text-gray-700 font-medium">Total Staff</span>
                <span className="font-bold text-violet-600">
                  {calculations.totalCurrent} / {calculations.totalRequired}
                </span>
              </div>
            </div>
          </div>

          {/* Alert */}
          {calculations.hasShortage && (
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="text-red-600 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium text-red-800">Staff Shortage Detected</p>
                  <p className="text-sm text-red-700 mt-1">
                    Request additional staff through DEO/CEO. Shortage affects quality of education.
                  </p>
                </div>
              </div>
            </div>
          )}

          {calculations.hasSurplus && (
            <div className="bg-amber-50 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="text-amber-600 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium text-amber-800">Surplus Staff</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Staff may be redeployed to other schools based on rationalization norms.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subject-wise Shortage Info */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-tn-text mb-4">Subject-wise Teacher Availability (TN General)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {subjectTeachers.map((subject) => (
            <div
              key={subject.subject}
              className={`p-3 rounded-lg ${
                subject.shortages ? "bg-red-50" : "bg-green-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {subject.shortages ? (
                  <AlertTriangle size={14} className="text-red-600" />
                ) : (
                  <CheckCircle size={14} className="text-green-600" />
                )}
                <span className="text-sm font-medium">{subject.subject}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {subject.shortages ? "Shortage reported" : "Adequate"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Staff Pattern Norms
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">General Norms:</p>
            <ul className="space-y-1">
              <li>• Primary: 1 teacher per 40 students</li>
              <li>• Middle: 1 teacher per 35 students</li>
              <li>• High/HSS: 1 teacher per 30 students</li>
              <li>• PET: 1 per school (more for large schools)</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Rationalization:</p>
            <ul className="space-y-1">
              <li>• Staff redeployed if enrollment drops</li>
              <li>• Based on EMIS data</li>
              <li>• Annual review by DEO</li>
              <li>• Subject to policy changes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <Link href="/tools/workload-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Workload Calculator
        </Link>
        <Link href="/tools/student-strength-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Student Strength
        </Link>
      </div>
    </div>
  );
}
