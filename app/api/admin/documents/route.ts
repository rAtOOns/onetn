import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      titleTamil,
      description,
      goNumber,
      fileName,
      fileUrl,
      fileSize,
      fileType,
      categoryId,
      departmentId,
      topicId,
      districtId,
      publishedYear,
      isPublished,
    } = body;

    if (!title || !fileName || !fileUrl || !categoryId || !departmentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        title,
        titleTamil: titleTamil || null,
        description: description || null,
        goNumber: goNumber || null,
        fileName,
        fileUrl,
        fileSize,
        fileType,
        categoryId,
        departmentId,
        topicId: topicId || null,
        districtId: districtId || null,
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
        isPublished: isPublished ?? true,
      },
      include: {
        Category: true,
        Department: true,
        Topic: true,
        District: true,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");
    const departmentId = searchParams.get("departmentId");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleTamil: { contains: search } },
        { fileName: { contains: search } },
        { goNumber: { contains: search } },
      ];
    }

    if (status === "published") {
      where.isPublished = true;
    } else if (status === "draft") {
      where.isPublished = false;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          Category: true,
          Department: true,
        },
      }),
      prisma.document.count({ where }),
    ]);

    return NextResponse.json({
      items: documents,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
