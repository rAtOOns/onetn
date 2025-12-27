import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { nameTamil: { contains: search } },
          ],
        }
      : {};

    const [districts, total] = await Promise.all([
      prisma.district.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: { Document: true, DocumentRequest: true },
          },
        },
      }),
      prisma.district.count({ where }),
    ]);

    return NextResponse.json({
      items: districts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    return NextResponse.json(
      { error: "Failed to fetch districts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, nameTamil } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = generateSlug(name);

    const existing = await prisma.district.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "District with this name already exists" },
        { status: 400 }
      );
    }

    const district = await prisma.district.create({
      data: {
        name,
        nameTamil: nameTamil || null,
        slug,
      },
    });

    return NextResponse.json(district, { status: 201 });
  } catch (error) {
    console.error("Error creating district:", error);
    return NextResponse.json(
      { error: "Failed to create district" },
      { status: 500 }
    );
  }
}
