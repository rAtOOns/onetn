import Link from "next/link";
import { Calendar, Newspaper, ArrowRight, FileText } from "lucide-react";
import prisma from "@/lib/db";

export const dynamic = 'force-dynamic';

async function getNews() {
  const articles = await prisma.newsArticle.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  return articles;
}

function formatDate(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-tn-primary text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Newspaper size={24} />
            <h1 className="text-xl md:text-2xl font-bold">
              Latest News{" "}
              <span className="tamil font-normal text-gray-300 text-base">
                அண்மை செய்திகள்
              </span>
            </h1>
          </div>
          <p className="text-sm text-gray-300 hidden md:block">
            Education updates & announcements
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {news.length === 0 ? (
          <div className="card text-center py-12">
            <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No News Available
            </h3>
            <p className="text-gray-500 mb-4">
              Check back later for the latest updates
            </p>
            <Link href="/documents" className="btn-primary">
              Browse Documents
            </Link>
          </div>
        ) : (
          <>
            {/* Featured News (First Item) */}
            <div className="mb-8">
              <article className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                  {news[0].imageUrl ? (
                    <div className="md:w-1/3 h-64 md:h-auto relative">
                      <img
                        src={news[0].imageUrl}
                        alt={news[0].imageAlt || news[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="md:w-1/3 h-64 md:h-auto bg-gradient-to-br from-tn-primary to-tn-highlight flex items-center justify-center">
                      <Newspaper size={64} className="text-white opacity-30" />
                    </div>
                  )}
                  <div className="p-6 md:p-8 md:w-2/3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span className="px-2 py-1 bg-tn-accent/10 text-tn-accent rounded-full text-xs font-medium">
                        Featured
                      </span>
                      <Calendar size={14} />
                      <span>{formatDate(news[0].publishedAt!)}</span>
                      {news[0].documentId && (
                        <span className="flex items-center gap-1 text-tn-primary">
                          <FileText size={12} />
                          Has Document
                        </span>
                      )}
                    </div>

                    <Link href={`/news/${news[0].id}`}>
                      <h2 className="text-2xl font-bold text-tn-text mb-3 hover:text-tn-primary transition-colors">
                        {news[0].title}
                      </h2>
                    </Link>

                    {news[0].titleTamil && (
                      <p className="text-lg text-gray-600 tamil mb-4">
                        {news[0].titleTamil}
                      </p>
                    )}

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {news[0].summary}
                    </p>

                    <Link
                      href={`/news/${news[0].id}`}
                      className="inline-flex items-center gap-2 text-tn-primary font-medium hover:text-tn-highlight transition-colors"
                    >
                      Read Full Article
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            {/* News Grid */}
            {news.length > 1 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.slice(1).map((item) => (
                  <article
                    key={item.id}
                    className="card hover:shadow-lg transition-all group"
                  >
                    {item.imageUrl ? (
                      <div className="h-40 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.imageAlt || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-tn-government to-tn-primary rounded-lg mb-4 flex items-center justify-center">
                        <Newspaper size={32} className="text-white opacity-30" />
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Calendar size={14} />
                      <span>{formatDate(item.publishedAt!)}</span>
                      {item.documentId && (
                        <span className="flex items-center gap-1 text-tn-accent">
                          <FileText size={12} />
                        </span>
                      )}
                    </div>

                    <Link href={`/news/${item.id}`}>
                      <h3 className="font-semibold text-tn-text mb-2 line-clamp-2 group-hover:text-tn-primary transition-colors">
                        {item.title}
                      </h3>
                    </Link>

                    {item.titleTamil && (
                      <p className="text-sm text-gray-500 tamil mb-3 line-clamp-1">
                        {item.titleTamil}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.summary}
                    </p>

                    <Link
                      href={`/news/${item.id}`}
                      className="inline-flex items-center gap-1 text-tn-primary font-medium text-sm hover:text-tn-highlight transition-colors"
                    >
                      Read More
                      <ArrowRight size={14} />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* Official News Sources */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-tn-text mb-4">
            Official Sources
          </h2>
          <p className="text-gray-600 mb-4">
            Our news is verified from official government sources
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
              <div className="p-2 bg-tn-primary/10 rounded-lg">
                <Newspaper className="text-tn-primary" size={24} />
              </div>
              <div>
                <p className="font-medium text-tn-text">DGE Tamil Nadu</p>
                <p className="text-sm text-gray-500">School Education</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
              <div className="p-2 bg-tn-primary/10 rounded-lg">
                <Newspaper className="text-tn-primary" size={24} />
              </div>
              <div>
                <p className="font-medium text-tn-text">TN Government</p>
                <p className="text-sm text-gray-500">Official Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
              <div className="p-2 bg-tn-primary/10 rounded-lg">
                <Newspaper className="text-tn-primary" size={24} />
              </div>
              <div>
                <p className="font-medium text-tn-text">TRB / TNPSC</p>
                <p className="text-sm text-gray-500">Recruitment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
