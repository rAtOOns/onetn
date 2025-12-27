import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");

// Ensure directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

function extractGoogleDriveId(url: string): string | null {
  // Extract file ID from various Google Drive URL formats
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function downloadFromGoogleDrive(fileId: string, destPath: string): boolean {
  try {
    // Use direct download URL
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    execSync(`curl -L -o "${destPath}" "${downloadUrl}" --max-time 120 -s`, {
      timeout: 130000
    });

    const stats = fs.statSync(destPath);
    if (stats.size > 5000) {
      return true;
    } else {
      // Might be a confirmation page for large files, try with confirm
      const confirmUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`;
      execSync(`curl -L -o "${destPath}" "${confirmUrl}" --max-time 120 -s`, {
        timeout: 130000
      });

      const newStats = fs.statSync(destPath);
      return newStats.size > 5000;
    }
  } catch (err) {
    console.log(`  Download error: ${err instanceof Error ? err.message : 'Unknown'}`);
    return false;
  }
}

async function scrapeKalvisolaiPage(url: string): Promise<string | null> {
  try {
    const html = execSync(`curl -s "${url}" --max-time 30`, {
      encoding: 'utf-8',
      timeout: 35000
    });

    // Find Google Drive link
    const driveMatch = html.match(/https:\/\/drive\.google\.com\/[^"'<>\s]+/);
    if (driveMatch) {
      return driveMatch[0];
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  console.log("=== Scrape Kalvisolai & Download from Google Drive ===\n");

  // Get the Blogger sitemap/feed to find all posts
  console.log("Fetching blog posts from kalvisolai...\n");

  let allPosts: string[] = [];

  // Fetch from RSS feed (max 150 posts per request)
  for (let start = 1; start <= 500; start += 150) {
    try {
      const feedUrl = `https://www.tngo.kalvisolai.com/feeds/posts/default?start-index=${start}&max-results=150&alt=json`;
      const feedJson = execSync(`curl -s "${feedUrl}" --max-time 30`, {
        encoding: 'utf-8',
        timeout: 35000
      });

      const feed = JSON.parse(feedJson);
      const entries = feed.feed?.entry || [];

      if (entries.length === 0) break;

      for (const entry of entries) {
        const links = entry.link || [];
        const postLink = links.find((l: { rel: string; href: string }) => l.rel === 'alternate');
        if (postLink?.href) {
          allPosts.push(postLink.href);
        }
      }

      console.log(`Found ${allPosts.length} posts so far...`);

      if (entries.length < 150) break;

      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.log(`Feed fetch error: ${err}`);
      break;
    }
  }

  console.log(`\nTotal posts found: ${allPosts.length}\n`);

  let downloaded = 0;
  let failed = 0;
  let noDriveLink = 0;

  // Get existing department and category for new documents
  const department = await prisma.department.findFirst({
    where: { slug: 'school-education' }
  }) || await prisma.department.findFirst();

  const category = await prisma.category.findFirst({
    where: { slug: 'government-orders' }
  }) || await prisma.category.findFirst();

  if (!department || !category) {
    console.log("Error: No department or category found");
    return;
  }

  for (let i = 0; i < allPosts.length; i++) {
    const postUrl = allPosts[i];

    // Extract title from URL
    const urlParts = postUrl.split('/');
    const slug = urlParts[urlParts.length - 1].replace('.html', '');
    const title = slug.replace(/-/g, ' ').replace(/^\d+\s*/, '');

    console.log(`[${i + 1}/${allPosts.length}] ${title.substring(0, 50)}...`);

    // Scrape the page for Google Drive link
    const driveUrl = await scrapeKalvisolaiPage(postUrl);

    if (!driveUrl) {
      console.log(`  No Drive link found`);
      noDriveLink++;
      continue;
    }

    const fileId = extractGoogleDriveId(driveUrl);
    if (!fileId) {
      console.log(`  Invalid Drive URL: ${driveUrl}`);
      noDriveLink++;
      continue;
    }

    // Check if we already have this file
    const existing = await prisma.document.findFirst({
      where: {
        OR: [
          { fileUrl: { contains: fileId } },
          { title: { contains: title.substring(0, 30) } }
        ]
      }
    });

    if (existing) {
      console.log(`  Already exists`);
      continue;
    }

    // Download from Google Drive
    const filename = `${fileId}.pdf`;
    const destPath = path.join(DOCS_DIR, filename);

    console.log(`  Downloading from Drive...`);
    const success = downloadFromGoogleDrive(fileId, destPath);

    if (success) {
      const stats = fs.statSync(destPath);

      // Create document in database
      await prisma.document.create({
        data: {
          title: title.charAt(0).toUpperCase() + title.slice(1),
          fileName: filename,
          fileUrl: `/documents/${filename}`,
          fileSize: stats.size,
          fileType: 'pdf',
          departmentId: department.id,
          categoryId: category.id,
          isPublished: true,
        }
      });

      console.log(`  OK: ${(stats.size / 1024).toFixed(1)} KB`);
      downloaded++;
    } else {
      try { fs.unlinkSync(destPath); } catch {}
      console.log(`  Failed to download`);
      failed++;
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\n=== Summary ===");
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Failed: ${failed}`);
  console.log(`No Drive link: ${noDriveLink}`);

  const total = await prisma.document.count();
  console.log(`\nTotal documents in database: ${total}`);

  await prisma.$disconnect();
}

main().catch(console.error);
