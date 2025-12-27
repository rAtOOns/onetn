import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");

  try {
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleTamil: { contains: search } },
        { summary: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [articles, total, statusCounts] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.newsArticle.count({ where }),
      prisma.newsArticle.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    return NextResponse.json({
      items: articles,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      statusCounts,
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      titleTamil,
      summary,
      summaryTamil,
      content,
      contentTamil,
      documentId,
      imageUrl,
      imageAlt,
      status,
      leadId,
    } = body;

    if (!title || !summary || !content) {
      return NextResponse.json(
        { error: "Title, summary, and content are required" },
        { status: 400 }
      );
    }

    const article = await prisma.newsArticle.create({
      data: {
        title,
        titleTamil: titleTamil || null,
        summary,
        summaryTamil: summaryTamil || null,
        content,
        contentTamil: contentTamil || null,
        documentId: documentId || null,
        imageUrl: imageUrl || null,
        imageAlt: imageAlt || null,
        status: status || "draft",
        publishedAt: status === "published" ? new Date() : null,
        createdBy: session.user?.email || "admin",
      },
    });

    // Update lead if provided
    if (leadId) {
      await prisma.newsLead.update({
        where: { id: leadId },
        data: {
          status: "published",
          articleId: article.id,
        },
      });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Failed to create article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
