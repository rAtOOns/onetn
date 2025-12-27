/**
 * GO Scraper v2 - Simplified with better error handling
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const DOCS_DIR = path.join(process.cwd(), "public", "documents");
const CONCURRENCY = 5;

if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

const DEPT_CODES: Record<string, string> = {
  "fd": "finance", "sed": "school-education", "hed": "higher-education",
  "hd": "health", "rd": "revenue", "td": "transport", "pd": "home-police",
};

interface GOInfo {
  url: string;
  title: string;
  goNum: number | null;
  goType: string | null;
  goDate: Date | null;
  deptCode: string | null;
  subject: string | null;
  driveId: string | null;
}

// Use curl for reliable fetching
async function curlFetch(url: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`curl -sL -A "Mozilla/5.0" "${url}"`, { timeout: 30000, maxBuffer: 10 * 1024 * 1024 });
    return stdout;
  } catch {
    return "";
  }
}

// Download with curl (handles redirects better)
async function curlDownload(url: string, dest: string): Promise<boolean> {
  try {
    await execAsync(`curl -sL -o "${dest}" -A "Mozilla/5.0" "${url}"`, { timeout: 60000 });
    return fs.existsSync(dest) && fs.statSync(dest).size > 1000;
  } catch {
    return false;
  }
}

function parseGO(title: string, html: string, url: string): GOInfo {
  const info: GOInfo = {
    url, title: title.trim(),
    goNum: null, goType: null, goDate: null,
    deptCode: null, subject: null, driveId: null,
  };

  // GO number: G.O.(Ms) No.264 or GO Ms No 264
  const goMatch = title.match(/G\.?O\.?\s*\(?([A-Za-z]{1,3})\.?\)?\s*(?:No\.?|NO\.?|no\.?)?\s*[-.]?\s*(\d+)/i);
  if (goMatch) {
    info.goType = goMatch[1].toUpperCase();
    info.goNum = parseInt(goMatch[2]);
  }

  // Date: DD.MM.YYYY or DD-MM-YYYY
  const dateMatch = title.match(/(\d{1,2})[-./](\d{1,2})[-./](\d{4})/);
  if (dateMatch) {
    info.goDate = new Date(parseInt(dateMatch[3]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[1]));
  }

  // Department
  const deptMatch = title.match(/[-\s](FD|SED|HED|HD|RD|TD|PD)[-\s]/i);
  if (deptMatch) info.deptCode = deptMatch[1].toLowerCase();
  else if (/finance|pay|pension|nhis/i.test(title)) info.deptCode = "fd";
  else if (/school|education|teacher|dse|dee/i.test(title)) info.deptCode = "sed";

  // Subject (after removing GO number and date)
  let subject = title
    .replace(/G\.?O\.?\s*\(?[A-Za-z]{1,3}\.?\)?\s*(?:No\.?|NO\.?|no\.?)?\s*[-.]?\s*\d+/i, '')
    .replace(/\d{1,2}[-./]\d{1,2}[-./]\d{4}/, '')
    .replace(/^[-.\s|:]+/, '')
    .trim();
  if (subject) info.subject = subject.substring(0, 200);

  // Drive ID
  const driveMatch = html.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                     html.match(/drive\.google\.com\/uc\?.*?id=([a-zA-Z0-9_-]+)/) ||
                     html.match(/id=([a-zA-Z0-9_-]{20,})/);
  if (driveMatch) info.driveId = driveMatch[1];

  return info;
}

async function getSitemapUrls(): Promise<string[]> {
  const urls: string[] = [];
  for (let page = 1; page <= 3; page++) {
    const xml = await curlFetch(`https://www.tngo.kalvisolai.com/sitemap.xml?page=${page}`);
    const matches = xml.matchAll(/<loc>([^<]+\.html)<\/loc>/g);
    for (const m of matches) urls.push(m[1]);
    console.log(`Sitemap ${page}: ${urls.length} URLs`);
  }
  return urls;
}

async function processUrl(url: string, deptMap: Map<string, string>, categoryId: string): Promise<boolean> {
  const html = await curlFetch(url);
  if (!html) return false;

  // Extract title
  const titleMatch = html.match(/<h3[^>]*class="[^"]*post-title[^"]*"[^>]*>([^<]+)</) ||
                     html.match(/<title>([^<]+)</);
  if (!titleMatch) return false;

  const title = titleMatch[1].replace(/\s*[-|].*tngo.*$/i, '').trim();
  const info = parseGO(title, html, url);

  if (!info.driveId) return false;

  // Filename
  let fileName: string;
  if (info.goNum && info.goDate) {
    const ds = info.goDate.toISOString().split('T')[0].replace(/-/g, '');
    fileName = `GO-${info.goType || 'Ms'}-${info.goNum}-${ds}.pdf`;
  } else {
    fileName = `${info.driveId}.pdf`;
  }

  const filePath = path.join(DOCS_DIR, fileName);
  if (fs.existsSync(filePath)) return false;

  // Download using gdown (better for Google Drive)
  const downloadUrl = `https://drive.google.com/uc?id=${info.driveId}&export=download`;
  const success = await curlDownload(downloadUrl, filePath);

  if (!success) {
    try { fs.unlinkSync(filePath); } catch {}
    return false;
  }

  // Verify PDF
  try {
    const { stdout } = await execAsync(`file "${filePath}"`);
    if (!stdout.includes('PDF')) {
      fs.unlinkSync(filePath);
      return false;
    }
  } catch {
    try { fs.unlinkSync(filePath); } catch {}
    return false;
  }

  const fileSize = fs.statSync(filePath).size;

  // Department
  let departmentId = deptMap.get("school-education")!;
  if (info.deptCode && DEPT_CODES[info.deptCode] && deptMap.has(DEPT_CODES[info.deptCode])) {
    departmentId = deptMap.get(DEPT_CODES[info.deptCode])!;
  }

  // Display title
  let displayTitle = info.title;
  if (info.goNum) {
    displayTitle = `G.O. (${info.goType || 'Ms'}) No. ${info.goNum}`;
    if (info.goDate) displayTitle += ` Dt. ${info.goDate.toLocaleDateString('en-IN')}`;
    if (info.subject) displayTitle += ` - ${info.subject.substring(0, 80)}`;
  }

  await prisma.document.create({
    data: {
      title: displayTitle,
      description: info.subject,
      goNum: info.goNum,
      goType: info.goType,
      goDate: info.goDate,
      deptCode: info.deptCode,
      subject: info.subject,
      sourceUrl: url,
      goNumber: info.goNum ? `GO ${info.goNum}` : null,
      fileName,
      fileUrl: `/documents/${fileName}`,
      fileSize,
      fileType: 'pdf',
      categoryId,
      departmentId,
      publishedYear: info.goDate?.getFullYear() || null,
      isPublished: true,
    }
  });

  return true;
}

async function processChunk(urls: string[], deptMap: Map<string, string>, categoryId: string, stats: { s: number, f: number }) {
  for (const url of urls) {
    try {
      const ok = await processUrl(url, deptMap, categoryId);
      if (ok) {
        stats.s++;
        console.log(`✓ [${stats.s}] Downloaded from ${url.split('/').pop()}`);
      } else {
        stats.f++;
      }
    } catch (e) {
      stats.f++;
    }
  }
}

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  GO Scraper v2 - tngo.kalvisolai.com");
  console.log("═══════════════════════════════════════════\n");

  const departments = await prisma.department.findMany();
  const deptMap = new Map(departments.map(d => [d.slug, d.id]));
  console.log(`✓ ${deptMap.size} departments loaded`);

  const category = await prisma.category.findFirst({ where: { slug: 'government-orders' } });
  if (!category) { console.error("No category!"); return; }
  console.log(`✓ Category: ${category.name}\n`);

  const urls = await getSitemapUrls();
  console.log(`\n✓ Total: ${urls.length} URLs\n`);

  const stats = { s: 0, f: 0 };

  // Split into chunks for parallel processing
  const chunkSize = Math.ceil(urls.length / CONCURRENCY);
  const chunks = [];
  for (let i = 0; i < urls.length; i += chunkSize) {
    chunks.push(urls.slice(i, i + chunkSize));
  }

  console.log(`Processing with ${chunks.length} parallel workers...\n`);

  await Promise.all(chunks.map(chunk => processChunk(chunk, deptMap, category.id, stats)));

  console.log("\n═══════════════════════════════════════════");
  console.log(`  DONE: ${stats.s} downloaded, ${stats.f} failed`);
  console.log("═══════════════════════════════════════════");

  const total = await prisma.document.count();
  console.log(`\nTotal documents in DB: ${total}`);

  await prisma.$disconnect();
}

main().catch(console.error);
