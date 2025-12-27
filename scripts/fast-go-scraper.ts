/**
 * Fast GO Scraper - Parallel processing
 * Focuses on Education Department GOs
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const QUALITY_DIR = path.join(process.cwd(), "public", "documents", "quality");
const LIMIT = parseInt(process.argv[2]) || 200;
const CONCURRENCY = 5; // Process 5 at a time

if (!fs.existsSync(QUALITY_DIR)) fs.mkdirSync(QUALITY_DIR, { recursive: true });

const DEPARTMENTS: Record<string, { en: string; ta: string }> = {
  "fd": { en: "Finance Department", ta: "நிதித்துறை" },
  "sed": { en: "School Education Department", ta: "பள்ளிக்கல்வித்துறை" },
  "hed": { en: "Higher Education Department", ta: "உயர்கல்வித்துறை" },
  "hd": { en: "Health & Family Welfare", ta: "சுகாதாரம் மற்றும் குடும்பநலத்துறை" },
};

async function curlFetch(url: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`curl -sL -A "Mozilla/5.0" --max-time 15 "${url}"`, {
      timeout: 20000,
      maxBuffer: 10 * 1024 * 1024
    });
    return stdout;
  } catch { return ""; }
}

async function downloadPDF(driveId: string, destPath: string): Promise<boolean> {
  try {
    const url = `https://drive.google.com/uc?export=download&id=${driveId}`;
    await execAsync(`curl -sL -o "${destPath}" --max-time 30 -A "Mozilla/5.0" "${url}"`, { timeout: 35000 });

    if (!fs.existsSync(destPath)) return false;
    const size = fs.statSync(destPath).size;
    if (size < 1000) { fs.unlinkSync(destPath); return false; }

    const { stdout } = await execAsync(`file "${destPath}"`);
    if (!stdout.includes('PDF')) { fs.unlinkSync(destPath); return false; }
    return true;
  } catch {
    try { fs.unlinkSync(destPath); } catch {}
    return false;
  }
}

interface ParsedGO {
  goNumber: number;
  goType: string;
  goDate: Date;
  deptCode: string;
  titleEn: string;
  titleTa: string | null;
  summaryEn: string | null;
  summaryTa: string | null;
  keywords: string[];
  driveId: string | null;
  sourceUrl: string;
}

function parseGOPage(html: string, url: string): ParsedGO | null {
  const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/) ||
                     html.match(/<title>([^<]+)</);
  if (!titleMatch) return null;

  const fullTitle = titleMatch[1]
    .replace(/\s*[-|]?\s*Kalvisolai.*$/i, '')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .trim();

  // Extract GO number - more flexible pattern
  const goMatch = fullTitle.match(/G\.?O\.?\s*\(?([A-Za-z]{1,3})\.?\)?\s*(?:No\.?|NO\.?|no\.?)?\s*[-.]?\s*(\d+)/i) ||
                  fullTitle.match(/GO\s*[-.]?\s*(\w+)\s*[-.]?\s*(\d+)/i);
  if (!goMatch) return null;

  const goType = goMatch[1].toUpperCase();
  const goNumber = parseInt(goMatch[2]);

  // Extract date
  const dateMatch = fullTitle.match(/(\d{1,2})[-./](\d{1,2})[-./](\d{4})/);
  if (!dateMatch) return null;

  const goDate = new Date(parseInt(dateMatch[3]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[1]));
  if (isNaN(goDate.getTime())) return null;

  // Determine department - prioritize education
  let deptCode = "sed";
  if (/[-\s](FD|FINANCE)[-\s]/i.test(fullTitle) || /pay|salary|pension|da |hra|nhis/i.test(fullTitle)) {
    deptCode = "fd";
  } else if (/[-\s](HD|HEALTH)[-\s]/i.test(fullTitle) || /health|medical|hospital/i.test(fullTitle)) {
    deptCode = "hd";
  } else if (/[-\s](HED)[-\s]/i.test(fullTitle) || /college|university|higher/i.test(fullTitle)) {
    deptCode = "hed";
  }

  // Extract Tamil content
  let titleTa: string | null = null;
  let summaryTa: string | null = null;

  if (/[\u0B80-\u0BFF]/.test(fullTitle)) {
    const tamilMatch = fullTitle.match(/([\u0B80-\u0BFF][\u0B80-\u0BFF\s.,\-()0-9]+)/);
    if (tamilMatch && tamilMatch[1].length > 10) {
      summaryTa = tamilMatch[1].trim();
      titleTa = summaryTa;
    }
  }

  // Clean English summary
  let summaryEn = fullTitle
    .replace(/G\.?O\.?\s*\(?[A-Za-z]{1,3}\.?\)?\s*(?:No\.?|NO\.?|no\.?)?\s*[-.]?\s*\d+/i, '')
    .replace(/\d{1,2}[-./]\d{1,2}[-./]\d{4}/, '')
    .replace(/[\u0B80-\u0BFF]+/g, '')
    .replace(/^[-\s|:]+/, '')
    .replace(/[-\s|:]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (summaryEn.length < 5) summaryEn = fullTitle;

  const titleEn = `G.O. (${goType}) No. ${goNumber} Dt. ${goDate.toLocaleDateString('en-IN')}`;

  // Keywords
  const keywords: string[] = [];
  if (/teacher|ஆசிரியர்/i.test(fullTitle)) keywords.push("teacher");
  if (/salary|pay|சம்பளம்/i.test(fullTitle)) keywords.push("salary");
  if (/leave|விடுப்பு/i.test(fullTitle)) keywords.push("leave");
  if (/exam|தேர்வு/i.test(fullTitle)) keywords.push("exam");
  if (/promotion|பதவி உயர்வு/i.test(fullTitle)) keywords.push("promotion");
  if (/transfer|இடமாற்றம்/i.test(fullTitle)) keywords.push("transfer");

  // Extract Google Drive ID
  const driveMatch = html.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                     html.match(/drive\.google\.com\/uc\?.*?id=([a-zA-Z0-9_-]+)/) ||
                     html.match(/id=([a-zA-Z0-9_-]{20,})/);

  return {
    goNumber, goType, goDate, deptCode,
    titleEn, titleTa, summaryEn, summaryTa,
    keywords, driveId: driveMatch ? driveMatch[1] : null, sourceUrl: url,
  };
}

async function getSitemapUrls(): Promise<string[]> {
  const urls: string[] = [];
  console.log("📥 Fetching sitemaps...");

  for (let page = 1; page <= 5; page++) {
    const xml = await curlFetch(`https://www.tngo.kalvisolai.com/sitemap.xml?page=${page}`);
    const matches = xml.matchAll(/<loc>([^<]+\.html)<\/loc>/g);
    for (const m of matches) urls.push(m[1]);
  }

  console.log(`   Found ${urls.length} URLs\n`);
  return urls;
}

async function processUrl(url: string, existingSet: Set<string>): Promise<boolean> {
  try {
    const html = await curlFetch(url);
    if (!html || html.length < 500) return false;

    const parsed = parseGOPage(html, url);
    if (!parsed || !parsed.driveId) return false;

    const key = `${parsed.goNumber}-${parsed.goDate.toISOString().split('T')[0]}`;
    if (existingSet.has(key)) return false;

    // Generate filename
    const dateStr = parsed.goDate.toISOString().split('T')[0].replace(/-/g, '');
    const fileName = `GO-${parsed.goType}-${parsed.goNumber}-${dateStr}.pdf`;
    const filePath = path.join(QUALITY_DIR, fileName);

    // Download PDF if not exists
    if (!fs.existsSync(filePath)) {
      const downloaded = await downloadPDF(parsed.driveId, filePath);
      if (!downloaded) return false;
    }

    const fileSize = fs.statSync(filePath).size;
    const dept = DEPARTMENTS[parsed.deptCode] || DEPARTMENTS["sed"];

    // Quality score
    let qualityScore = 0;
    if (parsed.titleEn) qualityScore += 20;
    if (parsed.titleTa) qualityScore += 20;
    if (parsed.summaryEn && parsed.summaryEn.length > 20) qualityScore += 20;
    if (parsed.summaryTa && parsed.summaryTa.length > 20) qualityScore += 20;
    if (parsed.keywords.length > 0) qualityScore += 10;
    if (fileSize > 10000) qualityScore += 10;

    await prisma.qualityGO.create({
      data: {
        goNumber: parsed.goNumber,
        goType: parsed.goType,
        goDate: parsed.goDate,
        deptCode: parsed.deptCode,
        deptName: dept.en,
        deptNameTamil: dept.ta,
        titleEn: parsed.titleEn,
        titleTa: parsed.titleTa,
        summaryEn: parsed.summaryEn,
        summaryTa: parsed.summaryTa,
        keywords: parsed.keywords.join(','),
        fileName,
        fileUrl: `/documents/quality/${fileName}`,
        fileSize,
        isClean: true,
        sourceUrl: parsed.sourceUrl,
        hasEnglish: !!parsed.summaryEn,
        hasTamil: !!parsed.summaryTa,
        qualityScore,
      }
    });

    existingSet.add(key);
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  console.log("╔═══════════════════════════════════════════════════════╗");
  console.log("║        FAST GO SCRAPER - Parallel Processing          ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");

  console.log(`🎯 Target: ${LIMIT} GOs | Concurrency: ${CONCURRENCY}\n`);

  const existing = await prisma.qualityGO.findMany({ select: { goNumber: true, goDate: true } });
  const existingSet = new Set(existing.map(g => `${g.goNumber}-${g.goDate.toISOString().split('T')[0]}`));
  console.log(`📊 Existing: ${existing.length} GOs\n`);

  const urls = await getSitemapUrls();

  let success = 0;
  let failed = 0;
  let processed = 0;

  // Process in batches
  for (let i = 0; i < urls.length && success < LIMIT; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(url => processUrl(url, existingSet)));

    for (const result of results) {
      processed++;
      if (result) {
        success++;
        process.stdout.write(`\r✅ Progress: ${success}/${LIMIT} GOs | Processed: ${processed}/${urls.length}`);
      } else {
        failed++;
      }
    }

    if (success >= LIMIT) break;

    // Small delay between batches
    await new Promise(r => setTimeout(r, 100));
  }

  console.log("\n\n╔═══════════════════════════════════════════════════════╗");
  console.log("║                    COMPLETE                            ║");
  console.log("╠═══════════════════════════════════════════════════════╣");
  console.log(`║  New GOs added:       ${String(success).padStart(6)}                       ║`);
  console.log(`║  Failed/skipped:      ${String(failed).padStart(6)}                       ║`);
  console.log(`║  Total in DB:         ${String(existing.length + success).padStart(6)}                       ║`);
  console.log("╚═══════════════════════════════════════════════════════╝");

  await prisma.$disconnect();
}

main().catch(console.error);
