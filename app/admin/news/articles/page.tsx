"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Clock, FileText, Loader2, Search, X } from "lucide-react";
import Pagination from "@/components/admin/Pagination";

interface NewsArticle {
  id: string;
  title: string;
  titleTamil: string | null;
  summary: string;
  status: string;
  documentId: string | null;
  publishedAt: string | null;
  createdAt: string;
}

interface StatusCount {
  status: string;
  _count: number;
}

interface PaginatedResponse {
  items: NewsArticle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  statusCounts: StatusCount[];
}

export default function ArticlesPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const statusColors: Record<string, string> = {
    draft: "bg-purple-100 text-purple-700",
    published: "bg-green-100 text-green-700",
  };

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const response = await fetch(`/api/admin/news/articles?${params}`);
      const result = await response.json();
      setData(result);
    } catch {
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/news"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-tn-text">News Articles</h1>
            <p className="text-gray-600">Manage your published articles</p>
          </div>
        </div>
        <Link
          href="/admin/news/articles/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Write Article
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center justify-between">
          {error}
          <button onClick={() => setError("")}><X size={18} /></button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-tn-primary" size={32} />
        </div>
      ) : (
        <>
          {/* Status Summary */}
          {data?.statusCounts && data.statusCounts.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => { setStatusFilter(""); setPage(1); }}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  !statusFilter ? "bg-tn-primary text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                All ({data.total})
              </button>
              {data.statusCounts.map((s) => (
                <button
                  key={s.status}
                  onClick={() => { setStatusFilter(statusFilter === s.status ? "" : s.status); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    statusFilter === s.status
                      ? "bg-tn-primary text-white"
                      : statusColors[s.status] || "bg-gray-100"
                  }`}
                >
                  {s.status} ({s._count})
                </button>
              ))}
            </div>
          )}

          {/* Articles List */}
          <div className="bg-white rounded-xl shadow-sm">
            {data?.items.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FileText className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-lg font-medium">No articles yet</p>
                <p className="text-sm mt-1">
                  Start by reviewing leads or writing a new article
                </p>
                <Link
                  href="/admin/news/articles/new"
                  className="inline-flex items-center gap-2 mt-4 text-tn-primary hover:text-tn-highlight"
                >
                  <Plus size={16} />
                  Write your first article
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {data?.items.map((article) => (
                  <Link
                    key={article.id}
                    href={`/admin/news/articles/${article.id}`}
                    className="p-4 hover:bg-gray-50 transition-colors block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              statusColors[article.status] || "bg-gray-100"
                            }`}
                          >
                            {article.status}
                          </span>
                          {article.documentId && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <FileText size={12} />
                              Has document
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-tn-text line-clamp-1">
                          {article.title}
                        </h3>
                        {article.titleTamil && (
                          <p className="text-sm text-gray-600 tamil line-clamp-1">
                            {article.titleTamil}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {article.publishedAt
                              ? `Published ${new Date(article.publishedAt).toLocaleDateString()}`
                              : `Draft - ${new Date(article.createdAt).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {data && data.total > 0 && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              totalItems={data.total}
              pageSize={data.pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
            />
          )}
        </>
      )}
    </div>
  );
}
