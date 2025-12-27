import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const article = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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
      status,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (titleTamil !== undefined) updateData.titleTamil = titleTamil || null;
    if (summary !== undefined) updateData.summary = summary;
    if (summaryTamil !== undefined) updateData.summaryTamil = summaryTamil || null;
    if (content !== undefined) updateData.content = content;
    if (contentTamil !== undefined) updateData.contentTamil = contentTamil || null;
    if (documentId !== undefined) updateData.documentId = documentId || null;

    if (status !== undefined) {
      updateData.status = status;
      if (status === "published") {
        // Check if already published
        const existing = await prisma.newsArticle.findUnique({ where: { id } });
        if (!existing?.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }
    }

    const article = await prisma.newsArticle.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Failed to update article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Unlink any leads pointing to this article
    await prisma.newsLead.updateMany({
      where: { articleId: id },
      data: { articleId: null, status: "verified" },
    });

    await prisma.newsArticle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
