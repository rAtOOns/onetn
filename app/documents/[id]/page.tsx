import prisma from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FileText,
  Download,
  Calendar,
  Building2,
  Tag,
  MapPin,
  ArrowLeft,
  Eye,
  Share2,
  ExternalLink,
} from "lucide-react";
import ShareButtons from "@/components/documents/ShareButtons";
import GOTimeline from "@/components/documents/GOTimeline";
import BookmarkButton from "@/components/documents/BookmarkButton";
import DocumentTypeBadge from "@/components/documents/DocumentTypeBadge";
import { decodeHtmlEntities } from "@/lib/utils";

interface PageProps {
  params: { id: string };
}

export const revalidate = 3600; // Cache for 1 hour
export const dynamicParams = true;

async function getDocument(id: string) {
  const document = await prisma.document.findUnique({
    where: { id, isPublished: true },
    include: {
      Category: true,
      Department: true,
      District: true,
    },
  });

  if (!document) return null;

  // Increment download count for view tracking
  await prisma.document.update({
    where: { id },
    data: { downloads: { increment: 1 } },
  });

  return document;
}

async function getRelatedDocuments(document: NonNullable<Awaited<ReturnType<typeof getDocument>>>) {
  return prisma.document.findMany({
    where: {
      isPublished: true,
      id: { not: document.id },
      OR: [
        { categoryId: document.categoryId },
        { departmentId: document.departmentId },
      ],
    },
    include: { Category: true, Department: true },
    take: 4,
    orderBy: { downloads: "desc" },
  });
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default async function DocumentDetailPage({ params }: PageProps) {
  const document = await getDocument(params.id);

  if (!document) {
    notFound();
  }

  const relatedDocuments = await getRelatedDocuments(document);
  const isPDF = document.fileType.toLowerCase() === "pdf";

  return (
    <div className="min-h-screen bg-tn-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm flex-wrap">
              <li>
                <Link href="/" className="text-gray-500 hover:text-tn-primary focus:outline-none focus:ring-1 focus:ring-tn-primary rounded px-1">
                  Home
                </Link>
              </li>
              <li className="text-gray-400" aria-hidden="true">/</li>
              <li>
                <Link href="/documents" className="text-gray-500 hover:text-tn-primary focus:outline-none focus:ring-1 focus:ring-tn-primary rounded px-1">
                  Documents
                </Link>
              </li>
              <li className="text-gray-400" aria-hidden="true">/</li>
              <li>
                <span className="text-tn-primary truncate max-w-xs" aria-current="page">{decodeHtmlEntities(document.title)}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <Link
              href="/documents"
              className="inline-flex items-center gap-2 text-tn-primary hover:text-tn-highlight mb-6"
            >
              <ArrowLeft size={20} />
              Back to Documents
            </Link>

            {/* Document Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-tn-primary/10 rounded-lg">
                  <FileText className="text-tn-primary" size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-tn-text flex-1">
                      {decodeHtmlEntities(document.title)}
                    </h1>
                    <DocumentTypeBadge
                      fileType={document.fileType}
                      category={document.Category.name}
                      goNumber={document.goNumber || undefined}
                      size="md"
                    />
                  </div>
                  {document.titleTamil && (
                    <p className="text-lg text-gray-600 tamil mb-2">
                      {decodeHtmlEntities(document.titleTamil)}
                    </p>
                  )}
                  {document.goNumber && (
                    <span className="inline-block px-3 py-1 bg-tn-accent/10 text-tn-accent rounded-full text-sm font-medium mt-2">
                      {document.goNumber}
                    </span>
                  )}
                </div>
              </div>

              {document.description && (
                <p className="text-gray-600 mb-4">{document.description}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <Building2 size={16} />
                  {document.Department.name}
                </span>
                <span className="flex items-center gap-1">
                  <Tag size={16} />
                  {document.Category.name}
                </span>
                {document.District && (
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {document.District.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {formatDate(document.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={16} />
                  {document.downloads.toLocaleString()} views
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={document.fileUrl}
                  download={document.fileName}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download size={20} />
                  Download ({formatFileSize(document.fileSize)})
                </a>
                <BookmarkButton
                  documentId={document.id}
                  title={decodeHtmlEntities(document.title)}
                  goNumber={document.goNumber}
                  department={document.Department.name}
                />
              </div>
            </div>

            {/* PDF Preview */}
            {isPDF && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-tn-text mb-4 flex items-center gap-2">
                  <Eye size={20} className="text-tn-primary" />
                  Document Preview
                </h2>
                {/* Local PDF files - use native browser embed */}
                {document.fileUrl.startsWith("/documents/") ? (
                  <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: "700px" }}>
                    <embed
                      src={document.fileUrl}
                      type="application/pdf"
                      className="w-full h-full"
                      title={decodeHtmlEntities(document.title)}
                    />
                  </div>
                ) : document.fileUrl.includes("drive.google.com") ? (
                  // Google Drive files - extract ID and use preview URL
                  <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: "600px" }}>
                    <iframe
                      src={document.fileUrl.replace("/uc?export=download&id=", "/file/d/").replace(/\/file\/d\/([^/]+).*/, "/file/d/$1/preview")}
                      className="w-full h-full"
                      title={decodeHtmlEntities(document.title)}
                      loading="lazy"
                      allow="autoplay"
                    />
                  </div>
                ) : (
                  // External links - show message with direct link
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-tn-text mb-2">Preview Not Available</h3>
                    <p className="text-gray-600 mb-4">
                      Click below to view or download.
                    </p>
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <ExternalLink size={18} />
                      Open Document
                    </a>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-3 text-center">
                  If preview doesn&apos;t load, please{" "}
                  <a href={document.fileUrl} download className="text-tn-primary hover:underline">
                    download the document
                  </a>
                </p>
              </div>
            )}

            {/* GO Timeline */}
            <GOTimeline documentId={document.id} />

            {/* Share Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-tn-text mb-4 flex items-center gap-2">
                <Share2 size={20} className="text-tn-primary" />
                Share this Document
              </h2>
              <ShareButtons
                title={decodeHtmlEntities(document.title)}
                url={`/documents/${document.id}`}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Document Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-tn-text mb-4">Document Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">File Type</dt>
                  <dd className="font-medium text-tn-text uppercase">{document.fileType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">File Size</dt>
                  <dd className="font-medium text-tn-text">{formatFileSize(document.fileSize)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Downloads</dt>
                  <dd className="font-medium text-tn-text">{document.downloads.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Published</dt>
                  <dd className="font-medium text-tn-text">{formatDate(document.createdAt)}</dd>
                </div>
              </dl>
            </div>

            {/* Related Documents */}
            {relatedDocuments.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-tn-text mb-4">Related Documents</h3>
                <div className="space-y-3">
                  {relatedDocuments.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/documents/${doc.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <p className="font-medium text-tn-text group-hover:text-tn-primary line-clamp-2 text-sm">
                        {decodeHtmlEntities(doc.title)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {doc.Department.name} • {doc.Category.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Request Document CTA */}
            <div className="bg-tn-primary/5 rounded-xl p-6 mt-6">
              <h3 className="font-semibold text-tn-text mb-2">Can&apos;t find a document?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Request a specific government document and we&apos;ll try to help you find it.
              </p>
              <Link href="/request" className="btn-primary w-full text-center">
                Request a Document
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
