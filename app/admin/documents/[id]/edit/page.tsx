"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Loader2,
  ArrowLeft,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  nameTamil: string | null;
}

interface Department {
  id: string;
  name: string;
  nameTamil: string | null;
}

interface Topic {
  id: string;
  name: string;
  nameTamil: string | null;
}

interface District {
  id: string;
  name: string;
  nameTamil: string | null;
}

interface Document {
  id: string;
  title: string;
  titleTamil: string | null;
  description: string | null;
  goNumber: string | null;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  categoryId: string;
  departmentId: string;
  topicId: string | null;
  districtId: string | null;
  publishedYear: number | null;
  isPublished: boolean;
}

export default function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    titleTamil: "",
    description: "",
    goNumber: "",
    fileName: "",
    categoryId: "",
    departmentId: "",
    topicId: "",
    districtId: "",
    publishedYear: "",
    isPublished: true,
  });
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/documents/${id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/departments").then((r) => r.json()),
      fetch("/api/topics").then((r) => r.json()),
      fetch("/api/districts").then((r) => r.json()),
    ]).then(([doc, cats, depts, tops, dists]) => {
      setDocument(doc);
      setCategories(cats);
      setDepartments(depts);
      setTopics(tops);
      setDistricts(dists);
      setFormData({
        title: doc.title || "",
        titleTamil: doc.titleTamil || "",
        description: doc.description || "",
        goNumber: doc.goNumber || "",
        fileName: doc.fileName || "",
        categoryId: doc.categoryId || "",
        departmentId: doc.departmentId || "",
        topicId: doc.topicId || "",
        districtId: doc.districtId || "",
        publishedYear: doc.publishedYear?.toString() || "",
        isPublished: doc.isPublished ?? true,
      });
      setLoading(false);
    }).catch(() => {
      setError("Failed to load document");
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update document");
      }

      setSuccess("Document updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to update document. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      router.push("/admin/documents");
      router.refresh();
    } catch {
      setError("Failed to delete document. Please try again.");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-tn-primary" size={32} />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Document not found</p>
        <Link href="/admin/documents" className="btn-primary mt-4 inline-block">
          Back to Documents
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/documents"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-tn-text">Edit Document</h1>
            <p className="text-gray-600">Update document details</p>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>

      {/* Current File Info */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-tn-primary/10 rounded-lg">
            <FileText className="text-tn-primary" size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">
              {(document.fileSize / 1024).toFixed(1)} KB • {document.fileType}
            </p>
          </div>
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-sm"
          >
            View File
          </a>
        </div>
        <div>
          <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-2">
            File Name (Display Name)
          </label>
          <input
            id="fileName"
            type="text"
            value={formData.fileName}
            onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
            placeholder="Enter display file name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight bg-white"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title (English) *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter document title"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
              required
            />
          </div>

          {/* Title Tamil */}
          <div>
            <label htmlFor="titleTamil" className="block text-sm font-medium text-gray-700 mb-2">
              Title (Tamil)
            </label>
            <input
              id="titleTamil"
              type="text"
              value={formData.titleTamil}
              onChange={(e) => setFormData({ ...formData, titleTamil: e.target.value })}
              placeholder="தமிழ் தலைப்பு"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight tamil"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the document"
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
            />
          </div>

          {/* GO Number & Year */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="goNumber" className="block text-sm font-medium text-gray-700 mb-2">
                GO/Order Number
              </label>
              <input
                id="goNumber"
                type="text"
                value={formData.goNumber}
                onChange={(e) => setFormData({ ...formData, goNumber: e.target.value })}
                placeholder="e.g., GO(Ms)No.123/2024"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
              />
            </div>
            <div>
              <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-2">
                Published Year
              </label>
              <select
                id="publishedYear"
                value={formData.publishedYear}
                onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
              >
                <option value="">Select year</option>
                {[2025, 2024, 2023, 2022, 2021, 2020].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department & Category */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                id="department"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                required
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic & District */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <select
                id="topic"
                value={formData.topicId}
                onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
              >
                <option value="">Select topic (optional)</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <select
                id="district"
                value={formData.districtId}
                onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
              >
                <option value="">State-wide (all districts)</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Publish Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 text-tn-primary rounded focus:ring-tn-highlight"
            />
            <label htmlFor="isPublished" className="text-sm text-gray-700">
              Published (visible to public)
            </label>
          </div>

          {/* Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
              {success}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
            <Link href="/admin/documents" className="btn-outline">
              Cancel
            </Link>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-tn-text mb-2">Delete Document?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{document.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-outline"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
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
