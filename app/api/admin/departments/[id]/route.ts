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

    const updateData: { name?: string; nameTamil?: string | null; slug?: string } = {};

    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = generateSlug(name);

      // Check if new slug already exists (excluding current)
      const existing = await prisma.department.findFirst({
        where: {
          slug: updateData.slug,
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Department with this name already exists" },
          { status: 400 }
        );
      }
    }

    if (nameTamil !== undefined) {
      updateData.nameTamil = nameTamil || null;
    }

    const department = await prisma.department.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      { error: "Failed to update department" },
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

    // Check if department has documents
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: { Document: true },
        },
      },
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    if (department._count.Document > 0) {
      return NextResponse.json(
        { error: `Cannot delete department with ${department._count.Document} documents. Move or delete documents first.` },
        { status: 400 }
      );
    }

    await prisma.department.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json(
      { error: "Failed to delete department" },
      { status: 500 }
    );
  }
}
