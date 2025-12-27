import { PrismaClient } from "@prisma/client";
import * as https from "https";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");

function fetch(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        file.close();
        fs.unlinkSync(dest);
        // Follow redirect
        downloadFile(res.headers.location!, dest).then(resolve);
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', () => {
      file.close();
      try { fs.unlinkSync(dest); } catch {}
      resolve(false);
    });
  });
}

function extractDriveId(html: string): string | null {
  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?.*?id=([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractTitle(html: string): string | null {
  let match = html.match(/<h3[^>]*class="[^"]*post-title[^"]*"[^>]*>([^<]+)</);
  if (match) return match[1].trim();
  match = html.match(/<title>([^<]+)</);
  if (match) return match[1].replace(/ - tngo\.kalvisolai\.com.*$/, '').trim();
  return null;
}

function parseGODetails(title: string): { goNumber: string | null; date: string | null; year: number | null } {
  const goMatch = title.match(/G\.?O\.?\s*(?:MS|Ms|ms)?\s*(?:NO|No|no)?\s*[-.]?\s*(\d+)/i);
  const dateMatch = title.match(/(\d{2}[-./]\d{2}[-./](\d{4}))/);

  return {
    goNumber: goMatch ? goMatch[1] : null,
    date: dateMatch ? dateMatch[1] : null,
    year: dateMatch ? parseInt(dateMatch[2]) : null
  };
}

async function getSitemapUrls(): Promise<string[]> {
  const urls: string[] = [];
  for (let page = 1; page <= 3; page++) {
    try {
      const xml = await fetch(`https://www.tngo.kalvisolai.com/sitemap.xml?page=${page}`);
      const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
      for (const match of matches) {
        if (match[1].includes('.html')) urls.push(match[1]);
      }
    } catch {}
  }
  return urls;
}

async function main() {
  console.log("=== Download Missing Kalvisolai Documents ===\n");

  // Get existing file IDs
  const docs = await prisma.document.findMany({ select: { fileName: true } });
  const existingIds = new Set(docs.map(d => d.fileName.replace('.pdf', '')));
  console.log(`Existing documents: ${existingIds.size}\n`);

  // Get default category and department
  const category = await prisma.category.findFirst({ where: { slug: 'government-orders' } });
  const department = await prisma.department.findFirst({ where: { slug: 'school-education' } });

  if (!category || !department) {
    console.error("Missing category or department");
    return;
  }

  const urls = await getSitemapUrls();
  console.log(`Found ${urls.length} URLs in sitemap\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    try {
      const html = await fetch(url);
      const driveId = extractDriveId(html);
      const title = extractTitle(html);

      if (!driveId || !title) {
        skipped++;
        continue;
      }

      // Skip if we already have this file
      if (existingIds.has(driveId)) {
        skipped++;
        continue;
      }

      // Download the file
      const fileName = `${driveId}.pdf`;
      const filePath = path.join(DOCS_DIR, fileName);
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;

      const success = await downloadFile(downloadUrl, filePath);

      if (!success || !fs.existsSync(filePath)) {
        failed++;
        continue;
      }

      // Check if it's a real PDF
      const fileSize = fs.statSync(filePath).size;
      if (fileSize < 1000) {
        fs.unlinkSync(filePath);
        failed++;
        continue;
      }

      // Parse GO details
      const { goNumber, date, year } = parseGODetails(title);

      // Build proper title
      let docTitle = title;
      if (goNumber) {
        docTitle = `GO ${goNumber}`;
        if (date) docTitle += ` (${date})`;
        const desc = title
          .replace(/G\.?O\.?\s*(?:MS|Ms|ms)?\s*(?:NO|No|no)?\s*[-.]?\s*\d+/i, '')
          .replace(/\d{2}[-./]\d{2}[-./]\d{4}[-.]?/, '')
          .replace(/^[-.\s]+/, '')
          .trim();
        if (desc.length > 5) docTitle += ` - ${desc.substring(0, 100)}`;
      }

      // Create database entry
      await prisma.document.create({
        data: {
          title: docTitle,
          fileName,
          fileUrl: `/documents/${fileName}`,
          fileSize,
          fileType: 'pdf',
          categoryId: category.id,
          departmentId: department.id,
          goNumber: goNumber ? `GO ${goNumber}` : null,
          publishedYear: year,
          isPublished: true
        }
      });

      console.log(`✓ Downloaded: ${docTitle.substring(0, 60)}...`);
      downloaded++;
      existingIds.add(driveId);

      // Progress
      if ((i + 1) % 100 === 0) {
        console.log(`\n[Progress: ${i + 1}/${urls.length}, Downloaded: ${downloaded}]\n`);
      }

      await new Promise(r => setTimeout(r, 200));

    } catch (e) {
      failed++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped (already have): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total documents now: ${await prisma.document.count()}`);

  await prisma.$disconnect();
}

main().catch(console.error);
