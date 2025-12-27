import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

function extractGoogleDriveId(url: string): string | null {
  // Decode HTML entities first
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

function downloadFromDrive(fileId: string, destPath: string): boolean {
  try {
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
    execSync(`curl -L -o "${destPath}" "${url}" --max-time 60 -s`, { timeout: 65000 });

    let stats = fs.statSync(destPath);

    if (stats.size < 10000) {
      const confirmUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`;
      execSync(`curl -L -o "${destPath}" "${confirmUrl}" --max-time 60 -s`, { timeout: 65000 });
      stats = fs.statSync(destPath);
    }

    return stats.size > 5000;
  } catch {
    return false;
  }
}

async function main() {
  console.log("=== Re-scan Kalvisolai for Missed PDFs ===\n");
  console.log("Looking for HTML-encoded Google Drive links...\n");

  const allPosts: string[] = [];

  // Fetch all blog posts
  for (let start = 1; start <= 2000; start += 150) {
    try {
      console.log(`Fetching posts ${start}-${start + 149}...`);
      const cmd = `curl -s "https://www.tngo.kalvisolai.com/feeds/posts/default?start-index=${start}&max-results=150" | grep -oE 'https://www.tngo.kalvisolai.com/[0-9]+/[0-9]+/[^<]+\\.html'`;
      const output = execSync(cmd, { encoding: 'utf-8', timeout: 30000 });
      const posts = [...new Set(output.trim().split('\n').filter(p => p.length > 0))];

      if (posts.length === 0) break;

      allPosts.push(...posts);
      console.log(`  Found ${posts.length} posts (total: ${allPosts.length})`);

      if (posts.length < 50) break;
      await new Promise(r => setTimeout(r, 500));
    } catch {
      break;
    }
  }

  const uniquePosts = [...new Set(allPosts)];
  console.log(`\nTotal unique posts: ${uniquePosts.length}\n`);

  const dept = await prisma.department.findFirst({ where: { slug: 'finance' } })
    || await prisma.department.findFirst();
  const cat = await prisma.category.findFirst({ where: { slug: 'government-orders' } })
    || await prisma.category.findFirst();

  if (!dept || !cat) {
    console.log("No department or category found");
    return;
  }

  let downloaded = 0, failed = 0, noLink = 0, skipped = 0;

  for (let i = 0; i < uniquePosts.length; i++) {
    const postUrl = uniquePosts[i];

    const slug = postUrl.split('/').pop()?.replace('.html', '') || 'document';
    const title = slug.replace(/-/g, ' ').replace(/\d{4}\s*$/, '').trim();
    const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

    console.log(`[${i + 1}/${uniquePosts.length}] ${displayTitle.substring(0, 50)}...`);

    try {
      const html = execSync(`curl -s "${postUrl}" --max-time 20`, { encoding: 'utf-8', timeout: 25000 });

      // Updated regex patterns to catch HTML-encoded URLs
      const drivePatterns = [
        /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
        /https:\/\/drive\.google\.com\/uc\?[^"'\s<>]+id=([a-zA-Z0-9_-]+)/,
        /https:\/\/drive\.google\.com\/uc\?[^"'\s<>]+&amp;id=([a-zA-Z0-9_-]+)/,
      ];

      let fileId: string | null = null;

      for (const pattern of drivePatterns) {
        const match = html.match(pattern);
        if (match) {
          fileId = match[1];
          break;
        }
      }

      // Also try to find any drive.google.com URL and extract ID
      if (!fileId) {
        const driveMatch = html.match(/https:\/\/drive\.google\.com\/[^"'\s<>]+/);
        if (driveMatch) {
          fileId = extractGoogleDriveId(driveMatch[0]);
        }
      }

      if (!fileId) {
        noLink++;
        continue;
      }

      // Check if already exists
      const exists = await prisma.document.findFirst({
        where: {
          OR: [
            { fileUrl: { contains: fileId } },
            { fileName: { contains: fileId } }
          ]
        }
      });

      if (exists) {
        skipped++;
        continue;
      }

      // Download
      const filename = `${fileId}.pdf`;
      const destPath = path.join(DOCS_DIR, filename);

      if (fs.existsSync(destPath)) {
        const stats = fs.statSync(destPath);
        if (stats.size > 5000) {
          console.log(`  File exists, adding to DB`);
          await prisma.document.create({
            data: {
              title: displayTitle,
              fileName: filename,
              fileUrl: `/documents/${filename}`,
              fileSize: stats.size,
              fileType: 'pdf',
              departmentId: dept.id,
              categoryId: cat.id,
              isPublished: true,
            }
          });
          downloaded++;
          continue;
        }
      }

      console.log(`  Downloading ${fileId}...`);
      const success = downloadFromDrive(fileId, destPath);

      if (success) {
        const stats = fs.statSync(destPath);
        await prisma.document.create({
          data: {
            title: displayTitle,
            fileName: filename,
            fileUrl: `/documents/${filename}`,
            fileSize: stats.size,
            fileType: 'pdf',
            departmentId: dept.id,
            categoryId: cat.id,
            isPublished: true,
          }
        });
        console.log(`  OK: ${(stats.size / 1024).toFixed(1)} KB`);
        downloaded++;
      } else {
        try { fs.unlinkSync(destPath); } catch {}
        console.log(`  Download failed`);
        failed++;
      }

    } catch (err) {
      console.log(`  Error: ${err instanceof Error ? err.message : 'Unknown'}`);
      failed++;
    }

    await new Promise(r => setTimeout(r, 800));
  }

  console.log("\n=== Summary ===");
  console.log(`New downloads: ${downloaded}`);
  console.log(`Already in DB: ${skipped}`);
  console.log(`No Drive link: ${noLink}`);
  console.log(`Failed: ${failed}`);

  const total = await prisma.document.count();
  console.log(`\nTotal documents: ${total}`);

  await prisma.$disconnect();
}

main().catch(console.error);
