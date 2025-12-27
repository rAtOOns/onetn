import Link from "next/link";
import prisma from "@/lib/db";
import { FileText, Clock, ArrowRight, Calendar } from "lucide-react";

async function getTodaysDocuments() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get documents from last 7 days to always show something
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return prisma.document.findMany({
    where: {
      isPublished: true,
      createdAt: {
        gte: weekAgo,
      },
    },
    include: {
      Category: true,
      Department: true,
      Topic: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default async function TodaysGOs() {
  const documents = await getTodaysDocuments();

  return (
    <section className="py-6 bg-gradient-to-r from-tn-primary to-tn-government text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Latest GOs</h2>
              <p className="text-xs text-gray-300 tamil">சமீபத்திய அரசாணைகள்</p>
            </div>
          </div>
          <Link
            href="/documents"
            className="flex items-center gap-1 text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {documents.length === 0 ? (
          <p className="text-gray-300 text-sm">No new GOs in the last 7 days</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
            {documents.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all group"
              >
                <div className="flex items-start gap-2">
                  <FileText size={16} className="text-tn-accent mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-tn-accent transition-colors">
                      {doc.title}
                    </p>
                    {doc.goNumber && (
                      <p className="text-xs text-gray-300 mt-1">{doc.goNumber}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span className="px-1.5 py-0.5 bg-white/10 rounded">
                        {doc.Department.name.split(" ")[0]}
                      </span>
                      <span>{formatTimeAgo(doc.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
