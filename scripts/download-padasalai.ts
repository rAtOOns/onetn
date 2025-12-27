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
  console.log("=== Download GOs from Padasalai ===\n");

  const allPosts: string[] = [];

  // Fetch GO-related posts from RSS feed
  const labels = ["GO", "Government-Orders", "Circular", "Orders"];

  for (const label of labels) {
    for (let start = 1; start <= 500; start += 150) {
      try {
        console.log(`Fetching ${label} posts ${start}-${start + 149}...`);
        const feedUrl = `https://www.padasalai.net/feeds/posts/default/-/${label}?start-index=${start}&max-results=150&alt=json`;
        const feedJson = execSync(`curl -s "${feedUrl}" --max-time 30`, {
          encoding: 'utf-8',
          timeout: 35000
        });

        try {
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

          console.log(`  Found ${entries.length} posts (total: ${allPosts.length})`);
          if (entries.length < 100) break;
        } catch {
          // Not JSON, might be empty
          break;
        }

        await new Promise(r => setTimeout(r, 500));
      } catch {
        break;
      }
    }
  }

  // Also get general posts that might have GOs
  for (let start = 1; start <= 1000; start += 150) {
    try {
      console.log(`Fetching general posts ${start}-${start + 149}...`);
      const feedUrl = `https://www.padasalai.net/feeds/posts/default?start-index=${start}&max-results=150&alt=json`;
      const feedJson = execSync(`curl -s "${feedUrl}" --max-time 30`, {
        encoding: 'utf-8',
        timeout: 35000
      });

      try {
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

        console.log(`  Found ${entries.length} posts (total: ${allPosts.length})`);
        if (entries.length < 100) break;
      } catch {
        break;
      }

      await new Promise(r => setTimeout(r, 500));
    } catch {
      break;
    }
  }

  const uniquePosts = [...new Set(allPosts)];
  console.log(`\nTotal unique posts: ${uniquePosts.length}\n`);

  const dept = await prisma.department.findFirst({ where: { slug: 'school-education' } })
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

    // Only process every 10th item to show progress without spam
    if (i % 50 === 0) {
      console.log(`[${i + 1}/${uniquePosts.length}] Processing...`);
    }

    try {
      const html = execSync(`curl -s "${postUrl}" --max-time 20`, { encoding: 'utf-8', timeout: 25000 });

      // Look for Google Drive links
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

      const filename = `${fileId}.pdf`;
      const destPath = path.join(DOCS_DIR, filename);

      if (fs.existsSync(destPath)) {
        const stats = fs.statSync(destPath);
        if (stats.size > 5000) {
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

      console.log(`  [${i + 1}] Downloading: ${displayTitle.substring(0, 40)}...`);
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
        console.log(`    OK: ${(stats.size / 1024).toFixed(1)} KB`);
        downloaded++;
      } else {
        try { fs.unlinkSync(destPath); } catch {}
        failed++;
      }

    } catch (err) {
      failed++;
    }

    await new Promise(r => setTimeout(r, 300));
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
