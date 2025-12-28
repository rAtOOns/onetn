"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, FileText, Trash2, ArrowLeft, Building2 } from "lucide-react";
import { getBookmarks, toggleBookmark } from "@/components/documents/BookmarkButton";

interface BookmarkedDocument {
  id: string;
  title: string;
  goNumber?: string | null;
  department: string;
  bookmarkedAt: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedDocument[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookmarks(getBookmarks());

    const handleChange = () => setBookmarks(getBookmarks());
    window.addEventListener("bookmarkChanged", handleChange);
    return () => window.removeEventListener("bookmarkChanged", handleChange);
  }, []);

  const handleRemove = (doc: BookmarkedDocument) => {
    toggleBookmark(doc);
    setBookmarks(getBookmarks());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-tn-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tn-background">
      {/* Header */}
      <div className="bg-tn-primary text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bookmark size={24} />
            <h1 className="text-xl md:text-2xl font-bold">Saved Documents <span className="tamil font-normal text-gray-300 text-base">சேமித்த ஆவணங்கள்</span></h1>
          </div>
          <p className="text-sm text-gray-300 hidden md:block">
            {bookmarks.length} document{bookmarks.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/go"
          className="inline-flex items-center gap-2 text-tn-primary hover:text-tn-highlight mb-6"
        >
          <ArrowLeft size={20} />
          Browse GOs
        </Link>

        {bookmarks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Bookmark className="mx-auto text-gray-300 mb-4" size={64} />
            <h2 className="text-xl font-semibold text-tn-text mb-2">No saved documents</h2>
            <p className="text-gray-600 mb-6">
              Save documents to access them quickly later.
            </p>
            <Link href="/go" className="btn-primary">
              Browse GOs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-tn-primary/10 rounded-lg flex-shrink-0">
                  <FileText className="text-tn-primary" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/documents/${doc.id}`}
                    className="block font-semibold text-tn-text hover:text-tn-primary line-clamp-1"
                  >
                    {doc.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    {doc.goNumber && (
                      <span className="px-2 py-0.5 bg-tn-accent/10 text-tn-accent rounded text-xs font-medium">
                        {doc.goNumber}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Building2 size={14} />
                      {doc.department}
                    </span>
                    <span>Saved {formatDate(doc.bookmarkedAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(doc)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Bookmarks are saved in your browser. They won&apos;t sync across devices.
          </p>
        </div>
      </div>
    </div>
  );
}
