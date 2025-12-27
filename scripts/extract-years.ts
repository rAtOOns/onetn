import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function extractYear(text: string): number | null {
  // Try various date patterns
  const patterns = [
    // DD.MM.YYYY or DD-MM-YYYY or DD/MM/YYYY
    /(\d{1,2})[.\-\/](\d{1,2})[.\-\/](20\d{2})/,
    // YYYY in text
    /(20[12]\d)/,
    // Year at end like "GO 123 2024"
    /\b(20[12]\d)\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const year = parseInt(match[match.length - 1]);
      if (year >= 2015 && year <= 2025) {
        return year;
      }
    }
  }

  return null;
}

async function main() {
  console.log("=== Extract Years from Documents ===\n");

  const docs = await prisma.document.findMany({
    select: { id: true, title: true, fileName: true, publishedYear: true }
  });

  console.log(`Total documents: ${docs.length}`);

  let updated = 0;
  let alreadyHasYear = 0;
  let noYearFound = 0;

  for (const doc of docs) {
    if (doc.publishedYear) {
      alreadyHasYear++;
      continue;
    }

    // Try to extract year from title first, then filename
    let year = extractYear(doc.title);
    if (!year) {
      year = extractYear(doc.fileName);
    }

    if (year) {
      await prisma.document.update({
        where: { id: doc.id },
        data: { publishedYear: year }
      });
      updated++;
    } else {
      noYearFound++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Already had year: ${alreadyHasYear}`);
  console.log(`Updated with year: ${updated}`);
  console.log(`No year found: ${noYearFound}`);

  // Show year distribution
  const yearCounts = await prisma.document.groupBy({
    by: ['publishedYear'],
    _count: true,
    orderBy: { publishedYear: 'desc' }
  });

  console.log(`\n=== Year Distribution ===`);
  yearCounts.forEach(y => {
    console.log(`  ${y.publishedYear || 'Unknown'}: ${y._count}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
