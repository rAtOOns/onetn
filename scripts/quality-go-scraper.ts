/**
 * Quality GO Scraper
 * - Extracts FULL descriptions from kalvisolai
 * - Downloads clean PDFs
 * - Stores in QualityGO table with rich metadata
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const QUALITY_DIR = path.join(process.cwd(), "public", "documents", "quality");
const LIMIT = parseInt(process.argv[2]) || 100; // Default 100 GOs

if (!fs.existsSync(QUALITY_DIR)) fs.mkdirSync(QUALITY_DIR, { recursive: true });

// Department mapping
const DEPARTMENTS: Record<string, { en: string; ta: string }> = {
  "fd": { en: "Finance Department", ta: "நிதித்துறை" },
  "sed": { en: "School Education Department", ta: "பள்ளிக்கல்வித்துறை" },
  "hed": { en: "Higher Education Department", ta: "உயர்கல்வித்துறை" },
  "hd": { en: "Health & Family Welfare", ta: "சுகாதாரம் மற்றும் குடும்பநலத்துறை" },
  "rd": { en: "Revenue Department", ta: "வருவாய்த்துறை" },
  "td": { en: "Transport Department", ta: "போக்குவரத்துத்துறை" },
  "pd": { en: "Home Department", ta: "உள்துறை" },
  "agri": { en: "Agriculture Department", ta: "வேளாண்மைத்துறை" },
  "pwd": { en: "Public Works Department", ta: "பொதுப்பணித்துறை" },
  "mad": { en: "Municipal Administration", ta: "நகராட்சி நிர்வாகம்" },
};

async function curlFetch(url: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`curl -sL -A "Mozilla/5.0" "${url}"`, {
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024
    });
    return stdout;
  } catch { return ""; }
}

async function downloadPDF(driveId: string, destPath: string): Promise<boolean> {
  try {
    const url = `https://drive.google.com/uc?export=download&id=${driveId}`;
    await execAsync(`curl -sL -o "${destPath}" -A "Mozilla/5.0" "${url}"`, { timeout: 60000 });

    if (!fs.existsSync(destPath)) return false;

    const size = fs.statSync(destPath).size;
    if (size < 1000) {
      fs.unlinkSync(destPath);
      return false;
    }

    // Verify it's a PDF
    const { stdout } = await execAsync(`file "${destPath}"`);
    if (!stdout.includes('PDF')) {
      fs.unlinkSync(destPath);
      return false;
    }

    return true;
  } catch {
    try { fs.unlinkSync(destPath); } catch {}
    return false;
  }
}

async function removeWatermark(pdfPath: string): Promise<boolean> {
  try {
    // Use Python script if available
    await execAsync(`python3 -c "
import fitz
doc = fitz.open('${pdfPath}')
patterns = ['kalvisolai', 'kalviexpress', 'padasalai']
modified = False
for page in doc:
    for p in patterns:
        for inst in page.search_for(p, quads=True):
            page.add_redact_annot(inst.rect)
            modified = True
    if modified:
        page.apply_redactions()
if modified:
    doc.save('${pdfPath}.tmp', garbage=4, deflate=True)
    doc.close()
    import os
    os.replace('${pdfPath}.tmp', '${pdfPath}')
else:
    doc.close()
"`, { timeout: 30000 });
    return true;
  } catch {
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
  // Extract title from meta or h3
  const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/) ||
                     html.match(/<h3[^>]*class="[^"]*post-title[^"]*"[^>]*>([^<]+)</) ||
                     html.match(/<title>([^<]+)</);

  if (!titleMatch) return null;

  const fullTitle = titleMatch[1]
    .replace(/\s*[-|]\s*Kalvisolai.*$/i, '')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .trim();

  // Extract GO number and type
  const goMatch = fullTitle.match(/G\.?O\.?\s*\(?([A-Za-z]{1,3})\.?\)?\s*(?:No\.?|NO\.?|no\.?)?\s*[-.]?\s*(\d+)/i);
  if (!goMatch) return null;

  const goType = goMatch[1].toUpperCase();
  const goNumber = parseInt(goMatch[2]);

  // Extract date
  const dateMatch = fullTitle.match(/(\d{1,2})[-./](\d{1,2})[-./](\d{4})/);
  if (!dateMatch) return null;

  const goDate = new Date(
    parseInt(dateMatch[3]),
    parseInt(dateMatch[2]) - 1,
    parseInt(dateMatch[1])
  );

  // Extract department code
  let deptCode = "sed"; // default
  const deptMatch = fullTitle.match(/[-\s](FD|SED|HED|HD|RD|TD|PD|AGRI|PWD|MAD)[-\s]/i);
  if (deptMatch) {
    deptCode = deptMatch[1].toLowerCase();
  } else if (/finance|pay|pension|nhis|da |hra/i.test(fullTitle)) {
    deptCode = "fd";
  } else if (/health|medical|hospital|covid/i.test(fullTitle)) {
    deptCode = "hd";
  }

  // Split title into English and Tamil parts
  let titleEn = fullTitle;
  let titleTa: string | null = null;
  let summaryTa: string | null = null;

  // Check for Tamil content (Unicode range U+0B80-U+0BFF)
  if (/[\u0B80-\u0BFF]/.test(fullTitle)) {
    // Split by | or find Tamil portion
    if (fullTitle.includes('|')) {
      const parts = fullTitle.split('|');
      // First part usually has GO number, second has Tamil
      titleEn = parts[0].trim();
      const tamilPart = parts.slice(1).join('|').trim();
      if (/[\u0B80-\u0BFF]/.test(tamilPart)) {
        titleTa = tamilPart;
        summaryTa = tamilPart; // Tamil description
      }
    } else {
      // Extract Tamil portion
      const tamilMatch = fullTitle.match(/([\u0B80-\u0BFF][\u0B80-\u0BFF\s.,\-()0-9]+)/);
      if (tamilMatch) {
        titleTa = tamilMatch[1].trim();
        summaryTa = titleTa;
      }
    }
  }

  // Clean up English title - remove GO number and date
  let summaryEn = titleEn
    .replace(/G\.?O\.?\s*\(?[A-Za-z]{1,3}\.?\)?\s*(?:No\.?|NO\.?|no\.?)?\s*[-.]?\s*\d+/i, '')
    .replace(/\d{1,2}[-./]\d{1,2}[-./]\d{4}/, '')
    .replace(/^[-.\s|:]+/, '')
    .replace(/[-.\s|:]+$/, '')
    .trim();

  if (summaryEn.length < 10) summaryEn = titleEn;

  // Build proper English title
  titleEn = `G.O. (${goType}) No. ${goNumber} Dt. ${goDate.toLocaleDateString('en-IN')}`;

  // Extract keywords from content
  const keywords: string[] = [];
  const keywordPatterns = [
    /pay|salary|pension|gpf|bonus|da |hra/i,
    /school|education|teacher|student|exam/i,
    /health|medical|hospital|insurance|nhis/i,
    /promotion|transfer|appointment/i,
    /leave|cl |el |ml /i,
    /retirement|vrs/i,
  ];

  for (const pattern of keywordPatterns) {
    if (pattern.test(fullTitle)) {
      const match = fullTitle.match(pattern);
      if (match) keywords.push(match[0].trim().toLowerCase());
    }
  }

  // Extract Google Drive ID
  const driveMatch = html.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                     html.match(/drive\.google\.com\/uc\?.*?id=([a-zA-Z0-9_-]+)/) ||
                     html.match(/id=([a-zA-Z0-9_-]{20,})/);

  return {
    goNumber,
    goType,
    goDate,
    deptCode,
    titleEn,
    titleTa,
    summaryEn,
    summaryTa,
    keywords,
    driveId: driveMatch ? driveMatch[1] : null,
    sourceUrl: url,
  };
}

async function getSitemapUrls(): Promise<string[]> {
  const urls: string[] = [];

  console.log("📥 Fetching sitemaps...");

  for (let page = 1; page <= 3; page++) {
    const xml = await curlFetch(`https://www.tngo.kalvisolai.com/sitemap.xml?page=${page}`);
    const matches = xml.matchAll(/<loc>([^<]+\.html)<\/loc>/g);
    for (const m of matches) urls.push(m[1]);
  }

  console.log(`   Found ${urls.length} URLs\n`);
  return urls;
}

async function main() {
  console.log("╔═══════════════════════════════════════════════════════╗");
  console.log("║        QUALITY GO SCRAPER                             ║");
  console.log("║        Extract full descriptions + clean PDFs         ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");

  console.log(`🎯 Target: ${LIMIT} quality GOs\n`);

  // Get existing quality GOs to avoid duplicates
  const existing = await prisma.qualityGO.findMany({ select: { goNumber: true, goDate: true } });
  const existingSet = new Set(existing.map(g => `${g.goNumber}-${g.goDate.toISOString()}`));
  console.log(`📊 Existing quality GOs: ${existing.length}\n`);

  const urls = await getSitemapUrls();

  let processed = 0;
  let success = 0;
  let failed = 0;

  for (const url of urls) {
    if (success >= LIMIT) break;

    try {
      const html = await curlFetch(url);
      if (!html) { failed++; continue; }

      const parsed = parseGOPage(html, url);
      if (!parsed || !parsed.driveId) { failed++; continue; }

      // Check for duplicate
      const key = `${parsed.goNumber}-${parsed.goDate.toISOString()}`;
      if (existingSet.has(key)) { continue; }

      // Generate filename
      const dateStr = parsed.goDate.toISOString().split('T')[0].replace(/-/g, '');
      const fileName = `GO-${parsed.goType}-${parsed.goNumber}-${dateStr}.pdf`;
      const filePath = path.join(QUALITY_DIR, fileName);

      // Download PDF
      if (!fs.existsSync(filePath)) {
        const downloaded = await downloadPDF(parsed.driveId, filePath);
        if (!downloaded) { failed++; continue; }
      }

      const fileSize = fs.statSync(filePath).size;

      // Remove watermark
      await removeWatermark(filePath);

      // Get department names
      const dept = DEPARTMENTS[parsed.deptCode] || DEPARTMENTS["sed"];

      // Calculate quality score
      let qualityScore = 0;
      if (parsed.titleEn) qualityScore += 20;
      if (parsed.titleTa) qualityScore += 20;
      if (parsed.summaryEn && parsed.summaryEn.length > 20) qualityScore += 20;
      if (parsed.summaryTa && parsed.summaryTa.length > 20) qualityScore += 20;
      if (parsed.keywords.length > 0) qualityScore += 10;
      if (fileSize > 10000) qualityScore += 10;

      // Create quality GO record
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

      success++;
      existingSet.add(key);

      console.log(`✅ [${success}/${LIMIT}] GO ${parsed.goNumber} (${parsed.goDate.toLocaleDateString('en-IN')}) - ${parsed.deptCode.toUpperCase()}`);
      if (parsed.summaryTa) {
        console.log(`   📝 ${parsed.summaryTa.substring(0, 60)}...`);
      } else if (parsed.summaryEn) {
        console.log(`   📝 ${parsed.summaryEn.substring(0, 60)}...`);
      }

      processed++;

    } catch (e) {
      failed++;
    }

    // Small delay
    await new Promise(r => setTimeout(r, 200));
  }

  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║                    COMPLETE                            ║");
  console.log("╠═══════════════════════════════════════════════════════╣");
  console.log(`║  Quality GOs created:     ${String(success).padStart(6)}                     ║`);
  console.log(`║  Failed/skipped:          ${String(failed).padStart(6)}                     ║`);
  console.log("╚═══════════════════════════════════════════════════════╝");

  // Show samples
  const samples = await prisma.qualityGO.findMany({
    take: 5,
    orderBy: { qualityScore: 'desc' },
    select: { goNumber: true, goDate: true, deptCode: true, titleEn: true, summaryTa: true, qualityScore: true }
  });

  console.log("\n📋 Top Quality GOs:");
  for (const s of samples) {
    console.log(`\n   GO ${s.goNumber} | ${s.goDate.toLocaleDateString('en-IN')} | ${s.deptCode.toUpperCase()} | Score: ${s.qualityScore}`);
    console.log(`   ${s.titleEn}`);
    if (s.summaryTa) console.log(`   ${s.summaryTa.substring(0, 80)}...`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
