"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, ExternalLink, Loader2, Search, X } from "lucide-react";
import Pagination from "@/components/admin/Pagination";

interface NewsLead {
  id: string;
  title: string;
  titleTamil: string | null;
  description: string | null;
  sourceName: string;
  sourceUrl: string;
  status: string;
  notes: string | null;
  fetchedAt: string;
}

interface SourceCount {
  sourceName: string;
  _count: number;
}

interface StatusCount {
  status: string;
  _count: number;
}

interface PaginatedResponse {
  items: NewsLead[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sources: SourceCount[];
  statusCounts: StatusCount[];
}

export default function LeadsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    reviewing: "bg-blue-100 text-blue-700",
    verified: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    published: "bg-purple-100 text-purple-700",
  };

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(sourceFilter && { source: sourceFilter }),
      });
      const response = await fetch(`/api/admin/news/leads?${params}`);
      const result = await response.json();
      setData(result);
    } catch {
      setError("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, sourceFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/news"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text">News Leads</h1>
          <p className="text-gray-600">
            Review headlines from education news sources
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search leads..."
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
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="published">Published</option>
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
          >
            <option value="">All Sources</option>
            {data?.sources.map((s) => (
              <option key={s.sourceName} value={s.sourceName}>
                {s.sourceName} ({s._count})
              </option>
            ))}
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

          {/* Leads List */}
          <div className="bg-white rounded-xl shadow-sm">
            {data?.items.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg font-medium">No leads found</p>
                <p className="text-sm mt-1">
                  Try fetching new leads or adjusting filters
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {data?.items.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/admin/news/leads/${lead.id}`}
                    className="p-4 hover:bg-gray-50 transition-colors block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              statusColors[lead.status] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {lead.status}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {lead.sourceName}
                          </span>
                        </div>
                        <h3 className="font-medium text-tn-text line-clamp-2">
                          {lead.title}
                        </h3>
                        {lead.titleTamil && (
                          <p className="text-sm text-gray-600 tamil mt-1 line-clamp-1">
                            {lead.titleTamil}
                          </p>
                        )}
                        {lead.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {lead.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(lead.fetchedAt).toLocaleString()}
                          </span>
                          {lead.notes && (
                            <span className="text-amber-600">Has notes</span>
                          )}
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-gray-400 flex-shrink-0 mt-1" />
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
