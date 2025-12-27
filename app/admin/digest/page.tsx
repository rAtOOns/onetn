"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Trash2,
  Loader2,
  X,
  Search,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Pagination from "@/components/admin/Pagination";

interface DigestSubscriber {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  verifiedAt: string | null;
  createdAt: string;
}

interface PaginatedResponse {
  items: DigestSubscriber[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function DigestPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<DigestSubscriber | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
        ...(activeFilter && { isActive: activeFilter }),
      });
      const response = await fetch(`/api/admin/digest?${params}`);
      const result = await response.json();
      setData(result);
    } catch {
      setError("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, activeFilter]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const toggleActive = async (sub: DigestSubscriber) => {
    setToggling(sub.id);
    try {
      const response = await fetch(`/api/admin/digest/${sub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !sub.isActive }),
      });

      if (!response.ok) throw new Error("Failed to update");

      fetchSubscribers();
    } catch {
      setError("Failed to update subscriber");
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/digest/${deleteConfirm.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setDeleteConfirm(null);
      fetchSubscribers();
    } catch {
      setError("Failed to delete subscriber");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-tn-text">Digest Subscribers</h1>
        <p className="text-gray-600">Manage newsletter subscribers</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
            />
          </div>
          <select
            value={activeFilter}
            onChange={(e) => { setActiveFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
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
          {/* Subscribers Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {data?.items.length === 0 ? (
              <div className="p-12 text-center">
                <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No subscribers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscriber</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data?.items.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-tn-text">{sub.email}</p>
                          {sub.name && <p className="text-sm text-gray-500">{sub.name}</p>}
                        </td>
                        <td className="px-6 py-4">
                          {sub.verifiedAt ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle size={18} className="text-green-500" />
                              <span className="text-sm text-gray-500">{formatDate(sub.verifiedAt)}</span>
                            </div>
                          ) : (
                            <XCircle size={18} className="text-gray-300" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            sub.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}>
                            {sub.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(sub.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleActive(sub)}
                              disabled={toggling === sub.id}
                              className="p-2 text-gray-500 hover:text-tn-primary hover:bg-gray-100 rounded-lg"
                              title={sub.isActive ? "Deactivate" : "Activate"}
                            >
                              {toggling === sub.id ? (
                                <Loader2 className="animate-spin" size={18} />
                              ) : sub.isActive ? (
                                <ToggleRight size={18} className="text-green-500" />
                              ) : (
                                <ToggleLeft size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(sub)}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-tn-text mb-2">Delete Subscriber?</h3>
            <p className="text-gray-600 mb-6">
              Remove {deleteConfirm.email} from digest?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="btn-outline" disabled={deleting}>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
              >
                {deleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
