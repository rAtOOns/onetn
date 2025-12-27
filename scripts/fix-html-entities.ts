import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Decode HTML entities to their corresponding characters
 */
function decodeHtmlEntities(text: string | null): string | null {
  if (!text) return text;

  // First handle numeric entities (&#1234;)
  let decoded = text.replace(/&#(\d+);/g, (_, code) => {
    return String.fromCharCode(parseInt(code, 10));
  });

  // Handle hex entities (&#x1234;)
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => {
    return String.fromCharCode(parseInt(code, 16));
  });

  // Handle common named entities
  const namedEntities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
    "&nbsp;": " ",
  };

  for (const [entity, char] of Object.entries(namedEntities)) {
    decoded = decoded.split(entity).join(char);
  }

  return decoded;
}

async function fixDocuments() {
  console.log("Fixing HTML entities in Documents...");

  const documents = await prisma.document.findMany();
  let fixed = 0;

  for (const doc of documents) {
    const decodedTitle = decodeHtmlEntities(doc.title);
    const decodedTitleTamil = decodeHtmlEntities(doc.titleTamil);
    const decodedDescription = decodeHtmlEntities(doc.description);

    // Only update if something changed
    if (
      decodedTitle !== doc.title ||
      decodedTitleTamil !== doc.titleTamil ||
      decodedDescription !== doc.description
    ) {
      await prisma.document.update({
        where: { id: doc.id },
        data: {
          title: decodedTitle!,
          titleTamil: decodedTitleTamil,
          description: decodedDescription,
        },
      });
      fixed++;
      console.log(`  Fixed: ${doc.id} - ${decodedTitle?.substring(0, 50)}...`);
    }
  }

  console.log(`  Documents fixed: ${fixed}/${documents.length}`);
}

async function fixNewsLeads() {
  console.log("Fixing HTML entities in NewsLeads...");

  const leads = await prisma.newsLead.findMany();
  let fixed = 0;

  for (const lead of leads) {
    const decodedTitle = decodeHtmlEntities(lead.title);
    const decodedTitleTamil = decodeHtmlEntities(lead.titleTamil);
    const decodedDescription = decodeHtmlEntities(lead.description);

    if (
      decodedTitle !== lead.title ||
      decodedTitleTamil !== lead.titleTamil ||
      decodedDescription !== lead.description
    ) {
      await prisma.newsLead.update({
        where: { id: lead.id },
        data: {
          title: decodedTitle!,
          titleTamil: decodedTitleTamil,
          description: decodedDescription,
        },
      });
      fixed++;
      console.log(`  Fixed: ${lead.id} - ${decodedTitle?.substring(0, 50)}...`);
    }
  }

  console.log(`  NewsLeads fixed: ${fixed}/${leads.length}`);
}

async function fixNewsArticles() {
  console.log("Fixing HTML entities in NewsArticles...");

  const articles = await prisma.newsArticle.findMany();
  let fixed = 0;

  for (const article of articles) {
    const decodedTitle = decodeHtmlEntities(article.title);
    const decodedTitleTamil = decodeHtmlEntities(article.titleTamil);
    const decodedSummary = decodeHtmlEntities(article.summary);
    const decodedSummaryTamil = decodeHtmlEntities(article.summaryTamil);

    if (
      decodedTitle !== article.title ||
      decodedTitleTamil !== article.titleTamil ||
      decodedSummary !== article.summary ||
      decodedSummaryTamil !== article.summaryTamil
    ) {
      await prisma.newsArticle.update({
        where: { id: article.id },
        data: {
          title: decodedTitle!,
          titleTamil: decodedTitleTamil,
          summary: decodedSummary!,
          summaryTamil: decodedSummaryTamil,
        },
      });
      fixed++;
      console.log(`  Fixed: ${article.id} - ${decodedTitle?.substring(0, 50)}...`);
    }
  }

  console.log(`  NewsArticles fixed: ${fixed}/${articles.length}`);
}

async function fixCategories() {
  console.log("Fixing HTML entities in Categories...");

  const categories = await prisma.category.findMany();
  let fixed = 0;

  for (const cat of categories) {
    const decodedName = decodeHtmlEntities(cat.name);
    const decodedNameTamil = decodeHtmlEntities(cat.nameTamil);

    if (decodedName !== cat.name || decodedNameTamil !== cat.nameTamil) {
      await prisma.category.update({
        where: { id: cat.id },
        data: {
          name: decodedName!,
          nameTamil: decodedNameTamil,
        },
      });
      fixed++;
    }
  }

  console.log(`  Categories fixed: ${fixed}/${categories.length}`);
}

async function fixDepartments() {
  console.log("Fixing HTML entities in Departments...");

  const departments = await prisma.department.findMany();
  let fixed = 0;

  for (const dept of departments) {
    const decodedName = decodeHtmlEntities(dept.name);
    const decodedNameTamil = decodeHtmlEntities(dept.nameTamil);

    if (decodedName !== dept.name || decodedNameTamil !== dept.nameTamil) {
      await prisma.department.update({
        where: { id: dept.id },
        data: {
          name: decodedName!,
          nameTamil: decodedNameTamil,
        },
      });
      fixed++;
    }
  }

  console.log(`  Departments fixed: ${fixed}/${departments.length}`);
}

async function fixTopics() {
  console.log("Fixing HTML entities in Topics...");

  const topics = await prisma.topic.findMany();
  let fixed = 0;

  for (const topic of topics) {
    const decodedName = decodeHtmlEntities(topic.name);
    const decodedNameTamil = decodeHtmlEntities(topic.nameTamil);

    if (decodedName !== topic.name || decodedNameTamil !== topic.nameTamil) {
      await prisma.topic.update({
        where: { id: topic.id },
        data: {
          name: decodedName!,
          nameTamil: decodedNameTamil,
        },
      });
      fixed++;
    }
  }

  console.log(`  Topics fixed: ${fixed}/${topics.length}`);
}

async function fixDistricts() {
  console.log("Fixing HTML entities in Districts...");

  const districts = await prisma.district.findMany();
  let fixed = 0;

  for (const district of districts) {
    const decodedName = decodeHtmlEntities(district.name);
    const decodedNameTamil = decodeHtmlEntities(district.nameTamil);

    if (decodedName !== district.name || decodedNameTamil !== district.nameTamil) {
      await prisma.district.update({
        where: { id: district.id },
        data: {
          name: decodedName!,
          nameTamil: decodedNameTamil,
        },
      });
      fixed++;
    }
  }

  console.log(`  Districts fixed: ${fixed}/${districts.length}`);
}

async function main() {
  console.log("=== Fixing HTML Entities in Database ===\n");

  try {
    await fixDocuments();
    await fixNewsLeads();
    await fixNewsArticles();
    await fixCategories();
    await fixDepartments();
    await fixTopics();
    await fixDistricts();

    console.log("\n=== Done! ===");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
