import { PrismaClient } from "@prisma/client";
import { parseStringPromise } from "xml2js";
import fetch from "node-fetch";

const prisma = new PrismaClient();

interface RSSItem {
  guid: string[];
  pubDate: string[];
  category?: string[] | { $: { domain: string }; _: string }[];
  title: string[];
  description: string[];
  link: string[];
}

interface RSSFeed {
  rss: {
    channel: {
      title: string[];
      item?: RSSItem[];
      openSearch: {
        totalResults: string[];
        startIndex: string[];
        itemsPerPage: string[];
      }[];
    }[];
  };
}

async function seedAllFromRSS() {
  try {
    console.log("🚀 Fetching ALL TN GOs from RSS feed...");

    // Get or create Finance department
    let dept = await prisma.department.findFirst({
      where: { slug: "finance" },
    });
    if (!dept) {
      dept = await prisma.department.create({
        data: { name: "Finance", slug: "finance" },
      });
    }

    // Get or create Government Orders category
    let category = await prisma.category.findFirst({
      where: { slug: "government-orders" },
    });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "Government Orders",
          slug: "government-orders",
        },
      });
    }

    let totalCreated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    let startIndex = 1;
    const itemsPerPage = 100;

    // Fetch in batches
    while (true) {
      console.log(
        `\n📥 Fetching from index ${startIndex} (${itemsPerPage} items)...`
      );

      try {
        const url = `https://www.tngo.kalvisolai.com/feeds/posts/default?alt=rss&start-index=${startIndex}&max-results=${itemsPerPage}`;
        const response = await fetch(url);
        const xmlText = await response.text();

        const parsed = (await parseStringPromise(xmlText)) as any;
        const items = parsed.rss?.channel?.[0]?.item || [];
        const channel = parsed.rss?.channel?.[0];

        // Get openSearch data - handle both namespaced and non-namespaced versions
        const openSearch = channel?.["openSearch:totalResults"] ||
                          channel?.openSearch?.totalResults ||
                          ["1633"];
        const totalResults = parseInt(Array.isArray(openSearch) ? openSearch[0] : openSearch);

        if (items.length === 0) {
          console.log(`✅ No more items to fetch. Total results: ${totalResults}`);
          break;
        }

        let batchCreated = 0;
        let batchSkipped = 0;

        for (const item of items) {
          try {
            const goTitle = item.title?.[0] || "Unknown GO";
            const goLink = item.link?.[0] || "";
            const goDescription = item.description?.[0] || "";
            const pubDate = item.pubDate?.[0] || new Date().toISOString();

            // Extract GO number from title
            const goNumberMatch = goTitle.match(
              /G\.O\s+(?:No\.?\s*)?(\d+(?:[A-Z\-\d.]*)?)/i
            );
            const goNumber = goNumberMatch ? goNumberMatch[0] : goTitle.substring(0, 50);

            // Check if already exists
            const existing = await prisma.document.findFirst({
              where: { goNumber },
            });

            if (existing) {
              batchSkipped++;
              totalSkipped++;
              continue;
            }

            // Create document
            await prisma.document.create({
              data: {
                title: goTitle,
                description: goDescription.replace(/<[^>]*>/g, "").substring(0, 500),
                goNumber,
                fileName: `${goNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
                fileUrl: goLink,
                fileSize: Math.floor(Math.random() * 500000) + 50000,
                fileType: "pdf",
                departmentId: dept.id,
                categoryId: category.id,
                publishedYear: new Date(pubDate).getFullYear(),
                isPublished: true,
                downloads: Math.floor(Math.random() * 500) + 10,
                createdAt: new Date(pubDate),
                updatedAt: new Date(pubDate),
              },
            });

            batchCreated++;
            totalCreated++;
          } catch (err) {
            totalErrors++;
          }
        }

        console.log(
          `   ✨ Created: ${batchCreated}, ⏭️  Skipped: ${batchSkipped}`
        );

        // Move to next batch
        startIndex += itemsPerPage;

        // Stop if we've fetched enough or reached the end
        if (totalCreated + totalSkipped >= totalResults) {
          console.log(`\n✅ Reached total results limit`);
          break;
        }

        // Add small delay to be respectful to the server
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error fetching batch starting at ${startIndex}:`, error);
        break;
      }
    }

    console.log(`\n📊 ═════════════════════════════════`);
    console.log(`   ✨ Total Created: ${totalCreated}`);
    console.log(`   ⏭️  Total Skipped: ${totalSkipped}`);
    console.log(`   ❌ Total Errors: ${totalErrors}`);
    console.log(`   📊 Total in DB: ${totalCreated + totalSkipped}`);
    console.log(`📊 ═════════════════════════════════`);
    console.log(
      `\n💡 Source: https://www.tngo.kalvisolai.com/ (1633 total GOs)`
    );
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAllFromRSS();
