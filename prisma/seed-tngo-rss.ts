import { PrismaClient } from "@prisma/client";
import { parseStringPromise } from "xml2js";
import fetch from "node-fetch";

const prisma = new PrismaClient();

interface RSSItem {
  guid: string[];
  pubDate: string[];
  category: string[] | { $: { domain: string }; _: string }[];
  title: string[];
  description: string[];
  link: string[];
}

interface RSSSuggest {
  channel: {
    title: string[];
    item: RSSItem[];
    openSearch: {
      totalResults: string[];
    }[];
  }[];
}

async function seedFromRSS() {
  try {
    console.log("📡 Fetching TN GOs from RSS feed...");

    // Fetch RSS feed with all items
    const response = await fetch(
      "https://www.tngo.kalvisolai.com/feeds/posts/default?alt=rss&max-results=999"
    );
    const xmlText = await response.text();

    // Parse XML
    const parsed = (await parseStringPromise(xmlText)) as RSSSuggest;
    const items = parsed.rss.channel[0].item || [];
    const totalResults = parsed.rss.channel[0].openSearch?.[0].totalResults?.[0];

    console.log(`📊 Total GOs found: ${totalResults || items.length}`);
    console.log(`📥 Processing first batch of ${items.length} items...`);

    // Get or create Finance department (default)
    let dept = await prisma.department.findFirst({
      where: { slug: "finance" },
    });

    if (!dept) {
      dept = await prisma.department.create({
        data: {
          name: "Finance",
          slug: "finance",
        },
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

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of items) {
      try {
        const goTitle = item.title?.[0] || "Unknown GO";
        const goLink = item.link?.[0] || "";
        const goDescription = item.description?.[0] || "";
        const pubDate = item.pubDate?.[0] || new Date().toISOString();

        // Extract GO number from title (format: "G.O No XXX...")
        const goNumberMatch = goTitle.match(/G\.O\s+(?:No\.?\s*)?(\d+(?:[A-Z\-\d.]*)?)/i);
        const goNumber = goNumberMatch ? goNumberMatch[0] : goTitle.substring(0, 50);

        // Check if already exists
        const existing = await prisma.document.findFirst({
          where: { goNumber },
        });

        if (existing) {
          skipped++;
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

        created++;
        if (created % 50 === 0) {
          console.log(`✅ Created: ${created} GOs...`);
        }
      } catch (err) {
        errors++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✨ Created: ${created} GOs`);
    console.log(`   ⏭️  Skipped: ${skipped} (already exist)`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📊 Total in DB: ${created + skipped}`);
    console.log(`\n💡 Note: Fetched from https://www.tngo.kalvisolai.com/`);
    console.log(`   Use pagination to fetch remaining ${totalResults ? parseInt(totalResults) - items.length : "..."} GOs`);
  } catch (error) {
    console.error("❌ Error seeding GOs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedFromRSS();
