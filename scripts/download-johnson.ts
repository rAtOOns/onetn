import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");
const BASE_URL = "https://www.johnsonasirservices.org";

// Ensure directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// Pages to scrape
const PAGES = [
  "/",
  "/government-orders-i/",
  "/government-orders-ii/",
  "/government-orders-s-3/",
  "/service-rules/",
  "/pension-rules/tamil-nadu-pension-rules/",
  "/pension-rules/government-orders-on-pension/",
  "/govt-orders-on-pension-i/",
  "/hba-gos-forms/",
  "/new-health-insurance-scheme-2016/",
  "/leaves-admissible-to-tamil-nadu-govt-servants/",
  "/tamil-nadu-travelling-allowance-rules/",
  "/income-tax/",
  "/pension-rules/contributory-pension-scheme/",
  "/pension-rules/pension-related-forms/",
];

async function getAllPdfLinks(): Promise<Set<string>> {
  const allPdfs = new Set<string>();
  
  for (const page of PAGES) {
    try {
      console.log(`Scanning ${page}...`);
      const url = `${BASE_URL}${page}`;
      const html = execSync(`curl -s "${url}" --max-time 30`, { encoding: 'utf-8', timeout: 35000 });
      
      // Extract PDF links
      const pdfMatches = html.match(/href="([^"]+\.pdf)"/gi) || [];
      for (const match of pdfMatches) {
        const pdfUrl = match.replace('href="', '').replace('"', '');
        if (pdfUrl.startsWith('http')) {
          allPdfs.add(pdfUrl);
        } else if (pdfUrl.startsWith('/')) {
          allPdfs.add(`${BASE_URL}${pdfUrl}`);
        }
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
  console.log("=== Download from Johnson Asir Services ===\n");
  
  // Get all PDF links
  const pdfLinks = await getAllPdfLinks();
  console.log(`\nFound ${pdfLinks.size} unique PDF links\n`);
  
  // Get department and category
  const dept = await prisma.department.findFirst({ where: { slug: 'finance' } })
    || await prisma.department.findFirst();
  const cat = await prisma.category.findFirst({ where: { slug: 'government-orders' } })
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
    
    console.log(`[${i + 1}/${pdfArray.length}] ${title.substring(0, 50)}...`);
    
    // Check if already exists
    const exists = await prisma.document.findFirst({
      where: { 
        OR: [
          { fileUrl: { contains: pdfUrl.split('/').pop() || '' } },
          { title: { contains: title.substring(0, 20) } }
        ]
      }
    });
    
    if (exists) {
      console.log(`  Already exists`);
      skipped++;
      continue;
    }
    
    // Generate unique filename
    const hash = Buffer.from(pdfUrl).toString('base64').replace(/[/+=]/g, '').substring(0, 20);
    const filename = `johnson_${hash}.pdf`;
    const destPath = path.join(DOCS_DIR, filename);
    
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
    
    await new Promise(r => setTimeout(r, 500));
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
