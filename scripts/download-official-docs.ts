import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");

// Ensure documents directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9_\-\.]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 100);
}

async function downloadFile(url: string, destPath: string, maxRedirects = 5): Promise<boolean> {
  return new Promise((resolve) => {
    if (maxRedirects <= 0) {
      console.log(`  Too many redirects`);
      resolve(false);
      return;
    }

    try {
      const request = https.get(url, {
        timeout: 60000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        }
      }, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            const fullUrl = redirectUrl.startsWith("http") ? redirectUrl : `https://cdn.s3waas.gov.in${redirectUrl}`;
            downloadFile(fullUrl, destPath, maxRedirects - 1).then(resolve);
            return;
          }
        }

        if (response.statusCode !== 200) {
          console.log(`  Failed: HTTP ${response.statusCode}`);
          resolve(false);
          return;
        }

        const fileStream = fs.createWriteStream(destPath);
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          const stats = fs.statSync(destPath);
          if (stats.size < 1000) {
            fs.unlinkSync(destPath);
            console.log(`  Failed: File too small (${stats.size} bytes)`);
            resolve(false);
          } else {
            console.log(`  OK: ${(stats.size / 1024).toFixed(1)} KB`);
            resolve(true);
          }
        });

        fileStream.on("error", (err) => {
          console.log(`  Write error: ${err.message}`);
          try { fs.unlinkSync(destPath); } catch {}
          resolve(false);
        });
      });

      request.on("error", (err) => {
        console.log(`  Network error: ${err.message}`);
        resolve(false);
      });

      request.on("timeout", () => {
        request.destroy();
        console.log(`  Timeout`);
        resolve(false);
      });
    } catch (err) {
      console.log(`  Exception: ${err}`);
      resolve(false);
    }
  });
}

async function main() {
  console.log("=== Download Official TN Gov Documents ===\n");

  // Get official TN Gov documents
  const officialDocs = await prisma.document.findMany({
    where: {
      OR: [
        { fileUrl: { contains: "tn.gov.in" } },
        { fileUrl: { contains: "s3waas.gov.in" } },
      ]
    },
    select: {
      id: true,
      title: true,
      fileUrl: true,
      fileName: true,
    }
  });

  console.log(`Found ${officialDocs.length} official documents\n`);

  let downloaded = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < officialDocs.length; i++) {
    const doc = officialDocs[i];
    const ext = doc.fileUrl.includes(".pdf") ? ".pdf" : ".pdf";
    const filename = `${doc.id}${ext}`;
    const destPath = path.join(DOCS_DIR, filename);
    const localUrl = `/documents/${filename}`;

    console.log(`[${i + 1}/${officialDocs.length}] ${doc.title.substring(0, 60)}...`);

    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 1000) {
        console.log(`  Already exists (${(stats.size / 1024).toFixed(1)} KB)`);
        await prisma.document.update({
          where: { id: doc.id },
          data: { fileUrl: localUrl, fileSize: stats.size }
        });
        skipped++;
        continue;
      }
    }

    // Download
    const success = await downloadFile(doc.fileUrl, destPath);

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

    // Small delay
    await new Promise(r => setTimeout(r, 300));
  }

  console.log("\n=== Download Summary ===");
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Already existed: ${skipped}`);
  console.log(`Failed: ${failed}`);

  // Now remove third-party documents
  console.log("\n=== Cleaning up third-party documents ===");

  const thirdPartyCount = await prisma.document.count({
    where: {
      AND: [
        { fileUrl: { startsWith: "http" } },
        { NOT: { fileUrl: { contains: "tn.gov.in" } } },
        { NOT: { fileUrl: { contains: "s3waas.gov.in" } } },
      ]
    }
  });

  console.log(`Found ${thirdPartyCount} third-party documents to remove`);

  const deleted = await prisma.document.deleteMany({
    where: {
      AND: [
        { fileUrl: { startsWith: "http" } },
        { NOT: { fileUrl: { contains: "tn.gov.in" } } },
        { NOT: { fileUrl: { contains: "s3waas.gov.in" } } },
      ]
    }
  });

  console.log(`Deleted: ${deleted.count}`);

  // Also remove documents with local paths that don't exist
  const localDocs = await prisma.document.findMany({
    where: { fileUrl: { startsWith: "/" } },
    select: { id: true, fileUrl: true }
  });

  let removedLocal = 0;
  for (const doc of localDocs) {
    const filePath = path.join(process.cwd(), "public", doc.fileUrl);
    if (!fs.existsSync(filePath)) {
      await prisma.document.delete({ where: { id: doc.id } });
      removedLocal++;
    }
  }
  console.log(`Removed ${removedLocal} documents with missing local files`);

  // Final count
  const finalCount = await prisma.document.count();
  console.log(`\n=== Final Result ===`);
  console.log(`Total documents in database: ${finalCount}`);

  await prisma.$disconnect();
}

main().catch(console.error);
