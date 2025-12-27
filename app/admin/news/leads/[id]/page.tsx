"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  FileEdit,
  Search,
  Loader2,
} from "lucide-react";

interface Lead {
  id: string;
  title: string;
  titleTamil: string | null;
  description: string | null;
  sourceUrl: string;
  sourceName: string;
  status: string;
  fetchedAt: string;
  reviewedAt: string | null;
  notes: string | null;
  articleId: string | null;
}

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchLead();
  }, [params.id]);

  async function fetchLead() {
    try {
      const res = await fetch(`/api/admin/news/leads/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setLead(data);
        setNotes(data.notes || "");
      }
    } catch (error) {
      console.error("Failed to fetch lead:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/news/leads/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, notes }),
      });
      if (res.ok) {
        const data = await res.json();
        setLead(data);
      }
    } catch (error) {
      console.error("Failed to update lead:", error);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-tn-primary" size={32} />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lead not found</p>
        <Link href="/admin/news/leads" className="text-tn-primary hover:underline mt-2 inline-block">
          Back to leads
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    reviewing: "bg-blue-100 text-blue-700 border-blue-200",
    verified: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    published: "bg-purple-100 text-purple-700 border-purple-200",
  };

  const officialSources = [
    { name: "DGE Tamil Nadu", url: "https://dge.tn.gov.in" },
    { name: "DSE Tamil Nadu", url: "https://dse.tnschools.gov.in" },
    { name: "TN Government", url: "https://www.tn.gov.in" },
    { name: "TRB", url: "https://trb.tn.gov.in" },
    { name: "TNPSC", url: "https://tnpsc.gov.in" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/news/leads"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                statusColors[lead.status] || "bg-gray-100"
              }`}
            >
              {lead.status}
            </span>
            <span className="text-xs text-gray-500">from {lead.sourceName}</span>
          </div>
          <h1 className="text-xl font-bold text-tn-text">{lead.title}</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-tn-text mb-4">Lead Details</h2>

            {lead.titleTamil && (
              <div className="mb-4">
                <label className="text-xs text-gray-500">Tamil Title</label>
                <p className="tamil text-gray-700">{lead.titleTamil}</p>
              </div>
            )}

            {lead.description && (
              <div className="mb-4">
                <label className="text-xs text-gray-500">Description</label>
                <p className="text-gray-700">{lead.description}</p>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                Fetched: {new Date(lead.fetchedAt).toLocaleString()}
              </span>
              {lead.reviewedAt && (
                <span>Reviewed: {new Date(lead.reviewedAt).toLocaleString()}</span>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <a
                href={lead.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-tn-primary hover:text-tn-highlight"
              >
                <ExternalLink size={16} />
                View Original Source
              </a>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-tn-text mb-4">Review Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about verification, official source found, etc."
              className="w-full border rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-tn-primary focus:border-transparent"
            />
            <button
              onClick={() => updateStatus(lead.status === "pending" ? "reviewing" : lead.status)}
              disabled={updating}
              className="mt-3 text-sm text-tn-primary hover:text-tn-highlight disabled:opacity-50"
            >
              {updating ? "Saving..." : "Save Notes"}
            </button>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-tn-text mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              {lead.status === "pending" && (
                <button
                  onClick={() => updateStatus("reviewing")}
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  <Search size={18} />
                  Start Review
                </button>
              )}

              {(lead.status === "pending" || lead.status === "reviewing") && (
                <>
                  <button
                    onClick={() => updateStatus("verified")}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Mark Verified
                  </button>
                  <button
                    onClick={() => updateStatus("rejected")}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </>
              )}

              {lead.status === "verified" && !lead.articleId && (
                <Link
                  href={`/admin/news/articles/new?leadId=${lead.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-tn-primary text-white rounded-lg hover:bg-tn-highlight"
                >
                  <FileEdit size={18} />
                  Write Article
                </Link>
              )}

              {lead.articleId && (
                <Link
                  href={`/admin/news/articles/${lead.articleId}`}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  <FileEdit size={18} />
                  View Article
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Official Sources */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-tn-text mb-4">
              Verify with Official Sources
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Check these official websites to verify the information before publishing.
            </p>
            <div className="space-y-2">
              {officialSources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium">{source.name}</span>
                  <ExternalLink size={14} className="text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-6">
            <h3 className="font-semibold text-amber-900 mb-2">Verification Tips</h3>
            <ul className="text-sm text-amber-800 space-y-2">
              <li>• Search for GO number on official sites</li>
              <li>• Check the date matches official records</li>
              <li>• Verify department and subject</li>
              <li>• Download original GO if available</li>
              <li>• Note the official source URL in notes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
