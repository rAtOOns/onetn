import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");
const CONCURRENCY = 15;

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

interface DownloadTask {
  fileId: string;
  title: string;
  postUrl: string;
}

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

async function downloadFile(task: DownloadTask): Promise<boolean> {
  const filename = `${task.fileId}.pdf`;
  const destPath = path.join(DOCS_DIR, filename);

  try {
    // Check if already exists
    const exists = await prisma.document.findFirst({
      where: { fileName: filename }
    });
    if (exists) return false;

    // Check disk
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 5000) {
        const dept = await prisma.department.findFirst();
        const cat = await prisma.category.findFirst();
        if (dept && cat) {
          await prisma.document.create({
            data: {
              title: task.title,
              fileName: filename,
              fileUrl: `/documents/${filename}`,
              fileSize: stats.size,
              fileType: 'pdf',
              departmentId: dept.id,
              categoryId: cat.id,
              isPublished: true,
            }
          });
          return true;
        }
      }
    }

    // Try docs.google.com first, then drive.google.com
    const urls = [
      `https://docs.google.com/uc?export=download&id=${task.fileId}`,
      `https://drive.google.com/uc?export=download&id=${task.fileId}`,
      `https://drive.google.com/uc?export=download&confirm=t&id=${task.fileId}`,
    ];

    let success = false;
    for (const url of urls) {
      try {
        await execAsync(`curl -L -o "${destPath}" "${url}" --max-time 60 -s`, { timeout: 65000 });
        const stats = fs.statSync(destPath);
        if (stats.size > 5000) {
          success = true;
          break;
        }
      } catch {}
    }

    if (success) {
      const stats = fs.statSync(destPath);
      const dept = await prisma.department.findFirst();
      const cat = await prisma.category.findFirst();
      if (dept && cat) {
        await prisma.document.create({
          data: {
            title: task.title,
            fileName: filename,
            fileUrl: `/documents/${filename}`,
            fileSize: stats.size,
            fileType: 'pdf',
            departmentId: dept.id,
            categoryId: cat.id,
            isPublished: true,
          }
        });
        console.log(`✓ ${task.title.substring(0, 50)}...`);
        return true;
      }
    } else {
      try { fs.unlinkSync(destPath); } catch {}
    }
  } catch {
    try { fs.unlinkSync(destPath); } catch {}
  }
  return false;
}

async function main() {
  console.log("=== RESCAN FOR docs.google.com LINKS ===\n");

  const allPosts: string[] = [];

  // Fetch all posts
  console.log("Fetching all kalvisolai posts...");
  for (let start = 1; start <= 2000; start += 150) {
    try {
      const cmd = `curl -s "https://www.tngo.kalvisolai.com/feeds/posts/default?start-index=${start}&max-results=150" | grep -oE 'https://www.tngo.kalvisolai.com/[0-9]+/[0-9]+/[^<]+\\.html'`;
      const { stdout } = await execAsync(cmd, { timeout: 30000 });
      const posts = [...new Set(stdout.trim().split('\n').filter(p => p.length > 0))];
      if (posts.length === 0) break;
      allPosts.push(...posts);
      process.stdout.write(`\r  Found ${allPosts.length} posts...`);
      if (posts.length < 50) break;
    } catch { break; }
  }

  const uniquePosts = [...new Set(allPosts)];
  console.log(`\n  Total: ${uniquePosts.length} posts\n`);

  // Scan pages in parallel for docs.google.com links
  console.log("Scanning for docs.google.com links (missed before)...");
  const tasks: DownloadTask[] = [];

  for (let i = 0; i < uniquePosts.length; i += 20) {
    const batch = uniquePosts.slice(i, i + 20);
    const promises = batch.map(async (postUrl) => {
      try {
        const { stdout: html } = await execAsync(`curl -s "${postUrl}" --max-time 10`, { timeout: 15000 });

        // Look for docs.google.com links (not drive.google.com)
        const docsMatch = html.match(/docs\.google\.com\/uc[^"'\s<>]+/);
        if (docsMatch) {
          const fileId = extractFileId(docsMatch[0]);
          if (fileId) {
            const slug = postUrl.split('/').pop()?.replace('.html', '') || 'document';
            const title = slug.replace(/-/g, ' ').replace(/\d{4}\s*$/, '').trim();
            return { fileId, title: title.charAt(0).toUpperCase() + title.slice(1), postUrl };
          }
        }
      } catch {}
      return null;
    });

    const results = await Promise.all(promises);
    tasks.push(...results.filter((t): t is DownloadTask => t !== null));
    process.stdout.write(`\r  Scanned ${Math.min(i + 20, uniquePosts.length)}/${uniquePosts.length} pages, found ${tasks.length} docs.google.com links`);
  }

  console.log(`\n\nFound ${tasks.length} docs.google.com links to download\n`);

  if (tasks.length === 0) {
    console.log("No new docs.google.com links found");
    await prisma.$disconnect();
    return;
  }

  // Download in parallel
  let downloaded = 0;
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    console.log(`[Batch ${Math.floor(i/CONCURRENCY) + 1}/${Math.ceil(tasks.length/CONCURRENCY)}]`);
    const results = await Promise.all(batch.map(downloadFile));
    downloaded += results.filter(Boolean).length;
  }

  console.log("\n=== Summary ===");
  console.log(`New downloads: ${downloaded}`);
  console.log(`Already in DB/Failed: ${tasks.length - downloaded}`);

  const total = await prisma.document.count();
  console.log(`\nTotal documents: ${total}`);

  await prisma.$disconnect();
}

main().catch(console.error);
