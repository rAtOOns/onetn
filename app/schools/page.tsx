"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  School as SchoolIcon,
  Filter,
  ChevronDown,
  Building2,
  Users,
  GraduationCap,
  Phone,
  X,
} from "lucide-react";

interface School {
  id: string;
  emisCode: string;
  name: string;
  nameTamil: string | null;
  district: string;
  block: string | null;
  village: string | null;
  schoolType: string;
  management: string;
  medium: string | null;
  category: string | null;
  phone: string | null;
  pincode: string | null;
}

interface SearchFilters {
  query: string;
  district: string;
  schoolType: string;
  management: string;
}

// Tamil Nadu Districts
const districts = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
  "Kanniyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
  "Ramanathapuram", "Ranipet", "Salem", "Sivagangai", "Tenkasi",
  "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
  "Vellore", "Viluppuram", "Virudhunagar"
];

const schoolTypes = ["Primary", "Middle", "High", "Higher Secondary"];
const managementTypes = ["Government", "Govt Aided", "ADW", "Corporation", "Municipal"];

export default function SchoolDirectoryPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    district: "",
    schoolType: "",
    management: "",
  });

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.set("q", filters.query);
      if (filters.district) params.set("district", filters.district);
      if (filters.schoolType) params.set("type", filters.schoolType);
      if (filters.management) params.set("management", filters.management);
      params.set("page", page.toString());
      params.set("limit", "20");

      const res = await fetch(`/api/schools?${params.toString()}`);
      const data = await res.json();

      setSchools(data.schools || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch schools:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSchools();
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      district: "",
      schoolType: "",
      management: "",
    });
    setPage(1);
  };

  const activeFilterCount = [
    filters.district,
    filters.schoolType,
    filters.management,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-tn-primary to-tn-secondary text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <SchoolIcon size={32} />
            <div>
              <h1 className="text-2xl font-bold">School Directory</h1>
              <p className="text-sm opacity-90 tamil">பள்ளி கையேடு</p>
            </div>
          </div>
          <p className="text-white/80">
            Search Government and Government Aided schools across Tamil Nadu
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                  placeholder="Search by school name or EMIS code..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-white/50 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${
                  showFilters || activeFilterCount > 0
                    ? "bg-white text-tn-primary"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                <Filter size={20} />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-tn-primary text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-white text-tn-primary rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1 opacity-90">District</label>
                  <select
                    value={filters.district}
                    onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                    className="w-full px-3 py-2 rounded text-gray-800"
                  >
                    <option value="">All Districts</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1 opacity-90">School Type</label>
                  <select
                    value={filters.schoolType}
                    onChange={(e) => setFilters({ ...filters, schoolType: e.target.value })}
                    className="w-full px-3 py-2 rounded text-gray-800"
                  >
                    <option value="">All Types</option>
                    {schoolTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1 opacity-90">Management</label>
                  <select
                    value={filters.management}
                    onChange={(e) => setFilters({ ...filters, management: e.target.value })}
                    className="w-full px-3 py-2 rounded text-gray-800"
                  >
                    <option value="">All Management</option>
                    {managementTypes.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm flex items-center gap-1 text-white/80 hover:text-white"
                >
                  <X size={14} />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            {loading ? (
              "Searching..."
            ) : (
              <>
                Found <strong>{totalCount.toLocaleString()}</strong> schools
                {filters.district && ` in ${filters.district}`}
              </>
            )}
          </p>
        </div>

        {/* School List */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : schools.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {schools.map((school) => (
                <div
                  key={school.id}
                  className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-tn-primary/10 p-2 rounded-lg">
                      <SchoolIcon className="text-tn-primary" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-tn-text truncate">
                        {school.name}
                      </h3>
                      {school.nameTamil && (
                        <p className="text-sm text-gray-500 tamil truncate">
                          {school.nameTamil}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          <Building2 size={12} />
                          {school.schoolType}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          {school.management}
                        </span>
                        {school.medium && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            {school.medium}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span>
                        {[school.village, school.block, school.district]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        EMIS: {school.emisCode}
                      </span>
                      {school.phone && (
                        <a
                          href={`tel:${school.phone}`}
                          className="inline-flex items-center gap-1 text-xs text-tn-primary hover:underline"
                        >
                          <Phone size={12} />
                          {school.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalCount > 20 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Page {page} of {Math.ceil(totalCount / 20)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(totalCount / 20)}
                  className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <SchoolIcon className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No schools found</h3>
            <p className="text-gray-500">
              {filters.query || activeFilterCount > 0
                ? "Try adjusting your search or filters"
                : "School data is being collected. Check back soon!"}
            </p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-3">About School Directory</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p>This directory includes Government, Government Aided, and ADW schools across Tamil Nadu.</p>
            <p>Data is collected from public sources including EMIS and UDISE+ portals.</p>
            <p className="text-xs text-blue-600">Last updated: December 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
