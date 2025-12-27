import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

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

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const protocol = url.startsWith("https") ? https : http;

      const request = protocol.get(url, {
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        }
      }, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            console.log(`  Redirecting to: ${redirectUrl.substring(0, 50)}...`);
            downloadFile(redirectUrl, destPath).then(resolve);
            return;
          }
        }

        if (response.statusCode !== 200) {
          console.log(`  Failed: HTTP ${response.statusCode}`);
          resolve(false);
          return;
        }

        const contentType = response.headers["content-type"] || "";
        if (!contentType.includes("pdf") && !contentType.includes("octet-stream")) {
          console.log(`  Skipped: Not a PDF (${contentType})`);
          resolve(false);
          return;
        }

        const fileStream = fs.createWriteStream(destPath);
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          const stats = fs.statSync(destPath);
          if (stats.size < 1000) {
            // Too small, probably an error page
            fs.unlinkSync(destPath);
            console.log(`  Failed: File too small`);
            resolve(false);
          } else {
            console.log(`  Downloaded: ${(stats.size / 1024).toFixed(1)} KB`);
            resolve(true);
          }
        });

        fileStream.on("error", () => {
          fs.unlinkSync(destPath);
          resolve(false);
        });
      });

      request.on("error", (err) => {
        console.log(`  Error: ${err.message}`);
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
  console.log("=== Document Download Script ===\n");

  // Get all documents with external URLs
  const documents = await prisma.document.findMany({
    where: {
      fileUrl: {
        startsWith: "http"
      }
    },
    select: {
      id: true,
      title: true,
      fileUrl: true,
      fileName: true,
    }
  });

  console.log(`Found ${documents.length} documents with external URLs\n`);

  let downloaded = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    const filename = `${doc.id}_${sanitizeFilename(doc.fileName || "document.pdf")}`;
    const destPath = path.join(DOCS_DIR, filename);
    const localUrl = `/documents/${filename}`;

    console.log(`[${i + 1}/${documents.length}] ${doc.title.substring(0, 50)}...`);

    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      console.log(`  Already exists, updating URL`);
      await prisma.document.update({
        where: { id: doc.id },
        data: { fileUrl: localUrl }
      });
      skipped++;
      continue;
    }

    // Download the file
    const success = await downloadFile(doc.fileUrl, destPath);

    if (success) {
      // Update database with local URL
      const stats = fs.statSync(destPath);
      await prisma.document.update({
        where: { id: doc.id },
        data: {
          fileUrl: localUrl,
          fileSize: stats.size
        }
      });
      downloaded++;
    } else {
      failed++;
    }

    // Small delay to avoid overwhelming servers
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("\n=== Summary ===");
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped (existing): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${documents.length}`);

  await prisma.$disconnect();
}

main().catch(console.error);
