import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Simplify Document Titles ===\n");

  // Get all documents
  const docs = await prisma.document.findMany({
    select: { id: true, title: true }
  });

  let updated = 0;
  let counter = 1;

  for (const doc of docs) {
    let newTitle = doc.title;

    // Extract GO number from various formats
    const goPatterns = [
      /G\.?\s*O\.?\s*(?:\(?\s*(?:Ms|RT|OP|D|Rt|ms|rt)\.?\s*\)?)?\s*(?:No\.?)?\s*(\d+)/i,
      /GO\s*(?:Ms|RT|OP)?\.?\s*(?:No\.?)?\s*(\d+)/i,
      /Go\s*(?:no|No|NO)?\s*\.?\s*(\d+)/i,
    ];

    let goNum = null;
    for (const pattern of goPatterns) {
      const match = doc.title.match(pattern);
      if (match) {
        goNum = match[1];
        break;
      }
    }

    if (goNum) {
      newTitle = `GO ${goNum}`;
    } else if (doc.title.startsWith("TN Doc:") || doc.title.startsWith("TN Government Document")) {
      // Give a simple numbered title
      newTitle = `TN Document ${counter}`;
      counter++;
    } else {
      // Keep original title but clean it up
      continue;
    }

    if (newTitle !== doc.title) {
      await prisma.document.update({
        where: { id: doc.id },
        data: { title: newTitle, goNumber: goNum ? `GO ${goNum}` : null }
      });
      updated++;
    }
  }

  console.log("Updated:", updated, "titles");

  // Show sample
  const samples = await prisma.document.findMany({
    take: 15,
    orderBy: { createdAt: "desc" },
    select: { title: true }
  });
  console.log("\nSample titles:");
  samples.forEach(d => console.log(" -", d.title));

  // Count summary
  const goCount = await prisma.document.count({ where: { title: { startsWith: "GO " } } });
  const tnDocCount = await prisma.document.count({ where: { title: { startsWith: "TN Document" } } });
  const otherCount = await prisma.document.count() - goCount - tnDocCount;

  console.log("\n=== Summary ===");
  console.log("GO titles:", goCount);
  console.log("TN Document titles:", tnDocCount);
  console.log("Other titles:", otherCount);

  await prisma.$disconnect();
}

main().catch(console.error);
