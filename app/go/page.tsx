import prisma from "@/lib/db";
import Link from "next/link";
import { FileText, Calendar, Building2, Search, Filter, Star, Languages } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { getGOCategory, getCategoryIcon } from "@/lib/go-categories";

interface PageProps {
  searchParams: { dept?: string; year?: string; q?: string; page?: string };
}

export const revalidate = 1800;

// Education-focused departments
const DEPARTMENTS = [
  { code: "sed", name: "School Education", nameTa: "பள்ளிக்கல்வித்துறை" },
  { code: "hed", name: "Higher Education", nameTa: "உயர்கல்வித்துறை" },
  { code: "fd", name: "Finance (Pay/DA)", nameTa: "நிதித்துறை" },
  { code: "hd", name: "Health", nameTa: "சுகாதாரம்" },
];

// Education topics for filtering
const TOPICS = [
  { id: "teachers", name: "Teachers", nameTa: "ஆசிரியர்கள்" },
  { id: "exams", name: "Exams & Results", nameTa: "தேர்வுகள்" },
  { id: "salary", name: "Salary & Pay", nameTa: "சம்பளம்" },
  { id: "leave", name: "Leave Rules", nameTa: "விடுப்பு" },
  { id: "promotion", name: "Promotion", nameTa: "பதவி உயர்வு" },
  { id: "transfer", name: "Transfer", nameTa: "இடமாற்றம்" },
];

async function getQualityGOs(searchParams: PageProps["searchParams"]) {
  const { dept, year, q, page = "1" } = searchParams;
  const limit = 12;
  const currentPage = parseInt(page);

  const where: Record<string, unknown> = {};

  if (dept) {
    where.deptCode = dept;
  }

  if (year) {
    const startDate = new Date(parseInt(year), 0, 1);
    const endDate = new Date(parseInt(year) + 1, 0, 1);
    where.goDate = { gte: startDate, lt: endDate };
  }

  if (q) {
    where.OR = [
      { titleEn: { contains: q } },
      { titleTa: { contains: q } },
      { summaryEn: { contains: q } },
      { summaryTa: { contains: q } },
      { keywords: { contains: q } },
    ];
  }

  const [gos, total] = await Promise.all([
    prisma.qualityGO.findMany({
      where,
      orderBy: { goDate: "desc" },
      skip: (currentPage - 1) * limit,
      take: limit,
    }),
    prisma.qualityGO.count({ where }),
  ]);

  return {
    gos,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage,
  };
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTamil(date: Date) {
  const d = new Date(date);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default async function QualityGOPage({ searchParams }: PageProps) {
  const { gos, total, totalPages, currentPage } = await getQualityGOs(searchParams);

  const activeDept = searchParams.dept;
  const activeYear = searchParams.year;
  const searchQuery = searchParams.q;

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

  return (
    <div className="min-h-screen bg-gradient-to-b from-tn-background to-white">
      {/* Hero Header - Education Focused */}
      <div className="bg-gradient-to-r from-tn-primary to-tn-highlight text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText size={28} />
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Education Department GOs</h1>
                <p className="text-sm tamil text-emerald-100">கல்வித்துறை அரசாணைகள்</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={14} className="text-yellow-300" />
                {total} GOs
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                <Languages size={14} />
                Tamil & English
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <form className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search: teacher, exam, salary, leave..."
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-primary/50"
              />
            </div>

            {/* Department Filter */}
            <select
              name="dept"
              defaultValue={activeDept}
              className="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-primary/50 bg-white"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              name="year"
              defaultValue={activeYear}
              className="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-primary/50 bg-white"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-tn-primary text-white px-6 py-2.5 rounded-lg hover:bg-tn-highlight transition-colors flex items-center gap-2"
            >
              <Filter size={18} />
              Filter
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{gos.length}</span> of{" "}
            <span className="font-semibold">{total}</span> Government Orders
          </p>
          {(activeDept || activeYear || searchQuery) && (
            <Link href="/go" className="text-tn-primary hover:underline text-sm">
              Clear filters
            </Link>
          )}
        </div>

        {gos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm text-center py-16">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Government Orders Found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search query
            </p>
            <Link href="/go" className="btn-primary">
              View All GOs
            </Link>
          </div>
        ) : (
          <>
            {/* GO Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gos.map((go) => {
                const category = getGOCategory(go.deptCode, go.deptName, go.goType);
                const icon = getCategoryIcon(category);

                return (
                  <Link key={go.id} href={`/go/${go.id}`}>
                    <Card
                      category={category}
                      variant="elevated"
                      hoverable
                      className="h-full"
                    >
                      <CardHeader
                        title={`G.O. No. ${go.goNumber}`}
                        subtitle={formatDate(go.goDate)}
                        subtitleTamil={formatDateTamil(go.goDate)}
                        category={category}
                      />

                      <CardContent>
                        {/* GO Type */}
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{icon}</span>
                          <span className="text-xs font-medium text-gray-600">
                            {go.goType}
                          </span>
                        </div>

                        {/* Department */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 size={14} />
                          <span>{go.deptName}</span>
                          {go.deptNameTamil && (
                            <span className="text-gray-400 tamil text-xs">
                              ({go.deptNameTamil})
                            </span>
                          )}
                        </div>

                        {/* Tamil Summary */}
                        {go.summaryTa && (
                          <p className="tamil text-sm text-gray-700 line-clamp-2">
                            {go.summaryTa}
                          </p>
                        )}

                        {/* English Summary */}
                        {go.summaryEn && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {go.summaryEn}
                          </p>
                        )}
                      </CardContent>

                      <CardFooter className="!flex-wrap gap-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FileText size={12} />
                          {formatFileSize(go.fileSize)}
                        </span>
                        <div className="flex items-center gap-1 ml-auto">
                          {go.hasTamil && (
                            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded tamil text-[10px]">
                              தமிழ்
                            </span>
                          )}
                          {go.hasEnglish && (
                            <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">
                              EN
                            </span>
                          )}
                          {go.qualityScore >= 80 && (
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {currentPage > 1 && (
                  <Link
                    href={`/go?page=${currentPage - 1}${activeDept ? `&dept=${activeDept}` : ""}${activeYear ? `&year=${activeYear}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </Link>
                )}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Link
                      key={pageNum}
                      href={`/go?page=${pageNum}${activeDept ? `&dept=${activeDept}` : ""}${activeYear ? `&year=${activeYear}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-tn-primary text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                {currentPage < totalPages && (
                  <Link
                    href={`/go?page=${currentPage + 1}${activeDept ? `&dept=${activeDept}` : ""}${activeYear ? `&year=${activeYear}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
