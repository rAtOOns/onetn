import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");
const TEMP_DIR = "/tmp/ocr-temp";

// Create temp directory
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function extractGOInfo(text: string): string | null {
  // Clean text
  const cleanText = text.replace(/\s+/g, ' ').trim();

  // Try to find GO number patterns
  const goPatterns = [
    // G.O.(Ms) No.123
    /G\.?\s*O\.?\s*\(?\s*(?:Ms|RT|OP|D|Rt|ms|rt)\.?\s*\)?\s*(?:No\.?)?\s*(\d+)/i,
    // GO Ms No 123
    /GO\s*(?:Ms|RT|OP|D)?\.?\s*(?:No\.?)?\s*(\d+)/i,
    // Government Order No. 123
    /Government\s*Order\s*(?:No\.?)?\s*(\d+)/i,
    // அரசாணை எண் 123
    /அரசாணை\s*(?:எண்|நிலை)?\s*(\d+)/,
  ];

  for (const pattern of goPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const goNum = match[1];

      // Try to find date nearby
      const datePatterns = [
        /(?:dated?|dt\.?|தேதி)[:\s]*(\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{2,4})/i,
        /(\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{4})/,
        /(\d{1,2})\s*(?:st|nd|rd|th)?\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s*(\d{4})/i,
      ];

      let dateStr = "";
      for (const dp of datePatterns) {
        const dm = cleanText.match(dp);
        if (dm) {
          dateStr = dm[0].replace(/dated?|dt\.?/i, '').trim();
          break;
        }
      }

      // Try to find department
      const deptPatterns = [
        /(School Education|Finance|Revenue|Health|Agriculture|Transport|Home|Public Works|Rural Development|Higher Education)/i,
      ];

      let dept = "";
      for (const dp of deptPatterns) {
        const dm = cleanText.match(dp);
        if (dm) {
          dept = dm[1];
          break;
        }
      }

      // Build title
      let title = `G.O. Ms No. ${goNum}`;
      if (dateStr) title += ` Dt. ${dateStr}`;
      if (dept) title += ` - ${dept}`;

      return title;
    }
  }

  return null;
}

async function ocrPdf(pdfPath: string): Promise<string> {
  const basename = path.basename(pdfPath, '.pdf');
  const imgPath = path.join(TEMP_DIR, basename);

  try {
    // Convert first page to image (higher resolution for better OCR)
    await execAsync(`pdftoppm -png -f 1 -l 1 -r 200 "${pdfPath}" "${imgPath}"`, { timeout: 30000 });

    // Find the generated image
    const imgFile = `${imgPath}-1.png`;
    if (!fs.existsSync(imgFile)) {
      return "";
    }

    // Run OCR from temp directory (fixes path issue)
    const { stdout } = await execAsync(`cd "${TEMP_DIR}" && tesseract "${basename}-1.png" stdout -l eng 2>/dev/null || true`, { timeout: 60000 });

    // Cleanup
    try { fs.unlinkSync(imgFile); } catch {}

    return stdout;
  } catch (e) {
    return "";
  }
}

async function main() {
  console.log("=== OCR Fix Document Titles ===\n");

  // Get documents with generic titles
  const docs = await prisma.document.findMany({
    where: { title: { startsWith: 'TN Government Document' } },
    select: { id: true, title: true, fileName: true }
  });

  console.log(`Found ${docs.length} documents to process\n`);

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const pdfPath = path.join(DOCS_DIR, doc.fileName);

    if (!fs.existsSync(pdfPath)) {
      failed++;
      continue;
    }

    try {
      // Run OCR
      const text = await ocrPdf(pdfPath);

      if (text.length > 50) {
        const newTitle = extractGOInfo(text);

        if (newTitle) {
          await prisma.document.update({
            where: { id: doc.id },
            data: { title: newTitle }
          });
          console.log(`✓ ${doc.fileName.substring(0, 20)}... → ${newTitle}`);
          updated++;
        } else {
          // Use first 80 chars of OCR text as fallback
          const fallback = text.replace(/\s+/g, ' ').trim().substring(0, 80);
          if (fallback.length > 20) {
            await prisma.document.update({
              where: { id: doc.id },
              data: { title: `TN Doc: ${fallback}...` }
            });
            console.log(`~ ${doc.fileName.substring(0, 20)}... → TN Doc: ${fallback.substring(0, 40)}...`);
            updated++;
          } else {
            failed++;
          }
        }
      } else {
        failed++;
      }
    } catch (e) {
      failed++;
    }

    // Progress update every 10 documents
    if ((i + 1) % 10 === 0) {
      console.log(`\n[Progress: ${i + 1}/${docs.length}, Updated: ${updated}, Failed: ${failed}]\n`);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Failed/No GO found: ${failed}`);

  // Cleanup temp dir
  try { fs.rmdirSync(TEMP_DIR, { recursive: true }); } catch {}

  await prisma.$disconnect();
}

main().catch(console.error);
