/**
 * Add missing GOs that were identified by the scan
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const QUALITY_DIR = path.join(process.cwd(), "public", "documents", "quality");
if (!fs.existsSync(QUALITY_DIR)) fs.mkdirSync(QUALITY_DIR, { recursive: true });

const DEPARTMENTS: Record<string, { en: string; ta: string }> = {
  "fd": { en: "Finance Department", ta: "நிதித்துறை" },
  "sed": { en: "School Education Department", ta: "பள்ளிக்கல்வித்துறை" },
  "hed": { en: "Higher Education Department", ta: "உயர்கல்வித்துறை" },
  "hd": { en: "Health & Family Welfare", ta: "சுகாதாரம் மற்றும் குடும்பநலத்துறை" },
};

// URLs identified as missing
const MISSING_URLS = [
  "https://www.tngo.kalvisolai.com/2021/06/go-no-01-date-01062021-free-bus-pass.html",
  "https://www.tngo.kalvisolai.com/2021/05/go-ms-no-2180-dt-27052021-ias-transfers.html",
  "https://www.tngo.kalvisolai.com/2021/04/go-6.html",
  "https://www.tngo.kalvisolai.com/2019/12/go-ms-no-379-dt-25092019-2020-2020.html",
  "https://www.tngo.kalvisolai.com/2019/12/go-ms-no-183-dt-16102019-757.html",
  "https://www.tngo.kalvisolai.com/2019/12/go-ms-no-189-dt-25102019.html",
  "https://www.tngo.kalvisolai.com/2019/12/go-ms-no-210-dt-19112019-shoes.html",
  "https://www.tngo.kalvisolai.com/2019/12/go1d-no206-dt-august-25-2014-barcode.html",
  "https://www.tngo.kalvisolai.com/2019/10/g.html",
  "https://www.tngo.kalvisolai.com/2019/10/go-no-762-2020-23.html",
  "https://www.tngo.kalvisolai.com/2018/12/go-ms-no-148-dt-20072018.html",
  "https://www.tngo.kalvisolai.com/2018/06/blog-post_30.html",
  "https://www.tngo.kalvisolai.com/2018/06/blog-post_21.html",
  "https://www.tngo.kalvisolai.com/2018/04/go-ms-no-33-dt-april-06-2018.html",
  "https://www.tngo.kalvisolai.com/2018/04/go-aided-schools-non-teaching-staff.html",
  "https://www.tngo.kalvisolai.com/2018/04/go-ms-46.html",
  "https://www.tngo.kalvisolai.com/2018/03/go-ms-no-51-dated-210318-remuneration-15.html",
  "https://www.tngo.kalvisolai.com/2018/03/tn-go-compensation-for-students.html",
  "https://www.tngo.kalvisolai.com/2018/02/sslc-examination-minimum-to-pass-go-ms.html",
  "https://www.tngo.kalvisolai.com/2018/02/science-practical-examination-go-ms-no.html",
  "https://www.tngo.kalvisolai.com/2018/02/sslc-public-examination-age-limit.html",
  "https://www.tngo.kalvisolai.com/2017/12/gomsno1294-dated-271077.html",
  "https://www.tngo.kalvisolai.com/2017/12/gono229-22nd-january-1974.html",
  "https://www.tngo.kalvisolai.com/2017/12/go-no-156-date-07122017.html",
  "https://www.tngo.kalvisolai.com/2017/10/go-651-new-transfer-counselling-norms.html",
  "https://www.tngo.kalvisolai.com/2017/10/gomsno307-revision-of-rates-of.html",
  "https://www.tngo.kalvisolai.com/2017/10/gomsno306-revision-of-rates-of-pay.html",
  "https://www.tngo.kalvisolai.com/2017/10/revision-of-rates-of-hra-and-cca.html",
  "https://www.tngo.kalvisolai.com/2017/10/gomsno303-dated-11th-october-2017-pay.html",
  "https://www.tngo.kalvisolai.com/2017/10/go-no-300-dt-october-10-2017-3-da-hike.html",
  "https://www.tngo.kalvisolai.com/2017/09/go-3d29-dse-date20092017-direct.html",
  "https://www.tngo.kalvisolai.com/2017/09/dse-go-no196-dt-29082017-upgradation-of.html",
  "https://www.tngo.kalvisolai.com/2017/08/go-1d-no500-dt-august-22-2017-2011-2015.html",
  "https://www.tngo.kalvisolai.com/2017/07/fwd-go-no174-dt-18072017-upgradation-of.html",
  "https://www.tngo.kalvisolai.com/2017/07/go-no173-dt-18072017-upgradation-of-100.html",
  "https://www.tngo.kalvisolai.com/2017/05/hr-sec-exam-pattern-go-12-11-download.html",
  "https://www.tngo.kalvisolai.com/2017/05/plus-one-public-exam-go-download-12-600.html",
  "https://www.tngo.kalvisolai.com/2017/05/go-no-91-dt-11052017-2-3-download.html",
  "https://www.tngo.kalvisolai.com/2017/05/pay-continuation-order-pgt-post.html",
  "https://www.tngo.kalvisolai.com/2017/05/pay-continuation-order-btpet-post-1400.html",
  "https://www.tngo.kalvisolai.com/2017/05/pay-continuation-order-high-school-hm.html",
  "https://www.tngo.kalvisolai.com/2017/04/goms-no105-dt-april-26-2017-allowances.html",
  "https://www.tngo.kalvisolai.com/2017/04/goms-no106-dt-april-26-2017-allowances.html",
  "https://www.tngo.kalvisolai.com/2017/04/gono102-dated25042017-hevilambi.html",
  "https://www.tngo.kalvisolai.com/2017/04/dge-go-no-270-dt-24042017.html",
  "https://www.tngo.kalvisolai.com/2017/03/go-no-51-value-education-2-6.html",
  "https://www.tngo.kalvisolai.com/2017/01/go186-dt-18112014sarva-shiksha-abhiyan.html",
  "https://www.tngo.kalvisolai.com/2017/01/goms-no177-dated11112011-school.html",
  "https://www.tngo.kalvisolai.com/2017/01/gomsno6-dated11012017-bonus-adhoc-bonus.html",
  "https://www.tngo.kalvisolai.com/2016/12/gono309-dated-16122016-7.html",
  "https://www.tngo.kalvisolai.com/1973/06/go-8.html",
  "https://www.tngo.kalvisolai.com/1973/06/go-7.html",
  "https://www.tngo.kalvisolai.com/1973/04/go-5.html",
  "https://www.tngo.kalvisolai.com/1973/04/go-4.html",
  "https://www.tngo.kalvisolai.com/1973/04/go-3.html",
  "https://www.tngo.kalvisolai.com/1973/06/go-2.html",
  "https://www.tngo.kalvisolai.com/1973/04/go.html",
];

async function curlFetch(url: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`curl -sL -A "Mozilla/5.0" --max-time 20 "${url}"`, {
      timeout: 25000,
      maxBuffer: 10 * 1024 * 1024
    });
    return stdout;
  } catch { return ""; }
}

async function downloadPDF(driveId: string, destPath: string): Promise<{ success: boolean; reason?: string }> {
  // Try multiple download methods
  const downloadUrls = [
    `https://drive.google.com/uc?export=download&id=${driveId}`,
    `https://drive.usercontent.google.com/download?id=${driveId}&export=download`,
    `https://docs.google.com/uc?export=download&id=${driveId}`,
  ];

  for (const url of downloadUrls) {
    try {
      await execAsync(`curl -sL -o "${destPath}" --max-time 45 -A "Mozilla/5.0" -L "${url}"`, { timeout: 50000 });

      if (!fs.existsSync(destPath)) continue;

      const size = fs.statSync(destPath).size;
      if (size < 1000) {
        fs.unlinkSync(destPath);
        continue;
      }

      // Check if it's actually a PDF
      const { stdout } = await execAsync(`file "${destPath}"`);
      if (stdout.includes('PDF')) {
        return { success: true };
      }

      // Check if it's an HTML file (Google auth page)
      if (stdout.includes('HTML') || stdout.includes('text')) {
        const content = fs.readFileSync(destPath, 'utf-8').substring(0, 500);
        fs.unlinkSync(destPath);
        if (content.includes('Sign in') || content.includes('accounts.google.com')) {
          return { success: false, reason: 'auth required' };
        }
        continue;
      }

      fs.unlinkSync(destPath);
    } catch {
      try { fs.unlinkSync(destPath); } catch {}
    }
  }

  return { success: false, reason: 'all methods failed' };
}

function extractDriveId(html: string): string | null {
  // Decode HTML entities first
  const decoded = html.replace(/&amp;/g, '&');

  // Pattern 1: drive.google.com/file/d/[ID] (newer format - most reliable)
  let match = decoded.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{20,})/);
  if (match && isValidDriveId(match[1])) return match[1];

  // Pattern 2: drive.google.com/uc?...id=[ID]
  match = decoded.match(/drive\.google\.com\/uc\?[^"']*id=([a-zA-Z0-9_-]+)/);
  if (match && isValidDriveId(match[1])) return match[1];

  // Pattern 3: docs.google.com/uc?...id=[ID] (older format - often requires auth)
  match = decoded.match(/docs\.google\.com\/uc\?[^"']*id=([a-zA-Z0-9_-]+)/);
  if (match && isValidDriveId(match[1])) return match[1];

  // Pattern 4: id= anywhere with valid ID
  match = decoded.match(/id=([a-zA-Z0-9_-]{20,})/);
  if (match && isValidDriveId(match[1])) return match[1];

  return null;
}

function isValidDriveId(id: string): boolean {
  // Filter out placeholder/invalid IDs
  if (!id || id.length < 10) return false;
  if (id === '0000' || /^0+$/.test(id)) return false;
  // IDs starting with 0B are old format - mark them but still try
  return true;
}

async function processUrl(url: string, existingSet: Set<string>): Promise<{ success: boolean; message: string }> {
  try {
    const html = await curlFetch(url);
    if (!html || html.length < 500) {
      return { success: false, message: "empty page" };
    }

    // Extract title
    const titleMatch = html.match(/<title>([^<]+)</) || html.match(/og:title"[^>]*content="([^"]+)"/);
    if (!titleMatch) return { success: false, message: "no title" };

    const fullTitle = titleMatch[1]
      .replace(/Kalvisolai.*$/i, "")
      .replace(/&amp;/g, "&")
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
      .trim();

    // Extract GO number - more flexible patterns
    let goNumber = 0;
    let goType = "MS";

    // Pattern 1: G.O Ms. No. 123 or G.O. (Ms) No. 123 etc
    let goMatch = fullTitle.match(/G\.?O\.?\s*(?:\(?)(Ms|MS|Rt|RT|1D|2D|3D|D)\.?\)?\.?\s*(?:No\.?)?\s*[-.:]*\s*(\d+)/i);
    if (goMatch) {
      goType = goMatch[1].toUpperCase().replace(/[^A-Z0-9]/g, "") || "MS";
      goNumber = parseInt(goMatch[2]);
    }

    // Pattern 2: G.O (type) No. 123
    if (!goNumber) {
      goMatch = fullTitle.match(/G\.?O\.?\s*\(([A-Za-z0-9]{1,4})\)\s*(?:No\.?)?\s*[-.:]*\s*(\d+)/i);
      if (goMatch) {
        goType = goMatch[1].toUpperCase().replace(/[^A-Z0-9]/g, "") || "MS";
        goNumber = parseInt(goMatch[2]);
      }
    }

    // Pattern 3: GO No. 123 or GO-123 (no type specified)
    if (!goNumber) {
      goMatch = fullTitle.match(/GO\s*(?:No\.?)?\s*[-.:]*\s*(\d+)/i);
      if (goMatch) {
        goNumber = parseInt(goMatch[1]);
      }
    }

    // Pattern 4: From URL - go-ms-no-123 or goms-no123 or go-no-123
    if (!goNumber) {
      const urlMatch = url.match(/go-?ms-?no-?(\d+)/i) ||
                       url.match(/gomsno(\d+)/i) ||
                       url.match(/gono(\d+)/i) ||
                       url.match(/go-no-(\d+)/i) ||
                       url.match(/go-(\d+)[^0-9]/i);
      if (urlMatch) {
        goNumber = parseInt(urlMatch[1]);
      }
    }

    // Pattern 5: From URL - extract type too
    if (!goNumber) {
      const urlTypeMatch = url.match(/go-?(ms|rt|1d|2d|3d|d)-?(\d+)/i);
      if (urlTypeMatch) {
        goType = urlTypeMatch[1].toUpperCase();
        goNumber = parseInt(urlTypeMatch[2]);
      }
    }

    if (!goNumber || goNumber <= 0) {
      return { success: false, message: "no GO number found" };
    }

    // Extract date - multiple patterns
    let goDate: Date | null = null;

    // Pattern 1: DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY
    let dateMatch = fullTitle.match(/(\d{1,2})[-./](\d{1,2})[-./](\d{4})/);
    if (dateMatch) {
      goDate = new Date(parseInt(dateMatch[3]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[1]));
    }

    // Pattern 2: Month DD, YYYY or DD Month YYYY
    if (!goDate || isNaN(goDate.getTime())) {
      const monthNames = "january|february|march|april|may|june|july|august|september|october|november|december";
      const monthMatch = fullTitle.toLowerCase().match(new RegExp(`(${monthNames})\\s*(\\d{1,2})[,\\s]+(\\d{4})`, "i")) ||
                        fullTitle.toLowerCase().match(new RegExp(`(\\d{1,2})\\s*(${monthNames})[,\\s]+(\\d{4})`, "i"));
      if (monthMatch) {
        const months = monthNames.split("|");
        let month: number, day: number, year: number;
        if (isNaN(parseInt(monthMatch[1]))) {
          month = months.indexOf(monthMatch[1].toLowerCase());
          day = parseInt(monthMatch[2]);
          year = parseInt(monthMatch[3]);
        } else {
          day = parseInt(monthMatch[1]);
          month = months.indexOf(monthMatch[2].toLowerCase());
          year = parseInt(monthMatch[3]);
        }
        if (month >= 0) {
          goDate = new Date(year, month, day);
        }
      }
    }

    // Pattern 3: From URL (DDMMYYYY)
    if (!goDate || isNaN(goDate.getTime())) {
      const urlDateMatch = url.match(/(\d{2})(\d{2})(\d{4})/);
      if (urlDateMatch) {
        goDate = new Date(parseInt(urlDateMatch[3]), parseInt(urlDateMatch[2]) - 1, parseInt(urlDateMatch[1]));
      }
    }

    // Pattern 4: Year from URL
    if (!goDate || isNaN(goDate.getTime())) {
      const yearMatch = url.match(/\/(19\d{2}|20\d{2})\//);
      if (yearMatch) {
        goDate = new Date(parseInt(yearMatch[1]), 0, 1);
      }
    }

    if (!goDate || isNaN(goDate.getTime())) {
      return { success: false, message: "no date found" };
    }

    // Check for duplicate
    const key = `${goNumber}-${goType}-${goDate.toISOString().split('T')[0]}`;
    if (existingSet.has(key)) {
      return { success: false, message: "duplicate" };
    }

    // Get drive ID
    const driveId = extractDriveId(html);
    if (!driveId) {
      return { success: false, message: "no PDF link" };
    }

    // Generate filename
    const dateStr = goDate.toISOString().split('T')[0].replace(/-/g, '');
    const fileName = `GO-${goType}-${goNumber}-${dateStr}.pdf`;
    const filePath = path.join(QUALITY_DIR, fileName);

    // Download PDF if not exists
    if (!fs.existsSync(filePath)) {
      const downloadResult = await downloadPDF(driveId, filePath);
      if (!downloadResult.success) {
        return { success: false, message: downloadResult.reason || "download failed" };
      }
    }

    const fileSize = fs.statSync(filePath).size;

    // Determine department
    let deptCode = "sed";
    const combinedText = (fullTitle + ' ' + url).toUpperCase();
    if (/FD|FINANCE|PAY|SALARY|PENSION|DA\s|HRA|NHIS|ALLOWANCE|BONUS/i.test(combinedText)) {
      deptCode = "fd";
    } else if (/HD|HEALTH|MEDICAL|HOSPITAL/i.test(combinedText)) {
      deptCode = "hd";
    } else if (/HED|COLLEGE|UNIVERSITY|HIGHER/i.test(combinedText)) {
      deptCode = "hed";
    }

    const dept = DEPARTMENTS[deptCode] || DEPARTMENTS["sed"];

    // Extract Tamil content
    let titleTa: string | null = null;
    let summaryTa: string | null = null;
    const tamilChunks = html.match(/[\u0B80-\u0BFF][\u0B80-\u0BFF\s.,\-()0-9a-zA-Z]{20,}/g);
    if (tamilChunks && tamilChunks.length > 0) {
      const longestTamil = tamilChunks.reduce((a, b) => a.length > b.length ? a : b);
      summaryTa = longestTamil.trim().substring(0, 500);
      titleTa = summaryTa.substring(0, 200);
    }

    // Clean English summary
    let summaryEn = fullTitle
      .replace(/G\.?O\.?\s*(?:\()?[A-Za-z0-9]{1,4}(?:\))?\s*(?:No\.?)?\s*[-.:]*\s*\d+/gi, '')
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
    if (/da\s|allowance|bonus/i.test(keywordText)) keywords.push("allowance");

    // Quality score
    let qualityScore = 0;
    if (titleEn) qualityScore += 20;
    if (titleTa) qualityScore += 20;
    if (summaryEn && summaryEn.length > 20) qualityScore += 20;
    if (summaryTa && summaryTa.length > 20) qualityScore += 20;
    if (keywords.length > 0) qualityScore += 10;
    if (fileSize > 10000) qualityScore += 10;

    await prisma.qualityGO.create({
      data: {
        goNumber,
        goType,
        goDate,
        deptCode,
        deptName: dept.en,
        deptNameTamil: dept.ta,
        titleEn,
        titleTa,
        summaryEn,
        summaryTa,
        keywords: keywords.join(','),
        fileName,
        fileUrl: `/documents/quality/${fileName}`,
        fileSize,
        isClean: true,
        sourceUrl: url,
        hasEnglish: !!summaryEn,
        hasTamil: !!summaryTa,
        qualityScore,
      }
    });

    existingSet.add(key);
    return { success: true, message: `GO ${goType} ${goNumber} (${goDate.toLocaleDateString('en-IN')})` };
  } catch (e: unknown) {
    const error = e as Error;
    return { success: false, message: error.message || "error" };
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("   ADDING MISSING GOs FROM KALVISOLAI");
  console.log("=".repeat(60) + "\n");

  const existing = await prisma.qualityGO.findMany({
    select: { goNumber: true, goType: true, goDate: true }
  });
  const existingSet = new Set(existing.map(g =>
    `${g.goNumber}-${g.goType}-${g.goDate.toISOString().split('T')[0]}`
  ));
  console.log(`Existing GOs: ${existing.length}`);
  console.log(`URLs to process: ${MISSING_URLS.length}\n`);

  let added = 0;
  let failed = 0;

  for (let i = 0; i < MISSING_URLS.length; i++) {
    const url = MISSING_URLS[i];
    const result = await processUrl(url, existingSet);

    if (result.success) {
      added++;
      console.log(`[${added}] ✅ ${result.message}`);
    } else {
      failed++;
      console.log(`[X] ❌ ${result.message} - ${url.split('/').pop()}`);
    }

    // Small delay
    await new Promise(r => setTimeout(r, 300));
  }

  console.log("\n" + "=".repeat(60));
  console.log("                    COMPLETE");
  console.log("=".repeat(60));
  console.log(`  New GOs added:    ${added}`);
  console.log(`  Failed/skipped:   ${failed}`);
  console.log(`  Total in DB:      ${existing.length + added}`);
  console.log("=".repeat(60));

  await prisma.$disconnect();
}

main().catch(console.error);
