import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");
const BASE_URL = "https://tnpsc.gov.in";

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// TNPSC document sections
const SECTIONS = [
  "/english.html",        // English notifications
  "/tamil.html",          // Tamil notifications
  "/notifications.html",  // All notifications
  "/results.html",        // Results
  "/counselling.html",    // Counselling
  "/",                    // Homepage
];

// Also check document archives
const DOCUMENT_PATHS = [
  "/document/tamil/",
  "/document/english/",
  "/document/notifications/",
  "/document/results/",
  "/document/finalresult/",
  "/document/counselling/",
  "/document/oraltest/",
  "/document/certificateverification/",
];

async function getAllPdfLinks(): Promise<Set<string>> {
  const allPdfs = new Set<string>();

  // Scrape main pages
  for (const section of SECTIONS) {
    try {
      console.log(`Scanning ${section}...`);
      const url = `${BASE_URL}${section}`;
      const html = execSync(`curl -s "${url}" --max-time 30`, { encoding: 'utf-8', timeout: 35000 });

      // Extract all PDF links
      const pdfMatches = html.match(/href="([^"]+\.pdf)"/gi) || [];
      for (const match of pdfMatches) {
        let pdfUrl = match.replace('href="', '').replace('"', '');
        if (pdfUrl.startsWith('http')) {
          allPdfs.add(pdfUrl);
        } else if (pdfUrl.startsWith('/')) {
          allPdfs.add(`${BASE_URL}${pdfUrl}`);
        } else {
          allPdfs.add(`${BASE_URL}/${pdfUrl}`);
        }
      }

      // Also check for S3 links (AWS hosted PDFs)
      const s3Matches = html.match(/https:\/\/[^"]+\.amazonaws\.com[^"]+\.pdf/gi) || [];
      for (const s3Url of s3Matches) {
        allPdfs.add(s3Url);
      }

      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.log(`  Error: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  }

  return allPdfs;
}

function extractTitleFromUrl(url: string): string {
  const filename = decodeURIComponent(url.split('/').pop() || 'document')
    .replace('.pdf', '')
    .replace(/%20/g, ' ')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return filename.charAt(0).toUpperCase() + filename.slice(1);
}

function generateFilename(url: string): string {
  // Create unique filename from URL hash
  const hash = Buffer.from(url).toString('base64').replace(/[/+=]/g, '').substring(0, 25);
  return `tnpsc_${hash}.pdf`;
}

async function downloadPdf(url: string, destPath: string): Promise<boolean> {
  try {
    execSync(`curl -L -o "${destPath}" "${url}" --max-time 120 -s`, { timeout: 130000 });
    const stats = fs.statSync(destPath);
    return stats.size > 1000;
  } catch {
    return false;
  }
}

async function main() {
  console.log("=== Download from TNPSC ===\n");

  // Get all PDF links
  const pdfLinks = await getAllPdfLinks();
  console.log(`\nFound ${pdfLinks.size} unique PDF links\n`);

  // Get department and category
  const dept = await prisma.department.findFirst({ where: { slug: 'tnpsc' } })
    || await prisma.department.findFirst({ where: { slug: 'general-administration' } })
    || await prisma.department.findFirst();

  const cat = await prisma.category.findFirst({ where: { slug: 'notifications' } })
    || await prisma.category.findFirst({ where: { slug: 'government-orders' } })
    || await prisma.category.findFirst();

  if (!dept || !cat) {
    console.log("No department or category found");
    return;
  }

  let downloaded = 0, failed = 0, skipped = 0;
  const pdfArray = Array.from(pdfLinks);

  for (let i = 0; i < pdfArray.length; i++) {
    const pdfUrl = pdfArray[i];
    const title = extractTitleFromUrl(pdfUrl);
    const filename = generateFilename(pdfUrl);

    console.log(`[${i + 1}/${pdfArray.length}] ${title.substring(0, 50)}...`);

    // Check if already exists
    const exists = await prisma.document.findFirst({
      where: {
        OR: [
          { fileName: filename },
          { fileUrl: { contains: filename } }
        ]
      }
    });

    if (exists) {
      console.log(`  Already exists`);
      skipped++;
      continue;
    }

    const destPath = path.join(DOCS_DIR, filename);

    // Check if file exists on disk
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 1000) {
        console.log(`  File exists, adding to DB`);
        await prisma.document.create({
          data: {
            title,
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

    const success = await downloadPdf(pdfUrl, destPath);

    if (success) {
      const stats = fs.statSync(destPath);
      await prisma.document.create({
        data: {
          title,
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
      console.log(`  Failed`);
      failed++;
    }

    await new Promise(r => setTimeout(r, 400));
  }

  console.log("\n=== Summary ===");
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);

  const total = await prisma.document.count();
  console.log(`\nTotal documents: ${total}`);

  await prisma.$disconnect();
}

main().catch(console.error);
