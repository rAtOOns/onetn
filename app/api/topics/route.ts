import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}
