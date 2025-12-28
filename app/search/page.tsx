"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, FileText, Download, Calendar, Building2, Tag, Loader2 } from "lucide-react";

interface Document {
  id: string;
  title: string;
  titleTamil: string | null;
  description: string | null;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  downloads: number;
  createdAt: string;
  Category: { name: string; slug: string };
  Department: { name: string; slug: string };
}

interface SearchResult {
  documents: Document[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
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

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/documents?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Search Header - Compact */}
      <div className="bg-tn-primary text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold whitespace-nowrap">Search <span className="tamil font-normal text-gray-300 text-sm">தேடல்</span></h1>
            <form onSubmit={handleSearch} className="flex-grow max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search documents, GOs, forms..."
                  className="w-full py-2.5 px-4 pr-12 rounded-full text-tn-text bg-white
                           focus:outline-none focus:ring-2 focus:ring-tn-highlight/50"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-tn-highlight
                           text-white rounded-full hover:bg-tn-accent transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-tn-primary" size={48} />
          </div>
        ) : query && results ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Found <span className="font-semibold">{results.pagination.total}</span> results
                for &quot;<span className="font-semibold text-tn-primary">{query}</span>&quot;
              </p>
            </div>

            {results.documents.length === 0 ? (
              <div className="card text-center py-12">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try different keywords or browse all GOs
                </p>
                <Link href="/go" className="btn-primary">
                  Browse All GOs
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="card hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-tn-primary/10 rounded-lg">
                        <FileText className="text-tn-primary" size={24} />
                      </div>
                      <span className="text-xs px-2 py-1 bg-tn-highlight/10 text-tn-primary rounded-full">
                        {doc.fileType.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-semibold text-tn-text mb-1 line-clamp-2 group-hover:text-tn-primary transition-colors">
                      {doc.title}
                    </h3>

                    {doc.titleTamil && (
                      <p className="text-sm text-gray-500 tamil mb-2 line-clamp-1">
                        {doc.titleTamil}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3 text-xs">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Building2 size={12} />
                        {doc.Department.name}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Tag size={12} />
                        {doc.Category.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={12} />
                        {formatDate(doc.createdAt)}
                        <span>•</span>
                        {formatFileSize(doc.fileSize)}
                      </div>

                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-tn-highlight hover:text-tn-primary text-sm font-medium transition-colors"
                      >
                        <Download size={16} />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Search Government Documents
            </h2>
            <p className="text-gray-500 mb-6">
              Enter keywords to find government orders, forms, circulars, and schemes
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Government Orders", "Application Forms", "Schemes", "Circulars", "Tenders"].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-4 py-2 bg-tn-primary/10 hover:bg-tn-primary/20 text-tn-primary rounded-full transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <div className="bg-tn-primary text-white py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-xl font-bold">Search <span className="tamil font-normal text-gray-300 text-sm">தேடல்</span></h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-tn-primary" size={48} />
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
