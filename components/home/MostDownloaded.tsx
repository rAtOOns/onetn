import Link from "next/link";
import prisma from "@/lib/db";
import { FileText, Download, TrendingUp, ArrowRight } from "lucide-react";

async function getMostDownloaded() {
  return prisma.document.findMany({
    where: { isPublished: true },
    orderBy: { downloads: "desc" },
    take: 6,
    include: {
      Category: true,
      Department: true,
    },
  });
}

export default async function MostDownloaded() {
  const documents = await getMostDownloaded();

  if (documents.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-tn-text mb-2 flex items-center gap-2">
              <TrendingUp className="text-tn-accent" size={28} />
              Most Downloaded
            </h2>
            <p className="text-gray-600 tamil">அதிகம் பதிவிறக்கம் செய்யப்பட்டவை</p>
          </div>
          <Link
            href="/documents?sort=downloads"
            className="btn-outline hidden md:inline-flex items-center gap-2"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, index) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all group flex items-start gap-4"
            >
              {/* Rank Badge */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                index === 0 ? "bg-yellow-500" :
                index === 1 ? "bg-gray-400" :
                index === 2 ? "bg-amber-600" :
                "bg-tn-primary"
              }`}>
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-tn-text group-hover:text-tn-primary transition-colors line-clamp-2">
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {doc.Department.name}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-tn-highlight font-medium">
                    <Download size={14} />
                    {doc.downloads.toLocaleString()}
                  </span>
                  <span className="text-gray-400">downloads</span>
                </div>
              </div>

              <FileText className="text-gray-300 group-hover:text-tn-primary transition-colors flex-shrink-0" size={24} />
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link href="/documents?sort=downloads" className="btn-outline inline-flex items-center gap-2">
            View All
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
