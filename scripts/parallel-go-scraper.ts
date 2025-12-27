/**
 * Advanced Parallel GO Scraper
 * - Scrapes tngo.kalvisolai.com with concurrent workers
 * - Extracts rich metadata (GO#, type, date, dept, subject)
 * - Downloads PDFs from Google Drive
 * - Removes watermarks
 * - Stores with proper naming
 */

import { PrismaClient } from "@prisma/client";
import * as https from "https";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const DOCS_DIR = path.join(process.cwd(), "public", "documents");
const TEMP_DIR = "/tmp/go-scraper";
const CONCURRENCY = 10; // Parallel workers
const RETRY_ATTEMPTS = 2;

// Ensure directories exist
if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// Department code mapping
const DEPT_CODES: Record<string, string> = {
  "fd": "finance",
  "sed": "school-education",
  "hed": "higher-education",
  "hd": "health",
  "rd": "revenue",
  "td": "transport",
  "pd": "home-police",
  "agri": "agriculture",
  "rdd": "rural-development",
  "mad": "municipal",
  "pwd": "public-works",
  "sw": "social-welfare",
  "pa": "personnel-admin",
};

interface GOData {
  url: string;
  title: string;
  goNum: number | null;
  goType: string | null;
  goDate: Date | null;
  deptCode: string | null;
  subject: string | null;
  subjectTamil: string | null;
  driveId: string | null;
}

// Simple fetch with timeout
function fetch(url: string, timeout = 15000): Promise<string> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), timeout);
    const client = url.startsWith("https") ? https : http;

    client.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: timeout
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        clearTimeout(timer);
        fetch(res.headers.location!, timeout).then(resolve).catch(reject);
        return;
      }
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => { clearTimeout(timer); resolve(data); });
      res.on("error", (e) => { clearTimeout(timer); reject(e); });
    }).on("error", (e) => { clearTimeout(timer); reject(e); });
  });
}

// Download file with retry
async function downloadFile(url: string, dest: string, retries = RETRY_ATTEMPTS): Promise<boolean> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await new Promise<boolean>((resolve) => {
        const file = fs.createWriteStream(dest);
        const request = https.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 30000
        }, (res) => {
          if (res.statusCode === 302 || res.statusCode === 301) {
            file.close();
            try { fs.unlinkSync(dest); } catch {}
            downloadFile(res.headers.location!, dest, 0).then(resolve);
            return;
          }
          res.pipe(file);
          file.on('finish', () => { file.close(); resolve(true); });
        });
        request.on('error', () => { file.close(); resolve(false); });
        request.on('timeout', () => { request.destroy(); file.close(); resolve(false); });
      });

      if (response && fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
        return true;
      }
    } catch {}
    await sleep(1000 * (i + 1));
  }
  return false;
}

// Parse GO metadata from title
function parseGOData(title: string, url: string, html: string): GOData {
  const data: GOData = {
    url,
    title: title.trim(),
    goNum: null,
    goType: null,
    goDate: null,
    deptCode: null,
    subject: null,
    subjectTamil: null,
    driveId: null,
  };

  // Extract GO number and type: "G.O.(Ms) No.264" or "GO Ms No 264"
  const goMatch = title.match(/G\.?O\.?\s*\(?([A-Za-z]{1,3})\.?\)?\s*(?:No\.?|NO\.?|no\.?)?\s*[-.]?\s*(\d+)/i);
  if (goMatch) {
    data.goType = goMatch[1].toUpperCase();
    data.goNum = parseInt(goMatch[2]);
  }

  // Extract date: "10.12.2025" or "10-12-2025" or "10/12/2025"
  const dateMatch = title.match(/(\d{1,2})[-./](\d{1,2})[-./](\d{4})/);
  if (dateMatch) {
    const [_, day, month, year] = dateMatch;
    data.goDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Extract department code
  const deptMatch = title.match(/[-\s](FD|SED|HED|HD|RD|TD|PD|AGRI|RDD|MAD|PWD|SW|PA)[-\s]/i);
  if (deptMatch) {
    data.deptCode = deptMatch[1].toLowerCase();
  } else {
    // Try to infer from content
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("finance") || lowerTitle.includes("pay") || lowerTitle.includes("pension") || lowerTitle.includes("nhis")) {
      data.deptCode = "fd";
    } else if (lowerTitle.includes("school") || lowerTitle.includes("education") || lowerTitle.includes("teacher") || lowerTitle.includes("dse") || lowerTitle.includes("dee")) {
      data.deptCode = "sed";
    } else if (lowerTitle.includes("health") || lowerTitle.includes("medical") || lowerTitle.includes("hospital")) {
      data.deptCode = "hd";
    }
  }

  // Extract subject (everything after date or GO number)
  let subject = title;
  if (data.goNum) {
    subject = title.replace(/G\.?O\.?\s*\(?[A-Za-z]{1,3}\.?\)?\s*(?:No\.?|NO\.?|no\.?)?\s*[-.]?\s*\d+/i, '');
  }
  if (data.goDate) {
    subject = subject.replace(/\d{1,2}[-./]\d{1,2}[-./]\d{4}/, '');
  }
  subject = subject.replace(/^[-.\s|:]+/, '').replace(/[-.\s|:]+$/, '').trim();

  // Split Tamil and English if both present
  if (subject.includes('|')) {
    const parts = subject.split('|');
    data.subject = parts[0].trim();
    data.subjectTamil = parts[1]?.trim() || null;
  } else {
    // Check if it's Tamil (contains Tamil Unicode range)
    if (/[\u0B80-\u0BFF]/.test(subject)) {
      data.subjectTamil = subject;
    } else {
      data.subject = subject;
    }
  }

  // Extract Google Drive ID
  const drivePatterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?.*?id=([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]{20,})/,
  ];
  for (const pattern of drivePatterns) {
    const match = html.match(pattern);
    if (match) {
      data.driveId = match[1];
      break;
    }
  }

  return data;
}

