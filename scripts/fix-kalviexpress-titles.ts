import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

function extractFileId(url: string): string | null {
  const decodedUrl = url.replace(/&amp;/g, '&');
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = decodedUrl.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractTitle(html: string): string | null {
  // Try to get title from <title> tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    let title = titleMatch[1]
      .replace(/\s*\|\s*kalviexpress\.in/gi, '')
      .replace(/\s*-\s*kalviexpress/gi, '')
      .replace(/kalviexpress\.in\s*[:\-]?\s*/gi, '')
      .trim();
    if (title.length > 10 && title.length < 200) {
      return title;
    }
  }

  // Try h1 or h2
  const h1Match = html.match(/<h1[^>]*class="[^"]*post-title[^"]*"[^>]*>([^<]+)<\/h1>/i) ||
                  html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) {
    const title = h1Match[1].trim();
    if (title.length > 5 && title.length < 200) {
      return title;
    }
  }

  return null;
}

async function main() {
  console.log("=== Fix Kalviexpress GO Titles ===\n");

  // Get all documents with generic titles
  const docs = await prisma.document.findMany({
    where: { title: { startsWith: 'Kalviexpress GO' } },
    select: { id: true, title: true, fileName: true }
  });

  console.log(`Found ${docs.length} documents with generic titles\n`);

  // Fetch main kalviexpress pages
  const pages = [
    "https://www.kalviexpress.in/p/government-orders-gos.html",
    "https://www.kalviexpress.in/p/pay-continuation-order-post.html",
    "https://www.kalviexpress.in",
  ];

  // Build a map of fileId -> title from kalviexpress pages
  const fileIdToTitle: Map<string, string> = new Map();
  const postUrls: Set<string> = new Set();

  console.log("Step 1: Finding all post URLs...");
  for (const page of pages) {
    try {
      const { stdout: html } = await execAsync(`curl -s "${page}" --max-time 20`, { timeout: 25000 });

      // Find all post URLs
      const urlMatches = html.match(/href="(https?:\/\/www\.kalviexpress\.in\/\d{4}\/\d{2}\/[^"]+\.html)"/g) || [];
      urlMatches.forEach(m => {
        const url = m.replace(/href="|"/g, '');
        postUrls.add(url);
      });
    } catch (e) {
      console.log(`  Error fetching ${page}`);
    }
  }

  console.log(`  Found ${postUrls.size} post URLs\n`);

  // Visit each post and extract title + file ID
  console.log("Step 2: Scanning posts for titles...");
  let scanned = 0;
  let found = 0;

  for (const postUrl of postUrls) {
    try {
      const { stdout: html } = await execAsync(`curl -s "${postUrl}" --max-time 10`, { timeout: 15000 });

      const title = extractTitle(html);
      const driveMatch = html.match(/(drive\.google\.com|docs\.google\.com)[^"'\s<>]+/);

      if (title && driveMatch) {
        const fileId = extractFileId(driveMatch[0]);
        if (fileId && !fileIdToTitle.has(fileId)) {
          fileIdToTitle.set(fileId, title);
          found++;
        }
      }

      scanned++;
      if (scanned % 20 === 0) {
        process.stdout.write(`\r  Scanned ${scanned}/${postUrls.size}, found ${found} titles`);
      }
    } catch {}
  }
  console.log(`\n  Final: ${found} file IDs with titles\n`);

  // Update documents
  console.log("Step 3: Updating document titles...");
  let updated = 0;

  for (const doc of docs) {
    // Extract fileId from fileName (fileName is like "1abc123.pdf")
    const fileId = doc.fileName.replace('.pdf', '');
    const newTitle = fileIdToTitle.get(fileId);

    if (newTitle) {
      await prisma.document.update({
        where: { id: doc.id },
        data: { title: newTitle }
      });
      console.log(`  ✓ ${doc.title} → ${newTitle.substring(0, 50)}...`);
      updated++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Remaining generic: ${docs.length - updated}`);

  await prisma.$disconnect();
}

main().catch(console.error);
