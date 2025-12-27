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

function extractTitle(html: string, url: string): string {
  // Try to get title from <title> tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    let title = titleMatch[1]
      .replace(/\s*[\|:]\s*kalviexpress\.in/gi, '')
      .replace(/\s*-\s*kalviexpress/gi, '')
      .replace(/kalviexpress\.in?\s*[:\|]?\s*/gi, '')
      .trim();
    if (title.length > 5 && title.length < 200) {
      return title;
    }
  }

  // Fallback: use URL slug
  const slug = url.split('/').pop()?.replace('.html', '') || 'document';
  return slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

async function main() {
  console.log("=== Fix Titles from Kalviexpress Sitemap ===\n");

  // Get all Kalviexpress documents
  const docs = await prisma.document.findMany({
    where: { title: { startsWith: 'Kalviexpress GO' } },
    select: { id: true, title: true, fileName: true }
  });

  console.log(`Found ${docs.length} documents with generic titles\n`);

  // Create fileId -> docId map
  const fileIdToDocId = new Map<string, string>();
  docs.forEach(doc => {
    const fileId = doc.fileName.replace('.pdf', '');
    fileIdToDocId.set(fileId, doc.id);
  });

  // Fetch all URLs from sitemap
  console.log("Step 1: Fetching sitemap...");
  const allUrls: string[] = [];

  for (let page = 1; page <= 16; page++) {
    try {
      const { stdout } = await execAsync(
        `curl -s "https://www.kalviexpress.in/sitemap.xml?page=${page}" | grep -oE 'https://www\\.kalviexpress\\.in/[0-9]+/[0-9]+/[^<]+\\.html'`,
        { timeout: 30000 }
      );
      const urls = stdout.trim().split('\n').filter(u => u.length > 0);
      allUrls.push(...urls);
      process.stdout.write(`\r  Page ${page}/16: ${allUrls.length} URLs total`);
    } catch {}
  }

  console.log(`\n  Total URLs: ${allUrls.length}\n`);

  // Visit pages in batches and find matching file IDs
  console.log("Step 2: Scanning pages for matching file IDs...");
  let updated = 0;
  const BATCH_SIZE = 15;

  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE);

    const promises = batch.map(async (url) => {
      try {
        const { stdout: html } = await execAsync(
          `curl -s "${url}" --max-time 10`,
          { timeout: 15000 }
        );

        // Find Google Drive links
        const driveMatches = html.match(/(drive\.google\.com|docs\.google\.com)[^"'\s<>]+/g) || [];

        for (const match of driveMatches) {
          const fileId = extractFileId(match);
          if (fileId && fileIdToDocId.has(fileId)) {
            const docId = fileIdToDocId.get(fileId)!;
            const title = extractTitle(html, url);

            await prisma.document.update({
              where: { id: docId },
              data: { title }
            });

            console.log(`\n  ✓ ${title.substring(0, 60)}...`);
            fileIdToDocId.delete(fileId); // Remove so we don't update again
            return true;
          }
        }
      } catch {}
      return false;
    });

    const results = await Promise.all(promises);
    updated += results.filter(Boolean).length;

    process.stdout.write(`\r  Scanned ${Math.min(i + BATCH_SIZE, allUrls.length)}/${allUrls.length}, updated ${updated}`);

    // Stop if all done
    if (fileIdToDocId.size === 0) break;
  }

  console.log(`\n\n=== Summary ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Remaining: ${fileIdToDocId.size}`);

  await prisma.$disconnect();
}

main().catch(console.error);
