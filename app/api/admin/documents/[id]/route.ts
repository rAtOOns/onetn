import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        Category: true,
        Department: true,
        Topic: true,
        District: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const {
      title,
      titleTamil,
      description,
      goNumber,
      fileName,
      categoryId,
      departmentId,
      topicId,
      districtId,
      publishedYear,
      isPublished,
    } = body;

    const document = await prisma.document.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(titleTamil !== undefined && { titleTamil: titleTamil || null }),
        ...(description !== undefined && { description: description || null }),
        ...(goNumber !== undefined && { goNumber: goNumber || null }),
        ...(fileName !== undefined && { fileName }),
        ...(categoryId !== undefined && { categoryId }),
        ...(departmentId !== undefined && { departmentId }),
        ...(topicId !== undefined && { topicId: topicId || null }),
        ...(districtId !== undefined && { districtId: districtId || null }),
        ...(publishedYear !== undefined && {
          publishedYear: publishedYear ? parseInt(publishedYear) : null,
        }),
        ...(isPublished !== undefined && { isPublished }),
      },
      include: {
        Category: true,
        Department: true,
        Topic: true,
        District: true,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the document to find the file path
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Delete from database
    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
