import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const department = searchParams.get("dept");
    const topic = searchParams.get("topic");
    const district = searchParams.get("district");
    const search = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const where: Record<string, unknown> = {
      isPublished: true,
    };

    if (category) {
      where.Category = { slug: category };
    }

    if (department) {
      where.Department = { slug: department };
    }

    if (topic) {
      where.topic = { slug: topic };
    }

    if (district) {
      where.District = { slug: district };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleTamil: { contains: search } },
        { description: { contains: search } },
        { goNumber: { contains: search } },
      ];
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          Category: true,
          Department: true,
          Topic: true,
          District: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.document.count({ where }),
    ]);

    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
