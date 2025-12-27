/**
 * Find pages on kalvisolai that have PDFs but we don't have in our database
 */

import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function curlFetch(url: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`curl -sL --max-time 10 "${url}"`, { timeout: 15000 });
    return stdout;
  } catch { return ""; }
}

async function main() {
  // Get existing GOs
  const existing = await prisma.qualityGO.findMany({
    select: { goNumber: true, goType: true, goDate: true }
  });
  const existingKeys = new Set(existing.map(g =>
    `${g.goNumber}-${g.goDate.toISOString().split('T')[0]}`
  ));
  console.log(`Database has ${existing.length} GOs\n`);

  // Get sitemap URLs
  console.log("Fetching sitemap...");
  const allUrls: string[] = [];
  for (let page = 1; page <= 5; page++) {
    const xml = await curlFetch(`https://www.tngo.kalvisolai.com/sitemap.xml?page=${page}`);
    const matches = xml.matchAll(/<loc>([^<]+\.html)<\/loc>/g);
    for (const m of matches) allUrls.push(m[1]);
  }
  console.log(`Found ${allUrls.length} URLs\n`);

  // Check each URL for drive links and GO pattern
  console.log("Scanning for pages with PDFs we are missing...\n");
  const missing: Array<{url: string; title: string; goNum: string; date: string}> = [];
  let checked = 0;

  for (const url of allUrls) {
    checked++;
    if (checked % 100 === 0) console.log(`Checked ${checked}/${allUrls.length}...`);

    const html = await curlFetch(url);
    if (!html) continue;

    // Check for drive link
    const driveMatch = html.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                       html.match(/drive\.google\.com\/uc\?[^"']*id=([a-zA-Z0-9_-]+)/) ||
                       html.match(/docs\.google\.com\/uc\?[^"']*id=([a-zA-Z0-9_-]+)/);

    if (!driveMatch) continue; // No PDF link

    // Extract title
    const titleMatch = html.match(/<title>([^<]+)</) || html.match(/og:title"[^>]*content="([^"]+)"/);
    const title = titleMatch ? titleMatch[1].replace(/Kalvisolai.*$/i, "").trim() : "";

    // Try to extract GO number and date
    const goMatch = title.match(/G\.?O\.?\s*(?:\()?([A-Za-z0-9]{1,4})(?:\))?\s*(?:No\.?)?\s*[-.]?\s*(\d+)/i);
    const dateMatch = title.match(/(\d{1,2})[-.\/](\d{1,2})[-.\/](\d{4})/);

    if (goMatch && dateMatch) {
      const goNum = parseInt(goMatch[2]);
      const goDate = new Date(parseInt(dateMatch[3]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[1]));
      const key = `${goNum}-${goDate.toISOString().split('T')[0]}`;

      if (!existingKeys.has(key)) {
        missing.push({ url, title: title.substring(0, 80), goNum: goNum.toString(), date: dateMatch[0] });
      }
    } else if (title.toLowerCase().includes("g.o") || title.toLowerCase().includes("go ")) {
      // Has GO in title but couldn't parse - might be missing
      missing.push({ url, title: title.substring(0, 80), goNum: "?", date: "?" });
    }
  }

  console.log(`\n========================================`);
  console.log(`PAGES WITH PDFs WE DON'T HAVE:`);
  console.log(`========================================\n`);

  if (missing.length === 0) {
    console.log("None found! We have all available GOs with PDFs.");
  } else {
    missing.forEach((m, i) => {
      console.log(`${i+1}. GO ${m.goNum} (${m.date})`);
      console.log(`   ${m.title}`);
      console.log(`   ${m.url}\n`);
    });
    console.log(`Total missing: ${missing.length}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
