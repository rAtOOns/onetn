import { PrismaClient } from "@prisma/client";
import { parseStringPromise } from "xml2js";
import fetch from "node-fetch";

const prisma = new PrismaClient();

async function seedKalviExpressGOs() {
  try {
    console.log("🚀 Fetching GOs from kalviexpress.in...");

    // Get or create School Education department
    let dept = await prisma.department.findFirst({
      where: { slug: "school-education" },
    });
    if (!dept) {
      dept = await prisma.department.create({
        data: { name: "School Education", slug: "school-education" },
      });
    }

    // Get or create Government Orders category
    let category = await prisma.category.findFirst({
      where: { slug: "government-orders" },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { name: "Government Orders", slug: "government-orders" },
      });
    }

    let totalCreated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    let startIndex = 1;
    const itemsPerPage = 50;

    // Fetch in batches
    while (true) {
      console.log(`\n📥 Fetching from index ${startIndex} (${itemsPerPage} items)...`);

      try {
        const url = `https://www.kalviexpress.in/feeds/posts/default/-/GO?alt=rss&start-index=${startIndex}&max-results=${itemsPerPage}`;
        const response = await fetch(url);
        const xmlText = await response.text();

        const parsed = (await parseStringPromise(xmlText)) as any;
        const items = parsed.rss?.channel?.[0]?.item || [];
        const channel = parsed.rss?.channel?.[0];

        // Get total results
        const openSearch = channel?.["openSearch:totalResults"] || ["337"];
        const totalResults = parseInt(Array.isArray(openSearch) ? openSearch[0] : openSearch);

        if (items.length === 0) {
          console.log(`✅ No more items. Total results: ${totalResults}`);
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
            const goNumberMatch = goTitle.match(/G\.?O\.?\s*(?:No\.?\s*)?([\d]+)/i);
            const goNumber = goNumberMatch
              ? `G.O No.${goNumberMatch[1]}`
              : `GO-${goTitle.substring(0, 30).replace(/[^a-zA-Z0-9]/g, "-")}`;

            // Check for duplicates by GO number or title
            const existing = await prisma.document.findFirst({
              where: {
                OR: [
                  { goNumber },
                  { title: goTitle },
                  { fileUrl: goLink },
                ],
              },
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
                fileSize: Math.floor(Math.random() * 400000) + 50000,
                fileType: "pdf",
                departmentId: dept.id,
                categoryId: category.id,
                publishedYear: new Date(pubDate).getFullYear(),
                isPublished: true,
                downloads: Math.floor(Math.random() * 300) + 10,
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

        console.log(`   ✨ Created: ${batchCreated}, ⏭️  Skipped: ${batchSkipped}`);

        startIndex += itemsPerPage;

        if (startIndex > totalResults) {
          console.log(`\n✅ Reached total results limit`);
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error fetching batch at ${startIndex}:`, error);
        break;
      }
    }

    console.log(`\n📊 ═════════════════════════════════`);
    console.log(`   ✨ Total Created: ${totalCreated}`);
    console.log(`   ⏭️  Total Skipped: ${totalSkipped}`);
    console.log(`   ❌ Total Errors: ${totalErrors}`);
    console.log(`📊 ═════════════════════════════════`);
    console.log(`\n💡 Source: https://www.kalviexpress.in (337 GOs)`);
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedKalviExpressGOs();
