import prisma from "@/lib/db";
import Link from "next/link";
import {
  Newspaper,
  Inbox,
  FileEdit,
  CheckCircle,
  Plus,
  Eye,
  Clock,
  ExternalLink,
} from "lucide-react";

export const dynamic = 'force-dynamic';

async function getNewsStats() {
  const [
    pendingLeads,
    reviewingLeads,
    draftArticles,
    publishedArticles,
    recentLeads,
    recentArticles,
  ] = await Promise.all([
    prisma.newsLead.count({ where: { status: "pending" } }),
    prisma.newsLead.count({ where: { status: "reviewing" } }),
    prisma.newsArticle.count({ where: { status: "draft" } }),
    prisma.newsArticle.count({ where: { status: "published" } }),
    prisma.newsLead.findMany({
      take: 5,
      orderBy: { fetchedAt: "desc" },
      where: { status: { in: ["pending", "reviewing"] } },
    }),
    prisma.newsArticle.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    pendingLeads,
    reviewingLeads,
    draftArticles,
    publishedArticles,
    recentLeads,
    recentArticles,
  };
}

export default async function AdminNewsPage() {
  const stats = await getNewsStats();

  const statCards = [
    {
      name: "Pending Leads",
      value: stats.pendingLeads,
      icon: Inbox,
      color: "bg-amber-500",
      href: "/admin/news/leads?status=pending",
    },
    {
      name: "Under Review",
      value: stats.reviewingLeads,
      icon: Eye,
      color: "bg-blue-500",
      href: "/admin/news/leads?status=reviewing",
    },
    {
      name: "Draft Articles",
      value: stats.draftArticles,
      icon: FileEdit,
      color: "bg-purple-500",
      href: "/admin/news/articles?status=draft",
    },
    {
      name: "Published",
      value: stats.publishedArticles,
      icon: CheckCircle,
      color: "bg-green-500",
      href: "/admin/news/articles?status=published",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-tn-text">News Management</h1>
          <p className="text-gray-600">
            Review leads from sources, verify, and publish original articles
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/news/fetch"
            className="btn-secondary flex items-center gap-2"
          >
            <Inbox size={20} />
            Fetch New Leads
          </Link>
          <Link
            href="/admin/news/articles/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Write Article
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-tn-text">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Leads */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-semibold text-tn-text flex items-center gap-2">
              <Inbox size={20} className="text-amber-500" />
              Pending Leads
            </h2>
            <Link
              href="/admin/news/leads"
              className="text-sm text-tn-primary hover:text-tn-highlight"
            >
              View All
            </Link>
          </div>
          <div className="divide-y">
            {stats.recentLeads.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Inbox className="mx-auto mb-2 text-gray-300" size={40} />
                <p>No pending leads</p>
                <p className="text-sm mt-1">
                  Click &quot;Fetch New Leads&quot; to get latest news from sources
                </p>
              </div>
            ) : (
              stats.recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/news/leads/${lead.id}`}
                  className="p-4 hover:bg-gray-50 transition-colors block"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        lead.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {lead.status}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-tn-text line-clamp-2">
                        {lead.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{lead.sourceName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(lead.fetchedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-gray-400 flex-shrink-0" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-semibold text-tn-text flex items-center gap-2">
              <Newspaper size={20} className="text-tn-primary" />
              Recent Articles
            </h2>
            <Link
              href="/admin/news/articles"
              className="text-sm text-tn-primary hover:text-tn-highlight"
            >
              View All
            </Link>
          </div>
          <div className="divide-y">
            {stats.recentArticles.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <FileEdit className="mx-auto mb-2 text-gray-300" size={40} />
                <p>No articles yet</p>
                <p className="text-sm mt-1">
                  Start by reviewing leads or writing a new article
                </p>
              </div>
            ) : (
              stats.recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/news/articles/${article.id}`}
                  className="p-4 hover:bg-gray-50 transition-colors block"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        article.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {article.status}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-tn-text line-clamp-2">
                        {article.title}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                        {article.summary}
                      </p>
                      <div className="text-xs text-gray-400 mt-1">
                        {article.publishedAt
                          ? `Published ${new Date(article.publishedAt).toLocaleDateString()}`
                          : `Draft - ${new Date(article.createdAt).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Workflow Info */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">How News Workflow Works</h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-blue-900">Fetch Leads</p>
              <p className="text-blue-700">
                Get headlines from education news sources
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-blue-900">Review & Verify</p>
              <p className="text-blue-700">
                Check official sources (DGE, TN.gov) to verify
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-blue-900">Write Article</p>
              <p className="text-blue-700">
                Create original content with your own summary
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <p className="font-medium text-blue-900">Publish</p>
              <p className="text-blue-700">
                Link to GO document and publish to users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
