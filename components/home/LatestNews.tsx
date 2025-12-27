import Link from "next/link";
import prisma from "@/lib/db";
import { Newspaper, Clock, ArrowRight, Calendar } from "lucide-react";

async function getLatestNews() {
  return prisma.newsArticle.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 5,
  });
}

function formatTimeAgo(date: Date | null) {
  if (!date) return "";
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default async function LatestNews() {
  const news = await getLatestNews();

  return (
    <section className="py-6 bg-gradient-to-r from-tn-primary to-tn-government text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Newspaper size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Latest News</h2>
              <p className="text-xs text-gray-300 tamil">சமீபத்திய செய்திகள்</p>
            </div>
          </div>
          <Link
            href="/news"
            className="flex items-center gap-1 text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {news.length === 0 ? (
          <p className="text-gray-300 text-sm">No news articles yet. Check back soon!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
            {news.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.id}`}
                className="bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-all group"
              >
                <div className="flex items-start gap-2">
                  <Newspaper size={16} className="text-tn-accent mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-tn-accent transition-colors">
                      {article.title}
                    </p>
                    {article.titleTamil && (
                      <p className="text-xs text-gray-300 tamil mt-1 line-clamp-1">
                        {article.titleTamil}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span className="px-1.5 py-0.5 bg-white/10 rounded">
                        One TN
                      </span>
                      <span>{formatTimeAgo(article.publishedAt)}</span>
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
