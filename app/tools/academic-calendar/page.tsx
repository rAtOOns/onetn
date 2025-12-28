"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Info, Bell } from "lucide-react";

// Academic year 2024-25 calendar events
const academicEvents = [
  // June 2024
  { date: "2024-06-03", event: "Schools Reopen for 2024-25", type: "important", tamil: "பள்ளிகள் திறப்பு" },
  { date: "2024-06-05", event: "World Environment Day", type: "observance", tamil: "உலக சுற்றுச்சூழல் தினம்" },
  { date: "2024-06-17", event: "Bakrid (Eid ul-Adha)", type: "holiday", tamil: "பக்ரீத்" },
  { date: "2024-06-21", event: "International Yoga Day", type: "observance", tamil: "சர்வதேச யோகா தினம்" },

  // July 2024
  { date: "2024-07-17", event: "Muharram", type: "holiday", tamil: "முஹர்ரம்" },
  { date: "2024-07-29", event: "Last date for 1st Term FA", type: "academic", tamil: "முதல் தவணை FA கடைசி தேதி" },

  // August 2024
  { date: "2024-08-15", event: "Independence Day", type: "holiday", tamil: "சுதந்திர தினம்" },
  { date: "2024-08-26", event: "Janmashtami", type: "holiday", tamil: "ஜன்மாஷ்டமி" },

  // September 2024
  { date: "2024-09-05", event: "Teachers Day", type: "observance", tamil: "ஆசிரியர் தினம்" },
  { date: "2024-09-16", event: "Milad-un-Nabi", type: "holiday", tamil: "மிலாதுன்னபி" },
  { date: "2024-09-20", event: "Quarterly Exam Begins", type: "exam", tamil: "காலாண்டு தேர்வு தொடக்கம்" },

  // October 2024
  { date: "2024-10-02", event: "Gandhi Jayanti", type: "holiday", tamil: "காந்தி ஜெயந்தி" },
  { date: "2024-10-12", event: "Ayudha Pooja / Saraswathi Pooja", type: "holiday", tamil: "ஆயுத பூஜை / சரஸ்வதி பூஜை" },
  { date: "2024-10-13", event: "Vijaya Dasami", type: "holiday", tamil: "விஜயதசமி" },
  { date: "2024-10-14", event: "Dussehra Holiday", type: "holiday", tamil: "தசரா விடுமுறை" },
  { date: "2024-10-31", event: "Deepavali", type: "holiday", tamil: "தீபாவளி" },

  // November 2024
  { date: "2024-11-01", event: "Deepavali Holiday", type: "holiday", tamil: "தீபாவளி விடுமுறை" },
  { date: "2024-11-15", event: "Karthigai Deepam", type: "holiday", tamil: "கார்த்திகை தீபம்" },

  // December 2024
  { date: "2024-12-09", event: "Half-Yearly Exam Begins", type: "exam", tamil: "அரையாண்டு தேர்வு தொடக்கம்" },
  { date: "2024-12-20", event: "Half-Yearly Exam Ends", type: "exam", tamil: "அரையாண்டு தேர்வு முடிவு" },
  { date: "2024-12-23", event: "Christmas Vacation Begins", type: "vacation", tamil: "கிறிஸ்துமஸ் விடுமுறை தொடக்கம்" },
  { date: "2024-12-25", event: "Christmas", type: "holiday", tamil: "கிறிஸ்துமஸ்" },

  // January 2025
  { date: "2025-01-01", event: "New Year", type: "holiday", tamil: "புத்தாண்டு" },
  { date: "2025-01-02", event: "Schools Reopen", type: "important", tamil: "பள்ளிகள் திறப்பு" },
  { date: "2025-01-14", event: "Pongal", type: "holiday", tamil: "பொங்கல்" },
  { date: "2025-01-15", event: "Thiruvalluvar Day", type: "holiday", tamil: "திருவள்ளுவர் தினம்" },
  { date: "2025-01-16", event: "Uzhavar Thirunal", type: "holiday", tamil: "உழவர் திருநாள்" },
  { date: "2025-01-26", event: "Republic Day", type: "holiday", tamil: "குடியரசு தினம்" },

  // February 2025
  { date: "2025-02-19", event: "Maha Shivaratri", type: "holiday", tamil: "மகா சிவராத்திரி" },
  { date: "2025-02-26", event: "3rd Term FA Begins", type: "academic", tamil: "மூன்றாம் தவணை FA தொடக்கம்" },

  // March 2025
  { date: "2025-03-01", event: "SSLC Practical Exam", type: "exam", tamil: "10ஆம் வகுப்பு செய்முறை தேர்வு" },
  { date: "2025-03-14", event: "Holi", type: "holiday", tamil: "ஹோலி" },
  { date: "2025-03-17", event: "SSLC Public Exam Begins", type: "exam", tamil: "பத்தாம் வகுப்பு பொதுத்தேர்வு தொடக்கம்" },
  { date: "2025-03-31", event: "Ramadan (Eid ul-Fitr)", type: "holiday", tamil: "ரமலான்" },

  // April 2025
  { date: "2025-04-01", event: "HSC Public Exam Begins", type: "exam", tamil: "பன்னிரெண்டாம் வகுப்பு பொதுத்தேர்வு" },
  { date: "2025-04-06", event: "Telugu New Year / Ugadi", type: "observance", tamil: "உகாதி" },
  { date: "2025-04-10", event: "Good Friday", type: "holiday", tamil: "புனித வெள்ளி" },
  { date: "2025-04-14", event: "Tamil New Year / Ambedkar Jayanti", type: "holiday", tamil: "தமிழ் புத்தாண்டு / அம்பேத்கர் ஜெயந்தி" },
  { date: "2025-04-18", event: "Annual Exam Begins (1-9, 11)", type: "exam", tamil: "ஆண்டுத் தேர்வு தொடக்கம்" },
  { date: "2025-04-30", event: "Annual Exam Ends", type: "exam", tamil: "ஆண்டுத் தேர்வு முடிவு" },

  // May 2025
  { date: "2025-05-01", event: "May Day", type: "holiday", tamil: "மே தினம்" },
  { date: "2025-05-02", event: "Summer Vacation Begins", type: "vacation", tamil: "கோடை விடுமுறை தொடக்கம்" },
  { date: "2025-05-12", event: "Buddha Purnima", type: "holiday", tamil: "புத்த பூர்ணிமா" },
];

