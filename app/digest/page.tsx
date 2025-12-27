"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Calendar, FileText, CheckCircle, Loader2, TrendingUp, Clock } from "lucide-react";

interface DigestPreview {
  weekStart: string;
  weekEnd: string;
  documentCount: number;
  subscriberCount: number;
  topDocuments: Array<{
    id: string;
    title: string;
    downloads: number;
    Category: { name: string };
    Department: { name: string };
    createdAt: string;
  }>;
}

export default function DigestPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<DigestPreview | null>(null);

  useEffect(() => {
    fetch("/api/digest")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setPreview(data);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setSuccess(true);
      setEmail("");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-tn-background">
      {/* Compact Header */}
      <div className="bg-tn-primary text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail size={24} />
            <h1 className="text-xl md:text-2xl font-bold">Weekly GO Digest <span className="tamil font-normal text-gray-300 text-base">வாராந்திர அரசாணை சுருக்கம்</span></h1>
          </div>
          <p className="text-sm text-gray-300 hidden md:block">
            Curated GOs in your inbox
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">

          <div className="grid md:grid-cols-2 gap-8">
            {/* Subscribe Form */}
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-semibold text-tn-text mb-6 flex items-center gap-2">
                  <Calendar size={24} className="text-tn-primary" />
                  Subscribe to Digest
                </h2>

                {success ? (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-tn-text mb-2">
                      Successfully Subscribed!
                    </h3>
                    <p className="text-gray-600">
                      You&apos;ll receive your first digest on Monday.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name (Optional)
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Mail size={20} />
                          Subscribe to Weekly Digest
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Delivered every Monday morning. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>

              {/* What You Get */}
              <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-tn-text mb-4">What You&apos;ll Receive</h3>
                <ul className="space-y-3">
                  {[
                    "Top 10 most important GOs of the week",
                    "New schemes and circulars summary",
                    "Department-wise highlights",
                    "Quick links to download documents",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Preview */}
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-semibold text-tn-text mb-4 flex items-center gap-2">
                  <TrendingUp size={24} className="text-tn-accent" />
                  This Week&apos;s Preview
                </h2>

                {preview ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Clock size={14} />
                      {formatDate(preview.weekStart)} - {formatDate(preview.weekEnd)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-tn-primary/5 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-tn-primary">
                          {preview.documentCount}
                        </p>
                        <p className="text-xs text-gray-500">New Documents</p>
                      </div>
                      <div className="bg-tn-accent/5 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-tn-accent">
                          {preview.subscriberCount}
                        </p>
                        <p className="text-xs text-gray-500">Subscribers</p>
                      </div>
                    </div>

                    {preview.topDocuments.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">Top Documents</h4>
                        {preview.topDocuments.slice(0, 5).map((doc) => (
                          <Link
                            key={doc.id}
                            href={`/documents/${doc.id}`}
                            className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <p className="font-medium text-tn-text text-sm line-clamp-2">
                              {doc.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span>{doc.Department.name}</span>
                              <span>•</span>
                              <span>{doc.downloads} downloads</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="mx-auto mb-2" size={32} />
                        <p className="text-sm">No documents this week yet</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-gray-100 rounded"></div>
                    <div className="h-32 bg-gray-100 rounded"></div>
                  </div>
                )}
              </div>

              {/* Also Subscribe */}
              <div className="mt-6 bg-tn-government/5 rounded-xl p-6">
                <h3 className="font-semibold text-tn-text mb-2">Want Instant Alerts?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get notified immediately when new GOs are published in your areas of interest.
                </p>
                <Link href="/subscribe" className="btn-outline inline-flex items-center gap-2">
                  Setup Instant Alerts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
