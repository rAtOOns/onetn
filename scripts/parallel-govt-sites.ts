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

interface PDFTask {
  url: string;
  title: string;
  source: string;
}

async function downloadPdf(task: PDFTask): Promise<boolean> {
  const hash = Buffer.from(task.url).toString('base64').replace(/[/+=]/g, '').substring(0, 25);
  const filename = `${task.source}_${hash}.pdf`;
  const destPath = path.join(DOCS_DIR, filename);

  try {
    const exists = await prisma.document.findFirst({ where: { fileName: filename } });
    if (exists) return false;

    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 2000) {
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

    await execAsync(`curl -L -o "${destPath}" "${task.url}" --max-time 90 -s`, { timeout: 95000 });
    const stats = fs.statSync(destPath);

    if (stats.size > 2000) {
      const dept = await prisma.department.findFirst();
      const cat = await prisma.category.findFirst();
      if (dept && cat) {
        await prisma.document.create({
          data: { title: task.title, fileName: filename, fileUrl: `/documents/${filename}`,
            fileSize: stats.size, fileType: 'pdf', departmentId: dept.id, categoryId: cat.id, isPublished: true }
        });
        console.log(`✓ [${task.source}] ${task.title.substring(0, 40)}...`);
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

async function scanSite(name: string, urls: string[]): Promise<PDFTask[]> {
  const tasks: PDFTask[] = [];
  console.log(`Scanning ${name}...`);

  for (const baseUrl of urls) {
    try {
      const { stdout: html } = await execAsync(`curl -s "${baseUrl}" --max-time 20 -L`, { timeout: 25000 });

      // Find PDF links
      const pdfMatches = html.match(/href="([^"]+\.pdf)"/gi) || [];
      for (const match of pdfMatches) {
        let url = match.replace('href="', '').replace('"', '');
        if (!url.startsWith('http')) {
          const base = new URL(baseUrl);
          url = url.startsWith('/') ? `${base.origin}${url}` : `${base.origin}/${url}`;
        }
        const title = decodeURIComponent(url.split('/').pop() || 'document')
          .replace('.pdf', '').replace(/%20/g, ' ').replace(/[_-]/g, ' ').trim();
        tasks.push({ url, title: title.charAt(0).toUpperCase() + title.slice(1), source: name });
      }
    } catch {}
  }

  const unique = tasks.filter((t, i, self) => i === self.findIndex(x => x.url === t.url));
  console.log(`  Found ${unique.length} PDFs`);
  return unique;
}

async function main() {
  console.log("=== PARALLEL GOVT SITES DOWNLOAD ===\n");

  const sites: { name: string; urls: string[] }[] = [
    { name: "trb", urls: ["https://trb.tn.gov.in", "https://trb.tn.gov.in/2025/TRB-Forms.html"] },
    { name: "tndte", urls: ["https://www.tndte.gov.in", "https://www.tndte.gov.in/site/go-circular/"] },
    { name: "dse", urls: ["https://dse.tnschools.gov.in"] },
    { name: "tnsocialwelfare", urls: ["https://www.tnsocialwelfare.tn.gov.in"] },
  ];

  const allTasks: PDFTask[] = [];

  // Scan all sites in parallel
  const results = await Promise.all(sites.map(s => scanSite(s.name, s.urls)));
  results.forEach(r => allTasks.push(...r));

  // Deduplicate
  const unique = allTasks.filter((t, i, self) => i === self.findIndex(x => x.url === t.url));
  console.log(`\nTotal unique PDFs: ${unique.length}`);

  if (unique.length === 0) {
    console.log("No PDFs found from these sources");
    await prisma.$disconnect();
    return;
  }

  console.log(`Downloading with ${CONCURRENCY} concurrent connections...\n`);

  let downloaded = 0;
  for (let i = 0; i < unique.length; i += CONCURRENCY) {
    const batch = unique.slice(i, i + CONCURRENCY);
    console.log(`[Batch ${Math.floor(i/CONCURRENCY) + 1}/${Math.ceil(unique.length/CONCURRENCY)}]`);
    const batchResults = await Promise.all(batch.map(downloadPdf));
    downloaded += batchResults.filter(Boolean).length;
  }

  console.log("\n=== Summary ===");
  console.log(`New downloads: ${downloaded}`);

  const total = await prisma.document.count();
  console.log(`Total documents: ${total}`);

  await prisma.$disconnect();
}

main().catch(console.error);
