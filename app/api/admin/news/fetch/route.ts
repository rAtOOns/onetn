import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import axios from "axios";
import * as cheerio from "cheerio";

// Force Node.js runtime for this route
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface FetchResult {
  source: string;
  success: boolean;
  count: number;
  error?: string;
}

interface NewsItem {
  title: string;
  titleTamil?: string;
  description?: string;
  url: string;
}

const axiosInstance = axios.create({
  timeout: 15000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; OneTN/1.0)",
  },
});

// Fetch headlines from Kalvisolai
async function fetchKalvisolai(): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get("https://www.kalvisolai.com");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    // Parse headlines from the page
    $("article h2 a, .post-title a, .entry-title a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url) {
        items.push({ title, url });
      }
    });

    return items.slice(0, 10);
  } catch (error) {
    console.error("Kalvisolai fetch error:", error);
    return [];
  }
}

// Fetch headlines from Padasalai
async function fetchPadasalai(): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get("https://www.padasalai.net");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("article h2 a, .post-title a, .entry-title a, h3.post-title a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url) {
        items.push({ title, url });
      }
    });

    return items.slice(0, 10);
  } catch (error) {
    console.error("Padasalai fetch error:", error);
    return [];
  }
}

// Fetch headlines from KalviExpress
async function fetchKalviexpress(): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get("https://www.kalviexpress.in");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("article h2 a, .post-title a, .entry-title a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url) {
        items.push({ title, url });
      }
    });

    return items.slice(0, 10);
  } catch (error) {
    console.error("KalviExpress fetch error:", error);
    return [];
  }
}

// Fetch headlines from KalviMalar
async function fetchKalvimalar(): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get("https://kalvimalar.com");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("article h2 a, .post-title a, .entry-title a, h3 a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url && title.length > 10) {
        items.push({ title, url });
      }
    });

    return items.slice(0, 10);
  } catch (error) {
    console.error("KalviMalar fetch error:", error);
    return [];
  }
}

// Fetch headlines from TRB TNPSC
async function fetchTrbtnpsc(): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get("https://www.trbtnpsc.com");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("article h2 a, .post-title a, .entry-title a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url) {
        items.push({ title, url });
      }
    });

    return items.slice(0, 10);
  } catch (error) {
    console.error("TRB TNPSC fetch error:", error);
    return [];
  }
}

// Fetch headlines from Kalvi Seithi
async function fetchKalviseithi(): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get("https://kalviseithi.net");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("article h2 a, .post-title a, .entry-title a, h3 a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url && title.length > 10) {
        items.push({ title, url });
      }
    });

    return items.slice(0, 10);
  } catch (error) {
    console.error("Kalvi Seithi fetch error:", error);
    return [];
  }
}

// Fetch headlines from Kalvi News
async function fetchKalvinews(): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get("https://www.kalvinews.com");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("article h2 a, .post-title a, .entry-title a, h3 a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url && title.length > 10) {
        items.push({ title, url });
      }
    });

    return items.slice(0, 10);
  } catch (error) {
    console.error("Kalvi News fetch error:", error);
    return [];
  }
}

// Fetch headlines from TNPSC Link
async function fetchTnpsclink(): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get("https://tnpsclink.in");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("article h2 a, .post-title a, .entry-title a, h3 a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url && title.length > 10) {
        items.push({ title, url });
      }
    });

    return items.slice(0, 10);
  } catch (error) {
    console.error("TNPSC Link fetch error:", error);
    return [];
  }
}

// Fetch headlines from Vidyaseva
async function fetchVidyaseva(): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get("https://www.vidyaseva.in");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("article h2 a, .post-title a, .entry-title a, h3 a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url && title.length > 10) {
        items.push({ title, url });
      }
    });

    return items.slice(0, 10);
  } catch (error) {
    console.error("Vidyaseva fetch error:", error);
    return [];
  }
}

// Fetch headlines from Kalvi Kural
async function fetchKalvikural(): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get("https://kalvikural.com");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("article h2 a, .post-title a, .entry-title a, h3 a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url && title.length > 10) {
        items.push({ title, url });
      }
    });

    return items.slice(0, 10);
  } catch (error) {
    console.error("Kalvi Kural fetch error:", error);
    return [];
  }
}

// Fetch from DGE TN Schools (Official)
async function fetchDgeTnschools(): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get("https://dge.tn.gov.in");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      // Look for PDF links or news items
      if (title && url && title.length > 20 && (url.includes(".pdf") || url.includes("notification") || url.includes("circular"))) {
        const fullUrl = url.startsWith("http") ? url : `https://dge.tn.gov.in${url}`;
        items.push({ title, url: fullUrl });
      }
    });

    return items.slice(0, 10);
  } catch (error) {
    console.error("DGE TN Schools fetch error:", error);
    return [];
  }
}

// Fetch from TRB Official
async function fetchTrbOfficial(): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get("https://trb.tn.gov.in");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url && title.length > 15 && (url.includes(".pdf") || url.includes("notification"))) {
        const fullUrl = url.startsWith("http") ? url : `https://trb.tn.gov.in${url}`;
        items.push({ title, url: fullUrl });
      }
    });

    return items.slice(0, 10);
  } catch (error) {
    console.error("TRB Official fetch error:", error);
    return [];
  }
}

const fetchFunctions: Record<string, () => Promise<NewsItem[]>> = {
  kalvisolai: fetchKalvisolai,
  padasalai: fetchPadasalai,
  kalviexpress: fetchKalviexpress,
  kalvimalar: fetchKalvimalar,
  trbtnpsc: fetchTrbtnpsc,
  kalviseithi: fetchKalviseithi,
  kalvinews: fetchKalvinews,
  tnpsclink: fetchTnpsclink,
  vidyaseva: fetchVidyaseva,
  kalvikural: fetchKalvikural,
  dge_tnschools: fetchDgeTnschools,
  trb_official: fetchTrbOfficial,
};

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { sources } = body;

    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      return NextResponse.json(
        { error: "No sources specified" },
        { status: 400 }
      );
    }

    const results: FetchResult[] = [];

    for (const sourceId of sources) {
      const fetchFn = fetchFunctions[sourceId];
      if (!fetchFn) {
        results.push({
          source: sourceId,
          success: false,
          count: 0,
          error: "Unknown source",
        });
        continue;
      }

      try {
        const items = await fetchFn();
        let addedCount = 0;

        for (const item of items) {
          // Check if this URL already exists
          const existing = await prisma.newsLead.findFirst({
            where: { sourceUrl: item.url },
          });

          if (!existing) {
            await prisma.newsLead.create({
              data: {
                title: item.title,
                titleTamil: item.titleTamil || null,
                description: item.description || null,
                sourceUrl: item.url,
                sourceName: sourceId,
                status: "pending",
              },
            });
            addedCount++;
          }
        }

        results.push({
          source: sourceId,
          success: true,
          count: addedCount,
        });
      } catch (error) {
        console.error(`Error fetching from ${sourceId}:`, error);
        results.push({
          source: sourceId,
          success: false,
          count: 0,
          error: error instanceof Error ? error.message : "Fetch failed",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