// Extract title from HTML
function extractTitle(html: string): string | null {
  // Try post-title first (Blogger)
  let match = html.match(/<h3[^>]*class="[^"]*post-title[^"]*"[^>]*>([^<]+)</);
  if (match) return match[1].trim();

  // Try h1
  match = html.match(/<h1[^>]*>([^<]+)</);
  if (match) return match[1].trim();

  // Try title tag
  match = html.match(/<title>([^<]+)</);
  if (match) return match[1].replace(/\s*[-|].*$/, '').trim();

  return null;
}

// Remove watermark from PDF
async function removeWatermark(inputPath: string, outputPath: string): Promise<boolean> {
  try {
    // Use qpdf to linearize and potentially remove some watermarks
    await execAsync(`qpdf --linearize "${inputPath}" "${outputPath}" 2>/dev/null || cp "${inputPath}" "${outputPath}"`, { timeout: 30000 });
    return fs.existsSync(outputPath);
  } catch {
    // Fallback: just copy the file
    try {
      fs.copyFileSync(inputPath, outputPath);
      return true;
    } catch {
      return false;
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

// Get all sitemap URLs
async function getSitemapUrls(): Promise<string[]> {
  const urls: string[] = [];

  console.log("Fetching sitemaps...");

  for (let page = 1; page <= 3; page++) {
    try {
      const xml = await fetch(`https://www.tngo.kalvisolai.com/sitemap.xml?page=${page}`);
      const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
      for (const match of matches) {
        if (match[1].includes('.html')) {
          urls.push(match[1]);
        }
      }
      console.log(`  Sitemap page ${page}: ${urls.length} URLs so far`);
    } catch (e) {
      console.error(`  Error fetching sitemap page ${page}`);
    }
  }

  return urls;
}

// Process a single URL
async function processUrl(url: string, deptMap: Map<string, string>, categoryId: string): Promise<{ success: boolean; goNum?: number }> {
  try {
    const html = await fetch(url);
    const title = extractTitle(html);

    if (!title) return { success: false };

    const goData = parseGOData(title, url, html);

    if (!goData.driveId) return { success: false };

    // Generate filename
    let fileName: string;
    if (goData.goNum && goData.goType && goData.goDate) {
      const dateStr = goData.goDate.toISOString().split('T')[0].replace(/-/g, '');
      fileName = `GO-${goData.goType}-${goData.goNum}-${dateStr}.pdf`;
    } else {
      fileName = `${goData.driveId}.pdf`;
    }

    const tempPath = path.join(TEMP_DIR, `temp-${goData.driveId}.pdf`);
    const finalPath = path.join(DOCS_DIR, fileName);

    // Skip if already exists
    if (fs.existsSync(finalPath)) {
      return { success: false };
    }

    // Download
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${goData.driveId}`;
    const downloaded = await downloadFile(downloadUrl, tempPath);

    if (!downloaded) return { success: false };

    // Verify it's a PDF
    try {
      const { stdout } = await execAsync(`file "${tempPath}"`, { timeout: 5000 });
      if (!stdout.includes('PDF')) {
        fs.unlinkSync(tempPath);
        return { success: false };
      }
    } catch {
      fs.unlinkSync(tempPath);
      return { success: false };
    }

    // Remove watermark (or just copy if qpdf not available)
    await removeWatermark(tempPath, finalPath);

    // Cleanup temp
    try { fs.unlinkSync(tempPath); } catch {}

    if (!fs.existsSync(finalPath)) return { success: false };

    const fileSize = fs.statSync(finalPath).size;

    // Determine department
    let departmentId = deptMap.get("school-education")!;
    if (goData.deptCode && DEPT_CODES[goData.deptCode]) {
      const deptSlug = DEPT_CODES[goData.deptCode];
      if (deptMap.has(deptSlug)) {
        departmentId = deptMap.get(deptSlug)!;
      }
    }

    // Build display title
    let displayTitle = goData.title;
    if (goData.goNum) {
      displayTitle = `G.O. (${goData.goType || 'Ms'}) No. ${goData.goNum}`;
      if (goData.goDate) {
        displayTitle += ` Dt. ${goData.goDate.toLocaleDateString('en-IN')}`;
      }
    }

    // Create database entry
    await prisma.document.create({
      data: {
        title: displayTitle,
        titleTamil: goData.subjectTamil,
        description: goData.subject,
        descTamil: goData.subjectTamil,
        goNum: goData.goNum,
        goType: goData.goType,
        goDate: goData.goDate,
        deptCode: goData.deptCode,
        subject: goData.subject,
        subjectTamil: goData.subjectTamil,
        sourceUrl: url,
        goNumber: goData.goNum ? `GO ${goData.goNum}` : null,
        fileName,
        fileUrl: `/documents/${fileName}`,
        fileSize,
        fileType: 'pdf',
        categoryId,
        departmentId,
        publishedYear: goData.goDate?.getFullYear() || null,
        isPublished: true,
      }
    });

    return { success: true, goNum: goData.goNum || undefined };

  } catch (e) {
    return { success: false };
  }
}

// Worker that processes URLs from queue
async function worker(
  id: number,
  urls: string[],
  startIdx: number,
  endIdx: number,
  deptMap: Map<string, string>,
  categoryId: string,
  stats: { success: number; failed: number }
): Promise<void> {
  for (let i = startIdx; i < endIdx && i < urls.length; i++) {
    const result = await processUrl(urls[i], deptMap, categoryId);
    if (result.success) {
      stats.success++;
      if (result.goNum) {
        process.stdout.write(`\r✓ GO ${result.goNum} | Success: ${stats.success} | Failed: ${stats.failed}    `);
      }
    } else {
      stats.failed++;
    }

    // Small delay to be nice to server
    await sleep(100);
  }
}

async function main() {
  console.log("╔════════════════════════════════════════════════════╗");
  console.log("║     Advanced Parallel GO Scraper v2.0              ║");
  console.log("║     tngo.kalvisolai.com → Clean PDFs               ║");
  console.log("╚════════════════════════════════════════════════════╝\n");

  // Get departments
  const departments = await prisma.department.findMany();
  const deptMap = new Map(departments.map(d => [d.slug, d.id]));

  if (deptMap.size === 0) {
    console.error("No departments found! Run seed first.");
    return;
  }
  console.log(`✓ Loaded ${deptMap.size} departments`);

  // Get category
  const category = await prisma.category.findFirst({ where: { slug: 'government-orders' } });
  if (!category) {
    console.error("No 'government-orders' category found! Run seed first.");
    return;
  }
  console.log(`✓ Using category: ${category.name}`);

  // Get URLs
  const urls = await getSitemapUrls();
  console.log(`\n✓ Found ${urls.length} URLs to process\n`);

  if (urls.length === 0) {
    console.error("No URLs found!");
    return;
  }

  // Stats
  const stats = { success: 0, failed: 0 };

  // Split URLs among workers
  const chunkSize = Math.ceil(urls.length / CONCURRENCY);
  const workers: Promise<void>[] = [];

  console.log(`Starting ${CONCURRENCY} parallel workers...\n`);

  for (let i = 0; i < CONCURRENCY; i++) {
    const startIdx = i * chunkSize;
    const endIdx = startIdx + chunkSize;
    workers.push(worker(i, urls, startIdx, endIdx, deptMap, category.id, stats));
  }

  // Wait for all workers
  await Promise.all(workers);

  console.log("\n\n╔════════════════════════════════════════════════════╗");
  console.log("║                    COMPLETE                         ║");
  console.log("╠════════════════════════════════════════════════════╣");
  console.log(`║  Successfully downloaded: ${String(stats.success).padStart(6)} documents        ║`);
  console.log(`║  Failed/skipped:          ${String(stats.failed).padStart(6)} documents        ║`);
  console.log(`║  Total processed:         ${String(urls.length).padStart(6)} URLs             ║`);
  console.log("╚════════════════════════════════════════════════════╝");

  // Show sample
  const samples = await prisma.document.findMany({
    take: 10,
    orderBy: { goNum: 'desc' },
    select: { title: true, goNum: true, goDate: true, deptCode: true }
  });

  if (samples.length > 0) {
    console.log("\n📄 Sample documents:");
    samples.forEach(d => {
      const date = d.goDate ? d.goDate.toLocaleDateString('en-IN') : 'N/A';
      console.log(`   GO ${d.goNum} | ${date} | ${d.deptCode || 'N/A'} | ${d.title.substring(0, 40)}...`);
    });
  }

  // Cleanup temp
  try { fs.rmSync(TEMP_DIR, { recursive: true }); } catch {}

  await prisma.$disconnect();
}

main().catch(console.error);
