import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");

// Dynamic import for pdf-parse
async function getPdfParse() {
  const pdf = await import("pdf-parse");
  return pdf.default;
}

function extractGOInfo(text: string): { goNumber: string | null; title: string | null } {
  // Clean text
  const cleanText = text.replace(/\s+/g, ' ').trim();

  // Try to find GO number patterns
  const goPatterns = [
    /G\.?O\.?\s*\(?(?:Ms\.?|RT\.?|OP\.?)\s*(?:No\.?)?\s*(\d+)/i,
    /Government\s*Order\s*(?:Ms\.?|RT\.?)?\s*(?:No\.?)?\s*(\d+)/i,
    /GO\s*(?:Ms|RT|OP)?\s*(?:No\.?)?\s*(\d+)/i,
    /அரசாணை\s*(?:எண்|நிலை)?\s*(\d+)/,
  ];

  let goNumber = null;
  for (const pattern of goPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      // Find full GO reference
      const fullMatch = cleanText.match(new RegExp(pattern.source + '[^\\n]{0,50}', 'i'));
      if (fullMatch) {
        goNumber = fullMatch[0].substring(0, 60).trim();
        break;
      }
    }
  }

  // Try to extract date
  const datePatterns = [
    /(?:dated?|dt\.?|தேதி)[:\s]*(\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{2,4})/i,
    /(\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{4})/,
  ];

  let dateStr = null;
  for (const pattern of datePatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      dateStr = match[1];
      break;
    }
  }

  // Try to extract department
  const deptPatterns = [
    /(School Education|Finance|Revenue|Health|Agriculture|Transport|Home|Public Works|Rural Development)/i,
    /(பள்ளிக்கல்வி|நிதி|வருவாய்|சுகாதாரம்)/,
  ];

  let dept = null;
  for (const pattern of deptPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      dept = match[1];
      break;
    }
  }

  // Build title
  let title = null;
  if (goNumber) {
    title = goNumber;
    if (dateStr) title += ` Dt.${dateStr}`;
    if (dept) title += ` - ${dept}`;
  }

  return { goNumber, title };
}

async function main() {
  console.log("=== Extract GO Numbers from PDFs ===\n");

  const pdfParse = await getPdfParse();

  // Get documents with generic titles
  const docs = await prisma.document.findMany({
    where: { title: { startsWith: 'Kalviexpress GO' } },
    select: { id: true, title: true, fileName: true }
  });

  console.log(`Found ${docs.length} documents to process\n`);

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const filePath = path.join(DOCS_DIR, doc.fileName);

    if (!fs.existsSync(filePath)) {
      failed++;
      continue;
    }

    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer, { max: 2 }); // Only first 2 pages

      const { title } = extractGOInfo(data.text);

      if (title && title.length > 10) {
        await prisma.document.update({
          where: { id: doc.id },
          data: {
            title: title.substring(0, 150),
            goNumber: title.substring(0, 50)
          }
        });
        console.log(`✓ ${doc.fileName.substring(0, 20)}... → ${title.substring(0, 50)}`);
        updated++;
      } else {
        // Use first 100 chars of text as title
        const fallbackTitle = data.text.replace(/\s+/g, ' ').trim().substring(0, 100);
        if (fallbackTitle.length > 20) {
          await prisma.document.update({
            where: { id: doc.id },
            data: { title: `TN GO: ${fallbackTitle.substring(0, 80)}...` }
          });
          console.log(`~ ${doc.fileName.substring(0, 20)}... → TN GO: ${fallbackTitle.substring(0, 40)}...`);
          updated++;
        } else {
          failed++;
        }
      }
    } catch (e) {
      failed++;
    }

    if ((i + 1) % 50 === 0) {
      console.log(`\n[Progress: ${i + 1}/${docs.length}]\n`);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Failed: ${failed}`);

  await prisma.$disconnect();
}

main().catch(console.error);
