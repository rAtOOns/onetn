"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  FileText,
  Search,
} from "lucide-react";
import Pagination from "@/components/admin/Pagination";

interface Topic {
  id: string;
  name: string;
  nameTamil: string | null;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  _count: {
    Document: number;
  };
}

interface PaginatedResponse {
  items: Topic[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function TopicsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Topic | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formData, setFormData] = useState({
    name: "",
    nameTamil: "",
    description: "",
    icon: "",
    color: "#065f46",
  });

  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
      });
      const response = await fetch(`/api/admin/topics?${params}`);
      const result = await response.json();
      setData(result);
    } catch {
      setError("Failed to load topics");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const openAddModal = () => {
    setFormData({ name: "", nameTamil: "", description: "", icon: "", color: "#065f46" });
    setEditingTopic(null);
    setShowModal(true);
    setError("");
  };

  const openEditModal = (topic: Topic) => {
    setFormData({
      name: topic.name,
      nameTamil: topic.nameTamil || "",
      description: topic.description || "",
      icon: topic.icon || "",
      color: topic.color || "#065f46",
    });
    setEditingTopic(topic);
    setShowModal(true);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingTopic
        ? `/api/admin/topics/${editingTopic.id}`
        : "/api/admin/topics";
      const method = editingTopic ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save topic");
      }

      setShowModal(false);
      fetchTopics();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save topic");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/topics/${deleteConfirm.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete topic");
      }

      setDeleteConfirm(null);
      fetchTopics();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete topic");
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-tn-text">Topics</h1>
          <p className="text-gray-600">Manage document topics (Pension, Salary, etc.)</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Topic
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
          />
        </div>
      </div>

      {/* Error Message */}
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
          {/* Topics Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {data?.items.length === 0 ? (
              <div className="p-12 text-center">
                <Tag size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No topics found</p>
                <button onClick={openAddModal} className="btn-primary mt-4">
                  Add First Topic
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data?.items.map((topic) => (
                      <tr key={topic.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                              style={{ backgroundColor: topic.color || "#065f46" }}
                            >
                              {topic.icon || <Tag size={20} />}
                            </div>
                            <div>
                              <p className="font-medium text-tn-text">{topic.name}</p>
                              {topic.nameTamil && (
                                <p className="text-sm text-gray-500 tamil">{topic.nameTamil}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {topic.description || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FileText size={14} />
                            {topic._count.Document}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(topic)}
                              className="p-2 text-gray-500 hover:text-tn-primary hover:bg-gray-100 rounded-lg"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(topic)}
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
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-tn-text">
                {editingTopic ? "Edit Topic" : "Add Topic"}
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
                  placeholder="e.g., Pension"
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
                  placeholder="ஓய்வூதியம்"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight tamil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon (emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="💰"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 border rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : null}
                  {editingTopic ? "Update" : "Add"} Topic
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
            <h3 className="text-lg font-semibold text-tn-text mb-2">Delete Topic?</h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete &quot;{deleteConfirm.name}&quot;?
            </p>
            {deleteConfirm._count.Document > 0 && (
              <p className="text-amber-600 text-sm mb-4">
                This topic has {deleteConfirm._count.Document} documents. Remove them first.
              </p>
            )}
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setDeleteConfirm(null)} className="btn-outline" disabled={deleting}>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || deleteConfirm._count.Document > 0}
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
