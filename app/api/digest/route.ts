import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";

// Subscribe to weekly digest
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

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

    // Check if already subscribed
    const existing = await prisma.digestSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: "You are already subscribed to the weekly digest" },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await prisma.digestSubscriber.update({
          where: { email },
          data: { isActive: true, verifiedAt: new Date() },
        });
        return NextResponse.json({
          message: "Subscription reactivated successfully",
        });
      }
    }

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const subscriber = await prisma.digestSubscriber.create({
      data: {
        email,
        name: name || null,
        verifyToken,
        // Auto-verify in development
        verifiedAt: process.env.NODE_ENV === "development" ? new Date() : null,
      },
    });

    // TODO: Send verification email in production

    return NextResponse.json({
      message: "Subscribed to weekly digest successfully",
      id: subscriber.id,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating digest subscription:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

// Unsubscribe from digest
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.digestSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Verify token in production
    if (process.env.NODE_ENV !== "development" && subscriber.verifyToken !== token) {
      return NextResponse.json(
        { error: "Invalid unsubscribe token" },
        { status: 403 }
      );
    }

    await prisma.digestSubscriber.update({
      where: { email },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}

// Get digest preview (what would be sent this week)
export async function GET() {
  try {
    // Get documents from the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentDocuments = await prisma.document.findMany({
      where: {
        isPublished: true,
        createdAt: { gte: weekAgo },
      },
      include: {
        Category: true,
        Department: true,
      },
      orderBy: { downloads: "desc" },
      take: 10,
    });

    // Get subscriber count
    const subscriberCount = await prisma.digestSubscriber.count({
      where: { isActive: true },
    });

    return NextResponse.json({
      weekStart: weekAgo.toISOString(),
      weekEnd: new Date().toISOString(),
      documentCount: recentDocuments.length,
      subscriberCount,
      topDocuments: recentDocuments,
    });
  } catch (error) {
    console.error("Error fetching digest preview:", error);
    return NextResponse.json(
      { error: "Failed to fetch digest" },
      { status: 500 }
    );
  }
}
