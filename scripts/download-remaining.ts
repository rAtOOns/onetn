import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");

async function downloadFile(url: string, destPath: string, maxRedirects = 5): Promise<boolean> {
  return new Promise((resolve) => {
    if (maxRedirects <= 0) {
      console.log(`  Too many redirects`);
      resolve(false);
      return;
    }

    try {
      const isHttps = url.startsWith("https");
      const protocol = isHttps ? https : http;

      const request = protocol.get(url, {
        timeout: 60000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        }
      }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            const fullUrl = redirectUrl.startsWith("http") ? redirectUrl : new URL(redirectUrl, url).href;
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
            console.log(`  Failed: File too small`);
            resolve(false);
          } else {
            console.log(`  OK: ${(stats.size / 1024).toFixed(1)} KB`);
            resolve(true);
          }
        });

        fileStream.on("error", () => {
          try { fs.unlinkSync(destPath); } catch {}
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
  console.log("=== Download Remaining Documents ===\n");

  // Get documents that still have external URLs (not yet downloaded)
  const docs = await prisma.document.findMany({
    where: {
      fileUrl: { startsWith: "http" }
    },
    select: { id: true, title: true, fileUrl: true }
  });

  console.log(`Found ${docs.length} documents still needing download\n`);

  let downloaded = 0;
  let failed = 0;

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const filename = `${doc.id}.pdf`;
    const destPath = path.join(DOCS_DIR, filename);
    const localUrl = `/documents/${filename}`;

    console.log(`[${i + 1}/${docs.length}] ${doc.title.substring(0, 60)}...`);

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

    await new Promise(r => setTimeout(r, 500));
  }

  console.log("\n=== Summary ===");
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Failed: ${failed}`);

  // Count final local documents
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
