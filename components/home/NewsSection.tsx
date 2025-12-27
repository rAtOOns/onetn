import Link from "next/link";
import { Calendar, ArrowRight, Newspaper, FileText } from "lucide-react";
import prisma from "@/lib/db";

async function getNews() {
  const articles = await prisma.newsArticle.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return articles;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function NewsSection() {
  const news = await getNews();

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-tn-text mb-2">
              Latest News & Updates
            </h2>
            <p className="text-gray-600 tamil">அண்மை செய்திகள் மற்றும் அறிவிப்புகள்</p>
          </div>
          <Link
            href="/news"
            className="btn-primary hidden md:inline-flex items-center gap-2"
          >
            View All News
            <ArrowRight size={18} />
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Newspaper className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No News Available</h3>
            <p className="text-gray-500 mb-4">Check back later for latest updates</p>
            <Link href="/documents" className="btn-primary">
              Browse Documents
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item) => (
              <article
                key={item.id}
                className="card hover:shadow-lg transition-all group"
              >
                <div className="h-40 bg-gradient-to-br from-tn-primary to-tn-highlight rounded-lg mb-4 flex items-center justify-center">
                  <Newspaper size={32} className="text-white opacity-30" />
                </div>

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
                  <h3 className="font-semibold text-tn-text mb-2 group-hover:text-tn-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>

                {item.titleTamil && (
                  <p className="text-sm text-gray-500 tamil mb-3 line-clamp-1">{item.titleTamil}</p>
                )}

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.summary}
                </p>

                <Link
                  href={`/news/${item.id}`}
                  className="text-tn-primary font-medium text-sm inline-flex items-center gap-1 hover:text-tn-highlight transition-colors"
                >
                  Read More
                  <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/news" className="btn-primary inline-flex items-center gap-2">
            View All News
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
