import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

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
    const source = searchParams.get("source");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleTamil: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (source) {
      where.sourceName = source;
    }

    const [leads, total, sources, statusCounts] = await Promise.all([
      prisma.newsLead.findMany({
        where,
        orderBy: { fetchedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.newsLead.count({ where }),
      prisma.newsLead.groupBy({
        by: ["sourceName"],
        _count: true,
      }),
      prisma.newsLead.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    return NextResponse.json({
      items: leads,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      sources,
      statusCounts,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
