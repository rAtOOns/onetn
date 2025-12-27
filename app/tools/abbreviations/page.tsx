"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search, Info } from "lucide-react";

interface Abbreviation {
  abbr: string;
  full: string;
  fullTamil: string;
  category: string;
}

const abbreviations: Abbreviation[] = [
  // Education Department
  { abbr: "DSE", full: "Director of School Education", fullTamil: "பள்ளிக்கல்வி இயக்குநர்", category: "Department" },
  { abbr: "DEE", full: "Director of Elementary Education", fullTamil: "தொடக்கக்கல்வி இயக்குநர்", category: "Department" },
  { abbr: "DGE", full: "Director of Government Examinations", fullTamil: "அரசுத் தேர்வுகள் இயக்குநர்", category: "Department" },
  { abbr: "DMS", full: "Director of Matriculation Schools", fullTamil: "நடுநிலைப்பள்ளிகள் இயக்குநர்", category: "Department" },
  { abbr: "DPI", full: "Director of Public Instruction", fullTamil: "பொதுக்கல்வி இயக்குநர்", category: "Department" },
  { abbr: "CEO", full: "Chief Educational Officer", fullTamil: "முதன்மைக் கல்வி அலுவலர்", category: "Department" },
  { abbr: "DEO", full: "District Educational Officer", fullTamil: "மாவட்டக் கல்வி அலுவலர்", category: "Department" },
  { abbr: "BEO", full: "Block Educational Officer", fullTamil: "வட்டக் கல்வி அலுவலர்", category: "Department" },
  { abbr: "AEEO", full: "Assistant Elementary Educational Officer", fullTamil: "உதவித் தொடக்கக் கல்வி அலுவலர்", category: "Department" },
  { abbr: "TRB", full: "Teachers Recruitment Board", fullTamil: "ஆசிரியர் தேர்வு வாரியம்", category: "Department" },
  { abbr: "SCERT", full: "State Council of Educational Research and Training", fullTamil: "மாநிலக் கல்வி ஆராய்ச்சி மற்றும் பயிற்சி கழகம்", category: "Department" },
  { abbr: "DIET", full: "District Institute of Education and Training", fullTamil: "மாவட்டக் கல்வி மற்றும் பயிற்சி நிறுவனம்", category: "Department" },

  // Schools & Posts
  { abbr: "GHS", full: "Government High School", fullTamil: "அரசு உயர்நிலைப் பள்ளி", category: "School" },
  { abbr: "GHSS", full: "Government Higher Secondary School", fullTamil: "அரசு மேல்நிலைப் பள்ளி", category: "School" },
  { abbr: "GMS", full: "Government Middle School", fullTamil: "அரசு நடுநிலைப் பள்ளி", category: "School" },
  { abbr: "GPS", full: "Government Primary School", fullTamil: "அரசுத் தொடக்கப் பள்ளி", category: "School" },
  { abbr: "ADW", full: "Adi Dravidar Welfare School", fullTamil: "ஆதிதிராவிடர் நல பள்ளி", category: "School" },
  { abbr: "HM", full: "Headmaster", fullTamil: "தலைமையாசிரியர்", category: "Post" },
  { abbr: "BT", full: "Bachelor of Teaching / Graduate Teacher", fullTamil: "பட்டதாரி ஆசிரியர்", category: "Post" },
  { abbr: "PG", full: "Post Graduate Teacher", fullTamil: "முதுகலை ஆசிரியர்", category: "Post" },
  { abbr: "SGT", full: "Secondary Grade Teacher", fullTamil: "இடைநிலை ஆசிரியர்", category: "Post" },
  { abbr: "PET", full: "Physical Education Teacher", fullTamil: "உடற்கல்வி ஆசிரியர்", category: "Post" },
  { abbr: "BRTE", full: "Block Resource Teacher Educator", fullTamil: "வட்ட வள ஆசிரியர் கல்வியாளர்", category: "Post" },

  // Exams & Schemes
  { abbr: "SSLC", full: "Secondary School Leaving Certificate", fullTamil: "இடைநிலைப் பள்ளி இறுதிச் சான்றிதழ்", category: "Exam" },
  { abbr: "HSC", full: "Higher Secondary Certificate", fullTamil: "மேல்நிலைச் சான்றிதழ்", category: "Exam" },
  { abbr: "TET", full: "Teacher Eligibility Test", fullTamil: "ஆசிரியர் தகுதித் தேர்வு", category: "Exam" },
  { abbr: "TNPSC", full: "Tamil Nadu Public Service Commission", fullTamil: "தமிழ்நாடு அரசுப் பணியாளர் தேர்வாணையம்", category: "Exam" },
  { abbr: "CCE", full: "Continuous and Comprehensive Evaluation", fullTamil: "தொடர்ச்சியான மற்றும் முழுமையான மதிப்பீடு", category: "Exam" },
  { abbr: "SA", full: "Summative Assessment", fullTamil: "தொகுப்பு மதிப்பீடு", category: "Exam" },
  { abbr: "FA", full: "Formative Assessment", fullTamil: "வடிவமைப்பு மதிப்பீடு", category: "Exam" },

  // Government Schemes
  { abbr: "SSA", full: "Sarva Shiksha Abhiyan", fullTamil: "அனைவருக்கும் கல்வி இயக்கம்", category: "Scheme" },
  { abbr: "RMSA", full: "Rashtriya Madhyamik Shiksha Abhiyan", fullTamil: "தேசிய இடைநிலைக் கல்வி இயக்கம்", category: "Scheme" },
  { abbr: "MDM", full: "Mid-Day Meal", fullTamil: "மதிய உணவுத் திட்டம்", category: "Scheme" },
  { abbr: "RTE", full: "Right to Education", fullTamil: "கல்வி உரிமைச் சட்டம்", category: "Scheme" },
  { abbr: "PM SHRI", full: "PM Schools for Rising India", fullTamil: "பிரதமர் எழுச்சி இந்தியா பள்ளிகள்", category: "Scheme" },
  { abbr: "NEET", full: "National Eligibility cum Entrance Test", fullTamil: "தேசிய தகுதி நுழைவுத் தேர்வு", category: "Exam" },

  // Administrative Terms
  { abbr: "EMIS", full: "Educational Management Information System", fullTamil: "கல்வி மேலாண்மை தகவல் அமைப்பு", category: "System" },
  { abbr: "UDISE", full: "Unified District Information System for Education", fullTamil: "ஒருங்கிணைந்த மாவட்ட கல்வித் தகவல் அமைப்பு", category: "System" },
  { abbr: "GO", full: "Government Order", fullTamil: "அரசாணை", category: "Admin" },
  { abbr: "Govt. Lr.", full: "Government Letter", fullTamil: "அரசுக் கடிதம்", category: "Admin" },
  { abbr: "Proc.", full: "Proceedings", fullTamil: "நடவடிக்கை", category: "Admin" },
  { abbr: "DDO", full: "Drawing and Disbursing Officer", fullTamil: "வரைவு மற்றும் பகிர்வு அலுவலர்", category: "Admin" },
  { abbr: "TA", full: "Travel Allowance", fullTamil: "பயணப்படி", category: "Salary" },
  { abbr: "DA", full: "Dearness Allowance", fullTamil: "அகவிலைப்படி", category: "Salary" },
  { abbr: "HRA", full: "House Rent Allowance", fullTamil: "வீட்டு வாடகைப்படி", category: "Salary" },
  { abbr: "GPF", full: "General Provident Fund", fullTamil: "பொது வருங்கால வைப்பு நிதி", category: "Salary" },
  { abbr: "TPF", full: "Tamil Nadu Provident Fund", fullTamil: "தமிழ்நாடு வருங்கால வைப்பு நிதி", category: "Salary" },
  { abbr: "CL", full: "Casual Leave", fullTamil: "தற்செயல் விடுப்பு", category: "Leave" },
  { abbr: "EL", full: "Earned Leave", fullTamil: "ஈட்டிய விடுப்பு", category: "Leave" },
  { abbr: "ML", full: "Medical Leave", fullTamil: "மருத்துவ விடுப்பு", category: "Leave" },
  { abbr: "HPL", full: "Half Pay Leave", fullTamil: "அரை ஊதிய விடுப்பு", category: "Leave" },
  { abbr: "LTC", full: "Leave Travel Concession", fullTamil: "விடுப்பு பயண சலுகை", category: "Leave" },
];

