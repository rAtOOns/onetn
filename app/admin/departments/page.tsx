"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  FileText,
  Search,
} from "lucide-react";
import Pagination from "@/components/admin/Pagination";

interface Department {
  id: string;
  name: string;
  nameTamil: string | null;
  slug: string;
  _count: {
    Document: number;
  };
}

interface PaginatedResponse {
  items: Department[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function DepartmentsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Department | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    nameTamil: "",
  });

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
      });
      const response = await fetch(`/api/admin/departments?${params}`);
      const result = await response.json();
      setData(result);
    } catch {
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const openAddModal = () => {
    setFormData({ name: "", nameTamil: "" });
    setEditingDepartment(null);
    setShowModal(true);
    setError("");
  };

  const openEditModal = (department: Department) => {
    setFormData({
      name: department.name,
      nameTamil: department.nameTamil || "",
    });
    setEditingDepartment(department);
    setShowModal(true);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingDepartment
        ? `/api/admin/departments/${editingDepartment.id}`
        : "/api/admin/departments";
      const method = editingDepartment ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save department");
      }

      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save department");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/departments/${deleteConfirm.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete department");
      }

      setDeleteConfirm(null);
      fetchDepartments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete department");
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-tn-text">Departments</h1>
          <p className="text-gray-600">Manage government departments</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Department
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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
          {/* Departments Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.items.map((department) => (
              <div
                key={department.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-tn-primary/10 rounded-lg">
                    <Building2 className="text-tn-primary" size={24} />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(department)}
                      className="p-2 text-gray-500 hover:text-tn-primary hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(department)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-tn-text mb-1">{department.name}</h3>
                {department.nameTamil && (
                  <p className="text-sm text-gray-600 tamil mb-3">{department.nameTamil}</p>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <FileText size={14} />
                  {department._count.Document} documents
                </div>
              </div>
            ))}

            {data?.items.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-xl">
                <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">{search ? "No departments match your search" : "No departments yet"}</p>
                {!search && (
                  <button onClick={openAddModal} className="btn-primary mt-4">
                    Add First Department
                  </button>
                )}
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
                {editingDepartment ? "Edit Department" : "Add Department"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name (English) *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., School Education"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                  required
                />
              </div>

              <div>
                <label htmlFor="nameTamil" className="block text-sm font-medium text-gray-700 mb-2">
                  Name (Tamil)
                </label>
                <input
                  id="nameTamil"
                  type="text"
                  value={formData.nameTamil}
                  onChange={(e) => setFormData({ ...formData, nameTamil: e.target.value })}
                  placeholder="பள்ளிக்கல்வி"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight tamil"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    editingDepartment ? "Update Department" : "Add Department"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-tn-text mb-2">Delete Department?</h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete &quot;{deleteConfirm.name}&quot;?
            </p>
            {deleteConfirm._count.Document > 0 && (
              <p className="text-amber-600 text-sm mb-4">
                Warning: This department has {deleteConfirm._count.Document} documents.
                You must move or delete them first.
              </p>
            )}
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-outline"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || deleteConfirm._count.Document > 0}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
