"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, BookOpen, GraduationCap, Award } from "lucide-react";
import { useState } from "react";

interface Exam {
  id: string;
  name: string;
  nameTamil: string;
  type: "school" | "recruitment" | "competitive";
  dates: string;
  resultDate?: string;
  status: "upcoming" | "ongoing" | "completed";
  description: string;
  website?: string;
}

const exams: Exam[] = [
  // School Exams 2025
  {
    id: "sslc-2025",
    name: "SSLC Public Exam 2025",
    nameTamil: "பத்தாம் வகுப்பு பொதுத்தேர்வு",
    type: "school",
    dates: "March 28 - April 15, 2025",
    resultDate: "May 2025",
    status: "upcoming",
    description: "Tamil Nadu 10th Standard Public Examination",
  },
  {
    id: "hsc-2025",
    name: "HSC Public Exam 2025",
    nameTamil: "பன்னிரண்டாம் வகுப்பு பொதுத்தேர்வு",
    type: "school",
    dates: "March 1 - March 22, 2025",
    resultDate: "May 2025",
    status: "upcoming",
    description: "Tamil Nadu 12th Standard Public Examination",
  },
  {
    id: "quarterly-2024",
    name: "Quarterly Exam 2024-25",
    nameTamil: "காலாண்டு தேர்வு",
    type: "school",
    dates: "August 2024",
    status: "completed",
    description: "First term quarterly examination for all classes",
  },
  {
    id: "halfyearly-2024",
    name: "Half Yearly Exam 2024-25",
    nameTamil: "அரையாண்டு தேர்வு",
    type: "school",
    dates: "December 2024",
    status: "completed",
    description: "Half yearly examination for all classes",
  },
  // Teacher Recruitment Exams
  {
    id: "tet-2025",
    name: "TN TET 2025",
    nameTamil: "ஆசிரியர் தகுதி தேர்வு",
    type: "recruitment",
    dates: "Expected: June 2025",
    status: "upcoming",
    description: "Tamil Nadu Teacher Eligibility Test for Paper I & II",
    website: "https://trb.tn.gov.in",
  },
  {
    id: "trb-pg-2025",
    name: "TRB PG Assistant 2025",
    nameTamil: "முதுகலை ஆசிரியர் தேர்வு",
    type: "recruitment",
    dates: "Expected: July 2025",
    status: "upcoming",
    description: "Recruitment of PG Assistants for Government Schools",
    website: "https://trb.tn.gov.in",
  },
  {
    id: "trb-bt-2025",
    name: "TRB BT Assistant 2025",
    nameTamil: "இளங்கலை ஆசிரியர் தேர்வு",
    type: "recruitment",
    dates: "Expected: August 2025",
    status: "upcoming",
    description: "Recruitment of BT Assistants for Government Schools",
    website: "https://trb.tn.gov.in",
  },
  {
    id: "trb-poly-2025",
    name: "TRB Polytechnic Lecturer 2025",
    nameTamil: "பாலிடெக்னிக் விரிவுரையாளர்",
    type: "recruitment",
    dates: "Expected: 2025",
    status: "upcoming",
    description: "Recruitment of Lecturers for Government Polytechnics",
    website: "https://trb.tn.gov.in",
  },
  // Competitive Exams
  {
    id: "tnpsc-group1-2025",
    name: "TNPSC Group 1 2025",
    nameTamil: "குரூப் 1 தேர்வு",
    type: "competitive",
    dates: "Prelims: Expected March 2025",
    status: "upcoming",
    description: "Tamil Nadu Public Service Commission Group 1 Exam",
    website: "https://tnpsc.gov.in",
  },
  {
    id: "tnpsc-group2-2025",
    name: "TNPSC Group 2 2025",
    nameTamil: "குரூப் 2 தேர்வு",
    type: "competitive",
    dates: "Expected: 2025",
    status: "upcoming",
    description: "TNPSC Group 2 & 2A Combined Examination",
    website: "https://tnpsc.gov.in",
  },
  {
    id: "tnpsc-group4-2024",
    name: "TNPSC Group 4 2024",
    nameTamil: "குரூப் 4 தேர்வு",
    type: "competitive",
    dates: "December 2024",
    status: "completed",
    description: "TNPSC Group 4 Combined Civil Services Examination",
    website: "https://tnpsc.gov.in",
  },
];

