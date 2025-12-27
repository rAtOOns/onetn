import prisma from "@/lib/db";
import Link from "next/link";
import {
  FileText,
  FolderOpen,
  Building2,
  Download,
  TrendingUp,
  Plus,
  Newspaper,
  Inbox,
} from "lucide-react";

async function getStats() {
  const [documentCount, categoryCount, departmentCount, totalDownloads, recentDocuments, pendingLeads, publishedArticles] =
    await Promise.all([
      prisma.document.count(),
      prisma.category.count(),
      prisma.department.count(),
      prisma.document.aggregate({ _sum: { downloads: true } }),
      prisma.document.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { Category: true, Department: true },
      }),
      prisma.newsLead.count({ where: { status: "pending" } }),
      prisma.newsArticle.count({ where: { status: "published" } }),
    ]);

  return {
    documentCount,
    categoryCount,
    departmentCount,
    totalDownloads: totalDownloads._sum.downloads || 0,
    recentDocuments,
    pendingLeads,
    publishedArticles,
  };
}

export default async function AdminDashboard() {
  const { documentCount, categoryCount, departmentCount, totalDownloads, recentDocuments, pendingLeads, publishedArticles } =
    await getStats();

  const stats = [
    {
      name: "Total Documents",
      value: documentCount,
      icon: FileText,
      color: "bg-blue-500",
      href: "/admin/documents",
    },
    {
      name: "Published News",
      value: publishedArticles,
      icon: Newspaper,
      color: "bg-green-500",
      href: "/admin/news/articles?status=published",
    },
    {
      name: "Pending Leads",
      value: pendingLeads,
      icon: Inbox,
      color: "bg-amber-500",
      href: "/admin/news/leads?status=pending",
    },
    {
      name: "Total Downloads",
      value: totalDownloads.toLocaleString(),
      icon: Download,
      color: "bg-purple-500",
      href: "/admin/documents",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-tn-text">Dashboard</h1>
          <p className="text-gray-600">Welcome to One TN Administration Portal</p>
        </div>
        <Link
          href="/admin/documents/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Upload Document
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
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

      {/* Recent Documents & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-semibold text-tn-text flex items-center gap-2">
              <TrendingUp size={20} className="text-tn-primary" />
              Recent Documents
            </h2>
            <Link
              href="/admin/documents"
              className="text-sm text-tn-primary hover:text-tn-highlight"
            >
              View All
            </Link>
          </div>
          <div className="divide-y">
            {recentDocuments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No documents uploaded yet
              </div>
            ) : (
              recentDocuments.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-tn-primary/10 rounded-lg">
                      <FileText className="text-tn-primary" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-tn-text truncate">{doc.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{doc.Department.name}</span>
                        <span>•</span>
                        <span>{doc.Category.name}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {doc.downloads} downloads
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-tn-text mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/documents/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-tn-primary text-white hover:bg-tn-highlight transition-colors"
            >
              <Plus size={20} />
              Upload New Document
            </Link>
            <Link
              href="/admin/documents"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <FileText size={20} className="text-tn-primary" />
              Manage Documents
            </Link>
            <Link
              href="/admin/news"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <Newspaper size={20} className="text-tn-primary" />
              Manage News
            </Link>
            <Link
              href="/admin/departments"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <Building2 size={20} className="text-tn-primary" />
              Manage Departments
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <TrendingUp size={20} className="text-tn-primary" />
              View Public Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
