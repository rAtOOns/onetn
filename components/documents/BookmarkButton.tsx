"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface BookmarkButtonProps {
  documentId: string;
  title: string;
  goNumber?: string | null;
  department: string;
  className?: string;
}

interface BookmarkedDocument {
  id: string;
  title: string;
  goNumber?: string | null;
  department: string;
  bookmarkedAt: string;
}

const BOOKMARKS_KEY = "onetn_bookmarks";

export function getBookmarks(): BookmarkedDocument[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(documentId: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.id === documentId);
}

export function toggleBookmark(doc: BookmarkedDocument): boolean {
  const bookmarks = getBookmarks();
  const existingIndex = bookmarks.findIndex((b) => b.id === doc.id);

  if (existingIndex >= 0) {
    bookmarks.splice(existingIndex, 1);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return false;
  } else {
    bookmarks.unshift({ ...doc, bookmarkedAt: new Date().toISOString() });
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return true;
  }
}

export default function BookmarkButton({
  documentId,
  title,
  goNumber,
  department,
  className = "",
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookmarked(isBookmarked(documentId));
  }, [documentId]);

  const handleToggle = () => {
    const newState = toggleBookmark({
      id: documentId,
      title,
      goNumber,
      department,
      bookmarkedAt: new Date().toISOString(),
    });
    setBookmarked(newState);

    // Dispatch event for other components to listen
    window.dispatchEvent(new CustomEvent("bookmarkChanged"));
  };

  if (!mounted) {
    return (
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-500 ${className}`}
        disabled
      >
        <Bookmark size={20} />
        Save
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        bookmarked
          ? "bg-tn-accent text-white hover:bg-tn-accent/90"
          : "border border-gray-300 text-gray-600 hover:bg-gray-50"
      } ${className}`}
      title={bookmarked ? "Remove from saved" : "Save for later"}
    >
      {bookmarked ? (
        <>
          <BookmarkCheck size={20} />
          Saved
        </>
      ) : (
        <>
          <Bookmark size={20} />
          Save
        </>
      )}
    </button>
  );
}
