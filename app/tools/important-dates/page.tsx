"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Info, GraduationCap, FileCheck, Users } from "lucide-react";

interface ImportantDate {
  event: string;
  eventTamil: string;
  date: string;
  tentative: boolean;
  category: "exam" | "admission" | "academic" | "recruitment" | "other";
}

const importantDates2025: ImportantDate[] = [
  // Board Exams
  { event: "10th Public Exam Start", eventTamil: "10ம் வகுப்பு பொதுத்தேர்வு தொடக்கம்", date: "2025-03-28", tentative: true, category: "exam" },
  { event: "10th Public Exam End", eventTamil: "10ம் வகுப்பு பொதுத்தேர்வு முடிவு", date: "2025-04-15", tentative: true, category: "exam" },
  { event: "12th Public Exam Start", eventTamil: "12ம் வகுப்பு பொதுத்தேர்வு தொடக்கம்", date: "2025-03-03", tentative: true, category: "exam" },
  { event: "12th Public Exam End", eventTamil: "12ம் வகுப்பு பொதுத்தேர்வு முடிவு", date: "2025-03-28", tentative: true, category: "exam" },
  { event: "10th Results Declaration", eventTamil: "10ம் வகுப்பு தேர்வு முடிவுகள்", date: "2025-05-15", tentative: true, category: "exam" },
  { event: "12th Results Declaration", eventTamil: "12ம் வகுப்பு தேர்வு முடிவுகள்", date: "2025-05-08", tentative: true, category: "exam" },
  { event: "Quarterly Exam", eventTamil: "காலாண்டு தேர்வு", date: "2025-08-15", tentative: true, category: "exam" },
  { event: "Half Yearly Exam", eventTamil: "அரையாண்டு தேர்வு", date: "2025-12-01", tentative: true, category: "exam" },

  // Admissions
  { event: "Plus One Admission Start", eventTamil: "+1 சேர்க்கை தொடக்கம்", date: "2025-05-20", tentative: true, category: "admission" },
  { event: "Plus One Admission End", eventTamil: "+1 சேர்க்கை முடிவு", date: "2025-06-30", tentative: true, category: "admission" },
  { event: "School Admission (RTE)", eventTamil: "பள்ளி சேர்க்கை (RTE)", date: "2025-04-01", tentative: true, category: "admission" },
  { event: "College Admission Start", eventTamil: "கல்லூரி சேர்க்கை தொடக்கம்", date: "2025-06-01", tentative: true, category: "admission" },
  { event: "Engineering Counseling", eventTamil: "பொறியியல் கவுன்சிலிங்", date: "2025-06-20", tentative: true, category: "admission" },
  { event: "Medical Counseling", eventTamil: "மருத்துவ கவுன்சிலிங்", date: "2025-07-15", tentative: true, category: "admission" },

  // Academic Calendar
  { event: "Academic Year Start", eventTamil: "கல்வியாண்டு தொடக்கம்", date: "2025-06-02", tentative: false, category: "academic" },
  { event: "Summer Vacation Start", eventTamil: "கோடை விடுமுறை தொடக்கம்", date: "2025-04-15", tentative: true, category: "academic" },
  { event: "Summer Vacation End", eventTamil: "கோடை விடுமுறை முடிவு", date: "2025-06-01", tentative: true, category: "academic" },
  { event: "Pongal Vacation Start", eventTamil: "பொங்கல் விடுமுறை தொடக்கம்", date: "2025-01-10", tentative: false, category: "academic" },
  { event: "Pongal Vacation End", eventTamil: "பொங்கல் விடுமுறை முடிவு", date: "2025-01-20", tentative: false, category: "academic" },
  { event: "Deepavali Vacation", eventTamil: "தீபாவளி விடுமுறை", date: "2025-10-18", tentative: true, category: "academic" },

  // Recruitment
  { event: "TRB Notification (Expected)", eventTamil: "TRB அறிவிப்பு", date: "2025-02-01", tentative: true, category: "recruitment" },
  { event: "TET Exam (Expected)", eventTamil: "TET தேர்வு", date: "2025-06-15", tentative: true, category: "recruitment" },
  { event: "Teacher Transfer Counseling", eventTamil: "ஆசிரியர் இடமாறுதல் கவுன்சிலிங்", date: "2025-05-01", tentative: true, category: "recruitment" },
  { event: "Promotion Orders", eventTamil: "பதவி உயர்வு உத்தரவுகள்", date: "2025-07-01", tentative: true, category: "recruitment" },

  // Other Important Dates
  { event: "Teachers Day", eventTamil: "ஆசிரியர் தினம்", date: "2025-09-05", tentative: false, category: "other" },
  { event: "Children's Day", eventTamil: "குழந்தைகள் தினம்", date: "2025-11-14", tentative: false, category: "other" },
  { event: "Education Day", eventTamil: "கல்வி தினம்", date: "2025-11-11", tentative: false, category: "other" },
  { event: "Annual Day (Schools)", eventTamil: "ஆண்டு விழா", date: "2025-02-28", tentative: true, category: "other" },
  { event: "Sports Day", eventTamil: "விளையாட்டு தினம்", date: "2025-01-25", tentative: true, category: "other" },
];

