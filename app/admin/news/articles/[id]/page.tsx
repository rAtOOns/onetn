"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  FileText,
  Search,
  ExternalLink,
  Bell,
  Send,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  titleTamil: string | null;
  summary: string;
  summaryTamil: string | null;
  content: string;
  contentTamil: string | null;
  documentId: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}

interface Document {
  id: string;
  title: string;
  goNumber: string | null;
}

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
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
  });

  useEffect(() => {
    fetchArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function fetchArticle() {
    try {
      const res = await fetch(`/api/admin/news/articles/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data);
        setForm({
          title: data.title || "",
          titleTamil: data.titleTamil || "",
          summary: data.summary || "",
          summaryTamil: data.summaryTamil || "",
          content: data.content || "",
          contentTamil: data.contentTamil || "",
          documentId: data.documentId || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch article:", error);
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

  async function handleSave() {
    if (!form.title || !form.summary || !form.content) {
      alert("Please fill in title, summary, and content");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/news/articles/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setArticle(data);
        alert("Saved successfully");
      } else {
        alert("Failed to save");
      }
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    setSaving(true);
    try {
      const newStatus = article?.status === "published" ? "draft" : "published";
      const res = await fetch(`/api/admin/news/articles/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setArticle(data);
      }
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await fetch(`/api/admin/news/articles/${params.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/news/articles");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }

  async function notifySubscribers() {
    if (!confirm("Send email notification to all subscribers about this article?")) return;

    setNotifying(true);
    try {
      const res = await fetch("/api/admin/news/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: params.id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Notifications sent to ${data.sent} subscribers`);
      } else {
        alert(data.error || "Failed to send notifications");
      }
    } catch (error) {
      console.error("Failed to notify:", error);
      alert("Failed to send notifications");
    } finally {
      setNotifying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-tn-primary" size={32} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Article not found</p>
        <Link
          href="/admin/news/articles"
          className="text-tn-primary hover:underline mt-2 inline-block"
        >
          Back to articles
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/news/articles"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  article.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {article.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-tn-text line-clamp-1">
              {article.title}
            </h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Save size={18} />
            Save
          </button>
          <button
            onClick={togglePublish}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg disabled:opacity-50 ${
              article.status === "published"
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-tn-primary text-white hover:bg-tn-highlight"
            }`}
          >
            {article.status === "published" ? (
              <>
                <EyeOff size={18} />
                Unpublish
              </>
            ) : (
              <>
                <Eye size={18} />
                Publish
              </>
            )}
          </button>
        </div>
      </div>

      {article.status === "published" && (
        <div className="bg-green-50 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-sm text-green-800">
            Published on {new Date(article.publishedAt!).toLocaleString()}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={notifySubscribers}
              disabled={notifying}
              className="flex items-center gap-2 text-sm px-3 py-1.5 bg-tn-accent text-white rounded-lg hover:bg-tn-accent/90 disabled:opacity-50"
            >
              {notifying ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Notify Subscribers
            </button>
            <Link
              href={`/news/${article.id}`}
              target="_blank"
              className="text-sm text-green-700 hover:text-green-900 flex items-center gap-1"
            >
              View on site <ExternalLink size={14} />
            </Link>
          </div>
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
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Summary
                </label>
                <textarea
                  value={form.summary}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  rows={3}
                  className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Content
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  rows={10}
                  className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Tamil Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-tn-text mb-4">Tamil Content</h2>

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
                  rows={10}
                  className="w-full border rounded-lg p-3 resize-none tamil focus:ring-2 focus:ring-tn-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Link Document */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <FileText size={18} />
              Linked Document
            </h2>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchDocuments()}
                placeholder="Search documents"
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
              <div className="border rounded-lg divide-y max-h-48 overflow-y-auto mb-3">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, documentId: doc.id }))
                    }
                    className={`w-full text-left p-3 hover:bg-gray-50 ${
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

            {form.documentId ? (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  Document linked
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
            ) : (
              <p className="text-sm text-gray-500">No document linked</p>
            )}
          </div>

          {/* Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-3">Article Info</h3>
            <dl className="text-sm space-y-2">
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd>{new Date(article.createdAt).toLocaleString()}</dd>
              </div>
              {article.publishedAt && (
                <div>
                  <dt className="text-gray-500">Published</dt>
                  <dd>{new Date(article.publishedAt).toLocaleString()}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">ID</dt>
                <dd className="font-mono text-xs">{article.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
