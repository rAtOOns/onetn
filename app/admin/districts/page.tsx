"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  FileText,
  Search,
} from "lucide-react";
import Pagination from "@/components/admin/Pagination";

interface District {
  id: string;
  name: string;
  nameTamil: string | null;
  slug: string;
  _count: {
    Document: number;
    DocumentRequest: number;
  };
}

interface PaginatedResponse {
  items: District[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function DistrictsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<District | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formData, setFormData] = useState({
    name: "",
    nameTamil: "",
  });

  const fetchDistricts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
      });
      const response = await fetch(`/api/admin/districts?${params}`);
      const result = await response.json();
      setData(result);
    } catch {
      setError("Failed to load districts");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  const openAddModal = () => {
    setFormData({ name: "", nameTamil: "" });
    setEditingDistrict(null);
    setShowModal(true);
    setError("");
  };

  const openEditModal = (district: District) => {
    setFormData({
      name: district.name,
      nameTamil: district.nameTamil || "",
    });
    setEditingDistrict(district);
    setShowModal(true);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingDistrict
        ? `/api/admin/districts/${editingDistrict.id}`
        : "/api/admin/districts";
      const method = editingDistrict ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save district");
      }

      setShowModal(false);
      fetchDistricts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save district");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/districts/${deleteConfirm.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete district");
      }

      setDeleteConfirm(null);
      fetchDistricts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete district");
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-tn-text">Districts</h1>
          <p className="text-gray-600">Manage Tamil Nadu districts</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add District
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search districts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
          />
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
          {/* Districts Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {data?.items.length === 0 ? (
              <div className="p-12 text-center">
                <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No districts found</p>
                <button onClick={openAddModal} className="btn-primary mt-4">
                  Add First District
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data?.items.map((district) => (
                      <tr key={district.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-tn-primary/10 rounded-lg flex items-center justify-center">
                              <MapPin className="text-tn-primary" size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-tn-text">{district.name}</p>
                              {district.nameTamil && (
                                <p className="text-sm text-gray-500 tamil">{district.nameTamil}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FileText size={14} />
                            {district._count.Document}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {district._count.DocumentRequest}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(district)}
                              className="p-2 text-gray-500 hover:text-tn-primary hover:bg-gray-100 rounded-lg"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(district)}
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-tn-text">
                {editingDistrict ? "Edit District" : "Add District"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name (English) *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chennai"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name (Tamil)</label>
                <input
                  type="text"
                  value={formData.nameTamil}
                  onChange={(e) => setFormData({ ...formData, nameTamil: e.target.value })}
                  placeholder="சென்னை"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight tamil"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : null}
                  {editingDistrict ? "Update" : "Add"} District
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-tn-text mb-2">Delete District?</h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete &quot;{deleteConfirm.name}&quot;?
            </p>
            {(deleteConfirm._count.Document + deleteConfirm._count.DocumentRequest) > 0 && (
              <p className="text-amber-600 text-sm mb-4">
                This district has {deleteConfirm._count.Document} documents and {deleteConfirm._count.DocumentRequest} requests.
              </p>
            )}
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setDeleteConfirm(null)} className="btn-outline" disabled={deleting}>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || (deleteConfirm._count.Document + deleteConfirm._count.DocumentRequest) > 0}
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
