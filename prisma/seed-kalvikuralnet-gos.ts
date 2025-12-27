import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GOs from kalvikuralnet.wordpress.com
const KALVIKURALNET_GOS = [
  { goNumber: "G.O.No.117-2016", title: "6 Percent Dearness Allowance Increase April 2016", url: "http://cms.tn.gov.in/sites/default/files/gos/fin_e_117_2016.pdf", year: 2016 },
  { goNumber: "G.O.No.118-2016", title: "6 Percent Dearness Allowance Alternative Order 2016", url: "http://cms.tn.gov.in/sites/default/files/gos/fin_e_118_2016.pdf", year: 2016 },
  { goNumber: "G.O.No.58-2016", title: "GIS Enhancement Lumpsum 1.5 Lakh to 3 Lakh", url: "http://cms.tn.gov.in/sites/default/files/gos/fin_e_58_2016.pdf", year: 2016 },
  { goNumber: "G.O.No.262-2015", title: "Dearness Allowance Enhanced 113 to 119 Percent", url: "http://cms.tn.gov.in/sites/default/files/gos/fin_e_262_2015.pdf", year: 2015 },
  { goNumber: "G.O.No.263-2015", title: "Ad-hoc Increase for Consolidated Fixed Pay Employees", url: "http://cms.tn.gov.in/sites/default/files/gos/fin_e_263_2015.pdf", year: 2015 },
  { goNumber: "G.O.No.65-2016", title: "CPS Cancellation Committee Constitution", url: "https://drive.google.com/uc?export=download&id=0Bz7LIsocPh3FSjUxS3RSdFRZNjA", year: 2016 },
  { goNumber: "G.O.No.59-2016", title: "CPS Settlement Orders February 2016", url: "https://drive.google.com/uc?export=download&id=0Bz7LIsocPh3FNVdEeXRRVEJicWM", year: 2016 },
  { goNumber: "G.O.No.1325-2015", title: "Public Holidays 2016 Government Notification", url: "https://drive.google.com/file/d/0Bz7LIsocPh3FOVducnkyX3FhdGs/view", year: 2015 },
  { goNumber: "G.O.No.72-DA", title: "Disabled Employees Special Leave Orders", url: "https://drive.google.com/file/d/0Bz7LIsocPh3FQW9fRXBkQjlLb0U/view", year: 2015 },
];

async function seedKalvikuralnetGOs() {
  try {
    console.log("🚀 Seeding GOs from kalvikuralnet.wordpress.com...");
    console.log(`📊 Total GOs to process: ${KALVIKURALNET_GOS.length}`);

    let dept = await prisma.department.findFirst({ where: { slug: "finance" } });
    let category = await prisma.category.findFirst({ where: { slug: "government-orders" } });

    let created = 0, skipped = 0;

    for (const go of KALVIKURALNET_GOS) {
      const existing = await prisma.document.findFirst({
        where: { OR: [{ goNumber: go.goNumber }, { fileUrl: go.url }] },
      });

      if (existing) { skipped++; continue; }

      await prisma.document.create({
        data: {
          title: go.title,
          description: `Official GO: ${go.title}. Source: kalvikuralnet.wordpress.com`,
          goNumber: go.goNumber,
          fileName: `${go.goNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          fileUrl: go.url,
          fileSize: Math.floor(Math.random() * 300000) + 50000,
          fileType: "pdf",
          departmentId: dept!.id,
          categoryId: category!.id,
          publishedYear: go.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 150) + 10,
        },
      });
      created++;
    }

    console.log(`\n📊 Created: ${created}, Skipped: ${skipped}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedKalvikuralnetGOs();
