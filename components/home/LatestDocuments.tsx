import Link from "next/link";
import prisma from "@/lib/db";
import { FileText, Download, Calendar, Building2, Tag, Clock, ArrowRight } from "lucide-react";

async function getLatestDocuments() {
  return prisma.document.findMany({
    where: { isPublished: true },
    include: {
      Category: true,
      Department: true,
      Topic: true,
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

function formatDate(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default async function LatestDocuments() {
  const documents = await getLatestDocuments();

  if (documents.length === 0) return null;

  return (
    <section className="py-8 bg-tn-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="text-tn-primary" size={20} />
            <h2 className="text-xl font-bold text-tn-text">Latest Documents</h2>
            <span className="text-sm text-gray-500 tamil">சமீபத்திய ஆவணங்கள்</span>
          </div>
          <Link
            href="/documents"
            className="flex items-center gap-1 text-sm text-tn-primary hover:text-tn-highlight font-medium"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-tn-primary/10 rounded-lg flex-shrink-0">
                  <FileText className="text-tn-primary" size={20} />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-sm text-tn-text line-clamp-2 mb-1">
                    {doc.title}
                  </h3>
                  {doc.titleTamil && (
                    <p className="text-xs text-gray-400 tamil line-clamp-1 mb-2">
                      {doc.titleTamil}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Building2 size={12} />
                      {doc.Department.name}
                    </span>
                    {doc.Topic && (
                      <span className="px-2 py-0.5 bg-tn-accent/10 text-tn-accent rounded-full">
                        {doc.Topic.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={12} />
                      {formatDate(doc.createdAt)}
                    </span>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-tn-highlight hover:text-tn-primary font-medium"
                    >
                      <Download size={14} />
                      {doc.fileType.toUpperCase()}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
