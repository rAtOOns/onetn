import { PrismaClient } from "@prisma/client";
import * as https from "https";
import * as http from "http";

const prisma = new PrismaClient();

// Simple fetch function
function fetch(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}

// Extract Google Drive file ID from page content
function extractDriveId(html: string): string | null {
  // Look for Google Drive links
  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?.*?id=([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]{25,})/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Extract title from page
function extractTitle(html: string): string | null {
  // Try h3.post-title first (Blogger format)
  let match = html.match(/<h3[^>]*class="[^"]*post-title[^"]*"[^>]*>([^<]+)</);
  if (match) return match[1].trim();

  // Try h1
  match = html.match(/<h1[^>]*>([^<]+)</);
  if (match) return match[1].trim();

  // Try title tag
  match = html.match(/<title>([^<]+)</);
  if (match) {
    const title = match[1].replace(/ - tngo\.kalvisolai\.com.*$/, '').trim();
    return title;
  }

  return null;
}

// Parse GO details from title
function parseGODetails(title: string): { goNumber: string | null; date: string | null; description: string } {
  // Pattern: "G.O MS NO -227 06-11-2017-Higher Secondary..."
  const goMatch = title.match(/G\.?O\.?\s*(?:MS|Ms|ms)?\s*(?:NO|No|no)?\s*[-.]?\s*(\d+)/i);
  const dateMatch = title.match(/(\d{2}[-./]\d{2}[-./]\d{4})/);

  let description = title;
  if (goMatch) {
    // Remove GO number and date from description
    description = title
      .replace(/G\.?O\.?\s*(?:MS|Ms|ms)?\s*(?:NO|No|no)?\s*[-.]?\s*\d+/i, '')
      .replace(/\d{2}[-./]\d{2}[-./]\d{4}[-.]?/, '')
      .replace(/^[-.\s]+/, '')
      .trim();
  }

  return {
    goNumber: goMatch ? goMatch[1] : null,
    date: dateMatch ? dateMatch[1] : null,
    description
  };
}

async function getSitemapUrls(): Promise<string[]> {
  const urls: string[] = [];

  // Fetch all 3 sitemap pages
  for (let page = 1; page <= 3; page++) {
    console.log(`Fetching sitemap page ${page}...`);
    try {
      const xml = await fetch(`https://www.tngo.kalvisolai.com/sitemap.xml?page=${page}`);
      const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
      for (const match of matches) {
        if (match[1].includes('.html')) {
          urls.push(match[1]);
        }
      }
    } catch (e) {
      console.error(`Error fetching sitemap page ${page}:`, e);
    }
  }

  return urls;
}

async function main() {
  console.log("=== Scrape Kalvisolai GO Titles ===\n");

  // Get all existing documents
  const docs = await prisma.document.findMany({
    select: { id: true, title: true, fileName: true }
  });

  // Create a map of fileId -> document
  const docMap = new Map<string, typeof docs[0]>();
  docs.forEach(d => {
    const fileId = d.fileName.replace('.pdf', '');
    docMap.set(fileId, d);
  });

  console.log(`Loaded ${docs.length} documents from database`);
  console.log(`Created map with ${docMap.size} file IDs\n`);

  // Get sitemap URLs
  const urls = await getSitemapUrls();
  console.log(`Found ${urls.length} URLs in sitemap\n`);

  let matched = 0;
  let updated = 0;
  let notFound = 0;

  // Process each URL
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    try {
      const html = await fetch(url);
      const driveId = extractDriveId(html);
      const title = extractTitle(html);

      if (driveId && title) {
        const doc = docMap.get(driveId);

        if (doc) {
          matched++;
          const { goNumber, date, description } = parseGODetails(title);

          // Build new title
          let newTitle = title;
          if (goNumber) {
            newTitle = `GO ${goNumber}`;
            if (date) newTitle += ` (${date})`;
            if (description && description.length > 5) {
              newTitle += ` - ${description.substring(0, 100)}`;
            }
          }

          // Extract year from date
          let year: number | null = null;
          if (date) {
            const yearMatch = date.match(/(\d{4})/);
            if (yearMatch) year = parseInt(yearMatch[1]);
          }

          // Update if different
          if (newTitle !== doc.title) {
            await prisma.document.update({
              where: { id: doc.id },
              data: {
                title: newTitle,
                goNumber: goNumber ? `GO ${goNumber}` : null,
                publishedYear: year
              }
            });
            console.log(`✓ ${doc.fileName.substring(0, 15)}... → ${newTitle.substring(0, 60)}...`);
            updated++;
          }
        } else {
          notFound++;
        }
      }

      // Progress
      if ((i + 1) % 50 === 0) {
        console.log(`\n[Progress: ${i + 1}/${urls.length}, Matched: ${matched}, Updated: ${updated}]\n`);
      }

      // Small delay to be nice to the server
      await new Promise(r => setTimeout(r, 100));

    } catch (e) {
      // Skip errors silently
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total URLs scanned: ${urls.length}`);
  console.log(`Matched to existing docs: ${matched}`);
  console.log(`Updated titles: ${updated}`);
  console.log(`Not in our database: ${notFound}`);

  // Show sample of updated titles
  const samples = await prisma.document.findMany({
    take: 10,
    orderBy: { updatedAt: 'desc' },
    select: { title: true }
  });
  console.log(`\nSample updated titles:`);
  samples.forEach(d => console.log(`  - ${d.title}`));

  await prisma.$disconnect();
}

main().catch(console.error);
