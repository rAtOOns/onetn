import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get("districtId");
    const type = searchParams.get("type"); // assembly or parliamentary

    const where: Record<string, unknown> = {};

    if (districtId) {
      where.districtId = districtId;
    }

    if (type) {
      where.type = type;
    }

    const constituencies = await prisma.constituency.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(constituencies);
  } catch (error) {
    console.error("Error fetching constituencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch constituencies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nameTamil, type, districtId, mlaName, mlaNameTamil, mpName, mpNameTamil } = body;

    if (!name || !type || !districtId) {
      return NextResponse.json(
        { error: "Name, type, and district are required" },
        { status: 400 }
      );
    }

    const constituency = await prisma.constituency.create({
      data: {
        name,
        nameTamil: nameTamil || null,
        type,
        districtId,
        mlaName: mlaName || null,
        mlaNameTamil: mlaNameTamil || null,
        mpName: mpName || null,
        mpNameTamil: mpNameTamil || null,
      },
    });

    return NextResponse.json(constituency, { status: 201 });
  } catch (error) {
    console.error("Error creating constituency:", error);
    return NextResponse.json(
      { error: "Failed to create constituency" },
      { status: 500 }
    );
  }
}
