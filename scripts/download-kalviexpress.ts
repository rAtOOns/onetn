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
    const exists = await prisma.document.findFirst({ where: { fileName: filename } });
    if (exists) return false;

    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 5000) {
        const dept = await prisma.department.findFirst();
        const cat = await prisma.category.findFirst();
        if (dept && cat) {
          await prisma.document.create({
            data: { title: task.title, fileName: filename, fileUrl: `/documents/${filename}`,
              fileSize: stats.size, fileType: 'pdf', departmentId: dept.id, categoryId: cat.id, isPublished: true }
          });
          return true;
        }
      }
    }

    const urls = [
      `https://drive.google.com/uc?export=download&id=${task.fileId}`,
      `https://docs.google.com/uc?export=download&id=${task.fileId}`,
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
          data: { title: task.title, fileName: filename, fileUrl: `/documents/${filename}`,
            fileSize: stats.size, fileType: 'pdf', departmentId: dept.id, categoryId: cat.id, isPublished: true }
        });
        console.log(`✓ ${task.title.substring(0, 45)}...`);
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
  console.log("=== Download from Kalviexpress.in ===\n");

  const pages = [
    "https://www.kalviexpress.in/p/government-orders-gos.html",
    "https://www.kalviexpress.in/p/pay-continuation-order-post.html",
    "https://www.kalviexpress.in",
  ];

  const allLinks: Set<string> = new Set();

  for (const page of pages) {
    try {
      console.log(`Scanning ${page}...`);
      const { stdout: html } = await execAsync(`curl -s "${page}" --max-time 20`, { timeout: 25000 });

      const driveMatches = html.match(/(drive\.google\.com|docs\.google\.com)[^"'\s<>]+/g) || [];
      driveMatches.forEach(m => allLinks.add(m));
    } catch {}
  }

  console.log(`\nFound ${allLinks.size} unique links\n`);

  // Extract file IDs
  const tasks: DownloadTask[] = [];
  for (const link of allLinks) {
    const fileId = extractFileId(link);
    if (fileId) {
      tasks.push({ fileId, title: `Kalviexpress GO ${tasks.length + 1}` });
    }
  }

  console.log(`Extracted ${tasks.length} file IDs\n`);

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

  const total = await prisma.document.count();
  console.log(`Total documents: ${total}`);

  await prisma.$disconnect();
}

main().catch(console.error);
