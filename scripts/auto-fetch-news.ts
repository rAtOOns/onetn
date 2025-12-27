// Auto-fetch news leads from all sources
// Run this script via cron: 0 0,6,12,18 * * * npx tsx scripts/auto-fetch-news.ts
// This runs every 6 hours (at 00:00, 06:00, 12:00, 18:00)

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

interface FetchResult {
  source: string;
  success: boolean;
  count: number;
  error?: string;
}

// Generic blog fetcher
async function fetchBlogHeadlines(
  url: string,
  source: string,
  selectors: string = "article h2 a, .post-title a, .entry-title a, h3 a"
): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get(url);
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $(selectors).each((_, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr("href") || "";
      if (title && href && title.length > 10) {
        items.push({ title, url: href, source });
      }
    });

    return items.slice(0, 10);
  } catch (error: any) {
    console.error(`  ${source} error:`, error.message);
    return [];
  }
}

// Official site fetcher (looks for PDFs and notifications)
async function fetchOfficialSite(
  url: string,
  source: string
): Promise<NewsItem[]> {
  try {
    const response = await axiosInstance.get(url);
    const $ = cheerio.load(response.data);
    const items: NewsItem[] = [];

    $("a").each((_, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr("href") || "";
      if (
        title &&
        href &&
        title.length > 15 &&
        (href.includes(".pdf") || href.includes("notification") || href.includes("circular"))
      ) {
        const fullUrl = href.startsWith("http") ? href : `${url}${href}`;
        items.push({ title, url: fullUrl, source });
      }
    });

    return items.slice(0, 10);
  } catch (error: any) {
    console.error(`  ${source} error:`, error.message);
    return [];
  }
}

// All sources configuration
const sources = [
  // Education Blogs
  { id: "kalvisolai", url: "https://www.kalvisolai.com", type: "blog" },
  { id: "padasalai", url: "https://www.padasalai.net", type: "blog" },
  { id: "kalviexpress", url: "https://www.kalviexpress.in", type: "blog" },
  { id: "kalvimalar", url: "https://kalvimalar.com", type: "blog" },
  { id: "kalviseithi", url: "https://kalviseithi.net", type: "blog" },
  { id: "kalvinews", url: "https://www.kalvinews.com", type: "blog" },
  { id: "kalvikural", url: "https://kalvikural.com", type: "blog" },
  // Recruitment & Exams
  { id: "trbtnpsc", url: "https://www.trbtnpsc.com", type: "blog" },
  { id: "tnpsclink", url: "https://tnpsclink.in", type: "blog" },
  { id: "vidyaseva", url: "https://www.vidyaseva.in", type: "blog" },
  // Official Sources
  { id: "dge_tnschools", url: "https://dge.tn.gov.in", type: "official" },
  { id: "trb_official", url: "https://trb.tn.gov.in", type: "official" },
];

async function fetchFromSource(source: typeof sources[0]): Promise<NewsItem[]> {
  console.log(`Fetching from ${source.id}...`);

  if (source.type === "official") {
    return fetchOfficialSite(source.url, source.id);
  }
  return fetchBlogHeadlines(source.url, source.id);
}

async function main() {
  const startTime = Date.now();
  console.log("\n=== Auto-Fetch News Leads ===");
  console.log(`Started at: ${new Date().toISOString()}\n`);

  const results: FetchResult[] = [];
  let totalAdded = 0;

  // Fetch from all sources in parallel (batched)
  const batchSize = 4;
  for (let i = 0; i < sources.length; i += batchSize) {
    const batch = sources.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (source) => {
        try {
          const items = await fetchFromSource(source);
          let added = 0;

          for (const item of items) {
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
            }
          }

          console.log(`  ${source.id}: ${added} new leads (${items.length} fetched)`);
          return { source: source.id, success: true, count: added };
        } catch (error: any) {
          console.error(`  ${source.id}: Failed - ${error.message}`);
          return { source: source.id, success: false, count: 0, error: error.message };
        }
      })
    );

    results.push(...batchResults);
    totalAdded += batchResults.reduce((sum, r) => sum + r.count, 0);
  }

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log("\n=== Summary ===");
  console.log(`Duration: ${duration}s`);
  console.log(`Sources: ${successful} successful, ${failed} failed`);
  console.log(`New leads: ${totalAdded}`);

  // Log to database for tracking
  const pending = await prisma.newsLead.count({ where: { status: "pending" } });
  const total = await prisma.newsLead.count();
  console.log(`Database: ${pending} pending, ${total} total leads`);

  await prisma.$disconnect();

  // Return results for external monitoring
  return {
    timestamp: new Date().toISOString(),
    duration: parseFloat(duration),
    sources: { successful, failed },
    newLeads: totalAdded,
    results,
  };
}

main()
  .then((result) => {
    console.log("\nCompleted successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nFailed:", error);
    process.exit(1);
  });
