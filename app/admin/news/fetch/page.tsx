"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";

interface Source {
  id: string;
  name: string;
  url: string;
  description: string;
  enabled: boolean;
}

interface FetchResult {
  source: string;
  success: boolean;
  count: number;
  error?: string;
}

interface SourceCategory {
  name: string;
  nameTamil: string;
  sources: Source[];
}

const sourceCategories: SourceCategory[] = [
  {
    name: "Education Blogs",
    nameTamil: "கல்வி வலைப்பதிவுகள்",
    sources: [
      {
        id: "kalvisolai",
        name: "Kalvisolai",
        url: "https://www.kalvisolai.com",
        description: "Education news and GO updates",
        enabled: true,
      },
      {
        id: "padasalai",
        name: "Padasalai",
        url: "https://www.padasalai.net",
        description: "Teacher resources and news",
        enabled: true,
      },
      {
        id: "kalviexpress",
        name: "KalviExpress",
        url: "https://www.kalviexpress.in",
        description: "Education department updates",
        enabled: true,
      },
      {
        id: "kalvimalar",
        name: "KalviMalar",
        url: "https://kalvimalar.com",
        description: "Education news portal",
        enabled: true,
      },
      {
        id: "kalviseithi",
        name: "Kalvi Seithi",
        url: "https://kalviseithi.net",
        description: "Tamil education news",
        enabled: true,
      },
      {
        id: "kalvinews",
        name: "Kalvi News",
        url: "https://www.kalvinews.com",
        description: "Education sector updates",
        enabled: true,
      },
      {
        id: "kalvikural",
        name: "Kalvi Kural",
        url: "https://kalvikural.com",
        description: "Teacher community news",
        enabled: true,
      },
    ],
  },
  {
    name: "Recruitment & Exams",
    nameTamil: "ஆட்சேர்ப்பு & தேர்வுகள்",
    sources: [
      {
        id: "trbtnpsc",
        name: "TRB TNPSC Blog",
        url: "https://www.trbtnpsc.com",
        description: "Recruitment and exam updates",
        enabled: true,
      },
      {
        id: "tnpsclink",
        name: "TNPSC Link",
        url: "https://tnpsclink.in",
        description: "TNPSC exam notifications",
        enabled: true,
      },
      {
        id: "vidyaseva",
        name: "Vidyaseva",
        url: "https://www.vidyaseva.in",
        description: "Educational services portal",
        enabled: true,
      },
    ],
  },
  {
    name: "Official Sources",
    nameTamil: "அரசு தளங்கள்",
    sources: [
      {
        id: "dge_tnschools",
        name: "DGE TN Schools",
        url: "https://dge.tn.gov.in",
        description: "Directorate of Govt Examinations",
        enabled: true,
      },
      {
        id: "trb_official",
        name: "TRB Official",
        url: "https://trb.tn.gov.in",
        description: "Teachers Recruitment Board",
        enabled: true,
      },
    ],
  },
];

// Flatten sources for easy access
const allSources = sourceCategories.flatMap((cat) => cat.sources);

export default function FetchNewsPage() {
  const [fetching, setFetching] = useState(false);
  const [results, setResults] = useState<FetchResult[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(
    allSources.filter((s) => s.enabled).map((s) => s.id)
  );

  const toggleSource = (id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const fetchLeads = async () => {
    if (selectedSources.length === 0) {
      alert("Please select at least one source");
      return;
    }

    setFetching(true);
    setResults([]);

    try {
      const res = await fetch("/api/admin/news/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources: selectedSources }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      } else {
        alert("Failed to fetch leads");
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      alert("Failed to fetch leads");
    } finally {
      setFetching(false);
    }
  };

  const totalFetched = results.reduce((sum, r) => sum + (r.success ? r.count : 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/news"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text">Fetch News Leads</h1>
          <p className="text-gray-600">
            Get latest headlines from education news sources
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sources */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-tn-text">Select Sources</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSources(allSources.map((s) => s.id))}
                  className="text-xs px-3 py-1 text-tn-primary hover:bg-tn-primary/10 rounded"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedSources([])}
                  className="text-xs px-3 py-1 text-gray-500 hover:bg-gray-100 rounded"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {sourceCategories.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-medium text-gray-700">{category.name}</h3>
                    <span className="text-xs text-gray-400 tamil">{category.nameTamil}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {category.sources.map((source) => (
                      <label
                        key={source.id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedSources.includes(source.id)
                            ? "border-tn-primary bg-tn-primary/5"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSources.includes(source.id)}
                          onChange={() => toggleSource(source.id)}
                          className="w-4 h-4 text-tn-primary rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-tn-text truncate">
                              {source.name}
                            </span>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-tn-primary flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={12} />
                            </a>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{source.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {selectedSources.length} source(s) selected
              </p>
              <button
                onClick={fetchLeads}
                disabled={fetching || selectedSources.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-tn-primary text-white rounded-lg hover:bg-tn-highlight disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {fetching ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <RefreshCw size={20} />
                    Fetch Leads
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-tn-text mb-4">
                Fetch Results
                {totalFetched > 0 && (
                  <span className="ml-2 text-sm font-normal text-green-600">
                    ({totalFetched} new leads)
                  </span>
                )}
              </h2>
              <div className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.source}
                    className={`flex items-center gap-3 p-4 rounded-lg ${
                      result.success ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <XCircle className="text-red-500" size={20} />
                    )}
                    <div className="flex-1">
                      <span className="font-medium">
                        {allSources.find((s) => s.id === result.source)?.name ||
                          result.source}
                      </span>
                      {result.success ? (
                        <span className="text-sm text-green-600 ml-2">
                          {result.count} leads fetched
                        </span>
                      ) : (
                        <span className="text-sm text-red-600 ml-2">
                          {result.error || "Failed"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalFetched > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Link
                    href="/admin/news/leads?status=pending"
                    className="text-tn-primary hover:text-tn-highlight font-medium"
                  >
                    View pending leads →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>1. Select sources to fetch from</li>
              <li>2. Click &quot;Fetch Leads&quot; to get headlines</li>
              <li>3. Review leads in the queue</li>
              <li>4. Verify with official sources</li>
              <li>5. Write and publish your article</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl p-6">
            <h3 className="font-semibold text-amber-900 mb-2">Important</h3>
            <p className="text-sm text-amber-800">
              Leads are for discovery only. Always verify information with
              official government sources before publishing. Never copy content
              directly.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-2">
              Duplicate Prevention
            </h3>
            <p className="text-sm text-gray-600">
              The system automatically skips headlines that have already been
              fetched to avoid duplicates in your queue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
