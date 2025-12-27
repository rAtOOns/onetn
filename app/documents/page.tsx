import prisma from "@/lib/db";
import Link from "next/link";
import { FileText, Download, Calendar, Building2, Tag, Clock } from "lucide-react";
import FilterSidebar from "@/components/documents/FilterSidebar";
import DocumentTypeBadge from "@/components/documents/DocumentTypeBadge";
import { decodeHtmlEntities } from "@/lib/utils";

interface PageProps {
  searchParams: { category?: string; dept?: string; district?: string; topic?: string; year?: string; q?: string; page?: string };
}

export const revalidate = 1800; // Cache for 30 minutes

async function getDocuments(searchParams: PageProps["searchParams"]) {
  const { category, dept, district, topic, year, q, page = "1" } = searchParams;
  const limit = 12;
  const currentPage = parseInt(page);

  const where: Record<string, unknown> = {
    isPublished: true,
  };

  if (category) {
    where.Category = { slug: category };
  }

  if (dept) {
    where.Department = { slug: dept };
  }

  if (district) {
    where.District = { slug: district };
  }

  if (topic) {
    where.topic = { slug: topic };
  }

  if (year) {
    where.publishedYear = parseInt(year);
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { titleTamil: { contains: q } },
      { description: { contains: q } },
      { goNumber: { contains: q } },
    ];
  }

  const [documents, total, categories, departments, districts, topics] = await Promise.all([
    prisma.document.findMany({
      where,
      include: {
        Category: true,
        Department: true,
        District: true,
        Topic: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * limit,
      take: limit,
    }),
    prisma.document.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.district.findMany({ orderBy: { name: "asc" } }),
    prisma.topic.findMany({ orderBy: { name: "asc" } }),
  ]);

  // Get available years for filter
  const years = [2025, 2024, 2023, 2022, 2021, 2020];

  return {
    documents,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage,
    categories,
    departments,
    districts,
    topics,
    years,
  };
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default async function DocumentsPage({ searchParams }: PageProps) {
  const { documents, total, totalPages, currentPage, categories, departments, districts, topics, years } =
    await getDocuments(searchParams);

  const activeCategory = searchParams.category;
  const activeDept = searchParams.dept;
  const activeDistrict = searchParams.district;
  const activeTopic = searchParams.topic;
  const activeYear = searchParams.year;
  const searchQuery = searchParams.q;


  return (
    <div className="min-h-screen">
      {/* Page Header - Compact */}
      <div className="bg-tn-primary text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Government Documents <span className="tamil font-normal text-gray-300 text-base">அரசு ஆவணங்கள்</span></h1>
          </div>
          <p className="text-sm text-gray-300 hidden md:block">
            Browse GOs, circulars, forms & schemes
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <FilterSidebar
            topics={topics}
            categories={categories}
            departments={departments}
            districts={districts}
            years={years}
            activeFilters={{
              topic: activeTopic,
              category: activeCategory,
              dept: activeDept,
              district: activeDistrict,
              year: activeYear,
              q: searchQuery,
            }}
          />

          {/* Documents Grid */}
          <main className="flex-grow">
            {/* Results info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{documents.length}</span> of{" "}
                <span className="font-semibold">{total}</span> documents
              </p>
            </div>

            {documents.length === 0 ? (
              <div className="card text-center py-12">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No Documents Found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search query
                </p>
                <Link href="/documents" className="btn-primary">
                  View All Documents
                </Link>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/documents/${doc.id}`}
                      className="card hover:shadow-lg transition-all group focus:outline-none focus:ring-2 focus:ring-tn-primary"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-tn-primary/10 rounded-lg" aria-hidden="true">
                          <FileText className="text-tn-primary" size={24} />
                        </div>
                        <DocumentTypeBadge
                          fileType={doc.fileType}
                          category={doc.Category.name}
                          goNumber={doc.goNumber || undefined}
                          size="sm"
                        />
                      </div>

                      <h3 className="font-semibold text-tn-text mb-1 line-clamp-2 group-hover:text-tn-primary transition-colors">
                        {decodeHtmlEntities(doc.title)}
                      </h3>

                      {doc.titleTamil && (
                        <p className="text-sm text-gray-500 tamil mb-2 line-clamp-1">
                          {decodeHtmlEntities(doc.titleTamil)}
                        </p>
                      )}

                      {doc.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {doc.description}
                        </p>
                      )}

                      {doc.goNumber && (
                        <p className="text-xs text-tn-accent font-medium mb-2">
                          {doc.goNumber}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3 text-xs">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Building2 size={12} />
                          {doc.Department.name.substring(0, 20)}
                        </span>
                      </div>

                      <div className="pt-3 border-t space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={12} />
                          Updated {formatDate(doc.updatedAt)}
                          <span>•</span>
                          {formatFileSize(doc.fileSize)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {doc.downloads} views
                          </span>
                          <span className="flex items-center gap-1 text-tn-highlight group-hover:text-tn-primary text-sm font-medium transition-colors">
                            <Download size={16} />
                            View
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {currentPage > 1 && (
                      <Link
                        href={`/documents?page=${currentPage - 1}${activeCategory ? `&category=${activeCategory}` : ""}${activeDept ? `&dept=${activeDept}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </Link>
                    )}

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Link
                          key={pageNum}
                          href={`/documents?page=${pageNum}${activeCategory ? `&category=${activeCategory}` : ""}${activeDept ? `&dept=${activeDept}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
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
                        href={`/documents?page=${currentPage + 1}${activeCategory ? `&category=${activeCategory}` : ""}${activeDept ? `&dept=${activeDept}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
