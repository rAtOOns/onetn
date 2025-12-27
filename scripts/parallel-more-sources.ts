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
  url: string;
  fileId?: string;
  directUrl?: string;
  title: string;
  source: string;
}

function extractGoogleDriveId(url: string): string | null {
  const decodedUrl = url.replace(/&amp;/g, '&');
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/(a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = decodedUrl.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function downloadTask(task: DownloadTask): Promise<boolean> {
  let filename: string;
  let destPath: string;

  if (task.fileId) {
    filename = `${task.fileId}.pdf`;
  } else if (task.directUrl) {
    const hash = Buffer.from(task.directUrl).toString('base64').replace(/[/+=]/g, '').substring(0, 25);
    filename = `${task.source}_${hash}.pdf`;
  } else {
    return false;
  }

  destPath = path.join(DOCS_DIR, filename);

  try {
    // Check if already exists
    const exists = await prisma.document.findFirst({
      where: { fileName: filename }
    });
    if (exists) return false;

    // Check disk
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 3000) {
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

    // Download
    let downloadUrl: string;
    if (task.fileId) {
      downloadUrl = `https://drive.google.com/uc?export=download&id=${task.fileId}`;
    } else {
      downloadUrl = task.directUrl!;
    }

    await execAsync(`curl -L -o "${destPath}" "${downloadUrl}" --max-time 60 -s`, { timeout: 65000 });
    let stats = fs.statSync(destPath);

    // Try confirm for Drive files
    if (task.fileId && stats.size < 10000) {
      const confirmUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${task.fileId}`;
      await execAsync(`curl -L -o "${destPath}" "${confirmUrl}" --max-time 60 -s`, { timeout: 65000 });
      stats = fs.statSync(destPath);
    }

    if (stats.size > 3000) {
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
        console.log(`✓ [${task.source}] ${task.title.substring(0, 35)}...`);
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

// Kalvi Malar - Another education blog
async function collectKalviMalar(): Promise<DownloadTask[]> {
  console.log("Scanning Kalvi Malar...");
  const tasks: DownloadTask[] = [];

  try {
    for (let start = 1; start <= 500; start += 150) {
      const feedUrl = `https://vazhikatti.kalvimalar.com/feeds/posts/default?start-index=${start}&max-results=150&alt=json`;
      try {
        const { stdout } = await execAsync(`curl -s "${feedUrl}" --max-time 20`, { timeout: 25000 });
        const feed = JSON.parse(stdout);
        const entries = feed.feed?.entry || [];
        if (entries.length === 0) break;

        for (const entry of entries) {
          const links = entry.link || [];
          const postLink = links.find((l: any) => l.rel === 'alternate');
          if (!postLink?.href) continue;

          try {
            const { stdout: html } = await execAsync(`curl -s "${postLink.href}" --max-time 10`, { timeout: 15000 });
            const driveMatch = html.match(/drive\.google\.com[^"'\s<>]+/);
            if (driveMatch) {
              const fileId = extractGoogleDriveId('https://' + driveMatch[0]);
              if (fileId) {
                const title = entry.title?.$t || 'Document';
                tasks.push({ url: postLink.href, fileId, title, source: 'kalvimalar' });
              }
            }
          } catch {}
        }

        if (entries.length < 100) break;
      } catch { break; }
    }
  } catch {}

  console.log(`  Found ${tasks.length} PDFs from Kalvi Malar`);
  return tasks;
}

// Kalvi Seithi - News blog
async function collectKalviSeithi(): Promise<DownloadTask[]> {
  console.log("Scanning Kalvi Seithi...");
  const tasks: DownloadTask[] = [];

  try {
    for (let start = 1; start <= 500; start += 150) {
      const feedUrl = `https://kalviseithi.net/feeds/posts/default?start-index=${start}&max-results=150&alt=json`;
      try {
        const { stdout } = await execAsync(`curl -s "${feedUrl}" --max-time 20`, { timeout: 25000 });
        const feed = JSON.parse(stdout);
        const entries = feed.feed?.entry || [];
        if (entries.length === 0) break;

        for (const entry of entries) {
          const links = entry.link || [];
          const postLink = links.find((l: any) => l.rel === 'alternate');
          if (!postLink?.href) continue;

          try {
            const { stdout: html } = await execAsync(`curl -s "${postLink.href}" --max-time 10`, { timeout: 15000 });
            const driveMatch = html.match(/drive\.google\.com[^"'\s<>]+/);
            if (driveMatch) {
              const fileId = extractGoogleDriveId('https://' + driveMatch[0]);
              if (fileId) {
                const title = entry.title?.$t || 'Document';
                tasks.push({ url: postLink.href, fileId, title, source: 'kalviseithi' });
              }
            }
          } catch {}
        }

        if (entries.length < 100) break;
      } catch { break; }
    }
  } catch {}

  console.log(`  Found ${tasks.length} PDFs from Kalvi Seithi`);
  return tasks;
}

// TNPSC Link
async function collectTNPSCLink(): Promise<DownloadTask[]> {
  console.log("Scanning TNPSC Link...");
  const tasks: DownloadTask[] = [];

  try {
    const { stdout: html } = await execAsync(`curl -s "https://tnpsclink.in" --max-time 20`, { timeout: 25000 });

    // Find all PDF links
    const pdfMatches = html.match(/href="([^"]+\.pdf)"/gi) || [];
    for (const match of pdfMatches) {
      let url = match.replace('href="', '').replace('"', '');
      if (!url.startsWith('http')) {
        url = url.startsWith('/') ? `https://tnpsclink.in${url}` : `https://tnpsclink.in/${url}`;
      }
      const title = decodeURIComponent(url.split('/').pop() || 'document')
        .replace('.pdf', '').replace(/[_-]/g, ' ').trim();
      tasks.push({ url, directUrl: url, title: title.charAt(0).toUpperCase() + title.slice(1), source: 'tnpsclink' });
    }

    // Find Drive links
    const driveMatches = html.match(/drive\.google\.com[^"'\s<>]+/g) || [];
    for (const match of driveMatches) {
      const fileId = extractGoogleDriveId('https://' + match);
      if (fileId) {
        tasks.push({ url: match, fileId, title: 'TNPSC Document', source: 'tnpsclink' });
      }
    }
  } catch {}

  console.log(`  Found ${tasks.length} PDFs from TNPSC Link`);
  return tasks;
}

// DGE TN
async function collectDGE(): Promise<DownloadTask[]> {
  console.log("Scanning DGE TN...");
  const tasks: DownloadTask[] = [];

  const pages = [
    "https://dge.tn.gov.in",
    "https://dge.tn.gov.in/hsesslc/",
    "https://dge.tn.gov.in/services/",
  ];

  for (const page of pages) {
    try {
      const { stdout: html } = await execAsync(`curl -s "${page}" --max-time 15`, { timeout: 20000 });
      const pdfMatches = html.match(/href="([^"]+\.pdf)"/gi) || [];
      for (const match of pdfMatches) {
        let url = match.replace('href="', '').replace('"', '');
        if (!url.startsWith('http')) {
          url = url.startsWith('/') ? `https://dge.tn.gov.in${url}` : `https://dge.tn.gov.in/${url}`;
        }
        const title = decodeURIComponent(url.split('/').pop() || 'document')
          .replace('.pdf', '').replace(/[_-]/g, ' ').trim();
        tasks.push({ url, directUrl: url, title: title.charAt(0).toUpperCase() + title.slice(1), source: 'dge' });
      }
    } catch {}
  }

  // Deduplicate
  const unique = tasks.filter((t, i, self) => i === self.findIndex(x => x.directUrl === t.directUrl));
  console.log(`  Found ${unique.length} PDFs from DGE`);
  return unique;
}

async function main() {
  console.log("=== PARALLEL DOWNLOAD - MORE SOURCES ===\n");

  const startTime = Date.now();

  // Collect from all sources in parallel
  const [kalviMalar, kalviSeithi, tnpscLink, dge] = await Promise.all([
    collectKalviMalar(),
    collectKalviSeithi(),
    collectTNPSCLink(),
    collectDGE(),
  ]);

  const allTasks = [...kalviMalar, ...kalviSeithi, ...tnpscLink, ...dge];

  // Deduplicate by fileId or directUrl
  const unique = allTasks.filter((task, index, self) => {
    if (task.fileId) {
      return index === self.findIndex(t => t.fileId === task.fileId);
    }
    return index === self.findIndex(t => t.directUrl === task.directUrl);
  });

  console.log(`\nTotal unique PDFs: ${unique.length}`);
  console.log(`Downloading with ${CONCURRENCY} concurrent connections...\n`);

  let downloaded = 0;
  for (let i = 0; i < unique.length; i += CONCURRENCY) {
    const batch = unique.slice(i, i + CONCURRENCY);
    console.log(`[Batch ${Math.floor(i/CONCURRENCY) + 1}/${Math.ceil(unique.length/CONCURRENCY)}]`);
    const results = await Promise.all(batch.map(downloadTask));
    downloaded += results.filter(Boolean).length;
  }

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log("\n=== Summary ===");
  console.log(`New downloads: ${downloaded}`);
  console.log(`Already in DB/Failed: ${unique.length - downloaded}`);
  console.log(`Time: ${elapsed} minutes`);

  const total = await prisma.document.count();
  console.log(`\nTotal documents: ${total}`);

  await prisma.$disconnect();
}

main().catch(console.error);