const examTypes = [
  { value: "all", label: "All Exams", icon: Calendar },
  { value: "school", label: "School Exams", icon: BookOpen },
  { value: "recruitment", label: "Recruitment", icon: GraduationCap },
  { value: "competitive", label: "Competitive", icon: Award },
];

export default function ExamsPage() {
  const [selectedType, setSelectedType] = useState("all");

  const filteredExams = exams.filter(
    (exam) => selectedType === "all" || exam.type === selectedType
  );

  const upcomingExams = filteredExams.filter((e) => e.status === "upcoming");
  const ongoingExams = filteredExams.filter((e) => e.status === "ongoing");
  const completedExams = filteredExams.filter((e) => e.status === "completed");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "school":
        return <BookOpen size={16} className="text-purple-500" />;
      case "recruitment":
        return <GraduationCap size={16} className="text-blue-500" />;
      case "competitive":
        return <Award size={16} className="text-orange-500" />;
      default:
        return <Calendar size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Calendar className="text-red-600" size={28} />
            Exam Calendar 2025
          </h1>
          <p className="text-sm text-gray-500 tamil">தேர்வு அட்டவணை 2025</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {examTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === type.value
                  ? "bg-tn-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon size={16} />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Exam dates are tentative and subject to change. Always verify
          with official sources before making plans.
        </p>
      </div>

      {/* Upcoming Exams */}
      {upcomingExams.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-tn-text mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            Upcoming Exams
          </h2>
          <div className="grid gap-4">
            {upcomingExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(exam.type)}
                      <h3 className="font-medium text-tn-text">{exam.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                        Upcoming
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 tamil mb-2">{exam.nameTamil}</p>
                    <p className="text-sm text-gray-600 mb-2">{exam.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-blue-600">
                        <Clock size={14} />
                        {exam.dates}
                      </span>
                      {exam.resultDate && (
                        <span className="text-gray-500">Result: {exam.resultDate}</span>
                      )}
                    </div>
                  </div>
                  {exam.website && (
                    <a
                      href={exam.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-tn-primary hover:underline whitespace-nowrap"
                    >
                      Official Site
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ongoing Exams */}
      {ongoingExams.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-tn-text mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-green-500 rounded-full"></span>
            Ongoing Exams
          </h2>
          <div className="grid gap-4">
            {ongoingExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-green-50 rounded-xl border border-green-200 p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  {getTypeIcon(exam.type)}
                  <h3 className="font-medium text-tn-text">{exam.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                    Ongoing
                  </span>
                </div>
                <p className="text-sm text-gray-600">{exam.dates}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Exams */}
      {completedExams.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-600 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gray-400 rounded-full"></span>
            Completed Exams
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {completedExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-gray-50 rounded-xl border p-4 opacity-75"
              >
                <div className="flex items-center gap-2 mb-1">
                  {getTypeIcon(exam.type)}
                  <h3 className="font-medium text-gray-700">{exam.name}</h3>
                </div>
                <p className="text-xs text-gray-500 tamil">{exam.nameTamil}</p>
                <p className="text-sm text-gray-500 mt-1">{exam.dates}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-blue-50 rounded-xl p-6 mt-8">
        <h3 className="font-semibold text-blue-800 mb-4">Official Exam Portals</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://dge.tn.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <p className="font-medium text-tn-text">DGE Tamil Nadu</p>
            <p className="text-sm text-gray-500">SSLC & HSC Results</p>
          </a>
          <a
            href="https://trb.tn.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <p className="font-medium text-tn-text">TRB Tamil Nadu</p>
            <p className="text-sm text-gray-500">Teacher Recruitment</p>
          </a>
          <a
            href="https://tnpsc.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <p className="font-medium text-tn-text">TNPSC</p>
            <p className="text-sm text-gray-500">Group Exams</p>
          </a>
        </div>
      </div>
    </div>
  );
}
