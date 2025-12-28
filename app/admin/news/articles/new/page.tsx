"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Eye, Loader2, FileText, Search, ImagePlus, X } from "lucide-react";

interface Lead {
  id: string;
  title: string;
  titleTamil: string | null;
  description: string | null;
  sourceName: string;
}

interface Document {
  id: string;
  title: string;
  goNumber: string | null;
}

function NewArticleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = searchParams.get("leadId");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lead, setLead] = useState<Lead | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchingDocs, setSearchingDocs] = useState(false);
  const [docSearch, setDocSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    titleTamil: "",
    summary: "",
    summaryTamil: "",
    content: "",
    contentTamil: "",
    documentId: "",
    imageUrl: "",
    imageAlt: "",
    status: "draft",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  async function fetchLead() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/news/leads/${leadId}`);
      if (res.ok) {
        const data = await res.json();
        setLead(data);
        setForm((prev) => ({
          ...prev,
          title: data.title || "",
          titleTamil: data.titleTamil || "",
          summary: data.description || "",
        }));
      }
    } catch (error) {
      console.error("Failed to fetch lead:", error);
    } finally {
      setLoading(false);
    }
  }

  async function searchDocuments() {
    if (!docSearch.trim()) return;
    setSearchingDocs(true);
    try {
      const res = await fetch(
        `/api/documents?search=${encodeURIComponent(docSearch)}&limit=10`
      );
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Failed to search documents:", error);
    } finally {
      setSearchingDocs(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "news");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          imageUrl: data.url,
          imageAlt: file.name.replace(/\.[^/.]+$/, ""),
        }));
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(publish = false) {
    if (!form.title || !form.summary || !form.content) {
      alert("Please fill in title, summary, and content");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/news/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: publish ? "published" : "draft",
          leadId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/news/articles/${data.id}`);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save article");
      }
    } catch (error) {
      console.error("Failed to save article:", error);
      alert("Failed to save article");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-tn-primary" size={32} />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-tn-text">Write Article</h1>
            {lead && (
              <p className="text-sm text-gray-500">
                Based on lead from {lead.sourceName}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Save size={18} />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-tn-primary text-white rounded-lg hover:bg-tn-highlight disabled:opacity-50"
          >
            <Eye size={18} />
            Publish
          </button>
        </div>
      </div>

      {lead && (
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Original lead:</strong> {lead.title}
          </p>
          {lead.description && (
            <p className="text-sm text-blue-600 mt-1">{lead.description}</p>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* English Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-tn-text mb-4">English Content</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Article title"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Summary * <span className="text-gray-400">(for listing)</span>
                </label>
                <textarea
                  value={form.summary}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  placeholder="Brief summary (2-3 sentences)"
                  rows={3}
                  className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Content *
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Full article content. Include key details, implications for teachers/staff, and any action items."
                  rows={10}
                  className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Tamil Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-tn-text mb-4">
              Tamil Content <span className="text-gray-400">(Optional)</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Tamil)
                </label>
                <input
                  type="text"
                  value={form.titleTamil}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, titleTamil: e.target.value }))
                  }
                  placeholder="தலைப்பு"
                  className="w-full border rounded-lg p-3 tamil focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Summary (Tamil)
                </label>
                <textarea
                  value={form.summaryTamil}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      summaryTamil: e.target.value,
                    }))
                  }
                  placeholder="சுருக்கம்"
                  rows={3}
                  className="w-full border rounded-lg p-3 resize-none tamil focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Content (Tamil)
                </label>
                <textarea
                  value={form.contentTamil}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      contentTamil: e.target.value,
                    }))
                  }
                  placeholder="முழு உள்ளடக்கம்"
                  rows={10}
                  className="w-full border rounded-lg p-3 resize-none tamil focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <ImagePlus size={18} />
              Featured Image
            </h2>

            {form.imageUrl ? (
              <div className="relative h-40 rounded-lg overflow-hidden">
                <Image
                  src={form.imageUrl}
                  alt={form.imageAlt || "Preview"}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() =>
                    setForm((prev) => ({ ...prev, imageUrl: "", imageAlt: "" }))
                  }
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
                <input
                  type="text"
                  value={form.imageAlt}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, imageAlt: e.target.value }))
                  }
                  placeholder="Image description (alt text)"
                  className="w-full border rounded-lg px-3 py-2 mt-3 text-sm focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                />
              </div>
            ) : (
              <label className="block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                {uploadingImage ? (
                  <Loader2 className="mx-auto animate-spin text-gray-400" size={32} />
                ) : (
                  <ImagePlus className="mx-auto text-gray-400" size={32} />
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {uploadingImage ? "Uploading..." : "Click to upload image"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
              </label>
            )}
          </div>

          {/* Link Document */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <FileText size={18} />
              Link to Document
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Attach a GO or document that this article is about.
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchDocuments()}
                placeholder="Search by GO number or title"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-tn-primary focus:border-transparent"
              />
              <button
                onClick={searchDocuments}
                disabled={searchingDocs}
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                {searchingDocs ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
              </button>
            </div>

            {documents.length > 0 && (
              <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, documentId: doc.id }))
                    }
                    className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                      form.documentId === doc.id ? "bg-tn-primary/10" : ""
                    }`}
                  >
                    <p className="text-sm font-medium line-clamp-1">
                      {doc.title}
                    </p>
                    {doc.goNumber && (
                      <p className="text-xs text-gray-500">{doc.goNumber}</p>
                    )}
                  </button>
                ))}
              </div>
            )}

            {form.documentId && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  Document linked: {form.documentId.slice(0, 8)}...
                </p>
                <button
                  onClick={() =>
                    setForm((prev) => ({ ...prev, documentId: "" }))
                  }
                  className="text-xs text-green-600 hover:underline mt-1"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-amber-50 rounded-xl p-6">
            <h3 className="font-semibold text-amber-900 mb-2">Writing Tips</h3>
            <ul className="text-sm text-amber-800 space-y-2">
              <li>• Write in your own words</li>
              <li>• Explain what it means for teachers</li>
              <li>• Include key dates and deadlines</li>
              <li>• Mention affected designations</li>
              <li>• Add action items if any</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewArticlePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-tn-primary" size={32} />
        </div>
      }
    >
      <NewArticleForm />
    </Suspense>
  );
}
