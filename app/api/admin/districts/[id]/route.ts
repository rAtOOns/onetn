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
    const { name, nameTamil } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = generateSlug(name);

      const existing = await prisma.district.findFirst({
        where: { slug: updateData.slug as string, NOT: { id } },
      });

      if (existing) {
        return NextResponse.json(
          { error: "District with this name already exists" },
          { status: 400 }
        );
      }
    }

    if (nameTamil !== undefined) updateData.nameTamil = nameTamil || null;

    const district = await prisma.district.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(district);
  } catch (error) {
    console.error("Error updating district:", error);
    return NextResponse.json(
      { error: "Failed to update district" },
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

    const district = await prisma.district.findUnique({
      where: { id },
      include: { _count: { select: { Document: true, DocumentRequest: true } } },
    });

    if (!district) {
      return NextResponse.json({ error: "District not found" }, { status: 404 });
    }

    const totalRefs = district._count.Document + district._count.DocumentRequest;
    if (totalRefs > 0) {
      return NextResponse.json(
        { error: `Cannot delete district with ${totalRefs} references` },
        { status: 400 }
      );
    }

    await prisma.district.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting district:", error);
    return NextResponse.json(
      { error: "Failed to delete district" },
      { status: 500 }
    );
  }
}
