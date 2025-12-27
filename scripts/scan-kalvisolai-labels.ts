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

async function getAllLabels(): Promise<string[]> {
  console.log("Fetching all labels from kalvisolai...");

  try {
    // Get homepage to find labels
    const html = execSync(`curl -s "https://www.tngo.kalvisolai.com" --max-time 30`, {
      encoding: 'utf-8',
      timeout: 35000
    });

    // Extract label URLs
    const labelMatches = html.match(/\/search\/label\/[^"'<>\s]+/g) || [];
    const labels = [...new Set(labelMatches)].map(l => decodeURIComponent(l));

    console.log(`Found ${labels.length} labels`);
    return labels;
  } catch (err) {
    console.log("Error fetching labels:", err);
    return [];
  }
}

async function getPostsFromLabel(labelPath: string): Promise<string[]> {
  const posts: string[] = [];

  try {
    const url = `https://www.tngo.kalvisolai.com${labelPath}?max-results=100`;
    const html = execSync(`curl -s "${url}" --max-time 20`, {
      encoding: 'utf-8',
      timeout: 25000
    });

    // Extract post URLs
    const postMatches = html.match(/https:\/\/www\.tngo\.kalvisolai\.com\/\d+\/\d+\/[^"<>\s]+\.html/g) || [];
    posts.push(...postMatches);

  } catch {
    // Ignore errors
  }

  return [...new Set(posts)];
}

async function main() {
  console.log("=== Scan Kalvisolai Labels for Missed GOs ===\n");

  // Get all labels
  const labels = await getAllLabels();

  if (labels.length === 0) {
    // Use common GO labels if we can't find them
    const commonLabels = [
      "/search/label/G.O",
      "/search/label/GO",
      "/search/label/Government%20Order",
      "/search/label/Circular",
      "/search/label/Finance",
      "/search/label/Education",
      "/search/label/Health",
      "/search/label/Revenue",
    ];
    labels.push(...commonLabels);
  }

  // Collect all posts from all labels
  const allPosts = new Set<string>();

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    console.log(`[${i + 1}/${labels.length}] Scanning ${label}...`);

    const posts = await getPostsFromLabel(label);
    posts.forEach(p => allPosts.add(p));

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nTotal unique posts from labels: ${allPosts.size}\n`);

  // Get department and category
  const dept = await prisma.department.findFirst({ where: { slug: 'finance' } })
    || await prisma.department.findFirst();
  const cat = await prisma.category.findFirst({ where: { slug: 'government-orders' } })
    || await prisma.category.findFirst();

  if (!dept || !cat) {
    console.log("No department or category found");
    return;
  }

  let downloaded = 0, failed = 0, noLink = 0, skipped = 0;
  const posts = Array.from(allPosts);

  for (let i = 0; i < posts.length; i++) {
    const postUrl = posts[i];
    const slug = postUrl.split('/').pop()?.replace('.html', '') || 'document';
    const title = slug.replace(/-/g, ' ').replace(/\d{4}\s*$/, '').trim();
    const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

    if (i % 25 === 0) {
      console.log(`\n[${i + 1}/${posts.length}] Processing batch...`);
    }

    try {
      const html = execSync(`curl -s "${postUrl}" --max-time 15`, { encoding: 'utf-8', timeout: 20000 });

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

      console.log(`  Downloading: ${displayTitle.substring(0, 40)}...`);
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

    } catch {
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
