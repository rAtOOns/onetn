import axios from "axios";
import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const axiosInstance = axios.create({
  timeout: 15000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
});

interface NewsItem {
  title: string;
  url: string;
  source: string;
}

async function fetchKalvisolai(): Promise<NewsItem[]> {
  try {
    console.log("Fetching from Kalvisolai...");
    const response = await axiosInstance.get("https://www.kalvisolai.com");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("article h2 a, .post-title a, .entry-title a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url && title.length > 10) {
        items.push({ title, url, source: "kalvisolai" });
      }
    });

    console.log("  Found " + items.length + " items from Kalvisolai");
    return items.slice(0, 5);
  } catch (error: any) {
    console.error("  Kalvisolai error:", error.message);
    return [];
  }
}

async function fetchPadasalai(): Promise<NewsItem[]> {
  try {
    console.log("Fetching from Padasalai...");
    const response = await axiosInstance.get("https://www.padasalai.net");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("article h2 a, .post-title a, .entry-title a, h3.post-title a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url && title.length > 10) {
        items.push({ title, url, source: "padasalai" });
      }
    });

    console.log("  Found " + items.length + " items from Padasalai");
    return items.slice(0, 5);
  } catch (error: any) {
    console.error("  Padasalai error:", error.message);
    return [];
  }
}

async function fetchTrbtnpsc(): Promise<NewsItem[]> {
  try {
    console.log("Fetching from TRB TNPSC...");
    const response = await axiosInstance.get("https://www.trbtnpsc.com");
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("article h2 a, .post-title a, .entry-title a").each((_, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href") || "";
      if (title && url && title.length > 10) {
        items.push({ title, url, source: "trbtnpsc" });
      }
    });

    console.log("  Found " + items.length + " items from TRB TNPSC");
    return items.slice(0, 5);
  } catch (error: any) {
    console.error("  TRB TNPSC error:", error.message);
    return [];
  }
}

async function main() {
  console.log("\n=== Testing News Fetch Workflow ===\n");

  // Fetch from multiple sources
  const [kalvisolai, padasalai, trbtnpsc] = await Promise.all([
    fetchKalvisolai(),
    fetchPadasalai(),
    fetchTrbtnpsc(),
  ]);

  const allItems = [...kalvisolai, ...padasalai, ...trbtnpsc];
  console.log("\nTotal items fetched: " + allItems.length + "\n");

  // Save to database
  let added = 0;
  let skipped = 0;

  for (const item of allItems) {
    const existing = await prisma.newsLead.findFirst({
      where: { sourceUrl: item.url },
    });

    if (!existing) {
      await prisma.newsLead.create({
        data: {
          title: item.title,
          sourceUrl: item.url,
          sourceName: item.source,
          status: "pending",
        },
      });
      added++;
      const shortTitle = item.title.length > 60 ? item.title.substring(0, 60) + "..." : item.title;
      console.log("+ Added: " + shortTitle);
    } else {
      skipped++;
    }
  }

  console.log("\n=== Results ===");
  console.log("Added: " + added + " new leads");
  console.log("Skipped: " + skipped + " duplicates");

  // Show current lead counts
  const pending = await prisma.newsLead.count({ where: { status: "pending" } });
  const total = await prisma.newsLead.count();
  console.log("\nDatabase: " + pending + " pending leads, " + total + " total leads");

  await prisma.$disconnect();
}

main().catch(console.error);
