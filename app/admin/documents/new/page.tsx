"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  nameTamil: string | null;
  slug: string;
}

interface Department {
  id: string;
  name: string;
  nameTamil: string | null;
  slug: string;
}

interface Topic {
  id: string;
  name: string;
  nameTamil: string | null;
  slug: string;
}

interface District {
  id: string;
  name: string;
  nameTamil: string | null;
  slug: string;
}

export default function NewDocumentPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    titleTamil: "",
    description: "",
    goNumber: "",
    categoryId: "",
    departmentId: "",
    topicId: "",
    districtId: "",
    publishedYear: new Date().getFullYear().toString(),
    isPublished: true,
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/departments").then((r) => r.json()),
      fetch("/api/topics").then((r) => r.json()),
      fetch("/api/districts").then((r) => r.json()),
    ]).then(([cats, depts, tops, dists]) => {
      setCategories(cats);
      setDepartments(depts);
      setTopics(tops);
      setDistricts(dists);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Upload file first
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json();
        throw new Error(uploadError.error || "Failed to upload file");
      }

      const uploadResult = await uploadResponse.json();

      // Create document with uploaded file info
      const response = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fileName: uploadResult.fileName,
          fileUrl: uploadResult.fileUrl,
          fileSize: uploadResult.fileSize,
          fileType: uploadResult.fileType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      router.push("/admin/documents");
      router.refresh();
    } catch {
      setError("Failed to upload document. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/documents"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text">Upload Document</h1>
          <p className="text-gray-600">Add a new document to the portal</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document File *
            </label>
            {file ? (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                <FileText className="text-tn-primary" size={24} />
                <div className="flex-1">
                  <p className="font-medium text-tn-text">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="text-gray-400 mb-2" size={32} />
                <p className="text-gray-600">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-400">PDF, DOC, XLS, Images (max 50MB)</p>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
              </label>
            )}
          </div>

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
                Published Year *
              </label>
              <select
                id="publishedYear"
                value={formData.publishedYear}
                onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                required
              >
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
                Topic (Pension, Salary, etc.)
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
                District (if specific)
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
              Publish immediately (visible to public)
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload Document
                </>
              )}
            </button>
            <Link
              href="/admin/documents"
              className="btn-outline"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
