import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");

async function downloadWithCurl(url: string, destPath: string): Promise<boolean> {
  // Try Wayback Machine first
  const archiveUrl = `https://web.archive.org/web/2024/${url}`;

  try {
    console.log(`  Trying Wayback Machine...`);
    execSync(`curl -L -o "${destPath}" "${archiveUrl}" --max-time 120 -s`, {
      timeout: 130000
    });

    const stats = fs.statSync(destPath);
    if (stats.size > 1000) {
      console.log(`  OK: ${(stats.size / 1024).toFixed(1)} KB`);
      return true;
    } else {
      fs.unlinkSync(destPath);
      console.log(`  Failed: File too small`);
      return false;
    }
  } catch (err) {
    console.log(`  Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    try { fs.unlinkSync(destPath); } catch {}
    return false;
  }
}

async function main() {
  console.log("=== Download via Wayback Machine ===\n");

  const docs = await prisma.document.findMany({
    where: { fileUrl: { startsWith: "http" } },
    select: { id: true, title: true, fileUrl: true }
  });

  console.log(`Found ${docs.length} documents to download\n`);

  let downloaded = 0;
  let failed = 0;

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const filename = `${doc.id}.pdf`;
    const destPath = path.join(DOCS_DIR, filename);
    const localUrl = `/documents/${filename}`;

    console.log(`[${i + 1}/${docs.length}] ${doc.title.substring(0, 55)}...`);

    // Skip if already exists
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 1000) {
        console.log(`  Already exists`);
        await prisma.document.update({
          where: { id: doc.id },
          data: { fileUrl: localUrl, fileSize: stats.size }
        });
        continue;
      }
    }

    const success = await downloadWithCurl(doc.fileUrl, destPath);

    if (success) {
      const stats = fs.statSync(destPath);
      await prisma.document.update({
        where: { id: doc.id },
        data: { fileUrl: localUrl, fileSize: stats.size }
      });
      downloaded++;
    } else {
      failed++;
    }

    // Delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\n=== Summary ===");
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Failed: ${failed}`);

  const localCount = await prisma.document.count({
    where: { fileUrl: { startsWith: "/documents/" } }
  });
  const remoteCount = await prisma.document.count({
    where: { fileUrl: { startsWith: "http" } }
  });

  console.log(`\nLocal documents: ${localCount}`);
  console.log(`Still remote: ${remoteCount}`);

  await prisma.$disconnect();
}

main().catch(console.error);
