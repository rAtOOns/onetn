import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // Fetch published articles from database
    const articles = await prisma.newsArticle.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    // Transform to news format for compatibility with existing components
    const news = articles.map((article) => ({
      id: article.id,
      title: article.title,
      titleTamil: article.titleTamil,
      description: article.summary,
      source: "One TN",
      imageUrl: article.imageUrl,
      imageAlt: article.imageAlt,
      publishedAt: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
      url: `/news/${article.id}`,
      // Additional fields for detail page
      content: article.content,
      contentTamil: article.contentTamil,
      summaryTamil: article.summaryTamil,
      documentId: article.documentId,
    }));

    return NextResponse.json({
      news,
      source: "database",
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news", news: [] },
      { status: 500 }
    );
  }
}
