import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { execSync, exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");
const CONCURRENCY = 10; // Download 10 files at a time

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

interface DownloadTask {
  url: string;
  fileId: string;
  title: string;
  source: string;
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

async function downloadFile(task: DownloadTask): Promise<boolean> {
  const filename = `${task.fileId}.pdf`;
  const destPath = path.join(DOCS_DIR, filename);

  try {
    // Check if already in DB
    const exists = await prisma.document.findFirst({
      where: {
        OR: [
          { fileName: { contains: task.fileId } },
          { fileUrl: { contains: task.fileId } }
        ]
      }
    });
    if (exists) return false;

    // Check if file exists on disk
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 5000) {
        // Add to DB
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

    // Download from Google Drive
    const url = `https://drive.google.com/uc?export=download&id=${task.fileId}`;
    await execAsync(`curl -L -o "${destPath}" "${url}" --max-time 60 -s`, { timeout: 65000 });

    let stats = fs.statSync(destPath);

    if (stats.size < 10000) {
      const confirmUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${task.fileId}`;
      await execAsync(`curl -L -o "${destPath}" "${confirmUrl}" --max-time 60 -s`, { timeout: 65000 });
      stats = fs.statSync(destPath);
    }

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
        console.log(`✓ ${task.title.substring(0, 40)}... (${(stats.size/1024).toFixed(0)}KB)`);
        return true;
      }
    } else {
      fs.unlinkSync(destPath);
    }
  } catch {
    try { fs.unlinkSync(destPath); } catch {}
  }
  return false;
}

async function processInBatches<T, R>(items: T[], batchSize: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    console.log(`\n[Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(items.length/batchSize)}] Processing ${batch.length} items in parallel...`);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

async function collectFromPadasalai(): Promise<DownloadTask[]> {
  console.log("Collecting from Padasalai...");
  const tasks: DownloadTask[] = [];

  try {
    const feedUrl = `https://www.padasalai.net/feeds/posts/default?max-results=500&alt=json`;
    const feedJson = execSync(`curl -s "${feedUrl}" --max-time 30`, { encoding: 'utf-8', timeout: 35000 });
    const feed = JSON.parse(feedJson);
    const entries = feed.feed?.entry || [];

    console.log(`Found ${entries.length} Padasalai posts`);

    // Process posts in parallel to find Drive links
    const postUrls = entries.map((e: any) => {
      const links = e.link || [];
      const postLink = links.find((l: any) => l.rel === 'alternate');
      return postLink?.href;
    }).filter(Boolean);

    // Fetch pages in batches of 20
    for (let i = 0; i < postUrls.length; i += 20) {
      const batch = postUrls.slice(i, i + 20);
      const promises = batch.map(async (url: string) => {
        try {
          const { stdout: html } = await execAsync(`curl -s "${url}" --max-time 10`, { timeout: 15000 });
          const driveMatch = html.match(/drive\.google\.com[^"'\s<>]+/);
          if (driveMatch) {
            const fileId = extractGoogleDriveId('https://' + driveMatch[0]);
            if (fileId) {
              const slug = url.split('/').pop()?.replace('.html', '') || 'document';
              const title = slug.replace(/-/g, ' ').replace(/\d{4}\s*$/, '').trim();
              return { url, fileId, title: title.charAt(0).toUpperCase() + title.slice(1), source: 'padasalai' };
            }
          }
        } catch {}
        return null;
      });
      const results = await Promise.all(promises);
      tasks.push(...results.filter((t): t is DownloadTask => t !== null));
      process.stdout.write(`\r  Scanned ${Math.min(i + 20, postUrls.length)}/${postUrls.length} pages, found ${tasks.length} PDFs`);
    }
    console.log();
  } catch (e) {
    console.log("Padasalai error:", e);
  }

  return tasks;
}

async function collectFromKalvisolai(): Promise<DownloadTask[]> {
  console.log("Collecting from Kalvisolai...");
  const tasks: DownloadTask[] = [];
  const allPosts: string[] = [];

  // Get posts from RSS
  for (let start = 1; start <= 2000; start += 150) {
    try {
      const cmd = `curl -s "https://www.tngo.kalvisolai.com/feeds/posts/default?start-index=${start}&max-results=150" | grep -oE 'https://www.tngo.kalvisolai.com/[0-9]+/[0-9]+/[^<]+\\.html'`;
      const output = execSync(cmd, { encoding: 'utf-8', timeout: 30000 });
      const posts = [...new Set(output.trim().split('\n').filter(p => p.length > 0))];
      if (posts.length === 0) break;
      allPosts.push(...posts);
      if (posts.length < 50) break;
    } catch { break; }
  }

  const uniquePosts = [...new Set(allPosts)];
  console.log(`Found ${uniquePosts.length} Kalvisolai posts`);

  // Fetch pages in batches of 20
  for (let i = 0; i < uniquePosts.length; i += 20) {
    const batch = uniquePosts.slice(i, i + 20);
    const promises = batch.map(async (url: string) => {
      try {
        const { stdout: html } = await execAsync(`curl -s "${url}" --max-time 10`, { timeout: 15000 });
        const driveMatch = html.match(/drive\.google\.com[^"'\s<>]+/);
        if (driveMatch) {
          const fileId = extractGoogleDriveId('https://' + driveMatch[0]);
          if (fileId) {
            const slug = url.split('/').pop()?.replace('.html', '') || 'document';
            const title = slug.replace(/-/g, ' ').replace(/\d{4}\s*$/, '').trim();
            return { url, fileId, title: title.charAt(0).toUpperCase() + title.slice(1), source: 'kalvisolai' };
          }
        }
      } catch {}
      return null;
    });
    const results = await Promise.all(promises);
    tasks.push(...results.filter((t): t is DownloadTask => t !== null));
    process.stdout.write(`\r  Scanned ${Math.min(i + 20, uniquePosts.length)}/${uniquePosts.length} pages, found ${tasks.length} PDFs`);
  }
  console.log();

  return tasks;
}

async function main() {
  console.log("=== PARALLEL DOWNLOAD - 10x Faster ===\n");

  const startTime = Date.now();

  // Collect all tasks in parallel
  const [padasalaiTasks, kalvisolaiTasks] = await Promise.all([
    collectFromPadasalai(),
    collectFromKalvisolai()
  ]);

  // Deduplicate by fileId
  const allTasks = [...padasalaiTasks, ...kalvisolaiTasks];
  const uniqueTasks = allTasks.filter((task, index, self) =>
    index === self.findIndex(t => t.fileId === task.fileId)
  );

  console.log(`\nTotal unique PDFs to download: ${uniqueTasks.length}`);
  console.log(`Starting parallel downloads (${CONCURRENCY} concurrent)...\n`);

  // Download in parallel batches
  const results = await processInBatches(uniqueTasks, CONCURRENCY, downloadFile);
  const downloaded = results.filter(Boolean).length;

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log("\n=== Summary ===");
  console.log(`New downloads: ${downloaded}`);
  console.log(`Already in DB/Failed: ${uniqueTasks.length - downloaded}`);
  console.log(`Time elapsed: ${elapsed} minutes`);

  const total = await prisma.document.count();
  console.log(`\nTotal documents: ${total}`);

  await prisma.$disconnect();
}

main().catch(console.error);
