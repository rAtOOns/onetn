import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");
const CONCURRENCY = 10;

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

interface PDFTask {
  url: string;
  title: string;
}

async function downloadPdf(task: PDFTask): Promise<boolean> {
  const hash = Buffer.from(task.url).toString('base64').replace(/[/+=]/g, '').substring(0, 25);
  const filename = `tnpsc_${hash}.pdf`;
  const destPath = path.join(DOCS_DIR, filename);

  try {
    // Check if already exists
    const exists = await prisma.document.findFirst({
      where: { fileName: filename }
    });
    if (exists) return false;

    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 1000) {
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

    await execAsync(`curl -L -o "${destPath}" "${task.url}" --max-time 60 -s`, { timeout: 65000 });
    const stats = fs.statSync(destPath);

    if (stats.size > 1000) {
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
        console.log(`✓ ${task.title.substring(0, 50)}... (${(stats.size/1024).toFixed(0)}KB)`);
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

async function collectPDFs(): Promise<PDFTask[]> {
  const tasks: PDFTask[] = [];
  const pages = [
    "https://tnpsc.gov.in",
    "https://tnpsc.gov.in/english.html",
    "https://tnpsc.gov.in/tamil.html",
    "https://tnpsc.gov.in/notifications.html",
    "https://tnpsc.gov.in/results.html",
  ];

  for (const page of pages) {
    try {
      const { stdout: html } = await execAsync(`curl -s "${page}" --max-time 20`, { timeout: 25000 });

      // Find all PDF links
      const pdfMatches = html.match(/href="([^"]+\.pdf)"/gi) || [];
      for (const match of pdfMatches) {
        let pdfUrl = match.replace('href="', '').replace('"', '');
        if (!pdfUrl.startsWith('http')) {
          pdfUrl = pdfUrl.startsWith('/') ? `https://tnpsc.gov.in${pdfUrl}` : `https://tnpsc.gov.in/${pdfUrl}`;
        }
        const title = decodeURIComponent(pdfUrl.split('/').pop() || 'document')
          .replace('.pdf', '').replace(/[_-]/g, ' ').trim();
        tasks.push({ url: pdfUrl, title: title.charAt(0).toUpperCase() + title.slice(1) });
      }

      // Also get S3 links
      const s3Matches = html.match(/https:\/\/[^"]+\.amazonaws\.com[^"]+\.pdf/gi) || [];
      for (const s3Url of s3Matches) {
        const title = decodeURIComponent(s3Url.split('/').pop() || 'document')
          .replace('.pdf', '').replace(/[_-]/g, ' ').trim();
        tasks.push({ url: s3Url, title: title.charAt(0).toUpperCase() + title.slice(1) });
      }
    } catch {}
  }

  // Deduplicate
  return tasks.filter((task, i, self) => i === self.findIndex(t => t.url === task.url));
}

async function main() {
  console.log("=== PARALLEL TNPSC DOWNLOAD ===\n");

  const tasks = await collectPDFs();
  console.log(`Found ${tasks.length} PDFs from TNPSC\n`);

  let downloaded = 0;
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    console.log(`[Batch ${Math.floor(i/CONCURRENCY) + 1}/${Math.ceil(tasks.length/CONCURRENCY)}]`);
    const results = await Promise.all(batch.map(downloadPdf));
    downloaded += results.filter(Boolean).length;
  }

  console.log(`\nDownloaded: ${downloaded}`);
  const total = await prisma.document.count();
  console.log(`Total documents: ${total}`);

  await prisma.$disconnect();
}

main().catch(console.error);
