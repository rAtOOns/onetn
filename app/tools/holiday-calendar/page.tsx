"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Info } from "lucide-react";

interface Holiday {
  date: string;
  day: string;
  name: string;
  nameTamil: string;
  type: "public" | "restricted" | "optional";
}

// TN Government Holidays 2025
const holidays2025: Holiday[] = [
  { date: "2025-01-01", day: "Wednesday", name: "New Year's Day", nameTamil: "புத்தாண்டு", type: "public" },
  { date: "2025-01-14", day: "Tuesday", name: "Pongal", nameTamil: "பொங்கல்", type: "public" },
  { date: "2025-01-15", day: "Wednesday", name: "Thiruvalluvar Day", nameTamil: "திருவள்ளுவர் தினம்", type: "public" },
  { date: "2025-01-16", day: "Thursday", name: "Uzhavar Thirunal", nameTamil: "உழவர் திருநாள்", type: "public" },
  { date: "2025-01-26", day: "Sunday", name: "Republic Day", nameTamil: "குடியரசு தினம்", type: "public" },
  { date: "2025-02-26", day: "Wednesday", name: "Maha Shivaratri", nameTamil: "மகா சிவராத்திரி", type: "restricted" },
  { date: "2025-03-14", day: "Friday", name: "Holi", nameTamil: "ஹோலி", type: "restricted" },
  { date: "2025-03-30", day: "Sunday", name: "Telugu New Year", nameTamil: "தெலுங்கு புத்தாண்டு", type: "restricted" },
  { date: "2025-03-31", day: "Monday", name: "Ramzan (Eid-ul-Fitr)", nameTamil: "ரமலான்", type: "public" },
  { date: "2025-04-06", day: "Sunday", name: "Mahavir Jayanti", nameTamil: "மகாவீர் ஜயந்தி", type: "restricted" },
  { date: "2025-04-10", day: "Thursday", name: "Tamil New Year", nameTamil: "தமிழ் புத்தாண்டு", type: "public" },
  { date: "2025-04-14", day: "Monday", name: "Dr. Ambedkar Jayanti", nameTamil: "அம்பேத்கர் ஜயந்தி", type: "public" },
  { date: "2025-04-18", day: "Friday", name: "Good Friday", nameTamil: "புனித வெள்ளி", type: "public" },
  { date: "2025-05-01", day: "Thursday", name: "May Day", nameTamil: "மே தினம்", type: "public" },
  { date: "2025-05-12", day: "Monday", name: "Buddha Purnima", nameTamil: "புத்த பூர்ணிமா", type: "restricted" },
  { date: "2025-06-07", day: "Saturday", name: "Bakrid (Eid-ul-Adha)", nameTamil: "பக்ரீத்", type: "public" },
  { date: "2025-07-06", day: "Sunday", name: "Muharram", nameTamil: "முகர்ரம்", type: "public" },
  { date: "2025-08-15", day: "Friday", name: "Independence Day", nameTamil: "சுதந்திர தினம்", type: "public" },
  { date: "2025-08-16", day: "Saturday", name: "Krishna Jayanthi", nameTamil: "கிருஷ்ண ஜெயந்தி", type: "public" },
  { date: "2025-08-27", day: "Wednesday", name: "Vinayagar Chathurthi", nameTamil: "விநாயகர் சதுர்த்தி", type: "public" },
  { date: "2025-09-05", day: "Friday", name: "Milad-un-Nabi", nameTamil: "மிலாது நபி", type: "public" },
  { date: "2025-10-01", day: "Wednesday", name: "Ayutha Pooja", nameTamil: "ஆயுத பூஜை", type: "public" },
  { date: "2025-10-02", day: "Thursday", name: "Gandhi Jayanti / Vijaya Dasami", nameTamil: "காந்தி ஜயந்தி / விஜயதசமி", type: "public" },
  { date: "2025-10-20", day: "Monday", name: "Deepavali", nameTamil: "தீபாவளி", type: "public" },
  { date: "2025-11-01", day: "Saturday", name: "All Saints Day", nameTamil: "அனைத்து புனிதர்கள் தினம்", type: "restricted" },
  { date: "2025-11-05", day: "Wednesday", name: "Guru Nanak Jayanti", nameTamil: "குரு நானக் ஜயந்தி", type: "restricted" },
  { date: "2025-12-25", day: "Thursday", name: "Christmas", nameTamil: "கிறிஸ்துமஸ்", type: "public" },
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const monthsTamil = [
  "ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்",
  "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"
];

export default function HolidayCalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [showType, setShowType] = useState<"all" | "public" | "restricted">("all");

  const filteredHolidays = holidays2025.filter((holiday) => {
    const monthMatch = selectedMonth === null ||
      new Date(holiday.date).getMonth() === selectedMonth;
    const typeMatch = showType === "all" || holiday.type === showType;
    return monthMatch && typeMatch;
  });

  const publicCount = holidays2025.filter(h => h.type === "public").length;
  const restrictedCount = holidays2025.filter(h => h.type === "restricted").length;

  const getHolidaysByMonth = (month: number) => {
    return holidays2025.filter(h => new Date(h.date).getMonth() === month);
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
            <Calendar className="text-red-600" size={28} />
            Holiday Calendar 2025
          </h1>
          <p className="text-sm text-gray-500 tamil">2025 அரசு விடுமுறை நாட்கள்</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{publicCount}</p>
          <p className="text-sm text-green-600">Public Holidays</p>
          <p className="text-xs text-green-500 tamil">பொது விடுமுறை</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-700">{restrictedCount}</p>
          <p className="text-sm text-orange-600">Restricted Holidays</p>
          <p className="text-xs text-orange-500 tamil">கட்டுப்படுத்தப்பட்ட விடுமுறை</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{holidays2025.length}</p>
          <p className="text-sm text-blue-600">Total Holidays</p>
          <p className="text-xs text-blue-500 tamil">மொத்த விடுமுறை</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Month Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Month</label>
            <select
              value={selectedMonth ?? ""}
              onChange={(e) => setSelectedMonth(e.target.value === "" ? null : Number(e.target.value))}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Months</option>
              {months.map((month, idx) => (
                <option key={idx} value={idx}>
                  {month} ({getHolidaysByMonth(idx).length} holidays)
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowType("all")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  showType === "all" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setShowType("public")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  showType === "public" ? "bg-green-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setShowType("restricted")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  showType === "restricted" ? "bg-orange-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Restricted
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Holiday List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Day</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Holiday</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredHolidays.map((holiday, idx) => {
                const date = new Date(holiday.date);
                const isPast = date < new Date();
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <tr
                    key={idx}
                    className={`${
                      isToday
                        ? "bg-yellow-50"
                        : isPast
                        ? "bg-gray-50 opacity-60"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-red-100 text-red-700 rounded px-2 py-1 text-center min-w-[60px]">
                          <p className="text-lg font-bold leading-tight">{date.getDate()}</p>
                          <p className="text-xs">{months[date.getMonth()].slice(0, 3)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{holiday.day}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-tn-text">{holiday.name}</p>
                      <p className="text-xs text-gray-500 tamil">{holiday.nameTamil}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          holiday.type === "public"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {holiday.type === "public" ? "Public" : "Restricted"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredHolidays.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No holidays found for the selected filters.
          </div>
        )}
      </div>

      {/* Month-wise Summary */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-tn-text mb-4">Month-wise Summary</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {months.map((month, idx) => {
            const count = getHolidaysByMonth(idx).length;
            return (
              <div
                key={idx}
                className={`p-3 rounded-lg text-center cursor-pointer transition-colors ${
                  selectedMonth === idx
                    ? "bg-blue-500 text-white"
                    : count > 0
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "bg-gray-50"
                }`}
                onClick={() => setSelectedMonth(selectedMonth === idx ? null : idx)}
              >
                <p className="text-xs opacity-75">{month.slice(0, 3)}</p>
                <p className="text-lg font-bold">{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About Government Holidays
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Public Holidays:</strong> Compulsory holidays for all government offices.</p>
          <p><strong>Restricted Holidays:</strong> Employees can avail 2 restricted holidays of their choice per year.</p>
          <p><strong>Note:</strong> Some dates may vary based on moon sighting (Islamic holidays) or official announcements.</p>
          <p className="text-xs mt-2">Source: Tamil Nadu Government Holiday List 2025</p>
        </div>
      </div>
    </div>
  );
}
