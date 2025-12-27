import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  sendEmail,
  generateNewsEmailHtml,
  generateNewsEmailText,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    // Get the article
    const article = await prisma.newsArticle.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    if (article.status !== "published") {
      return NextResponse.json(
        { error: "Article must be published to send notifications" },
        { status: 400 }
      );
    }

    // Get all active subscribers
    const subscribers = await prisma.digestSubscriber.findMany({
      where: {
        isActive: true,
        verifiedAt: { not: null },
      },
    });

    // Also get from general subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: {
        isActive: true,
        verifiedAt: { not: null },
      },
    });

    // Combine unique emails
    const emailSet = new Set<string>();
    subscribers.forEach((s) => emailSet.add(s.email));
    subscriptions.forEach((s) => emailSet.add(s.email));
    const emails = Array.from(emailSet);

    if (emails.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No verified subscribers to notify",
        sent: 0,
      });
    }

    // Prepare email data
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const emailData = {
      title: article.title,
      titleTamil: article.titleTamil || undefined,
      summary: article.summary,
      url: `${appUrl}/news/${article.id}`,
      imageUrl: article.imageUrl || undefined,
    };

    const html = generateNewsEmailHtml(emailData);
    const text = generateNewsEmailText(emailData);

    // Send emails (in batches for production)
    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      try {
        const success = await sendEmail({
          to: email,
          subject: `📰 ${article.title}`,
          html,
          text,
        });

        if (success) {
          sent++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Notifications sent to ${sent} subscribers`,
      sent,
      failed,
      total: emails.length,
    });
  } catch (error) {
    console.error("Failed to send notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