const categories = ["All", "Department", "School", "Post", "Exam", "Scheme", "System", "Admin", "Salary", "Leave"];

export default function AbbreviationsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredAbbreviations = abbreviations.filter((item) => {
    const matchesSearch =
      item.abbr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.full.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullTamil.includes(searchTerm);
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <BookOpen className="text-cyan-600" size={28} />
            Abbreviations & Glossary
          </h1>
          <p className="text-sm text-gray-500 tamil">சுருக்கங்கள் மற்றும் சொற்களஞ்சியம்</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-cyan-800">
          Common abbreviations used in Tamil Nadu Education Department circulars, GOs, and official documents.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search abbreviation or full form..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Showing {filteredAbbreviations.length} of {abbreviations.length} entries
        </p>
      </div>

      {/* Abbreviations List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="divide-y">
          {filteredAbbreviations.map((item, idx) => (
            <div key={idx} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="bg-cyan-100 text-cyan-700 font-bold px-3 py-2 rounded-lg min-w-[80px] text-center">
                  {item.abbr}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-tn-text">{item.full}</p>
                  <p className="text-sm text-gray-500 tamil mt-1">{item.fullTamil}</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredAbbreviations.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <p className="text-gray-500">No abbreviations found matching your search.</p>
        </div>
      )}

      {/* Quick Reference Cards */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-3">Common GO Types</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p><strong>G.O.(Ms):</strong> Government Order (Manuscript)</p>
            <p><strong>G.O.(Rt):</strong> Government Order (Routine)</p>
            <p><strong>G.O.(D):</strong> Government Order (Draft)</p>
            <p><strong>G.O.(1D):</strong> Government Order (First Draft)</p>
            <p><strong>G.O.(2D):</strong> Government Order (Second Draft)</p>
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="font-semibold text-green-800 mb-3">Pay Commission Terms</h3>
          <div className="space-y-2 text-sm text-green-700">
            <p><strong>BP:</strong> Basic Pay</p>
            <p><strong>GP:</strong> Grade Pay</p>
            <p><strong>PB:</strong> Pay Band</p>
            <p><strong>CCA:</strong> City Compensatory Allowance</p>
            <p><strong>MA:</strong> Medical Allowance</p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          About This Glossary
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Coverage:</strong> Education Department specific terms, posts, schemes, and administrative abbreviations.</p>
          <p><strong>Languages:</strong> English full forms with Tamil translations.</p>
          <p><strong>Updates:</strong> New terms are added periodically based on recent GOs and circulars.</p>
        </div>
      </div>
    </div>
  );
}