const eventTypes = {
  holiday: { label: "Public Holiday", color: "bg-red-100 text-red-700 border-red-200" },
  exam: { label: "Examination", color: "bg-purple-100 text-purple-700 border-purple-200" },
  academic: { label: "Academic", color: "bg-blue-100 text-blue-700 border-blue-200" },
  vacation: { label: "Vacation", color: "bg-green-100 text-green-700 border-green-200" },
  important: { label: "Important", color: "bg-amber-100 text-amber-700 border-amber-200" },
  observance: { label: "Observance", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AcademicCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get events for current month
  const monthEvents = academicEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth &&
           eventDate.getFullYear() === currentYear &&
           (selectedType === null || event.type === selectedType);
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get upcoming events (next 30 days)
  const today = new Date();
  const upcomingEvents = academicEvents.filter((event) => {
    const eventDate = new Date(event.date);
    const diffDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  }).slice(0, 5);

  // Generate calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDays = [];

  // Add empty cells for days before the first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return academicEvents.filter((e) => e.date === dateStr);
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
            <Calendar className="text-emerald-600" size={28} />
            Academic Calendar 2024-25
          </h1>
          <p className="text-sm text-gray-500 tamil">கல்வி நாட்காட்டி 2024-25</p>
        </div>
      </div>

      {/* Upcoming Events Alert */}
      {upcomingEvents.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-emerald-800 flex items-center gap-2 mb-2">
            <Bell size={16} />
            Upcoming Events
          </h3>
          <div className="flex flex-wrap gap-2">
            {upcomingEvents.map((event, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-1 rounded border ${eventTypes[event.type as keyof typeof eventTypes].color}`}
              >
                {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - {event.event}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Month Navigation */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 border-b">
              <button
                onClick={goToPrevMonth}
                className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-center">
                <h2 className="font-semibold text-lg">{months[currentMonth]} {currentYear}</h2>
                <button
                  onClick={goToToday}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  Go to Today
                </button>
              </div>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const events = day ? getEventsForDay(day) : [];
                const isToday = day === today.getDate() &&
                                currentMonth === today.getMonth() &&
                                currentYear === today.getFullYear();
                return (
                  <div
                    key={index}
                    className={`min-h-[80px] p-1 border-r border-b last:border-r-0 ${
                      day ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {day && (
                      <>
                        <span
                          className={`text-sm font-medium inline-block w-6 h-6 text-center leading-6 rounded-full ${
                            isToday ? "bg-emerald-500 text-white" : ""
                          }`}
                        >
                          {day}
                        </span>
                        <div className="mt-1 space-y-0.5">
                          {events.slice(0, 2).map((event, i) => (
                            <div
                              key={i}
                              className={`text-[10px] px-1 py-0.5 rounded truncate ${
                                eventTypes[event.type as keyof typeof eventTypes].color
                              }`}
                              title={event.event}
                            >
                              {event.event}
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-[10px] text-gray-500 px-1">
                              +{events.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Events List & Legend */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="font-semibold text-sm text-tn-text mb-3">Event Types</h3>
            <div className="space-y-2">
              {Object.entries(eventTypes).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedType(selectedType === key ? null : key)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                    selectedType === key ? "ring-2 ring-emerald-500" : ""
                  } ${value.color}`}
                >
                  <span className="text-xs">{value.label}</span>
                </button>
              ))}
              {selectedType && (
                <button
                  onClick={() => setSelectedType(null)}
                  className="w-full text-xs text-gray-500 hover:text-gray-700 py-1"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Events for Current Month */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="font-semibold text-sm text-tn-text mb-3">
              {months[currentMonth]} Events
            </h3>
            {monthEvents.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {monthEvents.map((event, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border ${eventTypes[event.type as keyof typeof eventTypes].color}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-gray-500 tamil">{event.tamil}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No {selectedType ? eventTypes[selectedType as keyof typeof eventTypes].label.toLowerCase() : ""} events this month
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Important Notes
        </h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Exam dates are tentative and subject to change by DGE/SCERT</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Holiday list may be revised by Government notification</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Schools may have additional local holidays as per CEO approval</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Working days calculation should exclude public holidays and Sundays</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/tools/exam-duty-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Exam Duty Calculator
        </Link>
        <Link href="/links" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Official Links
        </Link>
        <Link href="/tools/surrender-leave-calculator" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Leave Calculator
        </Link>
      </div>
    </div>
  );
}
