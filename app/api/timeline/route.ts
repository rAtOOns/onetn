import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Get timeline for a specific document
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Get timeline events for this document
    const timeline = await prisma.gOTimeline.findMany({
      where: {
        OR: [
          { documentId },
          { relatedDocId: documentId },
        ],
      },
      orderBy: { eventDate: "desc" },
    });

    // Get related document details
    const relatedDocIds = timeline
      .map((t) => t.relatedDocId)
      .filter((id): id is string => id !== null);

    const relatedDocs = await prisma.document.findMany({
      where: { id: { in: [...relatedDocIds, documentId] } },
      select: { id: true, title: true, goNumber: true, createdAt: true },
    });

    // Enrich timeline with document info
    const enrichedTimeline = timeline.map((event) => ({
      ...event,
      document: relatedDocs.find((d) => d.id === event.documentId),
      relatedDocument: relatedDocs.find((d) => d.id === event.relatedDocId),
    }));

    return NextResponse.json(enrichedTimeline);
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeline" },
      { status: 500 }
    );
  }
}

// Add a timeline event (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, relatedDocId, eventType, eventDate, description } = body;

    if (!documentId || !eventType || !eventDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await prisma.gOTimeline.create({
      data: {
        documentId,
        relatedDocId: relatedDocId || null,
        eventType,
        eventDate: new Date(eventDate),
        description: description || null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating timeline event:", error);
    return NextResponse.json(
      { error: "Failed to create timeline event" },
      { status: 500 }
    );
  }
}
