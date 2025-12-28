import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Download,
  Share2,
  Newspaper,
} from "lucide-react";
import prisma from "@/lib/db";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getArticle(id: string) {
  const article = await prisma.newsArticle.findUnique({
    where: { id, status: "published" },
  });

  if (!article) return null;

  let document = null;
  if (article.documentId) {
    document = await prisma.document.findUnique({
      where: { id: article.documentId },
      include: { Category: true, Department: true },
    });
  }

  return { article, document };
}

async function getRelatedNews(id: string) {
  return prisma.newsArticle.findMany({
    where: {
      status: "published",
      id: { not: id },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getArticle(id);

  if (!data) {
    notFound();
  }

  const { article, document } = data;
  const relatedNews = await getRelatedNews(id);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-tn-primary text-white py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={18} />
            Back to News
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Featured Image */}
              {article.imageUrl && (
                <div className="w-full h-64 md:h-80 relative">
                  <Image
                    src={article.imageUrl}
                    alt={article.imageAlt || article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-6 md:p-8">
              {/* Meta */}
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(article.publishedAt!).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                {document && (
                  <span className="flex items-center gap-1 text-tn-primary">
                    <FileText size={14} />
                    Related Document
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-tn-text mb-4">
                {article.title}
              </h1>

              {article.titleTamil && (
                <h2 className="text-xl text-gray-600 tamil mb-6">
                  {article.titleTamil}
                </h2>
              )}

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 font-medium">{article.summary}</p>
                {article.summaryTamil && (
                  <p className="text-gray-600 tamil mt-2">
                    {article.summaryTamil}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap">
                  {article.content}
                </div>

                {article.contentTamil && (
                  <div className="mt-8 pt-8 border-t">
                    <h3 className="text-lg font-semibold text-tn-text mb-4 tamil">
                      தமிழில் படிக்க
                    </h3>
                    <div className="text-gray-700 tamil whitespace-pre-wrap">
                      {article.contentTamil}
                    </div>
                  </div>
                )}
              </div>

              {/* Share */}
              <div className="mt-8 pt-6 border-t flex items-center justify-between">
                <p className="text-sm text-gray-500">Share this article</p>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
              </div>
            </article>

            {/* Related Document */}
            {document && (
              <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-tn-primary" />
                  Related Document
                </h3>
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-tn-primary/10 rounded-lg">
                      <FileText className="text-tn-primary" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-tn-text mb-1">
                        {document.title}
                      </h4>
                      {document.goNumber && (
                        <p className="text-sm text-gray-500 mb-2">
                          {document.goNumber}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{document.Department.name}</span>
                        <span>•</span>
                        <span>{document.Category.name}</span>
                      </div>
                    </div>
                    <Link
                      href={`/documents/${document.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-tn-primary text-white rounded-lg hover:bg-tn-highlight transition-colors"
                    >
                      <Download size={16} />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related News */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
                <Newspaper size={18} className="text-tn-primary" />
                More News
              </h3>
              {relatedNews.length === 0 ? (
                <p className="text-sm text-gray-500">No related news</p>
              ) : (
                <div className="space-y-4">
                  {relatedNews.map((news) => (
                    <Link
                      key={news.id}
                      href={`/news/${news.id}`}
                      className="block hover:bg-gray-50 p-3 rounded-lg -mx-3 transition-colors"
                    >
                      <h4 className="font-medium text-tn-text line-clamp-2 text-sm">
                        {news.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(news.publishedAt!).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Browse Documents */}
            <div className="bg-tn-primary/5 rounded-xl p-6">
              <h3 className="font-semibold text-tn-text mb-2">
                Looking for Documents?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Browse our collection of government orders and circulars
              </p>
              <Link
                href="/documents"
                className="btn-primary w-full text-center block"
              >
                Browse Documents
              </Link>
            </div>

            {/* Subscribe */}
            <div className="bg-tn-accent/10 rounded-xl p-6">
              <h3 className="font-semibold text-tn-text mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get notifications for new articles and documents
              </p>
              <Link
                href="/subscribe"
                className="btn-primary w-full text-center block bg-tn-accent hover:bg-tn-accent/90"
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
