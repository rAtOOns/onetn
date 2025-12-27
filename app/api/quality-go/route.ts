import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const dept = searchParams.get("dept");
  const year = searchParams.get("year");
  const search = searchParams.get("q");

  const where: any = {};

  if (dept) where.deptCode = dept;
  if (year) {
    const startDate = new Date(parseInt(year), 0, 1);
    const endDate = new Date(parseInt(year) + 1, 0, 1);
    where.goDate = { gte: startDate, lt: endDate };
  }
  if (search) {
    where.OR = [
      { titleEn: { contains: search } },
      { titleTa: { contains: search } },
      { summaryEn: { contains: search } },
      { summaryTa: { contains: search } },
      { keywords: { contains: search } },
    ];
  }

  const [gos, total] = await Promise.all([
    prisma.qualityGO.findMany({
      where,
      orderBy: { goDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.qualityGO.count({ where }),
  ]);

  return NextResponse.json({
    gos,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
