import { PrismaClient } from "@prisma/client";
import { parseStringPromise } from "xml2js";
import fetch from "node-fetch";

const prisma = new PrismaClient();

async function seedFormsFromRSS() {
  try {
    console.log("🚀 Fetching ALL Forms from RSS feed...");

    // Get or create Education department (forms are mostly education-related)
    let dept = await prisma.department.findFirst({
      where: { slug: "school-education" },
    });
    if (!dept) {
      dept = await prisma.department.create({
        data: { name: "School Education", slug: "school-education" },
      });
    }

    // Get or create Forms category
    let category = await prisma.category.findFirst({
      where: { slug: "forms" },
    });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "Forms",
          slug: "forms",
        },
      });
    }

    let totalCreated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    let startIndex = 1;
    const itemsPerPage = 50; // Smaller batches since only 111 forms

    // Fetch in batches
    while (true) {
      console.log(
        `\n📥 Fetching from index ${startIndex} (${itemsPerPage} items)...`
      );

      try {
        const url = `https://www.forms.kalvisolai.com/feeds/posts/default?alt=rss&start-index=${startIndex}&max-results=${itemsPerPage}`;
        const response = await fetch(url);
        const xmlText = await response.text();

        const parsed = (await parseStringPromise(xmlText)) as any;
        const items = parsed.rss?.channel?.[0]?.item || [];
        const channel = parsed.rss?.channel?.[0];

        // Get openSearch data - handle both namespaced and non-namespaced versions
        const openSearch = channel?.["openSearch:totalResults"] ||
                          channel?.openSearch?.totalResults ||
                          ["111"];
        const totalResults = parseInt(Array.isArray(openSearch) ? openSearch[0] : openSearch);

        if (items.length === 0) {
          console.log(`✅ No more items to fetch. Total results: ${totalResults}`);
          break;
        }

        let batchCreated = 0;
        let batchSkipped = 0;

        for (const item of items) {
          try {
            const formTitle = item.title?.[0] || "Unknown Form";
            const formLink = item.link?.[0] || "";
            const formDescription = item.description?.[0] || "";
            const pubDate = item.pubDate?.[0] || new Date().toISOString();

            // Generate a unique form number from title
            const formNumber = `FORM-${formTitle.substring(0, 30).replace(/[^a-zA-Z0-9]/g, "-").toUpperCase()}`;

            // Check if already exists by title (since forms don't have GO numbers)
            const existing = await prisma.document.findFirst({
              where: {
                OR: [
                  { title: formTitle },
                  { goNumber: formNumber }
                ]
              },
            });

            if (existing) {
              batchSkipped++;
              totalSkipped++;
              continue;
            }

            // Extract Google Drive link from description if present
            const driveMatch = formDescription.match(/https:\/\/drive\.google\.com[^\s"<]+/);
            const fileUrl = driveMatch ? driveMatch[0] : formLink;

            // Create document
            await prisma.document.create({
              data: {
                title: formTitle,
                description: formDescription.replace(/<[^>]*>/g, "").substring(0, 500),
                goNumber: formNumber,
                fileName: `${formNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
                fileUrl: fileUrl,
                fileSize: Math.floor(Math.random() * 200000) + 20000, // Forms are typically smaller
                fileType: "pdf",
                departmentId: dept.id,
                categoryId: category.id,
                publishedYear: new Date(pubDate).getFullYear(),
                isPublished: true,
                downloads: Math.floor(Math.random() * 300) + 5,
                createdAt: new Date(pubDate),
                updatedAt: new Date(pubDate),
              },
            });

            batchCreated++;
            totalCreated++;
          } catch (err) {
            totalErrors++;
            console.error(`   ⚠️ Error processing form:`, (err as Error).message);
          }
        }

        console.log(
          `   ✨ Created: ${batchCreated}, ⏭️  Skipped: ${batchSkipped}`
        );

        // Move to next batch
        startIndex += itemsPerPage;

        // Stop if we've fetched enough or reached the end
        if (startIndex > totalResults) {
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
    console.log(`   📊 Total Forms: ${totalCreated + totalSkipped}`);
    console.log(`📊 ═════════════════════════════════`);
    console.log(
      `\n💡 Source: https://www.forms.kalvisolai.com/ (111 total Forms)`
    );
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedFormsFromRSS();
