import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, name, departmentId, categoryId, districtId, frequency } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // Check if subscription already exists
    const existing = await prisma.subscription.findFirst({
      where: {
        email,
        departmentId: departmentId || null,
        categoryId: categoryId || null,
        districtId: districtId || null,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You are already subscribed to this alert" },
        { status: 400 }
      );
    }

    const subscription = await prisma.subscription.create({
      data: {
        email,
        phone: phone || null,
        name: name || null,
        departmentId: departmentId || null,
        categoryId: categoryId || null,
        districtId: districtId || null,
        frequency: frequency || "instant",
        verifyToken,
      },
    });

    // TODO: Send verification email
    // For now, auto-verify in development
    if (process.env.NODE_ENV === "development") {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { verifiedAt: new Date() },
      });
    }

    return NextResponse.json({
      message: "Subscription created successfully",
      id: subscription.id,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { email, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    // Get department/category/district names
    const [departments, categories, districts] = await Promise.all([
      prisma.department.findMany(),
      prisma.category.findMany(),
      prisma.district.findMany(),
    ]);

    const enrichedSubscriptions = subscriptions.map((sub) => ({
      ...sub,
      departmentName: departments.find((d) => d.id === sub.departmentId)?.name || "All Departments",
      categoryName: categories.find((c) => c.id === sub.categoryId)?.name || "All Categories",
      districtName: districts.find((d) => d.id === sub.districtId)?.name || "All Districts",
    }));

    return NextResponse.json(enrichedSubscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    await prisma.subscription.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
