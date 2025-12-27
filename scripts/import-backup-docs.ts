/**
 * Import backup documents and match with kalvisolai metadata
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const DOCS_DIR = path.join(process.cwd(), "public", "documents");

async function curlFetch(url: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`curl -sL -A "Mozilla/5.0" "${url}"`, { timeout: 20000, maxBuffer: 10 * 1024 * 1024 });
    return stdout;
  } catch { return ""; }
}

interface PageInfo {
  url: string;
  driveId: string;
  title: string;
  goNum: number | null;
  goType: string | null;
  goDate: Date | null;
  deptCode: string | null;
  subject: string | null;
}

async function buildDriveIdMap(): Promise<Map<string, PageInfo>> {
  const map = new Map<string, PageInfo>();

  console.log("Building Drive ID to metadata map from kalvisolai...\n");

  for (let page = 1; page <= 3; page++) {
    const xml = await curlFetch(`https://www.tngo.kalvisolai.com/sitemap.xml?page=${page}`);
    const urlMatches = xml.matchAll(/<loc>([^<]+\.html)<\/loc>/g);
    const urls = [...urlMatches].map(m => m[1]);
    console.log(`Sitemap ${page}: ${urls.length} URLs`);

    let processed = 0;
    for (const url of urls) {
      const html = await curlFetch(url);
      if (!html) continue;

      // Extract drive ID
      const driveMatch = html.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                         html.match(/drive\.google\.com\/uc\?.*?id=([a-zA-Z0-9_-]+)/) ||
                         html.match(/id=([a-zA-Z0-9_-]{20,})/);
      if (!driveMatch) continue;

      const driveId = driveMatch[1];

      // Extract title
      const titleMatch = html.match(/<h3[^>]*class="[^"]*post-title[^"]*"[^>]*>([^<]+)</) ||
                         html.match(/<title>([^<]+)</);
      if (!titleMatch) continue;

      const title = titleMatch[1].replace(/\s*[-|].*tngo.*$/i, '').trim();

      // Parse GO info
      const goMatch = title.match(/G\.?O\.?\s*\(?([A-Za-z]{1,3})\.?\)?\s*(?:No\.?|NO\.?|no\.?)?\s*[-.]?\s*(\d+)/i);
      const dateMatch = title.match(/(\d{1,2})[-./](\d{1,2})[-./](\d{4})/);
      const deptMatch = title.match(/[-\s](FD|SED|HED|HD|RD|TD|PD)[-\s]/i);

      let goDate: Date | null = null;
      if (dateMatch) {
        goDate = new Date(parseInt(dateMatch[3]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[1]));
      }

      let subject = title
        .replace(/G\.?O\.?\s*\(?[A-Za-z]{1,3}\.?\)?\s*(?:No\.?|NO\.?|no\.?)?\s*[-.]?\s*\d+/i, '')
        .replace(/\d{1,2}[-./]\d{1,2}[-./]\d{4}/, '')
        .replace(/^[-.\s|:]+/, '')
        .trim();

      map.set(driveId, {
        url,
        driveId,
        title,
        goNum: goMatch ? parseInt(goMatch[2]) : null,
        goType: goMatch ? goMatch[1].toUpperCase() : null,
        goDate,
        deptCode: deptMatch ? deptMatch[1].toLowerCase() : null,
        subject: subject || null,
      });

      processed++;
      if (processed % 100 === 0) {
        console.log(`  Processed ${processed} pages, found ${map.size} with Drive IDs`);
      }
    }
  }

  console.log(`\nTotal mappings: ${map.size}\n`);
  return map;
}

const DEPT_CODES: Record<string, string> = {
  "fd": "finance", "sed": "school-education", "hed": "higher-education",
  "hd": "health", "rd": "revenue", "td": "transport", "pd": "home-police",
};

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  Import Backup Documents with Metadata");
  console.log("═══════════════════════════════════════════\n");

  // Get existing documents
  const existing = await prisma.document.findMany({ select: { fileName: true } });
  const existingFiles = new Set(existing.map(d => d.fileName));
  console.log(`Existing in DB: ${existingFiles.size}`);

  // Get all PDF files
  const allFiles = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.pdf'));
  const newFiles = allFiles.filter(f => !existingFiles.has(f));
  console.log(`PDF files on disk: ${allFiles.length}`);
  console.log(`New files to import: ${newFiles.length}\n`);

  if (newFiles.length === 0) {
    console.log("Nothing to import!");
    await prisma.$disconnect();
    return;
  }

  // Build metadata map
  const metadataMap = await buildDriveIdMap();

  // Get departments and category
  const departments = await prisma.department.findMany();
  const deptMap = new Map(departments.map(d => [d.slug, d.id]));
  const defaultDeptId = deptMap.get("school-education")!;

  const category = await prisma.category.findFirst({ where: { slug: 'government-orders' } });
  if (!category) { console.error("No category!"); return; }

  console.log("Importing documents...\n");

  let imported = 0;
  let matched = 0;

  for (const fileName of newFiles) {
    const filePath = path.join(DOCS_DIR, fileName);
    const fileSize = fs.statSync(filePath).size;

    // Extract drive ID from filename
    const driveId = fileName.replace('.pdf', '').replace(/^GO-[A-Za-z]+-\d+-\d+$/, '');

    // Check for metadata
    const info = metadataMap.get(driveId);

    let title: string;
    let goNum: number | null = null;
    let goType: string | null = null;
    let goDate: Date | null = null;
    let deptCode: string | null = null;
    let subject: string | null = null;
    let sourceUrl: string | null = null;
    let departmentId = defaultDeptId;

    if (info) {
      matched++;
      title = info.title;
      goNum = info.goNum;
      goType = info.goType;
      goDate = info.goDate;
      deptCode = info.deptCode;
      subject = info.subject;
      sourceUrl = info.url;

      // Build display title
      if (goNum) {
        title = `G.O. (${goType || 'Ms'}) No. ${goNum}`;
        if (goDate) title += ` Dt. ${goDate.toLocaleDateString('en-IN')}`;
        if (subject) title += ` - ${subject.substring(0, 80)}`;
      }

      // Set department
      if (deptCode && DEPT_CODES[deptCode] && deptMap.has(DEPT_CODES[deptCode])) {
        departmentId = deptMap.get(DEPT_CODES[deptCode])!;
      }
    } else {
      // Generic title
      title = `TN Document - ${driveId.substring(0, 10)}`;
    }

    await prisma.document.create({
      data: {
        title,
        goNum,
        goType,
        goDate,
        deptCode,
        subject,
        sourceUrl,
        goNumber: goNum ? `GO ${goNum}` : null,
        fileName,
        fileUrl: `/documents/${fileName}`,
        fileSize,
        fileType: 'pdf',
        categoryId: category.id,
        departmentId,
        publishedYear: goDate?.getFullYear() || null,
        isPublished: true,
      }
    });

    imported++;
    if (imported % 50 === 0) {
      console.log(`Imported ${imported}/${newFiles.length} (${matched} matched)`);
    }
  }

  console.log(`\n═══════════════════════════════════════════`);
  console.log(`  DONE: ${imported} imported, ${matched} with metadata`);
  console.log(`═══════════════════════════════════════════`);

  const total = await prisma.document.count();
  console.log(`\nTotal documents in DB: ${total}`);

  await prisma.$disconnect();
}

main().catch(console.error);
