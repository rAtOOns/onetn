import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, districtId, documentType, description } = body;

    if (!name || !email || !documentType || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const documentRequest = await prisma.documentRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        documentType,
        description,
        districtId: districtId || null,
        status: "pending",
      },
    });

    return NextResponse.json(documentRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating document request:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const requests = await prisma.documentRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { District: true },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
