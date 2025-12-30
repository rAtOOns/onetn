"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, BookOpen, GraduationCap, Award, ExternalLink } from "lucide-react";
import { useState } from "react";
import PageContainer from "@/components/ui/page-container";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <PageContainer padding="lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-tn-primary" />
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-tn-text flex items-center gap-3">
            <Calendar className="text-tn-primary" size={32} />
            Exam Calendar 2025
          </h1>
          <p className="text-sm text-gray-500 tamil">தேர்வு அட்டவணை 2025</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {examTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              variant={selectedType === type.value ? "primary" : "outline"}
              size="md"
              icon={<Icon size={16} />}
            >
              {type.label}
            </Button>
          );
        })}
      </div>

      {/* Disclaimer */}
      <Card category="exam" className="mb-8">
        <CardContent>
          <p className="text-sm text-gray-700">
            <strong className="text-tn-primary">Note:</strong> Exam dates are tentative and subject to change. Always verify
            with official sources before making plans.
          </p>
        </CardContent>
      </Card>

      {/* Upcoming Exams */}
      {upcomingExams.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-tn-text mb-4 flex items-center gap-3">
            <span className="text-2xl">📅</span>
            Upcoming Exams
            <span className="text-sm font-normal text-gray-500 ml-auto">({upcomingExams.length})</span>
          </h2>
          <div className="space-y-4">
            {upcomingExams.map((exam) => (
              <Card
                key={exam.id}
                category="exam"
                variant="elevated"
                hoverable
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(exam.type)}
                      <h3 className="font-semibold text-tn-text">{exam.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                        Upcoming
                      </span>
                    </div>
                    {exam.nameTamil && (
                      <p className="text-xs text-gray-500 tamil mb-2">{exam.nameTamil}</p>
                    )}
                    <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-tn-primary font-medium">
                        <Clock size={14} />
                        {exam.dates}
                      </span>
                      {exam.resultDate && (
                        <span className="text-gray-600">Result: {exam.resultDate}</span>
                      )}
                    </div>
                  </div>
                  {exam.website && (
                    <a
                      href={exam.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-tn-primary bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap"
                    >
                      <ExternalLink size={14} />
                      Visit
                    </a>
                  )}
                </div>
              </Card>
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
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-tn-text mb-4">Official Exam Portals</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://dge.tn.gov.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card category="exam" variant="elevated" hoverable className="h-full">
              <CardHeader
                title="DGE Tamil Nadu"
                subtitle="SSLC & HSC Results"
                category="exam"
              />
            </Card>
          </a>
          <a
            href="https://trb.tn.gov.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card category="exam" variant="elevated" hoverable className="h-full">
              <CardHeader
                title="TRB Tamil Nadu"
                subtitle="Teacher Recruitment"
                category="exam"
              />
            </Card>
          </a>
          <a
            href="https://tnpsc.gov.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card category="exam" variant="elevated" hoverable className="h-full">
              <CardHeader
                title="TNPSC"
                subtitle="Group Exams"
                category="exam"
              />
            </Card>
          </a>
        </div>
      </div>
    </PageContainer>
  );
}