const categories = [
  { id: "all", name: "All Events", icon: Calendar, color: "bg-gray-500" },
  { id: "exam", name: "Exams", icon: FileCheck, color: "bg-red-500" },
  { id: "admission", name: "Admissions", icon: GraduationCap, color: "bg-green-500" },
  { id: "academic", name: "Academic", icon: Calendar, color: "bg-blue-500" },
  { id: "recruitment", name: "Recruitment", icon: Users, color: "bg-purple-500" },
  { id: "other", name: "Other", icon: Calendar, color: "bg-orange-500" },
];

export default function ImportantDatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredDates = importantDates2025
    .filter((d) => selectedCategory === "all" || d.category === selectedCategory)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingDates = filteredDates.filter((d) => new Date(d.date) >= new Date());
  const pastDates = filteredDates.filter((d) => new Date(d.date) < new Date());

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.color || "bg-gray-500";
  };

  const getCategoryName = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.name || category;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Calendar className="text-blue-600" size={28} />
            Important Dates 2025
          </h1>
          <p className="text-sm text-gray-500 tamil">முக்கிய தேதிகள் 2025</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Education Department Calendar:</strong> Exam dates, admission schedules, and important academic events.
          Dates marked as tentative may change based on official announcements.
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? `${cat.color} text-white`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon size={16} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingDates.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-tn-text mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            Upcoming Events
          </h2>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="divide-y">
              {upcomingDates.map((event, idx) => {
                const daysUntil = Math.ceil(
                  (new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div key={idx} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center bg-red-50 rounded-lg p-2 min-w-[60px]">
                          <p className="text-lg font-bold text-red-600">
                            {new Date(event.date).getDate()}
                          </p>
                          <p className="text-xs text-red-500">
                            {new Date(event.date).toLocaleDateString("en", { month: "short" })}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-tn-text">
                            {event.event}
                            {event.tentative && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                Tentative
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 tamil">{event.eventTamil}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(event.category)} text-white`}>
                          {getCategoryName(event.category)}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastDates.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-500 mb-4">Past Events</h2>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden opacity-60">
            <div className="divide-y">
              {pastDates.map((event, idx) => (
                <div key={idx} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center bg-gray-100 rounded-lg p-2 min-w-[60px]">
                        <p className="text-lg font-bold text-gray-500">
                          {new Date(event.date).getDate()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(event.date).toLocaleDateString("en", { month: "short" })}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">{event.event}</p>
                        <p className="text-sm text-gray-400 tamil">{event.eventTamil}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs bg-gray-200 text-gray-600`}>
                      {getCategoryName(event.category)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {filteredDates.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <p className="text-gray-500">No events found for the selected category.</p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Important Notes
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Tentative Dates:</strong> May change based on official government announcements.</p>
          <p><strong>Exam Dates:</strong> Check DGE website for confirmed timetables.</p>
          <p><strong>Admissions:</strong> Dates vary by institution. Check specific college/school websites.</p>
          <p><strong>Updates:</strong> Follow official TN School Education Department notifications.</p>
        </div>
      </div>
    </div>
  );
}
