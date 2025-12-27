/**
 * Improved GO Scraper - Handles multiple download patterns
 * Focuses on Education Department GOs from kalvisolai
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
const CONCURRENCY = 3; // Reduced for more stability

if (!fs.existsSync(QUALITY_DIR)) fs.mkdirSync(QUALITY_DIR, { recursive: true });

const DEPARTMENTS: Record<string, { en: string; ta: string }> = {
  "fd": { en: "Finance Department", ta: "நிதித்துறை" },
  "sed": { en: "School Education Department", ta: "பள்ளிக்கல்வித்துறை" },
  "hed": { en: "Higher Education Department", ta: "உயர்கல்வித்துறை" },
  "hd": { en: "Health & Family Welfare", ta: "சுகாதாரம் மற்றும் குடும்பநலத்துறை" },
};

async function curlFetch(url: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`curl -sL -A "Mozilla/5.0" --max-time 20 "${url}"`, {
      timeout: 25000,
      maxBuffer: 10 * 1024 * 1024
    });
    return stdout;
  } catch { return ""; }
}

async function downloadPDF(driveId: string, destPath: string): Promise<boolean> {
  try {
    // Try direct download first
    const url = `https://drive.google.com/uc?export=download&id=${driveId}`;
    await execAsync(`curl -sL -o "${destPath}" --max-time 45 -A "Mozilla/5.0" "${url}"`, { timeout: 50000 });

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

// Extract Google Drive ID from various URL patterns
function extractDriveId(html: string): string | null {
  // Pattern 1: drive.google.com/file/d/[ID]
  let match = html.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Pattern 2: drive.google.com/uc?...id=[ID]
  match = html.match(/drive\.google\.com\/uc\?[^"']*id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Pattern 3: docs.google.com/uc?...id=[ID]
  match = html.match(/docs\.google\.com\/uc\?[^"']*id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Pattern 4: id= anywhere with long enough ID
  match = html.match(/id=([a-zA-Z0-9_-]{20,})/);
  if (match) return match[1];

  return null;
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
  // Extract title
  const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/) ||
                     html.match(/<title>([^<]+)</);
  if (!titleMatch) return null;

  const fullTitle = titleMatch[1]
    .replace(/\s*[-|]?\\s*Kalvisolai.*$/i, '')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .trim();

  // More flexible GO number extraction
  // Pattern: G.O. (MS/Rt/D/3D) No. 123 or GO MS 123 or G.O No 123
  const goMatch = fullTitle.match(/G\.?O\.?\s*\(?([A-Za-z0-9]{1,4})\.?\)?\s*(?:No\.?|NO\.?|no\.?)?\s*[-.]?\s*(\d+)/i) ||
                  fullTitle.match(/GO\s*[-.]?\s*(\w{1,4})\s*[-.]?\s*(\d+)/i);

  if (!goMatch) return null;

  const goType = goMatch[1].toUpperCase().replace(/[^A-Z0-9]/g, '') || "MS";
  const goNumber = parseInt(goMatch[2]);
  if (isNaN(goNumber) || goNumber <= 0) return null;

  // More flexible date extraction
  // Patterns: DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY, DDMMYYYY (8 digits)
  let goDate: Date | null = null;

  // Try DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY
  const dateMatch = fullTitle.match(/(\d{1,2})[-./](\d{1,2})[-./](\d{4})/);
  if (dateMatch) {
    goDate = new Date(parseInt(dateMatch[3]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[1]));
  }

  // Try DDMMYYYY from URL (like go-no-264-10122025)
  if (!goDate || isNaN(goDate.getTime())) {
    const urlDateMatch = url.match(/(\d{2})(\d{2})(\d{4})/);
    if (urlDateMatch) {
      goDate = new Date(parseInt(urlDateMatch[3]), parseInt(urlDateMatch[2]) - 1, parseInt(urlDateMatch[1]));
    }
  }

  // Try extracting year at least
  if (!goDate || isNaN(goDate.getTime())) {
    const yearMatch = fullTitle.match(/\b(20\d{2})\b/) || url.match(/\/(20\d{2})\//);
    if (yearMatch) {
      goDate = new Date(parseInt(yearMatch[1]), 0, 1);
    }
  }

  if (!goDate || isNaN(goDate.getTime())) return null;

  // Determine department
  let deptCode = "sed"; // Default to education
  const combinedText = (fullTitle + ' ' + url).toUpperCase();

  if (/[-\s](FD|FINANCE)[-\s]|PAY|SALARY|PENSION|DA\s|HRA|NHIS|ALLOWANCE/i.test(combinedText)) {
    deptCode = "fd";
  } else if (/[-\s](HD|HEALTH)[-\s]|MEDICAL|HOSPITAL|HEALTH/i.test(combinedText)) {
    deptCode = "hd";
  } else if (/[-\s](HED)[-\s]|COLLEGE|UNIVERSITY|HIGHER/i.test(combinedText)) {
    deptCode = "hed";
  }

  // Extract Tamil content from body
  let titleTa: string | null = null;
  let summaryTa: string | null = null;

  // Look for Tamil text in the page content (longer chunks)
  const tamilChunks = html.match(/[\u0B80-\u0BFF][\u0B80-\u0BFF\s.,\-()0-9a-zA-Z]{20,}/g);
  if (tamilChunks && tamilChunks.length > 0) {
    // Get the longest Tamil chunk as summary
    const longestTamil = tamilChunks.reduce((a, b) => a.length > b.length ? a : b);
    summaryTa = longestTamil.trim().substring(0, 500);
    titleTa = summaryTa.substring(0, 200);
  }

  // If title has Tamil
  if (/[\u0B80-\u0BFF]/.test(fullTitle)) {
    const tamilMatch = fullTitle.match(/([\u0B80-\u0BFF][\u0B80-\u0BFF\s.,\-()0-9]+)/);
    if (tamilMatch && tamilMatch[1].length > 10) {
      if (!titleTa) titleTa = tamilMatch[1].trim();
      if (!summaryTa) summaryTa = tamilMatch[1].trim();
    }
  }

  // Clean English summary
  let summaryEn = fullTitle
    .replace(/G\.?O\.?\s*\(?[A-Za-z0-9]{1,4}\.?\)?\s*(?:No\.?|NO\.?|no\.?)?\s*[-.]?\s*\d+/gi, '')
    .replace(/\d{1,2}[-./]\d{1,2}[-./]\d{4}/g, '')
    .replace(/[\u0B80-\u0BFF]+/g, '')
    .replace(/^[-\s|:]+/, '')
    .replace(/[-\s|:]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (summaryEn.length < 5) summaryEn = fullTitle.replace(/[\u0B80-\u0BFF]+/g, '').trim();

  const titleEn = `G.O. (${goType}) No. ${goNumber} Dt. ${goDate.toLocaleDateString('en-IN')}`;

  // Keywords
  const keywords: string[] = [];
  const keywordText = (fullTitle + ' ' + (summaryEn || '')).toLowerCase();
  if (/teacher|ஆசிரியர்/i.test(keywordText)) keywords.push("teacher");
  if (/salary|pay|சம்பளம்/i.test(keywordText)) keywords.push("salary");
  if (/leave|விடுப்பு/i.test(keywordText)) keywords.push("leave");
  if (/exam|தேர்வு/i.test(keywordText)) keywords.push("exam");
  if (/promotion|பதவி உயர்வு/i.test(keywordText)) keywords.push("promotion");
  if (/transfer|இடமாற்றம்/i.test(keywordText)) keywords.push("transfer");
  if (/pension|ஓய்வூதியம்/i.test(keywordText)) keywords.push("pension");
  if (/da\s|allowance/i.test(keywordText)) keywords.push("allowance");

  // Extract Drive ID
  const driveId = extractDriveId(html);

  return {
    goNumber, goType, goDate, deptCode,
    titleEn, titleTa, summaryEn, summaryTa,
    keywords, driveId, sourceUrl: url,
  };
}

async function getSitemapUrls(): Promise<string[]> {
  const urls: string[] = [];
  console.log("Fetching sitemaps...");

  for (let page = 1; page <= 10; page++) {
    const xml = await curlFetch(`https://www.tngo.kalvisolai.com/sitemap.xml?page=${page}`);
    if (!xml || xml.length < 100) break;

    const matches = xml.matchAll(/<loc>([^<]+\.html)<\/loc>/g);
    for (const m of matches) {
      // Only include URLs that look like GO pages
      const url = m[1];
      if (url.includes('go-') || url.includes('goms') || url.includes('go_') ||
          url.match(/go\d+/) || url.includes('-go-') || url.match(/\d{8}/)) {
        urls.push(url);
      }
    }
  }

  console.log(`Found ${urls.length} potential GO URLs\n`);
  return urls;
}

async function processUrl(url: string, existingSet: Set<string>): Promise<{ success: boolean; message: string }> {
  try {
    const html = await curlFetch(url);
    if (!html || html.length < 500) {
      return { success: false, message: "empty page" };
    }

    const parsed = parseGOPage(html, url);
    if (!parsed) {
      return { success: false, message: "no GO data" };
    }

    if (!parsed.driveId) {
      return { success: false, message: "no PDF link" };
    }

    const key = `${parsed.goNumber}-${parsed.goType}-${parsed.goDate.toISOString().split('T')[0]}`;
    if (existingSet.has(key)) {
      return { success: false, message: "duplicate" };
    }

    // Generate filename
    const dateStr = parsed.goDate.toISOString().split('T')[0].replace(/-/g, '');
    const fileName = `GO-${parsed.goType}-${parsed.goNumber}-${dateStr}.pdf`;
    const filePath = path.join(QUALITY_DIR, fileName);

    // Download PDF if not exists
    if (!fs.existsSync(filePath)) {
      const downloaded = await downloadPDF(parsed.driveId, filePath);
      if (!downloaded) {
        return { success: false, message: "download failed" };
      }
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
    return { success: true, message: `GO ${parsed.goType} ${parsed.goNumber}` };
  } catch (e: unknown) {
    const error = e as Error;
    return { success: false, message: error.message || "error" };
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("   IMPROVED GO SCRAPER - Multiple Download Patterns");
  console.log("=".repeat(60) + "\n");

  console.log(`Target: ${LIMIT} GOs | Concurrency: ${CONCURRENCY}\n`);

  const existing = await prisma.qualityGO.findMany({ select: { goNumber: true, goType: true, goDate: true } });
  const existingSet = new Set(existing.map(g => `${g.goNumber}-${g.goType}-${g.goDate.toISOString().split('T')[0]}`));
  console.log(`Existing: ${existing.length} GOs\n`);

  const urls = await getSitemapUrls();
  if (urls.length === 0) {
    console.log("No URLs found!");
    await prisma.$disconnect();
    return;
  }

  let success = 0;
  let failed = 0;
  let processed = 0;

  // Process in batches
  for (let i = 0; i < urls.length && success < LIMIT; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(url => processUrl(url, existingSet)));

    for (const result of results) {
      processed++;
      if (result.success) {
        success++;
        console.log(`[${success}/${LIMIT}] Added: ${result.message}`);
      } else {
        failed++;
      }
    }

    if (success >= LIMIT) break;

    // Progress update every 50 URLs
    if (processed % 50 === 0) {
      console.log(`\n--- Progress: ${processed}/${urls.length} URLs | ${success} added | ${failed} skipped ---\n`);
    }

    // Small delay between batches
    await new Promise(r => setTimeout(r, 200));
  }

  console.log("\n" + "=".repeat(60));
  console.log("                      COMPLETE");
  console.log("=".repeat(60));
  console.log(`  New GOs added:      ${success}`);
  console.log(`  Failed/skipped:     ${failed}`);
  console.log(`  Total in DB:        ${existing.length + success}`);
  console.log("=".repeat(60));

  await prisma.$disconnect();
}

main().catch(console.error);
