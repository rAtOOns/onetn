import prisma from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FileText,
  Download,
  Calendar,
  Building2,
  ArrowLeft,
  Eye,
  Share2,
  ExternalLink,
  Star,
  CheckCircle,
  Globe,
  Hash,
  Clock,
  Copy,
} from "lucide-react";

interface PageProps {
  params: { id: string };
}

export const revalidate = 3600;
export const dynamicParams = true;

async function getGO(id: string) {
  const go = await prisma.qualityGO.findUnique({
    where: { id },
  });

  return go;
}

async function getRelatedGOs(go: NonNullable<Awaited<ReturnType<typeof getGO>>>) {
  return prisma.qualityGO.findMany({
    where: {
      id: { not: go.id },
      OR: [
        { deptCode: go.deptCode },
        { goDate: { gte: new Date(go.goDate.getTime() - 30 * 24 * 60 * 60 * 1000) } },
      ],
    },
    orderBy: { goDate: "desc" },
    take: 5,
  });
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTamil(date: Date) {
  const d = new Date(date);
  const months = [
    "ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்",
    "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

// Strip Tamil text from English summary to avoid duplication
function getCleanEnglishSummary(text: string | null): string | null {
  if (!text) return null;
  // Remove Tamil Unicode characters (U+0B80-U+0BFF)
  const cleaned = text.replace(/[\u0B80-\u0BFF]+/g, '').trim();
  // Clean up leftover formatting
  const result = cleaned
    .replace(/\s+/g, ' ')
    .replace(/^[-\s|:]+/, '')
    .replace(/[-\s|:]+$/, '')
    .trim();
  // Return null if nothing meaningful left
  return result.length > 5 ? result : null;
}

export async function generateMetadata({ params }: PageProps) {
  const go = await getGO(params.id);
  if (!go) return { title: "GO Not Found" };

  // Use clean English summary for description, fallback to Tamil
  const cleanDesc = getCleanEnglishSummary(go.summaryEn);
  const description = cleanDesc || go.summaryTa || `Government Order ${go.goNumber} dated ${formatDate(go.goDate)}`;

  return {
    title: `G.O. (${go.goType}) No. ${go.goNumber} - ${go.deptName} | Tamil Nadu`,
    description,
  };
}

export default async function GODetailPage({ params }: PageProps) {
  const go = await getGO(params.id);

  if (!go) {
    notFound();
  }

  const relatedGOs = await getRelatedGOs(go);

  return (
    <div className="min-h-screen bg-gradient-to-b from-tn-background to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm flex-wrap">
              <li>
                <Link href="/" className="text-gray-500 hover:text-tn-primary">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/go" className="text-gray-500 hover:text-tn-primary">
                  Government Orders
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <span className="text-tn-primary">
                  G.O. ({go.goType}) No. {go.goNumber}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/go"
          className="inline-flex items-center gap-2 text-tn-primary hover:text-tn-highlight mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Government Orders
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* GO Header Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-tn-primary to-tn-highlight p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        {go.goType}
                      </span>
                      {go.isVerified && (
                        <span className="bg-green-500/30 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <CheckCircle size={14} />
                          Verified
                        </span>
                      )}
                      {go.qualityScore >= 80 && (
                        <span className="bg-yellow-500/30 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <Star size={14} className="fill-yellow-300" />
                          Quality
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-1">
                      G.O. No. {go.goNumber}
                    </h1>
                    <p className="text-xl tamil text-emerald-100">
                      அரசாணை எண். {go.goNumber}
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-lg font-medium">{formatDate(go.goDate)}</p>
                    <p className="text-emerald-200 tamil">{formatDateTamil(go.goDate)}</p>
                  </div>
                </div>
              </div>

              {/* Department Info */}
              <div className="px-6 py-4 bg-gradient-to-r from-tn-accent/10 to-transparent border-b">
                <div className="flex items-center gap-3">
                  <Building2 className="text-tn-accent" size={24} />
                  <div>
                    <p className="font-semibold text-tn-text">{go.deptName}</p>
                    {go.deptNameTamil && (
                      <p className="text-sm text-gray-500 tamil">{go.deptNameTamil}</p>
                    )}
                  </div>
                  <span className="ml-auto bg-tn-accent/20 text-tn-accent px-3 py-1 rounded-full text-sm font-medium">
                    {go.deptCode.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content Sections */}
              <div className="p-6 space-y-6">
                {/* English Section - only show if there's clean English content */}
                {(() => {
                  const cleanSummary = getCleanEnglishSummary(go.summaryEn);
                  return (go.titleEn || cleanSummary) && (
                    <div className="rounded-xl border border-blue-200 overflow-hidden">
                      <div className="bg-blue-50 px-4 py-2 flex items-center gap-2 border-b border-blue-200">
                        <Globe size={16} className="text-blue-600" />
                        <span className="font-medium text-blue-800">English</span>
                      </div>
                      <div className="p-4 bg-white">
                        <h2 className="text-lg font-semibold text-tn-text mb-2">
                          {go.titleEn}
                        </h2>
                        {cleanSummary && (
                          <p className="text-gray-600 leading-relaxed">
                            {cleanSummary}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Tamil Section - Highlighted */}
                {(go.titleTa || go.summaryTa) && (
                  <div className="rounded-xl border border-amber-200 overflow-hidden">
                    <div className="bg-amber-50 px-4 py-2 flex items-center gap-2 border-b border-amber-200">
                      <span className="text-amber-700 tamil font-medium">தமிழ்</span>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-amber-50/50 to-white">
                      {/* Show summaryTa as main content, or titleTa if no summary */}
                      <p className="text-gray-700 leading-relaxed tamil text-lg">
                        {go.summaryTa || go.titleTa}
                      </p>
                    </div>
                  </div>
                )}

                {/* Keywords */}
                {go.keywords && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <Hash size={14} />
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {go.keywords.split(",").map((keyword, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-default"
                        >
                          {keyword.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <a
                    href={go.fileUrl}
                    download={go.fileName}
                    className="btn-primary flex items-center gap-2 flex-1 justify-center md:flex-none"
                  >
                    <Download size={20} />
                    Download PDF ({formatFileSize(go.fileSize)})
                  </a>
                  <button
                    type="button"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* PDF Preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold text-tn-text flex items-center gap-2">
                  <Eye size={20} className="text-tn-primary" />
                  Document Preview
                </h2>
                <a
                  href={go.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tn-primary hover:text-tn-highlight flex items-center gap-1 text-sm"
                >
                  <ExternalLink size={16} />
                  Open in new tab
                </a>
              </div>
              <div className="bg-gray-100" style={{ height: "700px" }}>
                <embed
                  src={go.fileUrl}
                  type="application/pdf"
                  className="w-full h-full"
                  title={`G.O. No. ${go.goNumber}`}
                />
              </div>
              <div className="px-6 py-3 bg-gray-50 text-center text-sm text-gray-500">
                If preview doesn&apos;t load, please{" "}
                <a href={go.fileUrl} download className="text-tn-primary hover:underline">
                  download the document
                </a>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-tn-text mb-4 flex items-center gap-2">
                <Share2 size={20} className="text-tn-primary" />
                Share this GO
              </h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/?text=G.O. (${go.goType}) No. ${go.goNumber} - ${go.deptName}%0A${typeof window !== 'undefined' ? window.location.href : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://telegram.me/share/url?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}&text=G.O. (${go.goType}) No. ${go.goNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  Telegram
                </a>
                <button
                  type="button"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Copy size={16} />
                  Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
                <FileText size={18} className="text-tn-primary" />
                GO Details
              </h3>
              <dl className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <dt className="text-gray-500 text-sm">GO Number</dt>
                  <dd className="font-bold text-tn-text text-lg">{go.goNumber}</dd>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <dt className="text-gray-500 text-sm">Type</dt>
                  <dd className="font-medium text-tn-text bg-tn-primary/10 px-2 py-0.5 rounded">
                    {go.goType}
                  </dd>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <dt className="text-gray-500 text-sm">Date</dt>
                  <dd className="font-medium text-tn-text">{formatDate(go.goDate)}</dd>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <dt className="text-gray-500 text-sm">Department</dt>
                  <dd className="font-medium text-tn-text text-right">{go.deptCode.toUpperCase()}</dd>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <dt className="text-gray-500 text-sm">File Size</dt>
                  <dd className="font-medium text-tn-text">{formatFileSize(go.fileSize)}</dd>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <dt className="text-gray-500 text-sm">Quality Score</dt>
                  <dd className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            go.qualityScore >= 80
                              ? "bg-green-500"
                              : go.qualityScore >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${go.qualityScore}%` }}
                        />
                      </div>
                      <span className="text-sm">{go.qualityScore}%</span>
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-gray-500 text-sm">Content</dt>
                  <dd className="flex gap-1">
                    {go.hasTamil && (
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs tamil">
                        தமிழ்
                      </span>
                    )}
                    {go.hasEnglish && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                        EN
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Source Info */}
            {go.sourceUrl && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-tn-text mb-3">Source</h3>
                <a
                  href={go.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tn-primary hover:underline text-sm flex items-center gap-1 break-all"
                >
                  <ExternalLink size={14} />
                  View original source
                </a>
              </div>
            )}

            {/* Related GOs */}
            {relatedGOs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-tn-text mb-4">Related GOs</h3>
                <div className="space-y-3">
                  {relatedGOs.map((rgo) => (
                    <Link
                      key={rgo.id}
                      href={`/go/${rgo.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-tn-text group-hover:text-tn-primary">
                          G.O. No. {rgo.goNumber}
                        </span>
                        <span className="text-xs text-gray-400">
                          {rgo.deptCode.toUpperCase()}
                        </span>
                      </div>
                      {rgo.summaryTa && (
                        <p className="text-xs text-gray-500 tamil line-clamp-1">
                          {rgo.summaryTa}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(rgo.goDate)}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/go?dept=${go.deptCode}`}
                  className="block text-center text-tn-primary hover:underline text-sm mt-4"
                >
                  View all {go.deptName} GOs
                </Link>
              </div>
            )}

            {/* Help Card */}
            <div className="bg-gradient-to-br from-tn-primary/5 to-tn-accent/5 rounded-2xl p-6 border border-tn-primary/10">
              <h3 className="font-semibold text-tn-text mb-2">Need help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Can&apos;t find what you&apos;re looking for? Request a specific document.
              </p>
              <Link href="/request" className="btn-primary w-full text-center text-sm">
                Request a Document
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
